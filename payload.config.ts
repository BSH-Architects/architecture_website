import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'

import { Media } from './src/collections/Media'
import { Projects } from './src/collections/Projects'
import { Users } from './src/collections/Users'
import { Homepage } from './src/globals/Homepage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const r2Configuration = {
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  bucket: process.env.R2_BUCKET,
  endpoint: process.env.R2_ENDPOINT,
  publicURL: process.env.R2_PUBLIC_URL,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
}

const configuredR2Values = Object.values(r2Configuration).filter(Boolean).length
const hasR2Configuration = configuredR2Values === Object.keys(r2Configuration).length

if (configuredR2Values > 0 && !hasR2Configuration) {
  throw new Error(
    'Cloudflare R2 configuration is incomplete. Set all five R2_* variables or remove all of them for local storage.',
  )
}

const storagePlugins = hasR2Configuration
  ? [
      s3Storage({
        clientUploads: {
          access: ({ req }) => Boolean(req.user),
        },
        collections: {
          media: {
            prefix: 'media',
            generateFileURL: ({ filename, prefix }) =>
              `${r2Configuration.publicURL!.replace(/\/$/, '')}/${[prefix, filename]
                .filter(Boolean)
                .join('/')}`,
          },
        },
        bucket: r2Configuration.bucket!,
        config: {
          credentials: {
            accessKeyId: r2Configuration.accessKeyId!,
            secretAccessKey: r2Configuration.secretAccessKey!,
          },
          endpoint: r2Configuration.endpoint!,
          forcePathStyle: true,
          region: 'auto',
        },
      }),
    ]
  : []

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, 'src/app/(payload)/admin/importMap.ts'),
    },
  },
  collections: [Users, Media, Projects],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  editor: lexicalEditor(),
  globals: [Homepage],
  plugins: storagePlugins,
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  upload: {
    limits: {
      fileSize: 20_000_000,
    },
  },
})
