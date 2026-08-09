import { ClosingTransition } from './ClosingTransition'
import { SiteFooter } from './SiteFooter'

type PageFooterClosing = {
  headingLines?: string[]
  image?: {
    alt: string
    objectPosition?: string
    src: string
  }
  label?: string
}

type PageFooterProps = {
  closing?: PageFooterClosing
  siteName: string
}

export function PageFooter({ closing, siteName }: PageFooterProps) {
  if (!closing) return <SiteFooter siteName={siteName} />

  return (
    <ClosingTransition
      headingLines={closing.headingLines}
      image={closing.image}
      label={closing.label}
      siteName={siteName}
    />
  )
}
