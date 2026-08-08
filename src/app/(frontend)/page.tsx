import Image from 'next/image'
import Link from 'next/link'

import {
  cmsIsConfigured,
  getHomepageContent,
  mediaData,
  type ProjectSummary,
} from '@/lib/cms'
import { heroPlaceholder, previewHeroImagePath, SITE_NAME } from '@/lib/site'

import { ClosingTransition } from './_components/ClosingTransition'
import { HeroStudyTwo } from './_components/HeroStudyTwo'
import { PeopleStudy } from './_components/PeopleStudy'
import { PositionStudy } from './_components/PositionStudy'
import { PracticeStudy } from './_components/PracticeStudy'
import { ProjectFieldStudy } from './_components/ProjectFieldStudy'
import { SiteNavigation } from './_components/SiteNavigation'

export const dynamic = 'force-dynamic'

const INDEX_ANCHOR = '#projects'
const POSITION_ANCHOR = '#position-study'

/** Placeholder hero copy is a development affordance, never a production fallback. */
const allowPlaceholderContent = process.env.NODE_ENV !== 'production'

export default async function HomePage() {
  const content = cmsIsConfigured
    ? await getHomepageContent().catch((error: unknown) => {
        console.error('Unable to load homepage content.', error)
        return null
      })
    : null

  if (!content && !allowPlaceholderContent) {
    return <UnavailableState configured={cmsIsConfigured} />
  }

  const hero = content?.homepage.hero
  const heroImage = mediaData(hero?.image, 'wide')
  const previewImageSrc = content ? null : previewHeroImagePath()
  const heroSummary = hero?.summary || heroPlaceholder.summary
  const heroTarget = allowPlaceholderContent ? POSITION_ANCHOR : INDEX_ANCHOR

  return (
    <>
      <main className="site-shell" id="top">
        <SiteNavigation activePage="home" />

        <HeroStudyTwo
          brand={SITE_NAME}
          eyebrow={hero?.eyebrow || heroPlaceholder.eyebrow}
          image={heroImage}
          indexHref={heroTarget}
          previewImageSrc={previewImageSrc}
          summary={heroSummary}
        />

      {allowPlaceholderContent && (
        <PositionStudy image={heroImage} previewImageSrc={previewImageSrc} />
      )}

      {allowPlaceholderContent && <ProjectFieldStudy />}
      {allowPlaceholderContent && <PracticeStudy />}
      {allowPlaceholderContent && <PeopleStudy />}

      {content && (
        <>
          {content.featuredProject && <ProjectFeature project={content.featuredProject} />}
          <ProjectIndex projects={content.projects} />
        </>
      )}
      </main>
      <ClosingTransition siteName={SITE_NAME} />
    </>
  )
}

function ProjectIndex({ projects }: { projects: ProjectSummary[] }) {
  return (
    <section className="content-preview project-index" id="projects">
      <div className="content-preview__inner">
        <p className="utility-label">Published work</p>
        {projects.length > 0 ? (
          <ul className="project-list">
            {projects.map((project) => (
              <li key={project.id}>
                <Link href={`/projects/${project.slug}`}>
                  <span>{project.title}</span>
                  <span>
                    {[project.location, project.year].filter(Boolean).join(' · ') || 'View project'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-copy">
            Publish a project in <Link href="/admin">Payload</Link>, then select and order it in the
            Homepage global.
          </p>
        )}
      </div>
    </section>
  )
}

function ProjectFeature({ project }: { project: ProjectSummary }) {
  const image = mediaData(project.coverImage, 'card')

  return (
    <section className="content-preview featured-project">
      <div className="content-preview__inner featured-project__grid">
        <div>
          <p className="utility-label">Featured project</p>
          <h2>{project.title}</h2>
          {(project.location || project.year) && (
            <p className="lede">{[project.location, project.year].filter(Boolean).join(' · ')}</p>
          )}
          <Link className="text-link" href={`/projects/${project.slug}`}>
            Open project
          </Link>
        </div>
        {image?.url && (
          <div className="featured-project__image">
            <Image
              alt={image.alt || ''}
              fill
              sizes="(max-width: 700px) 100vw, 50vw"
              src={image.url}
              unoptimized
            />
          </div>
        )}
      </div>
    </section>
  )
}

/** Production: never invents content. */
function UnavailableState({ configured }: { configured: boolean }) {
  return (
    <main className="site-shell">
      <section className="content-preview setup-state">
        <div className="content-preview__inner">
          <p className="utility-label">
            {configured ? 'Content connection unavailable' : 'Architecture website foundation'}
          </p>
          <h1>
            {configured
              ? 'Check the Neon database connection and run the Payload migration.'
              : 'The public experience will appear here once the CMS is connected.'}
          </h1>
          <p className="lede">
            The application is ready; it needs the environment variables in .env.example and an
            initialized database before it can load studio content.
          </p>
        </div>
      </section>
    </main>
  )
}
