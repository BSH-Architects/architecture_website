import { AwsClient } from 'aws4fetch'

const MEDIA_PREFIX = 'architecture-website/v1/media/'
const CACHE_CONTROL = 'public, max-age=31536000, immutable'
const FORWARDED_REQUEST_HEADERS = [
  'if-modified-since',
  'if-none-match',
  'range',
]

function requiredEnvironment(env, name) {
  const value = env[name]?.trim()
  if (!value) throw new Error(`Missing Worker environment variable: ${name}`)
  return value
}

function responseWithoutBody(response) {
  return new Response(null, {
    headers: response.headers,
    status: response.status,
    statusText: response.statusText,
  })
}

function publicResponse(response) {
  const headers = new Headers(response.headers)
  headers.delete('set-cookie')
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Cache-Control', response.ok ? CACHE_CONTROL : 'no-store')
  headers.set('X-Content-Type-Options', 'nosniff')

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  })
}

export default {
  async fetch(request, env, context) {
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response('Method Not Allowed', {
        headers: { Allow: 'GET, HEAD' },
        status: 405,
      })
    }

    const incomingURL = new URL(request.url)
    const objectKey = incomingURL.pathname.replace(/^\/+/, '')

    if (!objectKey.startsWith(MEDIA_PREFIX) || objectKey === MEDIA_PREFIX) {
      return new Response('Not Found', { status: 404 })
    }

    const cacheRequest = new Request(incomingURL.toString(), { method: 'GET' })
    const canUseCache = !request.headers.has('range')
    const cache = caches.default

    if (canUseCache) {
      const cached = await cache.match(cacheRequest)
      if (cached) return request.method === 'HEAD' ? responseWithoutBody(cached) : cached
    }

    try {
      const bucket = requiredEnvironment(env, 'B2_BUCKET')
      const endpoint = requiredEnvironment(env, 'B2_ENDPOINT')
      const region = requiredEnvironment(env, 'B2_REGION')
      const accessKeyId = requiredEnvironment(env, 'B2_APPLICATION_KEY_ID')
      const secretAccessKey = requiredEnvironment(env, 'B2_APPLICATION_KEY')

      const upstreamURL = new URL(`https://${endpoint}`)
      upstreamURL.pathname = `/${bucket}/${objectKey}`
      upstreamURL.search = incomingURL.search

      const forwardedHeaders = new Headers()
      for (const name of FORWARDED_REQUEST_HEADERS) {
        const value = request.headers.get(name)
        if (value) forwardedHeaders.set(name, value)
      }

      const signer = new AwsClient({
        accessKeyId,
        region,
        secretAccessKey,
        service: 's3',
      })
      const signedRequest = await signer.sign(upstreamURL.toString(), {
        headers: forwardedHeaders,
        method: 'GET',
      })
      const upstreamResponse = await fetch(signedRequest)
      const response = publicResponse(upstreamResponse)

      if (canUseCache && response.ok) {
        context.waitUntil(cache.put(cacheRequest, response.clone()))
      }

      return request.method === 'HEAD' ? responseWithoutBody(response) : response
    } catch (error) {
      console.error('Private B2 media proxy failed', error)
      return new Response('Media temporarily unavailable', { status: 502 })
    }
  },
}
