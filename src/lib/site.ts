import { existsSync } from 'node:fs'
import path from 'node:path'

/**
 * Server-only site constants. Nothing here is a CMS field yet: the practice name
 * becomes a Payload global the moment it is confirmed, and the fallback copy
 * exists purely so the design can be judged before a database is connected.
 */

/** TODO: replace with the practice name, then promote to a Payload global. */
export const SITE_NAME = 'Studio'

/** Shown in the hero rail beside the practice name. */
export const SITE_DATUM = 'Est. 2014 — Practice of architecture'

/** Placeholder hero content, used in development only. Not client copy. */
export const heroPlaceholder = {
  practiceDescriptor: 'Independent architectural practice',
  summary:
    'Rooms shaped by daylight, honest materials, and plans made to endure.',
  title: 'Built with intent.',
}

const PREVIEW_IMAGE_CANDIDATES = [
  'hero.avif',
  'hero.webp',
  'hero.jpg',
  'hero.jpeg',
  'hero.png',
] as const

/**
 * Drop any photograph at public/preview/hero.jpg (or .webp/.avif/.png) to view the
 * hero with real imagery before Cloudflare R2 and the CMS are connected. The
 * directory is git-ignored, so nothing leaks into the client repository.
 */
export function previewHeroImagePath(): string | null {
  for (const filename of PREVIEW_IMAGE_CANDIDATES) {
    if (existsSync(path.join(process.cwd(), 'public', 'preview', filename))) {
      return `/preview/${filename}`
    }
  }

  return null
}
