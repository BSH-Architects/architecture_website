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

## Cloudflare R2

R2 configuration is all-or-none: set all five `R2_*` values or leave all five empty for local filesystem uploads. Partial configuration fails early instead of silently writing to ephemeral Vercel storage.

The storage plugin uses authenticated direct browser uploads so large source images do not proxy through Vercel functions. Configure the R2 bucket CORS policy to allow `PUT` from local and production site origins. Point `R2_PUBLIC_URL` to the bucket's public custom domain.

## Vercel

Import the repository as a Next.js project. Add `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, and all R2 variables. Set `NEXT_PUBLIC_SERVER_URL` to the production domain. Apply migrations explicitly from a trusted environment before deploying code that depends on a new schema.

Local filesystem uploads are only a development fallback; Vercel's filesystem is ephemeral, so production must use R2.

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
