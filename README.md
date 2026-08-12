# Architecture website foundation

A deliberately small production foundation for an architecture practice:

- **Next.js** renders the public content preview and hosts Payload.
- **Payload CMS** supplies `/admin`, users, homepage controls, projects, project templates, and reusable sections.
- **Neon Postgres** persists CMS data through Payload's Postgres adapter.
- **Backblaze B2** stores image uploads when all B2 variables are configured; local development otherwise uses `media/`.
- **Vercel** deploys the Next.js application unchanged.

The public routes are intentionally a content preview, not the final art direction. Replace the files in `src/app/(frontend)` with the approved components without changing the CMS model.

## Content and access model

- **Homepage global:** draft/publish workflow, editable hero image/copy, one featured project, and an ordered relationship list for the rest of the homepage work.
- **Projects:** Payload's native draft/publish workflow, generated unique URL slug, cover image, location/year, one of three presentation-template choices, and blocks for a project hero, text/image sections, and galleries.
- **Media:** required alt text, responsive image sizes, public reads, and authenticated mutations.
- **Users:** Payload authentication. The one-time first user becomes an administrator; later users default to editor. Only administrators can create/delete users or change roles.
- **Public APIs:** anonymous project reads are limited to published documents. Authenticated editors can manage content.

## Replaceable design foundation

`src/app/(frontend)/tokens.css` is the only primitive token layer for the temporary public preview. It owns:

- body and display font families
- type scale, weights, line heights, and reading measure
- colors and focus treatment
- spacing scale and section rhythm
- container width, gutter, borders, and touch-target size

Change token values without editing components. When the final fonts are chosen, load them with `next/font` and assign the generated variables to `--font-family-body` and `--font-family-display`. Payload admin styles remain isolated in the `(payload)` route group.

## Local setup

1. Install the Node version in `.nvmrc` (Node 24.11.1) and run `npm install`.
2. Copy `.env.example` to `.env`; set `PAYLOAD_SECRET` and a Neon `DATABASE_URI`.
3. Create a migration after schema changes: `npm run migrate:create -- initial-schema`.
4. Apply migrations: `npm run migrate`.
5. Start the app: `npm run dev`.
6. Open `http://localhost:3000/admin` and create the first Payload user.

`payload-types.ts` and the admin import map are generated source artifacts and should be committed after model/admin-component changes:

```powershell
npm run generate:types
npm run generate:importmap
```

## CMS administrator access and recovery

The CMS deliberately has **no public sign-up page**. Allowing visitors to register themselves as administrators would give anyone control of the site.

- On an empty database, `/admin` exposes Payload's one-time **create first user** screen. That first account becomes an administrator.
- After the first user exists, new accounts are created by a signed-in administrator under **Users → Create New**. Administrators can assign Administrator or Editor; editors cannot create users or change roles.
- Payload includes forgot/reset-password operations, but this project does not yet have a transactional email adapter. Do not rely on reset emails until a client-owned email provider is configured.

If every administrator is locked out, recover the account from a trusted checkout connected to the intended database. The command updates the sole existing administrator's email and password; it creates an administrator only when none exists. It refuses to guess when multiple administrators exist unless `CMS_RECOVERY_ADMIN_ID` is supplied.

Do not put recovery values in `.env`, commit them, paste them into chat, or run this against the wrong database. In PowerShell, collect the password without adding it to shell history:

```powershell
$env:CMS_RECOVERY_EMAIL = Read-Host 'New administrator email'
$env:CMS_RECOVERY_NAME = Read-Host 'Administrator name'
$securePassword = Read-Host 'New password (minimum 12 characters)' -AsSecureString
$env:CMS_RECOVERY_PASSWORD = [System.Net.NetworkCredential]::new('', $securePassword).Password
npm run admin:recover
'CMS_RECOVERY_EMAIL', 'CMS_RECOVERY_NAME', 'CMS_RECOVERY_PASSWORD', 'CMS_RECOVERY_ADMIN_ID' |
  ForEach-Object { Remove-Item "Env:$_" -ErrorAction SilentlyContinue }
```

For a database with multiple administrators, set `CMS_RECOVERY_ADMIN_ID` to the intended existing administrator before rerunning. The command never prints the password. Once access is restored, create any additional named users from the CMS instead of sharing one administrator login.

The Payload dashboard is intentionally restricted to the light theme for consistent readability.

## Image delivery and asset library

**Use Backblaze B2 for every CMS-managed image**: homepage hero, project covers, galleries, editorial images, and future content uploads. The browser receives those images from the Cloudflare media domain (for example, `https://media.example.com`), not from Vercel storage or a Vercel function. Authenticated uploads go browser → B2 via a short-lived signed URL, so large source files never pass through Vercel.

