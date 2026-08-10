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
  const practiceImageID = relationshipID(homepage.practice.image)
  const practiceImageURL = mediaURL(homepage.practice.image)
  const practiceDisciplines = homepage.practice.disciplines ?? []
  const practiceDisciplinesComplete = practiceDisciplines.every(
    (discipline) =>
      nonEmpty(discipline.title) &&
      nonEmpty(discipline.descriptionPrimary) &&
      nonEmpty(discipline.descriptionSecondary),
  )
  const personOneImageID = relationshipID(homepage.people.personOne.image)
  const personTwoImageID = relationshipID(homepage.people.personTwo.image)
  const personOneImageURL = mediaURL(homepage.people.personOne.image)
  const personTwoImageURL = mediaURL(homepage.people.personTwo.image)
  const closingImageID = relationshipID(homepage.closing.image)
  const closingImageURL = mediaURL(homepage.closing.image)
  const positionHeadingLines = homepage.position.heading
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const closingHeadingLines = homepage.closing.heading
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const failures = [
    !nonEmpty(homepage.hero.title) && 'Homepage hero heading is empty.',
    !nonEmpty(homepage.hero.summary) && 'Homepage hero summary is empty.',
    !nonEmpty(homepage.hero.practiceDescriptor) &&
      'Homepage hero practice descriptor is empty.',
    !heroImageID && 'Homepage hero image is missing.',
    !positionImageID && 'Position image is missing.',
    heroImageID === positionImageID && 'Position image must be independent from the hero image.',
    !positionImageURL && 'Position image does not have a public URL.',
    positionHeadingLines.length < 1 && 'Position heading is empty.',
    !nonEmpty(homepage.position.descriptionPrimary) && 'Position first paragraph is empty.',
    !nonEmpty(homepage.position.descriptionSecondary) && 'Position second paragraph is empty.',
    !practiceImageID && 'Practice image is missing.',
    !practiceImageURL && 'Practice image does not have a public URL.',
    !nonEmpty(homepage.practice.headingLineOne) && 'Practice first heading line is empty.',
    !nonEmpty(homepage.practice.headingLineTwoPrefix) &&
      'Practice second-line prefix is empty.',
    !nonEmpty(homepage.practice.headingLineTwoEmphasis) &&
      'Practice emphasized heading phrase is empty.',
    !nonEmpty(homepage.practice.descriptionPrimary) &&
      'Practice first manifesto paragraph is empty.',
    !nonEmpty(homepage.practice.descriptionSecondary) &&
      'Practice second manifesto paragraph is empty.',
    practiceDisciplines.length !== 4 && 'Practice must contain exactly four disciplines.',
    !practiceDisciplinesComplete && 'One or more Practice disciplines are incomplete.',
    !nonEmpty(homepage.people.sectionLabel) && 'People section label is empty.',
    !nonEmpty(homepage.people.sectionSummary) && 'People section summary is empty.',
    !nonEmpty(homepage.people.heading) && 'People heading is empty.',
    !nonEmpty(homepage.people.description) && 'People description is empty.',
    !personOneImageID && 'First person portrait is missing.',
    !personOneImageURL && 'First person portrait does not have a public URL.',
    !nonEmpty(homepage.people.personOne.name) && 'First person name is empty.',
    !nonEmpty(homepage.people.personOne.role) && 'First person role is empty.',
    !nonEmpty(homepage.people.personOne.description) && 'First person description is empty.',
    !personTwoImageID && 'Second person portrait is missing.',
    !personTwoImageURL && 'Second person portrait does not have a public URL.',
    !nonEmpty(homepage.people.personTwo.name) && 'Second person name is empty.',
    !nonEmpty(homepage.people.personTwo.role) && 'Second person role is empty.',
    !nonEmpty(homepage.people.personTwo.description) && 'Second person description is empty.',
    !closingImageID && 'Closing image is missing.',
    !closingImageURL && 'Closing image does not have a public URL.',
    closingHeadingLines.length < 1 && 'Closing heading is empty.',
    !nonEmpty(homepage.closing.label) && 'Closing category label is empty.',
  ].filter((failure): failure is string => Boolean(failure))

  console.log(
    JSON.stringify(
      {
        heroImageID,
        closing: {
          headingLines: closingHeadingLines.length,
          imageID: closingImageID,
          imageURL: closingImageURL,
          label: nonEmpty(homepage.closing.label),
        },
        practice: {
          descriptionPrimary: nonEmpty(homepage.practice.descriptionPrimary),
          descriptionSecondary: nonEmpty(homepage.practice.descriptionSecondary),
          disciplineCount: practiceDisciplines.length,
          disciplinesComplete: practiceDisciplinesComplete,
          headingLineOne: nonEmpty(homepage.practice.headingLineOne),
          headingLineTwoEmphasis: nonEmpty(homepage.practice.headingLineTwoEmphasis),
          headingLineTwoPrefix: nonEmpty(homepage.practice.headingLineTwoPrefix),
          imageID: practiceImageID,
          imageURL: practiceImageURL,
        },
        people: {
          description: nonEmpty(homepage.people.description),
          heading: nonEmpty(homepage.people.heading),
          personOne: {
            description: nonEmpty(homepage.people.personOne.description),
            imageID: personOneImageID,
            imageURL: personOneImageURL,
            name: nonEmpty(homepage.people.personOne.name),
            role: nonEmpty(homepage.people.personOne.role),
          },
          personTwo: {
            description: nonEmpty(homepage.people.personTwo.description),
            imageID: personTwoImageID,
            imageURL: personTwoImageURL,
            name: nonEmpty(homepage.people.personTwo.name),
            role: nonEmpty(homepage.people.personTwo.role),
          },
          sectionLabel: nonEmpty(homepage.people.sectionLabel),
          sectionSummary: nonEmpty(homepage.people.sectionSummary),
        },
        position: {
          descriptionPrimary: nonEmpty(homepage.position.descriptionPrimary),
          descriptionSecondary: nonEmpty(homepage.position.descriptionSecondary),
          headingLines: positionHeadingLines.length,
          imageID: positionImageID,
          imageIndependent: heroImageID !== positionImageID,
          imageURL: positionImageURL,
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
