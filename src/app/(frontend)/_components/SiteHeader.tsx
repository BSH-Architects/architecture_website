'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import styles from '../site-header.module.css'

type SiteHeaderProps = {
  siteName: string
}

type ScrollState = {
  hidden: boolean
  scrolled: boolean
}

type RouteSiteHeaderProps = SiteHeaderProps & {
  pathname: string
}

const navItems = [
  { href: '/projects', label: 'Work', section: 'projects' },
  { href: '/#practice-study', label: 'Practice', section: 'practice' },
  { href: '/#people-study', label: 'People', section: 'people' },
] as const

export function SiteHeader({ siteName }: SiteHeaderProps) {
  const pathname = usePathname()

  return <RouteSiteHeader key={pathname} pathname={pathname} siteName={siteName} />
}

function RouteSiteHeader({ pathname, siteName }: RouteSiteHeaderProps) {
  const headerRef = useRef<HTMLElement>(null)
  const previousScrollY = useRef(0)
  const frame = useRef<number | null>(null)
  const [scrollState, setScrollState] = useState<ScrollState>({
    hidden: false,
    scrolled: false,
  })
  const [homeHeroRevealed, setHomeHeroRevealed] = useState(pathname !== '/')

  const projectsActive = pathname.startsWith('/projects')
  const opensOnDark = pathname === '/' || pathname === '/projects'
  const homeHeroPending = pathname === '/' && !homeHeroRevealed

  useEffect(() => {
    if (pathname !== '/') return

    const hero = document.getElementById('hero-study-02')
    if (!hero) {
      const frame = window.requestAnimationFrame(() => setHomeHeroRevealed(true))
      return () => window.cancelAnimationFrame(frame)
    }

    const revealWithHeroContent = () => {
      if (hero.dataset.phase === 'content') setHomeHeroRevealed(true)
    }

    const frame = window.requestAnimationFrame(revealWithHeroContent)
    const observer = new MutationObserver(revealWithHeroContent)
    observer.observe(hero, { attributeFilter: ['data-phase'], attributes: true })

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [pathname])

  useEffect(() => {
    const update = () => {
      const scrollY = Math.max(window.scrollY, 0)
      const delta = scrollY - previousScrollY.current
      const scrollableHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      )

      headerRef.current?.style.setProperty(
        '--header-scroll-progress',
        String(Math.min(scrollY / scrollableHeight, 1)),
      )

      setScrollState((current) => {
        let hidden = current.hidden

        if (scrollY <= 80) hidden = false
        else if (delta > 6) hidden = true
        else if (delta < -4) hidden = false

        const scrolled = scrollY > 24

        return hidden === current.hidden && scrolled === current.scrolled
          ? current
          : { hidden, scrolled }
      })

      previousScrollY.current = scrollY
      frame.current = null
    }

    const requestUpdate = () => {
      if (frame.current === null) frame.current = window.requestAnimationFrame(update)
    }

    previousScrollY.current = window.scrollY
    update()
    window.addEventListener('resize', requestUpdate)
    window.addEventListener('scroll', requestUpdate, { passive: true })

    return () => {
      window.removeEventListener('resize', requestUpdate)
      window.removeEventListener('scroll', requestUpdate)
      if (frame.current !== null) window.cancelAnimationFrame(frame.current)
    }
  }, [pathname])

  const headerClassName = [
    styles.header,
    opensOnDark ? styles.opensOnDark : styles.opensOnLight,
    pathname === '/' ? styles.waitsForHero : '',
    homeHeroPending ? styles.heroPending : '',
    scrollState.scrolled ? styles.scrolled : '',
    scrollState.hidden ? styles.hidden : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <a className={styles.skipLink} href="#top">
        Skip to content
      </a>

      <header
        aria-hidden={homeHeroPending || undefined}
        className={headerClassName}
        inert={homeHeroPending || undefined}
        ref={headerRef}
      >
        <div className={styles.inner}>
          <Link
            aria-current={pathname === '/' ? 'page' : undefined}
            aria-label={`${siteName}, home`}
            className={styles.identity}
            href="/"
          >
            {siteName}
          </Link>

          <p className={styles.disciplines}>Architecture / Interiors / Landscape</p>

          <nav aria-label="Primary navigation" className={styles.navigation}>
            {navItems.map((item, index) => (
              <Link
                aria-current={item.section === 'projects' && projectsActive ? 'page' : undefined}
                href={item.href}
                key={item.href}
              >
                <span aria-hidden="true" className={styles.index}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <span aria-hidden="true" className={styles.progress} />
      </header>
    </>
  )
}
