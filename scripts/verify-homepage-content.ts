import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

import type { Media } from '../payload-types'

function relationshipID(value: Media | number | string | null | undefined) {
  if (typeof value === 'object' && value) return String(value.id)
  return value === null || value === undefined ? null : String(value)
}

function mediaURL(value: Media | number | string | null | undefined) {
  return typeof value === 'object' && value ? value.url : null
}

function nonEmpty(value: string | null | undefined) {
  return typeof value === 'string' && value.trim().length > 0
}

let payload: Payload | undefined

try {
  payload = await getPayload({ config })
  const homepage = await payload.findGlobal({
    slug: 'homepage',
    depth: 1,
    draft: false,
    overrideAccess: true,
  })

  const heroImageID = relationshipID(homepage.hero.image)
  const positionImageID = relationshipID(homepage.position.image)
  const positionImageURL = mediaURL(homepage.position.image)
  const headingLines = homepage.position.heading
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const failures = [
    !heroImageID && 'Homepage hero image is missing.',
    !positionImageID && 'Position image is missing.',
    heroImageID === positionImageID && 'Position image must be independent from the hero image.',
    headingLines.length < 1 && 'Position heading is empty.',
    !nonEmpty(homepage.position.descriptionPrimary) && 'Position first paragraph is empty.',
    !nonEmpty(homepage.position.descriptionSecondary) && 'Position second paragraph is empty.',
    !positionImageURL?.includes('/api/media/file/') &&
      'Position image is not using Payload local media storage.',
  ].filter((failure): failure is string => Boolean(failure))

  console.log(
    JSON.stringify(
      {
        heroImageID,
        position: {
          descriptionPrimary: nonEmpty(homepage.position.descriptionPrimary),
          descriptionSecondary: nonEmpty(homepage.position.descriptionSecondary),
          headingLines: headingLines.length,
          imageID: positionImageID,
          imageIndependent: heroImageID !== positionImageID,
          localMedia: positionImageURL?.includes('/api/media/file/') ?? false,
        },
        status: homepage._status,
      },
      null,
      2,
    ),
  )

  if (failures.length > 0) throw new Error(failures.join(' '))
} finally {
  await payload?.destroy()
}
