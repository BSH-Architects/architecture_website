import Link from 'next/link'

import styles from '../hero-study-nav.module.css'

type HeroStudyNavProps = {
  activeStudy: '01' | '02'
}

export function HeroStudyNav({ activeStudy }: HeroStudyNavProps) {
  return (
    <nav aria-label="Hero design studies" className={styles.nav}>
      <span className={styles.label}>Hero studies</span>
      <Link aria-current={activeStudy === '01' ? 'page' : undefined} href="/?hero=01">
        <span>01</span>
        Statement
      </Link>
      <Link aria-current={activeStudy === '02' ? 'page' : undefined} href="/?hero=02">
        <span>02</span>
        Aperture
      </Link>
    </nav>
  )
}
