# Architecture website foundation

A deliberately small production foundation for an architecture practice:

- **Next.js** renders the public content preview and hosts Payload.
- **Payload CMS** supplies `/admin`, users, homepage controls, projects, project templates, and reusable sections.
- **Neon Postgres** persists CMS data through Payload's Postgres adapter.
- **Cloudflare R2** stores image uploads when all R2 variables are configured; local development otherwise uses `media/`.
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

## Image delivery and asset library

**Use Cloudflare R2 for every CMS-managed image**: homepage hero, project covers, galleries, editorial images, and future content uploads. The browser receives those images from the R2 public custom domain (for example, `https://media.example.com`), not from Vercel storage or a Vercel function. Authenticated uploads go browser → R2 via a short-lived signed URL, so large source files never pass through Vercel.

Keep only small, code-owned UI assets in the repository—for example an SVG wordmark, favicon, or interface icon. Next/Vercel serves those static build assets from its edge CDN. Do **not** use Vercel's ephemeral filesystem for editor-uploaded images; it is a local-development fallback only and can disappear on a deployment.

R2 object keys use one immutable technical namespace:

```text
architecture-website/v1/media/<collision-safe-filename>
```

Payload creates the `card` and `wide` WebP renditions alongside the original within that namespace. `v1` provides a clean migration boundary should the storage convention ever need to change. Keys deliberately do **not** contain project slugs, titles, or dates: projects can be renamed, images can be reused, and moving a blob would create cache misses and orphan risks without making it faster.

Instead, organize images in the Payload Media library with the required **Asset group** (`Website`, `Project`, `Identity`, `Editorial / press`, or `Archive`), optional related projects, tags, caption, credit, alt text, and focal point. This is the editor-friendly organizational system; R2 folders are an implementation detail.

The temporary preview already reads direct public image URLs. It should use the generated `card` / `wide` rendition URLs when final components are built rather than rendering original camera files. R2 delivers and caches files; it does not automatically resize them at request time. The Payload renditions, proper `sizes` attributes, and lazy loading below the fold are the performance controls for the final design.

## Client ownership and overnight development policy

Until the client creates their accounts, development stays **local only**. Do not create a temporary Vercel project, deploy a live preview, attach the client domain, create a personal Cloudflare R2 bucket, or upload client production assets under a developer account.

The application is intentionally account-neutral: credentials are read only from environment variables, the local filesystem is the upload fallback when all `R2_*` values are blank, and no client domain or account identifier is hard-coded. Once the client creates Cloudflare, Neon, Vercel, and preferably a client-owned GitHub organization, they remain Owner and invite the developer’s own account. Add the client-owned environment variables, run the migration, complete the R2 smoke test, and perform the first deployment directly from the client-owned Vercel team.

## What you need to create or provide

You own all accounts and secrets. **Do not send passwords, database URLs, `PAYLOAD_SECRET`, R2 access keys, or Vercel tokens in chat.** Put them directly in your local `.env` and Vercel's encrypted environment-variable UI. I only need non-secret decisions if you want configuration reviewed: production app domain, media subdomain, whether you need a staging environment, and any expected project/image volumes.

### 1. Cloudflare: R2 and public media domain

