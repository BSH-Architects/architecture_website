'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import type { MediaReference } from '@/lib/cms'

import styles from '../hero-study-two.module.css'

type HeroStudyTwoProps = {
  brand: string
  eyebrow?: string | null
  image: MediaReference | null
  indexHref: string
  previewImageSrc?: string | null
  summary?: string | null
}

type RevealPhase = 'void' | 'form' | 'hold' | 'expand' | 'content'

function focalPosition(image: MediaReference | null) {
  if (!image) return undefined

  const x = typeof image.focalX === 'number' ? image.focalX : 50
  const y = typeof image.focalY === 'number' ? image.focalY : 50

  return `${x}% ${y}%`
}

export function HeroStudyTwo({
  brand,
  eyebrow,
  image,
  indexHref,
  previewImageSrc,
  summary,
}: HeroStudyTwoProps) {
  const [phase, setPhase] = useState<RevealPhase>('void')
  const source = image?.url ?? previewImageSrc ?? null
  const objectPosition = focalPosition(image)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timers: ReturnType<typeof setTimeout>[] = []

    if (reducedMotion) {
      timers.push(setTimeout(() => setPhase('content'), 0))
    } else {
      // 0–400ms: uninterrupted charcoal field.
      timers.push(setTimeout(() => setPhase('form'), 400))
      // 400–1050ms: the aperture draws itself from zero into a small horizontal slit.
      timers.push(setTimeout(() => setPhase('hold'), 1050))
      // 1050–1650ms: hold the completed slit so the first state can register.
      timers.push(setTimeout(() => setPhase('expand'), 1650))
      // 1650–3100ms: expand to full frame before introducing typography.
      timers.push(setTimeout(() => setPhase('content'), 3100))
    }

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <section
      aria-labelledby="hero-study-two-name"
      className={styles.hero}
      data-phase={phase}
      id="hero-study-02"
    >
      <div className={styles.aperture}>
        {source ? (
          <Image
            alt={image?.alt || ''}
            fill
            sizes="100vw"
            src={source}
            style={objectPosition ? { objectPosition } : undefined}
            unoptimized
          />
        ) : (
          <div aria-hidden="true" className={styles.mediaUnset} />
        )}
        <div aria-hidden="true" className={styles.grade} />
      </div>

      <div aria-hidden="true" className={styles.rules} />

      <header className={styles.topRail}>
        <span>{eyebrow || 'Architecture / Interiors / Urban'}</span>
        <span>Hero study 02</span>
      </header>

      <div className={styles.nameMask}>
        <h1 aria-label={brand} className={styles.name} id="hero-study-two-name">
          {Array.from(brand).map((letter, index) => (
            <span
              aria-hidden="true"
              className={styles.nameLetter}
              key={`${letter}-${index}`}
              style={{ transitionDelay: `${index * 105}ms` }}
            >
              {letter === ' ' ? '\u00a0' : letter}
            </span>
          ))}
        </h1>
      </div>

      <footer className={styles.bottomRail}>
        <p>{summary}</p>
        <p>Independent architectural practice</p>
        <Link href={indexHref}>Enter</Link>
      </footer>
    </section>
  )
}
