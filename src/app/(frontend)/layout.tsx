import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import './tokens.css'
import '../globals.css'

export const metadata: Metadata = {
  description: 'Architecture studio work and project archive.',
  title: {
    default: 'Architecture Studio',
    template: '%s | Architecture Studio',
  },
}

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
