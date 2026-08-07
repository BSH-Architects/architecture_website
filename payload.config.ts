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

// Object keys are intentionally independent from editable project names. This lets the
// asset library and project URLs evolve without copying blobs or invalidating cache URLs.
const mediaObjectPrefix = 'architecture-website/v1/media'

const storagePlugins = [
  s3Storage({
    // Keep Payload's storage fields (including `prefix`) present during local
    // development. The schema and generated types are therefore identical to R2.
    alwaysInsertFields: true,
    bucket: r2Configuration.bucket ?? 'local-media',
    clientUploads: hasR2Configuration
      ? {
          access: ({ req }) => Boolean(req.user),
        }
      : false,
    collections: {
      media: {
        prefix: mediaObjectPrefix,
        generateFileURL: ({ filename, prefix }) =>
          `${r2Configuration.publicURL!.replace(/\/$/, '')}/${[mediaObjectPrefix, prefix, filename]
            .filter(Boolean)
            .join('/')}`,
      },
    },
    config: hasR2Configuration
      ? {
          credentials: {
            accessKeyId: r2Configuration.accessKeyId!,
            secretAccessKey: r2Configuration.secretAccessKey!,
          },
          endpoint: r2Configuration.endpoint!,
          forcePathStyle: true,
          region: 'auto',
        }
      : {},
    enabled: hasR2Configuration,
    // The collection prefix remains stable; a future import can add a safe
    // document prefix without replacing the application namespace.
    useCompositePrefixes: true,
  }),
]

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
