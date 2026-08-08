'use client'

import Image from 'next/image'
import { useId, useState, useSyncExternalStore, type CSSProperties } from 'react'

import styles from './project-detail.module.css'

const MOBILE_QUERY = '(max-width: 47.5rem)'

function subscribeToMobileLayout(callback: () => void) {
  const media = window.matchMedia(MOBILE_QUERY)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

function isMobileLayout() {
  return window.matchMedia(MOBILE_QUERY).matches
}

type CarouselImage = {
  alt: string
  caption?: string | null
  focalX?: number | null
  focalY?: number | null
  url: string
}

type ProjectImageCarouselProps = {
  images: CarouselImage[]
  label: string
}

function ArrowIcon({ direction }: { direction: 'next' | 'previous' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d={direction === 'next' ? 'M8 4l8 8-8 8' : 'M16 4l-8 8 8 8'} />
    </svg>
  )
}

export function ProjectImageCarousel({ images, label }: ProjectImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const viewportId = useId()
  const isMobile = useSyncExternalStore(subscribeToMobileLayout, isMobileLayout, () => false)
  const visibleCount = isMobile ? 1 : 3
  const maxIndex = Math.max(images.length - visibleCount, 0)
  const safeIndex = Math.min(activeIndex, maxIndex)

  if (images.length === 0) return null

  const move = (direction: -1 | 1) => {
    setActiveIndex((current) => Math.min(Math.max(current + direction, 0), maxIndex))
  }

  const carouselStyle = {
    '--carousel-visible': visibleCount,
  } as CSSProperties

  return (
    <div aria-label={label} className={styles.carousel} role="region" style={carouselStyle}>
      <div className={styles.carouselViewport} id={viewportId}>
        <div
          className={styles.carouselTrack}
          style={{ transform: `translate3d(${-safeIndex * (100 / visibleCount)}%, 0, 0)` }}
        >
          {images.map((image, index) => {
            const isVisible = index >= safeIndex && index < safeIndex + visibleCount

            return (
              <figure
                aria-hidden={!isVisible}
                className={styles.carouselSlide}
                key={`${image.url}-${index}`}
              >
                <div className={styles.carouselImage}>
                  <Image
                    alt={image.alt}
                    fill
                    sizes="(max-width: 760px) 100vw, 31vw"
                    src={image.url}
                    style={{ objectPosition: `${image.focalX ?? 50}% ${image.focalY ?? 50}%` }}
                    unoptimized
                  />
                  {image.caption && (
                    <figcaption className={styles.carouselCaption}>{image.caption}</figcaption>
                  )}
                </div>
              </figure>
            )
          })}
        </div>
      </div>

      {images.length > visibleCount && (
        <>
          <button
            aria-controls={viewportId}
            aria-label="Previous project image"
            className={`${styles.carouselControl} ${styles.carouselPrevious}`}
            disabled={safeIndex === 0}
            onClick={() => move(-1)}
            type="button"
          >
            <ArrowIcon direction="previous" />
          </button>
          <button
            aria-controls={viewportId}
            aria-label="Next project image"
            className={`${styles.carouselControl} ${styles.carouselNext}`}
            disabled={safeIndex === maxIndex}
            onClick={() => move(1)}
            type="button"
          >
            <ArrowIcon direction="next" />
          </button>
          <span aria-live="polite" className={styles.carouselStatus} role="status">
            {String(safeIndex + 1).padStart(2, '0')}–
            {String(Math.min(safeIndex + visibleCount, images.length)).padStart(2, '0')} /{' '}
            {String(images.length).padStart(2, '0')}
          </span>
        </>
      )}
    </div>
  )
}
