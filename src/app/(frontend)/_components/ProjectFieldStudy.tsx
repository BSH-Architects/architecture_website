import Image from 'next/image'
import Link from 'next/link'

import styles from '../project-field-study.module.css'

const signatureProject = {
  title: 'House of Stillness',
  location: 'Alibaug, Maharashtra',
  details: ['Residence / 2026', 'Architecture / Interiors / Landscape'],
  image:
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2400&q=88',
  alt: 'Minimal contemporary residence framed by concrete and landscape',
} as const

const projects = [
  {
    title: 'Courtyard House',
    code: 'P02 / 2025',
    location: 'Goa, India / Residential',
    layout: 'largeA',
    image:
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=86',
    alt: 'Warm minimal interior with natural materials',
  },
  {
    title: 'Monolith Offices',
    code: 'P03 / 2024',
    location: 'Bengaluru, India / Workplace',
    layout: 'smallA',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=86',
    alt: 'Contemporary urban architecture',
  },
  {
    title: 'Casa Terra',
    code: 'P04 / 2023',
    location: 'Udaipur, India / Hospitality',
    layout: 'smallB',
    image:
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=86',
    alt: 'Sculptural contemporary interior',
  },
  {
    title: 'Residence 18',
    code: 'P05 / 2022',
    location: 'Mumbai, India / Residential',
    layout: 'largeB',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=86',
    alt: 'Refined residential interior with warm stone surfaces',
  },
] as const

export function ProjectFieldStudy() {
  return (
    <section
      aria-labelledby="signature-project-title"
      className={styles.section}
      id="project-field-study"
    >
      <div aria-hidden="true" className={styles.rules} />

      <div className={styles.feature}>
        <header className={styles.sectionHead}>
          <span>Signature project</span>
          <span>01 / 05 · 2026</span>
        </header>

        <div className={styles.featureMedia}>
          <Image
            alt={signatureProject.alt}
            fill
            sizes="(max-width: 760px) calc(100vw - 3rem), 86vw"
            src={signatureProject.image}
            unoptimized
          />
        </div>

        <div className={styles.featureCaption}>
          <h2 id="signature-project-title">{signatureProject.title}</h2>

          <div className={styles.projectMeta}>
            <strong>{signatureProject.location}</strong>
            {signatureProject.details.map((detail) => (
              <span key={detail}>{detail}</span>
            ))}
          </div>

          <Link className={styles.projectLink} href="/projects">
            View project
          </Link>
        </div>
      </div>

      <div className={styles.archive}>
        <header className={styles.sectionHead}>
          <span>Selected work</span>
          <span>Archive · 2021—2026</span>
        </header>

        <div className={styles.projectGrid}>
          {projects.map((project) => (
            <Link
              className={`${styles.projectCard} ${styles[project.layout]}`}
              href="/projects"
              key={project.title}
            >
              <div className={styles.projectImage}>
                <Image
                  alt={project.alt}
                  fill
                  sizes={
                    project.layout.startsWith('large')
                      ? '(max-width: 760px) calc(100vw - 3rem), 50vw'
                      : '(max-width: 760px) calc(100vw - 3rem), 29vw'
                  }
                  src={project.image}
                  unoptimized
                />
              </div>

              <div className={styles.projectRow}>
                <h3>{project.title}</h3>
                <span>{project.code}</span>
              </div>

              <span className={styles.projectLocation}>{project.location}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
