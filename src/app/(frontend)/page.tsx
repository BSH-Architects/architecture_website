import Image from 'next/image'
import Link from 'next/link'

import {
  cmsIsConfigured,
  getHomepageContent,
  mediaData,
  type ProjectSummary,
} from '@/lib/cms'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  if (!cmsIsConfigured) {
    return <SetupState />
  }

  const content = await getHomepageContent().catch((error: unknown) => {
    console.error('Unable to load homepage content.', error)
    return null
  })

  if (!content) {
    return <ConnectionFailure />
  }

  const { featuredProject, homepage, projects } = content
  const heroImage = mediaData(homepage.hero?.image)

  return (
    <main className="site-shell">
      <section className="content-preview hero-preview">
        {heroImage?.url && (
          <Image
            alt={heroImage.alt || ''}
            className="hero-preview__image"
            fill
            priority
            sizes="100vw"
            src={heroImage.url}
            unoptimized
          />
        )}
        <div className="hero-preview__scrim" />
        <div className="content-preview__inner hero-preview__content">
          <p className="utility-label">{homepage.hero?.eyebrow || 'CMS content preview'}</p>
          <h1>{homepage.hero?.title || 'Your studio’s work, managed in one place.'}</h1>
          {homepage.hero?.summary && <p className="lede">{homepage.hero.summary}</p>}
          <Link className="text-link" href="#projects">
            Browse published projects
          </Link>
        </div>
      </section>

      {featuredProject && <ProjectFeature project={featuredProject} />}

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
                      {[project.location, project.year].filter(Boolean).join(' · ') ||
                        'View project'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-copy">
              Publish a project in <Link href="/admin">Payload</Link>, then select and order it in the Homepage
              global.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}

function ConnectionFailure() {
  return (
    <main className="site-shell">
      <section className="content-preview setup-state">
        <div className="content-preview__inner">
          <p className="utility-label">Content connection unavailable</p>
          <h1>Check the Neon database connection and run the Payload migration.</h1>
          <p className="lede">
            The application is ready; it needs the environment variables in .env.example and an initialized
            database before it can load studio content.
          </p>
        </div>
      </section>
    </main>
  )
}

function ProjectFeature({ project }: { project: ProjectSummary }) {
  const image = mediaData(project.coverImage)

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

function SetupState() {
  return (
    <main className="site-shell">
      <section className="content-preview setup-state">
        <div className="content-preview__inner">
          <p className="utility-label">Architecture website foundation</p>
          <h1>The public experience will appear here once the CMS is connected.</h1>
          <p className="lede">
            Add DATABASE_URI and PAYLOAD_SECRET to .env, start the app, then create the first administrator at
            <Link href="/admin"> /admin</Link>.
          </p>
        </div>
      </section>
    </main>
  )
}
