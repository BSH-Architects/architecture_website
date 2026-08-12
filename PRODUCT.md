# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary users are the architecture practice owner and trusted editors. They use the CMS repeatedly to upload project imagery, prepare project narratives, choose homepage work, order projects, and publish changes without developer assistance.

## Product Purpose

The product is an architecture-practice website and its private editorial control plane. The public site presents the studio and its work; the Payload admin lets the practice maintain that experience safely. Success means an editor can enter a project once, reuse the same record across the homepage, work archive, and detail page, preview its state, and publish confidently.

## Positioning

One project record is the source of truth for every public presentation. Homepage curation selects and orders those records instead of duplicating project copy or media.

## Operating Context

Editors work in a Media → Projects → Homepage sequence. They first upload and describe reusable assets, then create or update a project and its narrative sections, then curate the homepage signature project and selected-work order. Draft and published states separate preparation from public release.

## Capabilities and Constraints

- Next.js hosts the public site, Payload admin, and APIs.
- Neon Postgres stores CMS records and version history.
- Media uses the local ignored `media/` directory during development and Backblaze B2 through Cloudflare in production.
- Projects contain shared summary metadata, two work-archive images, optional closing imagery, rich introductions, and reorderable narrative blocks.
- The Homepage global controls hero content, one signature project, and ordered selected work.
- Public reads expose published projects only. Authenticated editors manage content; administrators manage users and roles.
- The admin redesign must preserve Payload behavior, keyboard interaction, responsive layouts, dialogs, drawers, upload handling, and generated form controls.

## Brand Commitments

The public portfolio is a restrained architectural world of warm paper, charcoal, precise rules, editorial typography, and image-led composition. The private admin is intentionally distinct: the user requested a Linear-inspired operating design system with compact type, reduced visual noise, stronger hierarchy, denser navigation, and disciplined dark surfaces. It must be an original adaptation, not Linear branding or a pixel copy.

## Evidence on Hand

- Product and deployment documentation: `README.md`
- CMS configuration and workflows: `payload.config.ts`, `src/collections`, `src/globals`, `src/blocks`
- Public visual tokens: `src/app/(frontend)/tokens.css`
- Working Payload admin route: `src/app/(payload)`
- Real project content and brand assets have not yet been entered; the interface must not fabricate them.

## Product Principles

1. Enter content once; reference it everywhere.
2. Make draft, publish, and ordering state unmistakable.
3. Keep frequent editorial work compact, predictable, and keyboard-friendly.
4. Preserve image quality, metadata, and accessibility throughout the asset workflow.
5. Keep client accounts, infrastructure, and secrets client-owned.

## Accessibility & Inclusion

Maintain visible keyboard focus, clear labels and descriptions, semantic error and status states, sufficient text and control contrast, reduced-motion behavior, and usable responsive layouts down to mobile web widths.
