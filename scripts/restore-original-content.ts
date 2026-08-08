import { copyFile, mkdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

import config from '@payload-config'
import { getPayload, type Payload, type RequiredDataFromCollectionSlug } from 'payload'

import type { Media, Project } from '../payload-types'
import { positionSectionDefaults } from '../src/content/homepageDefaults'

type AssetGroup = NonNullable<Media['assetGroup']>

type AssetDefinition = {
  alt: string
  assetGroup: AssetGroup
  credit?: string
  filename: string
  key: string
  source: { localPath: string } | { url: string }
  tags: string[]
}

type ProjectDefinition = {
  archiveDetailAsset: string
  closingAsset: string
  coverAsset: string
  description: string
  layout: NonNullable<Project['layout']>
  location: string
  scope: string
  slug: string
  status: string
  title: string
  year: number
}

const rootDirectory = process.cwd()
const cacheDirectory = path.join(rootDirectory, '.restore-cache', 'original-site')
const originalPrototypeCredit = 'Original architecture website design prototype / Unsplash'

const assets: AssetDefinition[] = [
  {
    key: 'homepageHero',
    filename: 'homepage-hero.jpg',
    alt: 'Contemporary house with timber cladding arranged around a sheltered courtyard',
    assetGroup: 'website',
    source: { localPath: path.join(rootDirectory, 'public', 'preview', 'hero.jpg') },
    tags: ['homepage', 'hero', 'original-site'],
  },
  {
    key: 'houseCover',
    filename: 'house-of-stillness-cover.jpg',
    alt: 'Minimal contemporary residence framed by concrete and landscape',
    assetGroup: 'project',
    credit: originalPrototypeCredit,
    source: {
      url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2400&q=88',
    },
    tags: ['house-of-stillness', 'cover', 'original-site'],
  },
  {
    key: 'warmInterior',
    filename: 'warm-interior-timber-stone.jpg',
    alt: 'Warm interior detail with natural timber and stone',
    assetGroup: 'project',
    credit: originalPrototypeCredit,
    source: {
      url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=88',
    },
    tags: ['house-of-stillness', 'courtyard-house', 'interior', 'original-site'],
  },
  {
    key: 'courtyardInterior',
    filename: 'courtyard-house-interior.jpg',
    alt: 'Quiet living space opening toward a planted courtyard',
    assetGroup: 'project',
    credit: originalPrototypeCredit,
    source: {
      url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=2000&q=88',
    },
    tags: ['courtyard-house', 'casa-terra', 'interior', 'original-site'],
  },
  {
    key: 'monolithCover',
    filename: 'monolith-offices-cover.jpg',
    alt: 'Contemporary urban architecture',
    assetGroup: 'project',
    credit: originalPrototypeCredit,
    source: {
      url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=88',
    },
    tags: ['monolith-offices', 'cover', 'original-site'],
  },
  {
    key: 'monolithInterior',
    filename: 'monolith-offices-interior.jpg',
    alt: 'Open workplace with a restrained material palette',
    assetGroup: 'project',
    credit: originalPrototypeCredit,
    source: {
      url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=86',
    },
    tags: ['monolith-offices', 'workplace', 'original-site'],
  },
  {
    key: 'stoneInterior',
    filename: 'casa-terra-stone-interior.jpg',
    alt: 'Stone-lined hospitality interior in soft daylight',
    assetGroup: 'project',
    credit: originalPrototypeCredit,
    source: {
      url: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=86',
    },
    tags: ['casa-terra', 'house-of-stillness', 'interior', 'original-site'],
  },
  {
    key: 'residenceInterior',
    filename: 'residence-18-interior.jpg',
    alt: 'Refined residential interior with warm stone surfaces',
    assetGroup: 'project',
    credit: originalPrototypeCredit,
    source: {
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=88',
    },
    tags: ['residence-18', 'house-of-stillness', 'interior', 'original-site'],
  },
  {
    key: 'landscapeResidence',
    filename: 'residence-landscape-closing.jpg',
    alt: 'Contemporary residence opening toward its surrounding landscape',
    assetGroup: 'project',
    credit: originalPrototypeCredit,
    source: {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=90',
    },
    tags: ['residence-18', 'house-of-stillness', 'closing', 'original-site'],
  },
  {
    key: 'practiceModel',
    filename: 'practice-model.webp',
    alt: 'Architectural model study used in the practice section',
    assetGroup: 'website',
    source: {
      url: 'https://cdn.prod.website-files.com/69e60b77c36e562efcf3a092/6a0209b5b80c1f21303cae07_model-section.webp',
    },
    tags: ['practice', 'original-site'],
  },
  {
    key: 'personOne',
    filename: 'studio-person-one.jpg',
    alt: 'Temporary editorial portrait for the first founder',
    assetGroup: 'identity',
    credit: originalPrototypeCredit,
    source: {
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1600&q=88',
    },
    tags: ['people', 'portrait', 'original-site'],
  },
  {
    key: 'personTwo',
    filename: 'studio-person-two.jpg',
    alt: 'Temporary editorial portrait for the second founder',
    assetGroup: 'identity',
    credit: originalPrototypeCredit,
    source: {
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1600&q=88',
    },
    tags: ['people', 'portrait', 'original-site'],
  },
]

const projectDefinitions: ProjectDefinition[] = [
  {
    title: 'House of Stillness',
    slug: 'house-of-stillness',
    layout: 'editorial',
    status: 'In development',
    location: 'Alibaug, Maharashtra',
    year: 2026,
    scope: 'Architecture / Interiors / Landscape',
    description:
      'A coastal residence organized around shade, cross-ventilation, and rooms that open gradually toward the landscape.',
    coverAsset: 'houseCover',
    archiveDetailAsset: 'warmInterior',
    closingAsset: 'landscapeResidence',
  },
  {
    title: 'Courtyard House',
    slug: 'courtyard-house',
    layout: 'editorial',
    status: 'Completed',
    location: 'Goa, India',
    year: 2025,
    scope: 'Residential / Architecture',
    description:
      'A family house gathered around a planted court, with deep thresholds mediating between private rooms and shared life.',
    coverAsset: 'warmInterior',
    archiveDetailAsset: 'courtyardInterior',
    closingAsset: 'courtyardInterior',
  },
  {
    title: 'Monolith Offices',
    slug: 'monolith-offices',
    layout: 'technical',
    status: 'Completed',
    location: 'Bengaluru, India',
    year: 2024,
    scope: 'Workplace / Architecture',
    description:
      'A compact workplace where a restrained material shell supports flexible occupation, diffuse light, and quiet concentration.',
    coverAsset: 'monolithCover',
    archiveDetailAsset: 'monolithInterior',
    closingAsset: 'monolithInterior',
  },
  {
    title: 'Casa Terra',
    slug: 'casa-terra',
    layout: 'gallery',
    status: 'Completed',
    location: 'Udaipur, India',
    year: 2023,
    scope: 'Hospitality / Interiors',
    description:
      'Local stone, filtered daylight, and a sequence of compressed rooms shape a retreat grounded in the surrounding terrain.',
    coverAsset: 'courtyardInterior',
    archiveDetailAsset: 'stoneInterior',
    closingAsset: 'stoneInterior',
  },
  {
    title: 'Residence 18',
    slug: 'residence-18',
    layout: 'editorial',
    status: 'Completed',
    location: 'Mumbai, India',
    year: 2022,
    scope: 'Residential / Interiors',
    description:
      'A city apartment reduced to proportion, warm stone, and carefully framed storage so everyday routines remain foregrounded.',
    coverAsset: 'residenceInterior',
    archiveDetailAsset: 'landscapeResidence',
    closingAsset: 'landscapeResidence',
  },
]

function richText(...paragraphs: string[]): NonNullable<Project['intro']> {
  return {
    root: {
      type: 'root',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        textStyle: '',
        version: 1,
      })),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  } as NonNullable<Project['intro']>
}