Keep only small, code-owned UI assets in the repository—for example an SVG wordmark, favicon, or interface icon. Next/Vercel serves those static build assets from its edge CDN. Do **not** use Vercel's ephemeral filesystem for editor-uploaded images; it is a local-development fallback only and can disappear on a deployment.

B2 object keys use one immutable technical namespace:

```text
architecture-website/v1/media/<collision-safe-filename>
```

Payload creates the `card` and `wide` WebP renditions alongside the original within that namespace. `v1` provides a clean migration boundary should the storage convention ever need to change. Keys deliberately do **not** contain project slugs, titles, or dates: projects can be renamed, images can be reused, and moving a blob would create cache misses and orphan risks without making it faster.

Instead, organize images in the Payload Media library with the required **Asset group** (`Website`, `Project`, `Identity`, `Editorial / press`, or `Archive`), optional related projects, tags, caption, credit, alt text, and focal point. This is the editor-friendly organizational system; B2 folders are an implementation detail.

The temporary preview already reads direct public image URLs. It should use the generated `card` / `wide` rendition URLs when final components are built rather than rendering original camera files. B2 stores files and Cloudflare delivers and caches them; neither service automatically resizes images at request time. The Payload renditions, proper `sizes` attributes, and lazy loading below the fold are the performance controls for the final design.

## Client ownership and overnight development policy

Until the client creates their accounts, development stays **local only**. Do not create a temporary Vercel project, deploy a live preview, attach the client domain, create a personal Backblaze B2 bucket, or upload client production assets under a developer account.

The application is intentionally account-neutral: credentials are read only from environment variables, the local filesystem is the upload fallback when all `B2_*` values are blank, and no client domain or account identifier is hard-coded. Once the client creates Backblaze, Cloudflare, Neon, Vercel, and preferably a client-owned GitHub organization, they remain Owner and invite the developer’s own account. Add the client-owned environment variables, run the migration, complete the B2 smoke test, and perform the first deployment directly from the client-owned Vercel team.

## What you need to create or provide

You own all accounts and secrets. **Do not send passwords, database URLs, `PAYLOAD_SECRET`, B2 access keys, or Vercel tokens in chat.** Put them directly in your local `.env` and Vercel's encrypted environment-variable UI. I only need non-secret decisions if you want configuration reviewed: production app domain, media subdomain, whether you need a staging environment, and any expected project/image volumes.

### 1. Private Backblaze B2 storage and Cloudflare Worker CDN

1. In the client-owned Backblaze account, enable **B2 Cloud Storage** and create a dedicated **Private** production bucket. Private buckets avoid the payment verification Backblaze requires for the first public bucket. Keep Object Lock off unless retention rules are explicitly required, because locked files cannot be deleted from Payload.
2. Copy the bucket's exact S3 endpoint and region. They have the form `https://s3.us-east-005.backblazeb2.com` and `us-east-005`; do not use a friendly download host as `B2_ENDPOINT`.
3. Create a bucket-restricted **Read and Write** application key for Payload. Enable **List All Bucket Names** and optionally restrict the filename prefix to `architecture-website/v1/media/`. Store its key ID and application key only as `B2_ACCESS_KEY_ID` / `B2_SECRET_ACCESS_KEY` in local and Vercel secret storage.
4. Create a second bucket-restricted **Read Only** key with the same filename prefix for Cloudflare. Never give the public-delivery Worker the Payload write key.
5. Deploy the Worker in `workers/b2-media-proxy`. Its non-secret bucket/endpoint/region bindings live in `wrangler.jsonc`; add the read-only key as encrypted Cloudflare secrets named `B2_APPLICATION_KEY_ID` and `B2_APPLICATION_KEY`. The Worker accepts only `GET`/`HEAD`, exposes only the media prefix, signs private path-style B2 requests, and caches successful files with immutable headers.

```powershell
cd workers/b2-media-proxy
npm install
npx wrangler login
npm run check
npm run deploy
cd ../..
```