1. Create or use a Cloudflare account. Your primary domain should be managed in its DNS if you want `media.yourdomain.com`.
2. Create a **dedicated production bucket**, named consistently, for example `architecture-website-media-production`. If previews/staging will be tested with real uploads, create a separate bucket such as `architecture-website-media-staging`; never let preview deployments write into production media.
3. In R2, create an **S3 API token** scoped only to the relevant bucket with **Object Read** and **Object Write** permissions. Save its Access Key ID and Secret Access Key directly in `.env` / Vercel. It is never exposed to browsers; browser uploads use short-lived signed URLs.
4. Copy the R2 S3 endpoint: `https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com`.
5. Attach a public custom domain such as `media.yourdomain.com` to the bucket. Copy the resulting HTTPS URL without a trailing slash. This is `R2_PUBLIC_URL`.
6. Configure the bucket CORS policy, replacing the example domains and adding only origins that will actually upload through Payload:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://yourdomain.com",
      "https://www.yourdomain.com"
    ],
    "AllowedMethods": ["GET", "HEAD", "PUT"],
    "AllowedHeaders": ["Content-Type", "Content-Length"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 86400
  }
]
```

If you run a separate staging app, add only its exact HTTPS domain. Do not use `*` for origins in production.

The five required R2 variables are shown in `.env.example`:

```text
R2_BUCKET
R2_ENDPOINT
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_PUBLIC_URL
```

The application rejects partial configuration. Leave all five blank for a local-filesystem-only session, or set all five to exercise the real R2 path.

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
2. Set the **Production** environment variables: `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, and all five R2 variables. Set `NEXT_PUBLIC_SERVER_URL` to the final HTTPS application domain, no trailing slash.
3. Create `PAYLOAD_SECRET` locally with a cryptographically random value, for example:

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

4. For Preview environments, either use separate Neon/R2 resources and exact preview CORS origins, or omit CMS/R2 secrets so previews cannot edit production content.
5. Deploy only after migrations have completed. Vercel has no need for an R2 secret in client-side code; all secrets remain server-side.

## Local and production test run

### Local, without Cloudflare

1. Install Node `24.11.1` from `.nvmrc` and run `npm install`.
2. Copy `.env.example` to `.env`; set only `PAYLOAD_SECRET` and `DATABASE_URI`, leaving every `R2_*` value blank.
3. Create/apply migrations, then run:

```powershell
npm run dev
```

4. Open `http://localhost:3000` for the temporary public preview and `http://localhost:3000/admin` to create the first administrator. Local uploads go into the ignored `media/` directory.

### Real R2 smoke test

1. Add all five R2 values to local `.env`, use the production/staging media domain, and confirm the CORS policy includes `http://localhost:3000`.
2. Run `npm run dev`, sign in at `/admin`, upload an image, set its alt text and Asset group, then assign it to the homepage hero or a project and publish that content.
3. Verify all of the following:
   - the image appears at `http://localhost:3000`;
   - the image URL begins with your `R2_PUBLIC_URL`;
   - R2 shows keys under `architecture-website/v1/media/`;
   - browser DevTools → Network shows the upload `PUT` going to R2, not a Vercel URL;
   - the public media URL returns `200` in a private/incognito browser window.

### Pre-deployment check and live test

Run this before deploying:

```powershell
npm run generate:types
npm run generate:importmap
npm run lint
npm run build
```

After production deployment, open the public domain, `/admin`, and one published project URL. Upload a non-critical test image, verify the R2 custom-domain URL and cache headers in DevTools, then delete the test asset if it is not needed. The public experience is intentionally still a content preview until visual implementation begins.

## Vercel

Import the repository as a Next.js project. Production CMS media must use R2; Vercel's filesystem is ephemeral. Apply database migrations explicitly from a trusted environment before deploying code that depends on a new schema.

## Intentional version pins

Dependencies use exact versions for reproducible builds. Most direct dependencies are current. Three packages intentionally remain below the registry's latest major:

- **TypeScript 5.9.3:** the installed `@typescript-eslint/parser` supports TypeScript `<6.1`; TypeScript 7 cannot currently run this lint stack.
- **ESLint 9.39.5:** transitive plugins used by `eslint-config-next` currently declare support through ESLint 9. ESLint 10 installs with peer conflicts.
- **GraphQL 16.14.2:** `@payloadcms/next` requires GraphQL `^16.8.1`; GraphQL 17 is outside that peer range.

`@types/node` follows the actual Node 24 runtime rather than the newer Node 26 type package.

## Validation

Run before deployment:

```powershell
npm run generate:types
npm run generate:importmap
npm run lint
npm run build
```
