import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { SITE_NAME } from '@/lib/site'
import { cmsIsConfigured, getPublishedProject, mediaData } from '@/lib/cms'

import { ClosingTransition } from '../../_components/ClosingTransition'
import { SiteNavigation } from '../../_components/SiteNavigation'

import styles from './project-detail.module.css'

export const dynamic = 'force-dynamic'

type DetailImage = {
  alt: string
  focalX?: number | null
  focalY?: number | null
  url: string
}

type DetailFeature = {
  body: string[]
  heading?: string | null
  image: DetailImage | null
  imagePosition: 'left' | 'right' | 'wide'
  kind: 'feature'
}

type DetailGallery = {
  heading?: string | null
  images: Array<DetailImage & { caption?: string | null }>
  kind: 'gallery'
}

type DetailSection = DetailFeature | DetailGallery

type DetailProject = {
  closingImage: DetailImage
  cover: DetailImage
  index: string
  intro: string[]
  location?: string | null
  sections: DetailSection[]
  status?: string | null
  title: string
  total: string
  year?: number | string | null
}

type CmsProject = NonNullable<Awaited<ReturnType<typeof getPublishedProject>>>

const previewProjects: Record<string, DetailProject> = {
  'house-of-stillness': {
    title: 'House of Stillness',
    intro: [
      'A coastal residence organized around shade, cross-ventilation, and rooms that open gradually toward the landscape.',
    ],
    status: 'In development',
    location: 'Alibaug, Maharashtra',
    year: 2026,
    index: '01',
    total: '/05',
    cover: {
      alt: 'Minimal contemporary residence framed by concrete and landscape',
      url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2400&q=88',
    },
    sections: [
      {
        kind: 'feature',
        heading: 'Living between shelter and landscape',
        body: [
          'Deep overhangs, planted courts, and a restrained material palette temper the coastal climate while keeping daily life connected to the garden.',
        ],
        imagePosition: 'right',
        image: {
          alt: 'Warm interior detail with natural timber and stone',
          url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=88',
        },
      },
      {
        kind: 'gallery',
        heading: 'Material studies',
        images: [
          {
            alt: 'Quiet living space opening toward a planted courtyard',
            url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=86',
          },
          {
            alt: 'Stone-lined interior in soft daylight',
            url: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=86',
          },
          {
            alt: 'Residential detail with warm surfaces and filtered light',
            url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=86',
          },
        ],
      },
    ],
    closingImage: {
      alt: 'Contemporary residence opening toward its surrounding landscape',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=90',
    },
  },
}

function nodeText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''

  const value = node as { children?: unknown[]; text?: unknown }
  if (typeof value.text === 'string') return value.text
  return Array.isArray(value.children) ? value.children.map(nodeText).join('') : ''
}

function richTextParagraphs(value: unknown): string[] {
  if (!value || typeof value !== 'object') return []

  const root = (value as { root?: { children?: unknown[] } }).root
  if (!Array.isArray(root?.children)) return []

  return root.children.map(nodeText).map((text) => text.trim()).filter(Boolean)
}

function detailImage(value: Parameters<typeof mediaData>[0]): DetailImage | null {
  const image = mediaData(value, 'wide')
  if (!image?.url) return null

  return {
    alt: image.alt || '',
    focalX: image.focalX,
    focalY: image.focalY,
    url: image.url,
  }
}

