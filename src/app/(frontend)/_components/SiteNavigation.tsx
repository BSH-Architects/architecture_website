import Link from 'next/link'

import styles from '../site-navigation.module.css'

type SiteNavigationProps = {
  activePage: 'home' | 'projects'
}

export function SiteNavigation({ activePage }: SiteNavigationProps) {
  return (
    <nav aria-label="Primary navigation" className={styles.nav}>
      <Link aria-current={activePage === 'home' ? 'page' : undefined} href="/">
        Home
      </Link>
      <Link aria-current={activePage === 'projects' ? 'page' : undefined} href="/projects">
        Projects
      </Link>
    </nav>
  )
}
