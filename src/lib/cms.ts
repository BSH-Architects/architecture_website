import config from '@payload-config'
import { getPayload } from 'payload'

import type { Homepage, Media, Project } from '../../payload-types'

export type ProjectSummary = Pick<
  Project,
  'coverImage' | 'id' | 'layout' | 'location' | 'slug' | 'title' | 'year'
>

export type MediaRendition = 'card' | 'wide'

export type MediaReference = Pick<Media, 'alt' | 'focalX' | 'focalY' | 'height' | 'url' | 'width'>

export type HomepageContent = {
  featuredProject: ProjectSummary | null
  homepage: Homepage
  projects: ProjectSummary[]
}

export const cmsIsConfigured = Boolean(process.env.DATABASE_URI && process.env.PAYLOAD_SECRET)

const payloadClient = () => getPayload({ config })

function relationshipID(value: { id: number | string } | number | string | null | undefined) {
  if (typeof value === 'object' && value) return String(value.id)
  return value === null || value === undefined ? null : String(value)
}

export async function getHomepageContent(): Promise<HomepageContent> {
  const payload = await payloadClient()
  const [homepage, projectsResult] = await Promise.all([
    payload.findGlobal({
      slug: 'homepage',
      depth: 1,
      draft: false,
      overrideAccess: true,
    }),
    payload.find({
      collection: 'projects',
      depth: 1,
      draft: false,
      limit: 0,
      overrideAccess: false,
      pagination: false,
      sort: '-updatedAt',
      where: { _status: { equals: 'published' } },
    }),
  ])

  const publishedProjects = projectsResult.docs as ProjectSummary[]
  const projectsByID = new Map(
    publishedProjects.map((project) => [String(project.id), project]),
  )
  const featuredID = relationshipID(homepage.featuredProject)
  const orderedProjects = (homepage.projectOrder ?? [])
    .map((project) => projectsByID.get(relationshipID(project) ?? ''))
    .filter((project): project is ProjectSummary => Boolean(project))

  return {
    featuredProject: featuredID ? projectsByID.get(featuredID) ?? null : null,
    homepage,
    projects: orderedProjects.length > 0 ? orderedProjects : publishedProjects,
  }
}

export async function getPublishedProject(slug: string) {
  const payload = await payloadClient()
  const result = await payload.find({
    collection: 'projects',
    depth: 1,
    draft: false,
    limit: 1,
    overrideAccess: false,
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
  })

  return result.docs[0] ?? null
}

export function mediaData(
  value: Media | number | string | null | undefined,
  rendition?: MediaRendition,
): MediaReference | null {
  if (typeof value !== 'object' || !value) return null

  const resized = rendition ? value.sizes?.[rendition] : undefined
  const url = resized?.url || value.url

  if (typeof url !== 'string') return null

  return {
    alt: value.alt,
    focalX: value.focalX,
    focalY: value.focalY,
    height: resized?.height || value.height,
    url,
    width: resized?.width || value.width,
  }
}