async function fileHasContent(filePath: string) {
  try {
    return (await stat(filePath)).size > 0
  } catch {
    return false
  }
}

async function download(url: string, destination: string) {
  let lastError: unknown

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'architecture-website-local-content-restoration/1.0' },
        redirect: 'follow',
      })

      if (!response.ok) throw new Error(`Image request returned HTTP ${response.status}`)

      const contentType = response.headers.get('content-type') ?? ''
      if (!contentType.startsWith('image/')) {
        throw new Error(`Expected an image response, received ${contentType || 'unknown content'}`)
      }

      await writeFile(destination, Buffer.from(await response.arrayBuffer()))
      return
    } catch (error) {
      lastError = error
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 750))
    }
  }

  throw lastError
}

async function prepareAssetSource(asset: AssetDefinition) {
  await mkdir(cacheDirectory, { recursive: true })
  const destination = path.join(cacheDirectory, asset.filename)
  if (await fileHasContent(destination)) return destination

  if ('localPath' in asset.source) {
    await copyFile(asset.source.localPath, destination)
  } else {
    console.log(`Downloading ${asset.filename}`)
    await download(asset.source.url, destination)
  }

  return destination
}

async function upsertMedia(payload: Payload, asset: AssetDefinition) {
  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { filename: { equals: asset.filename } },
  })

  const data = {
    alt: asset.alt,
    assetGroup: asset.assetGroup,
    credit: asset.credit,
    tags: asset.tags.map((tag) => ({ tag })),
  } satisfies RequiredDataFromCollectionSlug<'media'>

  if (existing.docs[0]) {
    const updated = await payload.update({
      collection: 'media',
      id: existing.docs[0].id,
      data,
      depth: 0,
      overrideAccess: true,
    })
    console.log(`Updated media: ${asset.filename}`)
    return updated
  }

  const created = await payload.create({
    collection: 'media',
    data,
    depth: 0,
    filePath: await prepareAssetSource(asset),
    overrideAccess: true,
  })
  console.log(`Created media: ${asset.filename}`)
  return created
}

