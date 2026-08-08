'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

import { SiteFooter } from './SiteFooter'

import styles from '../closing-transition.module.css'

const FOOTER_START_OFFSET = 0.48

export function ClosingTransition({ siteName }: { siteName: string }) {
  const transitionRef = useRef<HTMLDivElement>(null)

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
    <div className={styles.transition} ref={transitionRef}>
      <div className={styles.stage}>
        <section aria-labelledby="closing-field-title" className={styles.imageField}>
          <Image
            alt="Bright contemporary residence framed by white concrete and open sky"
            fill
            sizes="100vw"
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=90"
            unoptimized
          />
          <div aria-hidden="true" className={styles.grade} />
          <div aria-hidden="true" className={styles.rules} />

          <div className={styles.copy}>
            <h2 id="closing-field-title">
              <span>Made to hold the</span>
              <span>life that follows.</span>
            </h2>
            <p>Architecture / Interiors / Landscape</p>
          </div>
        </section>

        <div className={styles.footerLock}>
          <SiteFooter siteName={siteName} />
        </div>
      </div>
    </div>
  )
}