function projectDetail(project: CmsProject): DetailProject | null {
  const cover = detailImage(project.coverImage)
  if (!cover) return null

  const sections: DetailSection[] = []

  for (const section of project.sections ?? []) {
    if (section.blockType === 'projectHero') {
      sections.push({
        kind: 'feature',
        heading: section.heading,
        body: section.summary ? [section.summary] : [],
        image: detailImage(section.image),
        imagePosition: 'wide',
      })
    }

    if (section.blockType === 'textImage') {
      sections.push({
        kind: 'feature',
        heading: section.heading,
        body: richTextParagraphs(section.body),
        image: detailImage(section.image),
        imagePosition: section.imagePosition === 'left' ? 'left' : 'right',
      })
    }

    if (section.blockType === 'imageGallery') {
      const images = (section.images ?? []).flatMap((item) => {
        const image = detailImage(item.image)
        return image ? [{ ...image, caption: item.caption }] : []
      })

      if (images.length > 0) {
        sections.push({
          kind: 'gallery',
          heading: section.heading,
          images,
        })
      }
    }
  }

  return {
    title: project.title,
    intro: richTextParagraphs(project.intro),
    location: project.location,
    year: project.year,
    index: '01',
    total: '/Archive',
    cover,
    sections,
    closingImage: cover,
  }
}

function ProjectImage({ image, priority = false }: { image: DetailImage; priority?: boolean }) {
  return (
    <Image
      alt={image.alt}
      fill
      priority={priority}
      sizes="(max-width: 760px) 100vw, 92vw"
      src={image.url}
      style={{ objectPosition: `${image.focalX ?? 50}% ${image.focalY ?? 50}%` }}
      unoptimized
    />
  )
}

function ProjectCopy({ paragraphs }: { paragraphs: string[] }) {
  if (paragraphs.length === 0) return null

  return (
    <div className={styles.copy}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  )
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cmsProject = cmsIsConfigured
    ? await getPublishedProject(slug).catch((error: unknown) => {
        console.error(`Unable to load project ${slug}.`, error)
        return null
      })
    : null
  const project = cmsProject ? projectDetail(cmsProject) : previewProjects[slug]

  if (!project) notFound()

  const facts = [
    project.status ? { label: 'Status', value: project.status } : null,
    project.location ? { label: 'Location', value: project.location } : null,
    project.year ? { label: 'Year', value: String(project.year) } : null,
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact))

  return (
    <>
      <main className={`site-shell ${styles.page}`} id="top">
        <SiteNavigation activePage="projects" />

        <article className={styles.article}>
          <header className={styles.header}>
            <Link className={styles.archiveLink} href="/projects">
              Project archive
            </Link>

            <div className={styles.introduction}>
              <h1>{project.title}</h1>
              <ProjectCopy paragraphs={project.intro} />
            </div>

            <dl className={styles.facts}>
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>

            <span aria-label={`Project ${project.index}`} className={styles.projectIndex}>
              {project.index}
            </span>
            <span className={styles.projectTotal}>{project.total}</span>
          </header>

          <figure className={styles.cover}>
            <ProjectImage image={project.cover} priority />
          </figure>

          <div className={styles.sections}>
            {project.sections.map((section, index) => {
              if (section.kind === 'gallery') {
                return (
                  <section className={styles.gallerySection} key={`gallery-${index}`}>
                    {section.heading && <h2>{section.heading}</h2>}
                    <div className={styles.gallery}>
                      {section.images.map((image, imageIndex) => (
                        <figure key={`${image.url}-${imageIndex}`}>
                          <ProjectImage image={image} />
                          {image.caption && <figcaption>{image.caption}</figcaption>}
                        </figure>
                      ))}
                    </div>
                  </section>
                )
              }

              return (
                <section
                  className={`${styles.feature} ${styles[section.imagePosition]}`}
                  key={`feature-${index}`}
                >
                  {(section.heading || section.body.length > 0) && (
                    <div className={styles.featureCopy}>
                      {section.heading && <h2>{section.heading}</h2>}
                      <ProjectCopy paragraphs={section.body} />
                    </div>
                  )}
                  {section.image && (
                    <figure className={styles.featureImage}>
                      <ProjectImage image={section.image} />
                    </figure>
                  )}
                </section>
              )
            })}
          </div>

          <figure className={styles.closingVisual}>
            <ProjectImage image={project.closingImage} />
          </figure>
        </article>
      </main>

      <ClosingTransition siteName={SITE_NAME} variant="project" />
    </>
  )
}