function projectData(
  definition: ProjectDefinition,
  mediaByKey: Map<string, Media>,
): RequiredDataFromCollectionSlug<'projects'> {
  const mediaID = (key: string) => {
    const media = mediaByKey.get(key)
    if (!media) throw new Error(`Missing restored media asset: ${key}`)
    return media.id
  }

  const narratives: Record<string, { body: string; heading: string }> = {
    'house-of-stillness': {
      heading: 'Living between shelter and landscape',
      body: 'Deep overhangs, planted courts, and a restrained material palette temper the coastal climate while keeping daily life connected to the garden.',
    },
    'courtyard-house': {
      heading: 'Rooms gathered around an open centre',
      body: 'Shared rooms meet the planted court through deep thresholds, allowing light, air, and family life to move continuously between inside and outside.',
    },
    'monolith-offices': {
      heading: 'A quiet framework for changing work',
      body: 'A measured structural rhythm and durable material palette create a calm workplace that can adapt as teams, routines, and patterns of occupation change.',
    },
    'casa-terra': {
      heading: 'Material, light, and a measured sequence',
      body: 'Compressed passages open into generous rooms, while stone, timber, and filtered daylight establish a retreat rooted in its landscape.',
    },
    'residence-18': {
      heading: 'Making room for everyday life',
      body: 'Storage, thresholds, and warm surfaces are integrated into a clear spatial framework so the routines of the home remain foregrounded.',
    },
  }
  const narrative = narratives[definition.slug] ?? {
    heading: 'Project study',
    body: definition.description,
  }

  return {
    title: definition.title,
    slug: definition.slug,
    layout: definition.layout,
    status: definition.status,
    location: definition.location,
    year: definition.year,
    scope: definition.scope,
    description: definition.description,
    coverImage: mediaID(definition.coverAsset),
    archiveDetailImage: mediaID(definition.archiveDetailAsset),
    closingImage: mediaID(definition.closingAsset),
    sections: [
      {
        blockType: 'textImage',
        heading: narrative.heading,
        body: richText(narrative.body),
        image: mediaID('warmInterior'),
        imagePosition: definition.year % 2 === 0 ? 'right' : 'left',
      },
      {
        blockType: 'imageGallery',
        heading: 'Material studies',
        images: [
          { image: mediaID('courtyardInterior') },
          { image: mediaID('stoneInterior') },
          { image: mediaID('residenceInterior') },
          { image: mediaID('houseCover') },
          { image: mediaID('landscapeResidence') },
        ],
      },
    ],
    _status: 'published',
  }
}

