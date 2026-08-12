import { createReadStream } from 'node:fs'
import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'

import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const mediaDirectory = path.resolve(process.cwd(), 'media')
const mediaObjectPrefix = 'architecture-website/v1/media'
const apply = process.argv.includes('apply')
const overwrite = process.argv.includes('overwrite')

const contentTypes: Record<string, string> = {
  '.avif': 'image/avif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

const requiredEnvironment = [
  'B2_BUCKET',
  'B2_ENDPOINT',
  'B2_REGION',
  'B2_ACCESS_KEY_ID',
  'B2_SECRET_ACCESS_KEY',
  'B2_PUBLIC_URL',
] as const

function environment(name: (typeof requiredEnvironment)[number]): string {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`${name} is required to sync media to Backblaze B2.`)
  }

  return value
}

const configuration = Object.fromEntries(
  requiredEnvironment.map((name) => [name, environment(name)]),
) as Record<(typeof requiredEnvironment)[number], string>

const expectedEndpoint = `https://s3.${configuration.B2_REGION}.backblazeb2.com`
if (configuration.B2_ENDPOINT !== expectedEndpoint) {
  throw new Error(`B2_ENDPOINT must match the bucket endpoint: ${expectedEndpoint}`)
}

if (!configuration.B2_PUBLIC_URL.startsWith('https://')) {
  throw new Error('B2_PUBLIC_URL must be an HTTPS Cloudflare URL.')
}

const client = new S3Client({
  credentials: {
    accessKeyId: configuration.B2_ACCESS_KEY_ID,
    secretAccessKey: configuration.B2_SECRET_ACCESS_KEY,
  },
  endpoint: configuration.B2_ENDPOINT,
  forcePathStyle: true,
  region: configuration.B2_REGION,
})

function isMissingObject(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false

  const candidate = error as {
    $metadata?: { httpStatusCode?: number }
    name?: string
  }

  return candidate.$metadata?.httpStatusCode === 404 || candidate.name === 'NotFound'
}

async function syncFile(filename: string): Promise<'skipped' | 'uploaded'> {
  const filePath = path.join(mediaDirectory, filename)
  const file = await stat(filePath)
  const key = `${mediaObjectPrefix}/${filename}`

  try {
    const existing = await client.send(
      new HeadObjectCommand({ Bucket: configuration.B2_BUCKET, Key: key }),
    )

    if (existing.ContentLength === file.size) {
      console.log(`skip     ${key}`)
      return 'skipped'
    }

    if (!overwrite) {
      throw new Error(
        `${key} already exists with a different size. Re-run with --apply --overwrite only after verifying the object.`,
      )
    }
  } catch (error) {
    if (!isMissingObject(error)) throw error
  }

  const extension = path.extname(filename).toLowerCase()
  const contentType = contentTypes[extension]
  if (!contentType) throw new Error(`Unsupported media extension: ${filename}`)

  await client.send(
    new PutObjectCommand({
      Body: createReadStream(filePath),
      Bucket: configuration.B2_BUCKET,
      CacheControl: 'public, max-age=31536000, immutable',
      ContentLength: file.size,
      ContentType: contentType,
      Key: key,
    }),
  )

  console.log(`uploaded ${key}`)
  return 'uploaded'
}

async function main() {
  const entries = (await readdir(mediaDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort()

  if (entries.length === 0) throw new Error(`No files found in ${mediaDirectory}.`)

  console.log(
    `${apply ? 'Syncing' : 'Dry run:'} ${entries.length} files to b2://${configuration.B2_BUCKET}/${mediaObjectPrefix}/`,
  )

  if (!apply) {
    for (const filename of entries) console.log(`would upload ${mediaObjectPrefix}/${filename}`)
    console.log('No files uploaded. Re-run with --apply after reviewing the destination.')
    return
  }

  let uploaded = 0
  let skipped = 0

  for (const filename of entries) {
    const result = await syncFile(filename)
    if (result === 'uploaded') uploaded += 1
    else skipped += 1
  }

  console.log(`B2 media sync complete: ${uploaded} uploaded, ${skipped} already present.`)
}

await main()
