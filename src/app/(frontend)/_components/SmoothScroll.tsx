'use client'

import type { LenisOptions } from 'lenis'
import { ReactLenis } from 'lenis/react'

const options: LenisOptions = {
  anchors: true,
  autoRaf: true,
  lerp: 0.09,
  respectReducedMotion: true,
  smoothWheel: true,
  stopInertiaOnNavigate: true,
  syncTouch: false,
  wheelMultiplier: 0.9,
}

export function SmoothScroll() {
  return <ReactLenis options={options} root />
}