async function upsertProject(
  payload: Payload,
  definition: ProjectDefinition,
  mediaByKey: Map<string, Media>,
) {
  const existing = await payload.find({
    collection: 'projects',
    depth: 0,
    draft: true,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: definition.slug } },
  })
  const data = projectData(definition, mediaByKey)

  if (existing.docs[0]) {
    const updated = await payload.update({
      collection: 'projects',
      id: existing.docs[0].id,
      data,
      depth: 0,
      draft: false,
      overrideAccess: true,
    })
    console.log(`Updated project: ${definition.title}`)
    return updated
  }

  const created = await payload.create({
    collection: 'projects',
    data,
    depth: 0,
    draft: false,
    overrideAccess: true,
  })
  console.log(`Created project: ${definition.title}`)
  return created
}

async function relateProjectMedia(
  payload: Payload,
  mediaByKey: Map<string, Media>,
  projectsBySlug: Map<string, Project>,
) {
  const relationships: Record<string, string[]> = {
    houseCover: ['house-of-stillness'],
    warmInterior: ['house-of-stillness', 'courtyard-house'],
    courtyardInterior: ['house-of-stillness', 'courtyard-house', 'casa-terra'],
    monolithCover: ['monolith-offices'],
    monolithInterior: ['monolith-offices'],
    stoneInterior: ['house-of-stillness', 'casa-terra'],
    residenceInterior: ['house-of-stillness', 'residence-18'],
    landscapeResidence: ['house-of-stillness', 'residence-18'],
  }

  for (const [assetKey, slugs] of Object.entries(relationships)) {
    const media = mediaByKey.get(assetKey)
    if (!media) continue

    const relatedProjects = slugs.flatMap((slug) => {
      const project = projectsBySlug.get(slug)
      return project ? [project.id] : []
    })

    await payload.update({
      collection: 'media',
      id: media.id,
      data: { relatedProjects },
      depth: 0,
      overrideAccess: true,
    })
  }
}

async function restore() {
  if (['R2_BUCKET', 'R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_PUBLIC_URL'].some(
    (key) => Boolean(process.env[key]),
  )) {
    throw new Error('Local restoration requires every R2_* variable to remain empty.')
  }

  let payload: Payload | undefined

  try {
    payload = await getPayload({ config })

    const mediaByKey = new Map<string, Media>()
    for (const asset of assets) {
      mediaByKey.set(asset.key, await upsertMedia(payload, asset))
    }

    const projectsBySlug = new Map<string, Project>()
    for (const definition of projectDefinitions) {
      projectsBySlug.set(definition.slug, await upsertProject(payload, definition, mediaByKey))
    }

    await relateProjectMedia(payload, mediaByKey, projectsBySlug)

    const homepageHero = mediaByKey.get('homepageHero')
    const positionImage = mediaByKey.get('warmInterior')
    const featuredProject = projectsBySlug.get('house-of-stillness')
    if (!homepageHero || !positionImage || !featuredProject) {
      throw new Error('Homepage restoration data is incomplete.')
    }

    await payload.updateGlobal({
      slug: 'homepage',
      data: {
        hero: {
          eyebrow: 'Architecture / Interiors / Urban',
          title: 'Studio',
          summary: 'Rooms shaped by daylight, honest materials, and plans made to endure.',
          image: homepageHero.id,
        },
        position: {
          image: positionImage.id,
          heading: positionSectionDefaults.heading,
          descriptionPrimary: positionSectionDefaults.descriptionPrimary,
          descriptionSecondary: positionSectionDefaults.descriptionSecondary,
        },
        featuredProject: featuredProject.id,
        projectOrder: projectDefinitions.map((project) => {
          const restored = projectsBySlug.get(project.slug)
          if (!restored) throw new Error(`Missing restored project: ${project.slug}`)
          return restored.id
        }),
        _status: 'published',
      },
      depth: 0,
      draft: false,
      overrideAccess: true,
    })

    console.log(
      `Restoration complete: ${mediaByKey.size} media items, ${projectsBySlug.size} published projects, and the published Homepage global.`,
    )
  } finally {
    await payload?.destroy()
  }
}

await restore()
