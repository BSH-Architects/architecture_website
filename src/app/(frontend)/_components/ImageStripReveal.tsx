'use client'

import { useEffect, useRef } from 'react'

import styles from '../image-strip-reveal.module.css'

export function ImageStripReveal() {
  const maskRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mask = maskRef.current
    const media = mask?.parentElement
    if (!mask || !media) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      mask.dataset.reveal = 'complete'
      return
    }

    mask.dataset.reveal = 'masked'

    let revealFrame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return

        observer.disconnect()
        revealFrame = window.requestAnimationFrame(() => {
          mask.dataset.reveal = 'complete'
        })
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.18,
      },
    )

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      if (!event.matches) return

      observer.disconnect()
      if (revealFrame) window.cancelAnimationFrame(revealFrame)
      mask.dataset.reveal = 'complete'
    }

    observer.observe(media)
    reducedMotion.addEventListener('change', handleMotionPreference)

    return () => {
      observer.disconnect()
      if (revealFrame) window.cancelAnimationFrame(revealFrame)
      reducedMotion.removeEventListener('change', handleMotionPreference)
    }
  }, [])

  return (
    <div aria-hidden="true" className={styles.mask} ref={maskRef}>
      <span className={styles.strip} />
      <span className={styles.strip} />
      <span className={styles.strip} />
    </div>
  )
}
