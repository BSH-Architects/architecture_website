'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, type CSSProperties } from 'react'

import type { MediaReference } from '@/lib/cms'

import styles from '../project-scroll-archive.module.css'

export type ArchiveProject = {
  description: string
  detailImage: MediaReference
  id: number | string
  location: string
  primaryImage: MediaReference
  scope: string
  slug: string
  status: string
  title: string
  year: number
}

const HOLD_VIEWPORT_RATIO = 0.45
const PROJECT_GAP_VIEWPORT_RATIO = 0.22

type TimelineState = {
  currentIndex: number
  nextIndex: number
  progress: number
  gapDistance: number
}

const initialTimeline: TimelineState = {
  currentIndex: 0,
  nextIndex: 0,
  progress: 0,
  gapDistance: 0,
}

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

function focalPosition(image: MediaReference) {
  return `${image.focalX ?? 50}% ${image.focalY ?? 50}%`
}

function imageStyle(index: number, timeline: TimelineState): CSSProperties {
  if (index === timeline.currentIndex) {
    return { clipPath: 'inset(0)', zIndex: 1 }
  }

  if (index === timeline.nextIndex && timeline.nextIndex !== timeline.currentIndex) {
    return {
      clipPath: `inset(${(1 - timeline.progress) * 100}% 0 0 0)`,
      zIndex: 2,
    }
  }

  return {
    clipPath: index < timeline.currentIndex ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)',
    zIndex: 0,
  }
}

function cardStyle(index: number, timeline: TimelineState): CSSProperties {
  const isTransitioning = timeline.nextIndex !== timeline.currentIndex
  const gap = timeline.gapDistance

  if (index === timeline.currentIndex) {
    return {
      transform: isTransitioning
        ? `translateY(calc(${-timeline.progress * 100}% - ${timeline.progress * gap}px))`
        : 'translateY(0)',
      zIndex: 2,
    }
  }

  if (isTransitioning && index === timeline.nextIndex) {
    return {
      transform: `translateY(calc(${(1 - timeline.progress) * 100}% + ${(1 - timeline.progress) * gap}px))`,
      zIndex: 3,
    }
  }

  return {
    transform:
      index < timeline.currentIndex
        ? `translateY(calc(-100% - ${gap}px))`
        : `translateY(calc(100% + ${gap}px))`,
    zIndex: 1,
  }
}

export function ProjectScrollArchive({ projects }: { projects: ArchiveProject[] }) {
  const experienceRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const [timeline, setTimeline] = useState<TimelineState>(initialTimeline)

  useEffect(() => {
    let animationFrame = 0

    const update = () => {
      animationFrame = 0
      const experience = experienceRef.current
      const media = mediaRef.current
      if (!experience || !media) return

      const mediaHeight = media.getBoundingClientRect().height
      if (mediaHeight < 1) return

      const holdDistance = window.innerHeight * HOLD_VIEWPORT_RATIO
      const gapDistance = window.innerHeight * PROJECT_GAP_VIEWPORT_RATIO
      const transitionDistance = mediaHeight + gapDistance
      let remaining = Math.max(-experience.getBoundingClientRect().top, 0)
      let nextState: TimelineState = {
        ...initialTimeline,
        gapDistance,
      }

      for (let index = 0; index < projects.length; index += 1) {
        if (remaining <= holdDistance) {
          nextState = {
            currentIndex: index,
            nextIndex: index,
            progress: 0,
            gapDistance,
          }
          break
        }

        remaining -= holdDistance

        if (index === projects.length - 1) {
          nextState = {
            currentIndex: index,
            nextIndex: index,
            progress: 0,
            gapDistance,
          }
          break
        }

        if (remaining <= transitionDistance) {
          nextState = {
            currentIndex: index,
            nextIndex: index + 1,
            progress: clamp(remaining / transitionDistance),
            gapDistance,
          }
          break
        }

        remaining -= transitionDistance
      }

      setTimeline((previous) => {
        if (
          previous.currentIndex === nextState.currentIndex &&
          previous.nextIndex === nextState.nextIndex &&
          Math.abs(previous.progress - nextState.progress) < 0.001 &&
          Math.abs(previous.gapDistance - nextState.gapDistance) < 0.5
        ) {
          return previous
        }

        return nextState
      })
    }

    const requestUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(update)
    }

    requestUpdate()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [projects.length])

  if (projects.length === 0) {
    return (
      <section aria-label="Project information" className={styles.emptyState}>
        <p>Published projects will appear here once they are added in the studio dashboard.</p>
      </section>
    )
  }

  const announcedIndex =
    timeline.nextIndex !== timeline.currentIndex && timeline.progress >= 0.5
      ? timeline.nextIndex
      : timeline.currentIndex
  const transitions = projects.length - 1
  const scrollViewportHeight = 100 + projects.length * 45 + transitions * 22
  const transitionHeights = Array.from(
    { length: transitions },
    () => 'var(--stage-height)',
  ).join(' + ')
  const experienceStyle: CSSProperties = {
    height: `calc(${scrollViewportHeight}svh${transitionHeights ? ` + ${transitionHeights}` : ''})`,
  }

  return (
    <div className={styles.experience} ref={experienceRef} style={experienceStyle}>
      <aside aria-label="Active project" className={styles.imageRail}>
        <div className={styles.imageSticky}>
          <div className={styles.mediaStage} ref={mediaRef}>
            {projects.map((project, index) => (
              <figure
                aria-hidden={index !== announcedIndex}
                className={styles.projectFrame}
                key={project.id}
                style={imageStyle(index, timeline)}
              >
                <Image
                  alt={project.primaryImage.alt || ''}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 760px) 100vw, 58vw"
                  src={project.primaryImage.url!}
                  style={{ objectPosition: focalPosition(project.primaryImage) }}
                  unoptimized
                />
              </figure>
            ))}
          </div>
        </div>
      </aside>

      <section aria-label="Project information" className={styles.narratives}>
        <div className={styles.narrativeSticky}>
          <div className={styles.narrativeStage}>
            {projects.map((project, index) => (
              <article
                aria-label={project.title}
                className={styles.projectCard}
                key={project.id}
                style={cardStyle(index, timeline)}
              >
                <div className={styles.mobileProject}>
                  <Image
                    alt={project.primaryImage.alt || ''}
                    fill
                    sizes="calc(100vw - 2.25rem)"
                    src={project.primaryImage.url!}
                    style={{ objectPosition: focalPosition(project.primaryImage) }}
                    unoptimized
                  />
                </div>

                <div className={styles.projectTop}>
                  <h2 className={styles.projectTitle}>{project.title}</h2>

                  <div className={styles.detailImage}>
                    <Image
                      alt={project.detailImage.alt || ''}
                      fill
                      sizes="(max-width: 760px) calc(100vw - 2.25rem), 30vw"
                      src={project.detailImage.url!}
                      style={{ objectPosition: focalPosition(project.detailImage) }}
                      unoptimized
                    />
                  </div>

                  <p className={styles.description}>{project.description}</p>
                </div>

                <div className={styles.projectBottom}>
                  <dl className={styles.metadata}>
                    <div>
                      <dt>Status</dt>
                      <dd>{project.status}</dd>
                    </div>
                    <div>
                      <dt>Location</dt>
                      <dd>{project.location}</dd>
                    </div>
                    <div>
                      <dt>Year / Scope</dt>
                      <dd>
                        {project.year} / {project.scope}
                      </dd>
                    </div>
                  </dl>

                  <Link className={styles.forthcoming} href={`/projects/${project.slug}`}>
                    View full project study
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
