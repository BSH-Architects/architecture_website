import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from './src/collections/Media'
import { Projects } from './src/collections/Projects'
import { Users } from './src/collections/Users'
import { Homepage } from './src/globals/Homepage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseURI = process.env.DATABASE_URI?.trim()
const payloadSecret = process.env.PAYLOAD_SECRET?.trim()
const configuredCMSValues = [databaseURI, payloadSecret].filter(Boolean).length
const isVercelProduction = process.env.VERCEL_ENV === 'production'

if (configuredCMSValues === 1) {
  throw new Error(
    'CMS configuration is incomplete. Set both DATABASE_URI and PAYLOAD_SECRET or remove both for a frontend-only preview.',
  )
}

if (
  payloadSecret &&
  (payloadSecret.length < 32 || payloadSecret === 'replace-with-a-long-random-secret')
) {
  throw new Error('PAYLOAD_SECRET must be a random value of at least 32 characters.')
}

if (isVercelProduction && configuredCMSValues !== 2) {
  throw new Error('Production Vercel deployments require DATABASE_URI and PAYLOAD_SECRET.')
}

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

if (isVercelProduction && !hasR2Configuration) {
  throw new Error(
    'Production Vercel deployments require all five R2_* variables; local media storage is ephemeral.',
  )
}

const mediaObjectPrefix = 'architecture-website/v1/media'

const storagePlugins = [
  s3Storage({
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
        // Composite mode keeps this callback's prefix document-only, so the collection
        // namespace is prepended exactly once and matches the adapter's object key.
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
    useCompositePrefixes: true,
  }),
]

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      beforeLogin: ['/src/components/admin/AdminBrand#AdminWelcome'],
      graphics: {
        Icon: '/src/components/admin/AdminBrand#StudioIcon',
        Logo: '/src/components/admin/AdminBrand#StudioLogo',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, 'src/app/(payload)/admin/importMap.ts'),
    },
    meta: {
      titleSuffix: '— Studio CMS',
    },
    theme: 'dark',
  },
  collections: [Users, Media, Projects],
  db: postgresAdapter({
    pool: {
      connectionString: databaseURI ?? '',
    },
  }),
  editor: lexicalEditor(),
  globals: [Homepage],
  plugins: storagePlugins,
  secret: payloadSecret ?? '',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  upload: {
    limits: {
      fileSize: 20_000_000,
    },
  },
})
