import Image from 'next/image'
import Link from 'next/link'

import { mediaData, type ProjectSummary } from '@/lib/cms'

import styles from '../project-field-study.module.css'

const cardLayouts = ['largeA', 'smallA', 'smallB', 'largeB'] as const

function yearRange(projects: ProjectSummary[]) {
  const years = projects
    .map((project) => project.year)
    .filter((year): year is number => typeof year === 'number')

  if (years.length === 0) return 'Current work'

  const first = Math.min(...years)
  const last = Math.max(...years)
  return first === last ? String(first) : `${first}—${last}`
}

export function ProjectFieldStudy({
  featuredProject,
  projects,
}: {
  featuredProject: ProjectSummary | null
  projects: ProjectSummary[]
}) {
  if (!featuredProject && projects.length === 0) return null

  const allProjects = featuredProject ? [featuredProject, ...projects] : projects
  const featureImage = featuredProject ? mediaData(featuredProject.coverImage, 'wide') : null

  return (
    <section aria-label="Selected projects" className={styles.section} id="project-field-study">
      <div aria-hidden="true" className={styles.rules} />

      {featuredProject && (
        <div className={styles.feature}>
          <header className={styles.sectionHead}>
            <span>Signature project</span>
            <span>
              01 / {String(allProjects.length).padStart(2, '0')} · {featuredProject.year}
            </span>
          </header>

          <div className={styles.featureMedia}>
            {featureImage?.url && (
              <Image
                alt={featureImage.alt || ''}
                fill
                sizes="(max-width: 760px) calc(100vw - 3rem), 86vw"
                src={featureImage.url}
                style={{
                  objectPosition: `${featureImage.focalX ?? 50}% ${featureImage.focalY ?? 50}%`,
                }}
                unoptimized
              />
            )}
          </div>

          <div className={styles.featureCaption}>
            <h2>{featuredProject.title}</h2>

            <div className={styles.projectMeta}>
              <strong>{featuredProject.location}</strong>
              <span>
                {[featuredProject.status, featuredProject.year].filter(Boolean).join(' / ')}
              </span>
              <span>{featuredProject.scope}</span>
            </div>

            <Link className={styles.projectLink} href={`/projects/${featuredProject.slug}`}>
              View project
            </Link>
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className={styles.archive}>
          <header className={styles.sectionHead}>
            <span>Selected work</span>
            <span>Archive · {yearRange(allProjects)}</span>
          </header>

          <div className={styles.projectGrid}>
            {projects.map((project, index) => {
              const image = mediaData(project.coverImage, index % 4 < 2 ? 'wide' : 'card')
              const layout = cardLayouts[index % cardLayouts.length]

              return (
                <Link
                  className={`${styles.projectCard} ${styles[layout]}`}
                  href={`/projects/${project.slug}`}
                  key={project.id}
                >
                  <div className={styles.projectImage}>
                    {image?.url && (
                      <Image
                        alt={image.alt || ''}
                        fill
                        sizes={
                          layout.startsWith('large')
                            ? '(max-width: 760px) calc(100vw - 3rem), 50vw'
                            : '(max-width: 760px) calc(100vw - 3rem), 29vw'
                        }
                        src={image.url}
                        style={{ objectPosition: `${image.focalX ?? 50}% ${image.focalY ?? 50}%` }}
                        unoptimized
                      />
                    )}
                  </div>

                  <div className={styles.projectRow}>
                    <h3>{project.title}</h3>
                    <span>
                      P{String(index + 2).padStart(2, '0')} / {project.year}
                    </span>
                  </div>

                  <span className={styles.projectLocation}>
                    {[project.location, project.scope].filter(Boolean).join(' / ')}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
