import config from '@payload-config'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

const notFound = () => new Response(null, { status: 404 })

export const GET =
  process.env.NODE_ENV === 'production' ? notFound : GRAPHQL_PLAYGROUND_GET(config)
