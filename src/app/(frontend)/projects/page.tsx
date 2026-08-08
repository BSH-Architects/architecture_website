import type { Metadata } from 'next'

import { cmsIsConfigured, getPublishedProjects, mediaData } from '@/lib/cms'
import { SITE_NAME } from '@/lib/site'

import { ClosingTransition } from '../_components/ClosingTransition'
import {
  ProjectScrollArchive,
  type ArchiveProject,
} from '../_components/ProjectScrollArchive'
import { SiteNavigation } from '../_components/SiteNavigation'

import styles from './projects-page.module.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  description: 'Selected architecture projects and studio work.',
  title: 'Projects',
}

export default async function ProjectsPage() {
  const publishedProjects = cmsIsConfigured
    ? await getPublishedProjects().catch((error: unknown) => {
        console.error('Unable to load the project archive.', error)
        return []
      })
    : []

  const projects = publishedProjects.flatMap<ArchiveProject>((project) => {
    const primaryImage = mediaData(project.coverImage, 'wide')
    const detailImage = mediaData(project.archiveDetailImage, 'card') ?? primaryImage

    if (!primaryImage?.url || !detailImage?.url) return []

    return [
      {
        description: project.description,
        detailImage,
        id: project.id,
        location: project.location,
        primaryImage,
        scope: project.scope,
        slug: project.slug,
        status: project.status,
        title: project.title,
        year: project.year,
      },
    ]
  })

  const years = projects.map((project) => project.year)
  const archiveRange =
    years.length > 0
      ? Math.min(...years) === Math.max(...years)
        ? String(years[0])
        : `${Math.min(...years)}—${Math.max(...years)}`
      : 'Current work'

  return (
    <>
      <main className={`site-shell ${styles.page}`} id="top">
        <SiteNavigation activePage="projects" />

        <header className={styles.intro}>
          <p className={styles.eyebrow}>Project archive / {archiveRange}</p>
          <h1>Our Work</h1>
          <p className={styles.introduction}>
            An evolving record of spaces shaped by climate, material, structure, and the patterns
            of ordinary life.
          </p>
        </header>

        <ProjectScrollArchive projects={projects} />
      </main>

      <ClosingTransition siteName={SITE_NAME} variant="project" />
    </>
  )
}
