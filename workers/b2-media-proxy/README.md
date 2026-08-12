# Private Backblaze B2 media Worker

This Worker exposes only `architecture-website/v1/media/` from the private `BSH-Architects-Media` bucket. It accepts `GET` and `HEAD`, signs path-style S3 requests to Backblaze, and caches successful immutable responses at Cloudflare's edge.

## Required encrypted secrets

Set these on the `bsh-architects-media` Worker in Cloudflare Dashboard → Settings → Variables and Secrets:

- `B2_APPLICATION_KEY_ID`: key ID for the bucket-restricted, read-only Worker key
- `B2_APPLICATION_KEY`: application key for that same read-only key

Do not use the Payload read/write key and do not put either value in this repository.

## Deploy

```powershell
npm install
npx wrangler login
npm run check
npm run deploy
```

The non-secret bucket, endpoint, and region values are committed in `wrangler.jsonc`. The public media base URL is `https://bsh-architects-media.bsharchitects.workers.dev`.