6. Use the deployed `https://<worker>.<account>.workers.dev` URL as `B2_PUBLIC_URL` without a trailing slash. A custom `media.example.com` Worker domain can replace it later without changing object keys.
7. Configure this S3-compatible CORS policy on the B2 bucket for direct authenticated Payload uploads. Replace the production origin after Vercel assigns the application URL:

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": [
        "http://localhost:3000",
        "https://your-project.vercel.app"
      ],
      "AllowedMethods": ["GET", "HEAD", "PUT"],
      "AllowedHeaders": ["Content-Type", "Content-Length"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 86400
    }
  ]
}
```

Use Backblaze's bucket CORS controls where available or the standard S3 `PutBucketCors` operation with a separate administrative credential. Do not grant bucket-configuration permissions to the long-lived Payload upload key, and do not use `*` for production origins.

The six required application variables are shown in `.env.example`:

```text
B2_BUCKET
B2_ENDPOINT
B2_REGION
B2_ACCESS_KEY_ID
B2_SECRET_ACCESS_KEY
B2_PUBLIC_URL
```

The application rejects partial or mismatched configuration. Leave all six blank for local filesystem storage, or set all six for B2. After the Worker successfully returns an authenticated B2 `404` for a missing allowed-prefix object, migrate the existing local originals and renditions with a dry run followed by the dedicated write command:

```powershell
npm run sync:media:b2
npm run sync:media:b2:apply
```

The sync is idempotent, uploads to `architecture-website/v1/media/`, skips same-sized existing objects, and refuses to overwrite a different object unless the positional `overwrite` mode is explicitly supplied.

### 2. Neon: CMS database

1. Create a Neon project and a production database/role for the site.
2. Copy a pooled Postgres connection string with `sslmode=require` into `DATABASE_URI`; treat it as a password.
3. Optional but recommended: make a separate Neon branch/database for staging or Vercel previews. Do not point preview deployments at the production CMS unless that is explicitly intended.
4. Before the first deploy—and after any Payload schema change—apply migrations from a trusted machine with access to that database:

```powershell
npm run migrate:create -- descriptive-schema-change
npm run migrate
```

### 3. Vercel: application hosting

1. Import this repository as a Next.js project.
2. Set the **Production** environment variables: `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, and all six B2 variables. Set `NEXT_PUBLIC_SERVER_URL` to the final HTTPS application domain, no trailing slash.
3. Create `PAYLOAD_SECRET` locally with a cryptographically random value, for example:

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

4. For Preview environments, either use separate Neon/B2 resources and exact preview CORS origins, or omit CMS/B2 secrets so previews cannot edit production content.
5. Deploy only after migrations have completed. Vercel has no need for a B2 secret in client-side code; all secrets remain server-side.

## Local and production test run

### Local, without Cloudflare

1. Install Node `24.11.1` from `.nvmrc` and run `npm install`.
2. Copy `.env.example` to `.env`; set only `PAYLOAD_SECRET` and `DATABASE_URI`, leaving every `B2_*` value blank.
3. Create/apply migrations, then run:

```powershell
npm run dev
```

4. Open `http://localhost:3000` for the temporary public preview and `http://localhost:3000/admin` to create the first administrator. Local uploads go into the ignored `media/` directory.

### Real B2 smoke test

1. Add all six B2 values to local `.env`, use the production/staging media domain, and confirm the CORS policy includes `http://localhost:3000`.
2. Run `npm run dev`, sign in at `/admin`, upload an image, set its alt text and Asset group, then assign it to the homepage hero or a project and publish that content.
3. Verify all of the following:
   - the image appears at `http://localhost:3000`;
   - the image URL begins with your `B2_PUBLIC_URL`;
   - B2 shows keys under `architecture-website/v1/media/`;
   - browser DevTools → Network shows the upload `PUT` going to B2, not a Vercel URL;
   - the public media URL returns `200` in a private/incognito browser window.

### Pre-deployment check and live test

Run this before deploying:

```powershell
npm run generate:types
npm run generate:importmap
npm run lint
npm run build
```

After production deployment, open the public domain, `/admin`, and one published project URL. Upload a non-critical test image, verify the B2-backed Cloudflare media URL and cache headers in DevTools, then delete the test asset if it is not needed. The public experience is intentionally still a content preview until visual implementation begins.

## Vercel

Import the repository as a Next.js project. Production CMS media must use B2; Vercel's filesystem is ephemeral. Apply database migrations explicitly from a trusted environment before deploying code that depends on a new schema.

## Intentional version pins

Dependencies use exact versions for reproducible builds. Most direct dependencies are current. Three packages intentionally remain below the registry's latest major:

- **TypeScript 5.9.3:** the installed `@typescript-eslint/parser` supports TypeScript `<6.1`; TypeScript 7 cannot currently run this lint stack.
- **ESLint 9.39.5:** transitive plugins used by `eslint-config-next` currently declare support through ESLint 9. ESLint 10 installs with peer conflicts.
- **GraphQL 16.14.2:** `@payloadcms/next` requires GraphQL `^16.8.1`; GraphQL 17 is outside that peer range.

`@types/node` follows the actual Node 24 runtime rather than the newer Node 26 type package.

## Validation

Run the complete clone-safe verification gate before opening a pull request or deploying:

```powershell
npm run check
```

This regenerates Payload types and the admin import map, runs ESLint, and creates the production Next.js build. The GitHub Actions workflow runs the same checks on every push and pull request, applies the full migration chain to disposable PostgreSQL, and fails if committed generated artifacts are stale.

With a configured local `.env`, also verify the connected CMS database and published homepage content:

```powershell
npm run payload -- migrate:status
npm run verify:homepage
```
