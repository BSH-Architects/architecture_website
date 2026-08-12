import Link from 'next/link'

import styles from '../site-footer.module.css'
import { ContactDrawerTrigger } from './ContactDrawer'

const footerLinks = [
  { href: '/projects', label: 'Selected work' },
  { href: '/#practice-study', label: 'Approach' },
  { href: '/#people-study', label: 'People' },
] as const

export function SiteFooter({ siteName }: { siteName: string }) {
  return (
    <footer className={styles.footer}>
      <div aria-hidden="true" className={styles.rules} />

      <div className={styles.top}>
        <div className={styles.lead}>
          <h2>Every project begins in conversation.</h2>
          <ContactDrawerTrigger
            ariaLabel="Partner with us"
            className={styles.leadAction}
          >
            <span>Partner with us</span>
            <span aria-hidden="true">→</span>
          </ContactDrawerTrigger>
        </div>

        <nav aria-label="Footer" className={styles.navigation}>
          <span className={styles.label}>Index</span>
          {footerLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.practice}>
          <span className={styles.label}>Practice</span>
          <p>Architecture / Interiors / Landscape</p>
          <Link href="#top">Back to top</Link>
        </div>
      </div>

      <div aria-hidden="true" className={styles.wordmark}>
        {siteName}
      </div>

      <div className={styles.bottom}>
        <span>© 2026 {siteName}</span>
        <span>Independent architectural practice</span>
        <Link href="#top">Back to top</Link>
      </div>
    </footer>
  )
}
