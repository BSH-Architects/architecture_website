import { IBM_Plex_Mono, Instrument_Sans, Instrument_Serif } from 'next/font/google'

/**
 * The Quiet Structure pairing, self-hosted by next/font. Swap the imports here
 * and the whole site follows; tokens.css only consumes the CSS variables.
 *
 * Instrument Serif — the display voice. One weight, used at size.
 * Instrument Sans  — running text and interface labels.
 * IBM Plex Mono    — data, indices, and metadata only.
 */
export const displayFont = Instrument_Serif({
  display: 'swap',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-display',
  weight: '400',
})

export const textFont = Instrument_Sans({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-text',
})

export const monoFont = IBM_Plex_Mono({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
})
