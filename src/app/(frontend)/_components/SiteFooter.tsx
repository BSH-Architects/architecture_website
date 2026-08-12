import Link from 'next/link'

import { CONTACT_EMAIL } from '@/lib/contact'

import styles from '../site-footer.module.css'
import { ContactDrawerTrigger } from './ContactDrawer'

const footerLinks = [
  { href: '/projects', label: 'Work' },
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

        <nav
          aria-label="Footer index"
          className={`${styles.linkColumn} ${styles.navigation}`}
        >
          <span className={styles.label}>Index</span>
          {footerLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={`${styles.linkColumn} ${styles.socials}`}>
          <span className={styles.label}>Socials</span>
          <span title="Instagram profile to be confirmed">Instagram</span>
          <span title="LinkedIn profile to be confirmed">LinkedIn</span>
          <a href={`mailto:${CONTACT_EMAIL}`}>Email</a>
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
