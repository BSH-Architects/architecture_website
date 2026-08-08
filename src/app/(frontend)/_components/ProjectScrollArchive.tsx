'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties } from 'react'

import styles from '../project-scroll-archive.module.css'

const projects = [
  {
    title: 'House of Stillness',
    location: 'Alibaug, Maharashtra',
    year: '2026',
    status: 'In development',
    scope: 'Architecture / Interiors / Landscape',
    description:
      'A coastal residence organized around shade, cross-ventilation, and rooms that open gradually toward the landscape.',
    image:
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2400&q=88',
    alt: 'Minimal contemporary residence framed by concrete and landscape',
    detailImage:
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=86',
    detailAlt: 'Warm interior detail with natural timber and stone',
  },
  {
    title: 'Courtyard House',
    location: 'Goa, India',
    year: '2025',
    status: 'Completed',
    scope: 'Residential / Architecture',
    description:
      'A family house gathered around a planted court, with deep thresholds mediating between private rooms and shared life.',
    image:
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=88',
    alt: 'Warm minimal interior with natural materials',
    detailImage:
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=86',
    detailAlt: 'Quiet living space opening toward a planted courtyard',
  },
  {
    title: 'Monolith Offices',
    location: 'Bengaluru, India',
    year: '2024',
    status: 'Completed',
    scope: 'Workplace / Architecture',
    description:
      'A compact workplace where a restrained material shell supports flexible occupation, diffuse light, and quiet concentration.',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=88',
    alt: 'Contemporary urban architecture',
    detailImage:
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=86',
    detailAlt: 'Open workplace with a restrained material palette',
  },
  {
    title: 'Casa Terra',
    location: 'Udaipur, India',
    year: '2023',
    status: 'Completed',
    scope: 'Hospitality / Interiors',
    description:
      'Local stone, filtered daylight, and a sequence of compressed rooms shape a retreat grounded in the surrounding terrain.',
    image:
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=2000&q=88',
    alt: 'Sculptural contemporary interior',
    detailImage:
      'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=86',
    detailAlt: 'Stone-lined hospitality interior in soft daylight',
  },
  {
    title: 'Residence 18',
    location: 'Mumbai, India',
    year: '2022',
    status: 'Completed',
    scope: 'Residential / Interiors',
    description:
      'A city apartment reduced to proportion, warm stone, and carefully framed storage so everyday routines remain foregrounded.',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=88',
    alt: 'Refined residential interior with warm stone surfaces',
    detailImage:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=86',
    detailAlt: 'Residential detail with warm surfaces and filtered light',
  },
] as const

const HOLD_VIEWPORT_RATIO = 0.45
const PROJECT_GAP_VIEWPORT_RATIO = 0.22

type TimelineState = {
  currentIndex: number
  nextIndex: number
  progress: number
  gapDistance: number
  releaseProgress: number
}

const initialTimeline: TimelineState = {
  currentIndex: 0,
  nextIndex: 0,
  progress: 0,
  gapDistance: 0,
  releaseProgress: 0,
}

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 1)
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
    if (timeline.releaseProgress > 0) {
      return {
        transform: `translateY(${-timeline.releaseProgress * 100}%)`,
        zIndex: 2,
      }
    }

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

export function ProjectScrollArchive() {
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
            releaseProgress: 0,
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
            releaseProgress: clamp(remaining / mediaHeight),
          }
          break
        }

        if (remaining <= transitionDistance) {
          nextState = {
            currentIndex: index,
            nextIndex: index + 1,
            progress: clamp(remaining / transitionDistance),
            gapDistance,
            releaseProgress: 0,
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
          Math.abs(previous.gapDistance - nextState.gapDistance) < 0.5 &&
          Math.abs(previous.releaseProgress - nextState.releaseProgress) < 0.001
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
  }, [])

  const announcedIndex =
    timeline.nextIndex !== timeline.currentIndex && timeline.progress >= 0.5
      ? timeline.nextIndex
      : timeline.currentIndex

  return (
    <div className={styles.experience} ref={experienceRef}>
      <aside aria-label="Active project" className={styles.imageRail}>
        <div className={styles.imageSticky}>
          <div className={styles.mediaStage} ref={mediaRef}>
            {projects.map((project, index) => (
              <figure
                aria-hidden={index !== announcedIndex}
                className={styles.projectFrame}
                key={project.title}
                style={imageStyle(index, timeline)}
              >
                <Image
                  alt={project.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 760px) 100vw, 58vw"
                  src={project.image}
                  unoptimized
                />
              </figure>
            ))}
          </div>
        </div>
      </aside>

      <section aria-label="Project information" className={styles.narratives}>
        <div className={styles.narrativeSticky}>
          {projects.map((project, index) => (
            <article
              aria-label={project.title}
              className={styles.projectCard}
              key={project.title}
              style={cardStyle(index, timeline)}
            >
              <div className={styles.mobileProject}>
                <Image
                  alt={project.alt}
                  fill
                  sizes="calc(100vw - 2.25rem)"
                  src={project.image}
                  unoptimized
                />
              </div>

              <div className={styles.projectTop}>
                <h2 className={styles.projectTitle}>{project.title}</h2>

                <div className={styles.detailImage}>
                  <Image
                    alt={project.detailAlt}
                    fill
                    sizes="(max-width: 760px) calc(100vw - 2.25rem), 30vw"
                    src={project.detailImage}
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
                    <dd>{project.year} / {project.scope}</dd>
                  </div>
                </dl>

                <span className={styles.forthcoming}>Full project study forthcoming</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
