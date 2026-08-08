'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

import { SiteFooter } from './SiteFooter'

import styles from '../closing-transition.module.css'

const FOOTER_START_OFFSET = 0.48

const DEFAULT_IMAGE = {
  alt: 'Bright contemporary residence framed by white concrete and open sky',
  src: '/api/media/file/residence-landscape-closing.jpg',
}
const DEFAULT_HEADING_LINES = ['Made to hold the', 'life that follows.']
const DEFAULT_LABEL = 'Architecture / Interiors / Landscape'

type ClosingImage = {
  alt: string
  objectPosition?: string
  src: string
}

type ClosingTransitionProps = {
  headingLines?: string[]
  image?: ClosingImage
  label?: string
  siteName: string
  variant?: 'image' | 'project'
}

export function ClosingTransition({
  headingLines = DEFAULT_HEADING_LINES,
  image = DEFAULT_IMAGE,
  label = DEFAULT_LABEL,
  siteName,
  variant = 'image',
}: ClosingTransitionProps) {
  const transitionRef = useRef<HTMLDivElement>(null)
  const isProjectReveal = variant === 'project'

  useEffect(() => {
    const transition = transitionRef.current
    if (!transition) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobileLayout = window.matchMedia('(max-width: 47.5rem)')
    let animationFrame = 0

    const updatePosition = () => {
      animationFrame = 0

      if (reducedMotion.matches || mobileLayout.matches) {
        transition.style.removeProperty('--image-shift')
        transition.style.removeProperty('--footer-shift')
        return
      }

      const bounds = transition.getBoundingClientRect()
      const scrollRange = Math.max(transition.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(1, Math.max(0, -bounds.top / scrollRange))

      transition.style.setProperty('--image-shift', `${progress * -100}%`)
      transition.style.setProperty(
        '--footer-shift',
        `${(1 - progress) * FOOTER_START_OFFSET * window.innerHeight}px`,
      )
    }

    const scheduleUpdate = () => {
      if (animationFrame) return
      animationFrame = window.requestAnimationFrame(updatePosition)
    }

    updatePosition()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    reducedMotion.addEventListener('change', scheduleUpdate)
    mobileLayout.addEventListener('change', scheduleUpdate)

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      reducedMotion.removeEventListener('change', scheduleUpdate)
      mobileLayout.removeEventListener('change', scheduleUpdate)
    }
  }, [])

  return (
    <div
      className={`${styles.transition} ${isProjectReveal ? styles.projectTransition : ''}`}
      ref={transitionRef}
    >
      <div className={styles.stage}>
        {!isProjectReveal && (
          <section aria-labelledby="closing-field-title" className={styles.imageField}>
            <Image
              alt={image.alt}
              fill
              sizes="100vw"
              src={image.src}
              style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
              unoptimized
            />
            <div aria-hidden="true" className={styles.grade} />
            <div aria-hidden="true" className={styles.rules} />

            <div className={styles.copy}>
              <h2 id="closing-field-title">
                {headingLines.map((line, index) => (
                  <span key={`${line}-${index}`}>{line}</span>
                ))}
              </h2>
              <p>{label}</p>
            </div>
          </section>
        )}

        <div className={styles.footerLock}>
          <SiteFooter siteName={siteName} />
        </div>
      </div>
    </div>
  )
}
