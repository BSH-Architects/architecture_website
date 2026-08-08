import type { Metadata } from 'next'

import { SITE_NAME } from '@/lib/site'

import { ProjectScrollArchive } from '../_components/ProjectScrollArchive'
import { SiteFooter } from '../_components/SiteFooter'
import { SiteNavigation } from '../_components/SiteNavigation'

import styles from './projects-page.module.css'

export const metadata: Metadata = {
  description: 'Selected architecture projects and studio work.',
  title: 'Projects',
}

export default function ProjectsPage() {
  return (
    <>
      <main className={`site-shell ${styles.page}`} id="top">
        <SiteNavigation activePage="projects" />

        <header className={styles.intro}>
          <p className={styles.eyebrow}>Project archive / 2022—2026</p>
          <h1>Our Work</h1>
          <p className={styles.introduction}>
            An evolving record of spaces shaped by climate, material, structure, and the patterns
            of ordinary life.
          </p>
        </header>

        <ProjectScrollArchive />
      </main>

      <SiteFooter siteName={SITE_NAME} />
    </>
  )
}
