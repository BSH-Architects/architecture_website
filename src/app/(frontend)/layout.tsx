import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/contact'
import { SITE_NAME } from '@/lib/site'

import { ContactDrawerProvider } from './_components/ContactDrawer'
import { SiteHeader } from './_components/SiteHeader'
import { SmoothScroll } from './_components/SmoothScroll'
import { displayFont, monoFont, textFont } from './fonts'

import 'lenis/dist/lenis.css'
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
    <html
      className={`${displayFont.variable} ${textFont.variable} ${monoFont.variable}`}
      lang="en"
    >
      <body suppressHydrationWarning>
        <ContactDrawerProvider
          contactEmail={CONTACT_EMAIL}
          contactPhone={CONTACT_PHONE}
          siteName={SITE_NAME}
        >
          <SmoothScroll />
          <SiteHeader siteName={SITE_NAME} />
          {children}
        </ContactDrawerProvider>
      </body>
    </html>
  )
}
