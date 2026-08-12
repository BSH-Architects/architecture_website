'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import styles from '../site-header.module.css'
import { ContactDrawerTrigger } from './ContactDrawer'

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

const MOBILE_MENU_TRANSITION_DURATION = 480
const MOBILE_CONTACT_HANDOFF_DELAY = 420

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const getMobileMenuTransitionDuration = () =>
  prefersReducedMotion() ? 0 : MOBILE_MENU_TRANSITION_DURATION

const getMobileContactHandoffDelay = () =>
  prefersReducedMotion() ? 0 : MOBILE_CONTACT_HANDOFF_DELAY

export function SiteHeader({ siteName }: SiteHeaderProps) {
  const pathname = usePathname()

  return <RouteSiteHeader key={pathname} pathname={pathname} siteName={siteName} />
}

function RouteSiteHeader({ pathname, siteName }: RouteSiteHeaderProps) {
  const headerRef = useRef<HTMLElement>(null)
  const menuToggleRef = useRef<HTMLButtonElement>(null)
  const menuCloseTimerRef = useRef<number | null>(null)
  const contactHandoffTimerRef = useRef<number | null>(null)
  const previousScrollY = useRef(0)
  const frame = useRef<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileMenuClosing, setMobileMenuClosing] = useState(false)
  const [scrollState, setScrollState] = useState<ScrollState>({
    hidden: false,
    scrolled: false,
  })
  const [homeHeroRevealed, setHomeHeroRevealed] = useState(pathname !== '/')

  const projectsActive = pathname.startsWith('/projects')
  const opensOnDark = pathname === '/' || pathname === '/projects'
  const homeHeroPending = pathname === '/' && !homeHeroRevealed

  const beginMobileMenuClose = useCallback((restoreFocus = false) => {
    const closeDuration = getMobileMenuTransitionDuration()

    setMobileMenuOpen(false)
    setMobileMenuClosing(closeDuration > 0)

    if (menuCloseTimerRef.current !== null) {
      window.clearTimeout(menuCloseTimerRef.current)
      menuCloseTimerRef.current = null
    }

    if (closeDuration > 0) {
      menuCloseTimerRef.current = window.setTimeout(() => {
        setMobileMenuClosing(false)
        menuCloseTimerRef.current = null
      }, closeDuration)
    }

    if (restoreFocus) {
      window.requestAnimationFrame(() => menuToggleRef.current?.focus())
    }
  }, [])

  const openMobileMenu = useCallback(() => {
    if (menuCloseTimerRef.current !== null) {
      window.clearTimeout(menuCloseTimerRef.current)
      menuCloseTimerRef.current = null
    }

    setMobileMenuClosing(false)
    setMobileMenuOpen(true)
  }, [])

  const closeMobileMenu = useCallback(() => beginMobileMenuClose(false), [
    beginMobileMenuClose,
  ])

  const dismissMobileMenu = useCallback(() => beginMobileMenuClose(true), [
    beginMobileMenuClose,
  ])

  const handleMobileContactHandoff = useCallback(() => {
    const handoffDelay = getMobileContactHandoffDelay()
    beginMobileMenuClose(false)

    if (contactHandoffTimerRef.current !== null) {
      window.clearTimeout(contactHandoffTimerRef.current)
    }

    contactHandoffTimerRef.current = window.setTimeout(() => {
      menuToggleRef.current?.focus()
      contactHandoffTimerRef.current = null
    }, Math.max(0, handoffDelay - 40))
  }, [beginMobileMenuClose])

  useEffect(
    () => () => {
      if (menuCloseTimerRef.current !== null) {
        window.clearTimeout(menuCloseTimerRef.current)
      }
      if (contactHandoffTimerRef.current !== null) {
        window.clearTimeout(contactHandoffTimerRef.current)
      }
    },
    [],
  )

  const mobileMenuActive = mobileMenuOpen || mobileMenuClosing

  useEffect(() => {
    if (!mobileMenuActive) return

    const backgroundElements = Array.from(
      document.querySelectorAll<HTMLElement>('main, footer'),
    )
    const previousInert = backgroundElements.map((element) => element.inert)
    const mobileQuery = window.matchMedia('(max-width: 47.5rem)')

    backgroundElements.forEach((element) => {
      element.inert = true
    })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        dismissMobileMenu()
        return
      }

      if (event.key !== 'Tab' || !headerRef.current) return

      const focusable = Array.from(
        headerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0)

      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) return

      if (menuCloseTimerRef.current !== null) {
        window.clearTimeout(menuCloseTimerRef.current)
        menuCloseTimerRef.current = null
      }
      setMobileMenuOpen(false)
      setMobileMenuClosing(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    mobileQuery.addEventListener('change', handleViewportChange)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      mobileQuery.removeEventListener('change', handleViewportChange)
      backgroundElements.forEach((element, index) => {
        element.inert = previousInert[index]
      })
    }
  }, [dismissMobileMenu, mobileMenuActive])

  useEffect(() => {
    if (pathname !== '/') return

    const hero = document.getElementById('hero-study-02')
    if (!hero) {
      const fallbackFrame = window.requestAnimationFrame(() => setHomeHeroRevealed(true))
      return () => window.cancelAnimationFrame(fallbackFrame)
    }

    const revealWithHeroContent = () => {
      if (hero.dataset.phase === 'content') setHomeHeroRevealed(true)
    }

    const observerFrame = window.requestAnimationFrame(revealWithHeroContent)
    const observer = new MutationObserver(revealWithHeroContent)
    observer.observe(hero, { attributeFilter: ['data-phase'], attributes: true })

    return () => {
      window.cancelAnimationFrame(observerFrame)
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
    scrollState.hidden && !mobileMenuOpen ? styles.hidden : '',
    mobileMenuOpen ? styles.mobileMenuOpen : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <a className={styles.skipLink} href="#top">
        Skip to content
      </a>

      <button
        aria-hidden={mobileMenuActive ? undefined : true}
        aria-label="Close navigation menu"
        className={styles.menuBackdrop}
        data-closing={mobileMenuClosing ? 'true' : undefined}
        data-lenis-prevent
        data-open={mobileMenuOpen ? 'true' : 'false'}
        onClick={dismissMobileMenu}
        tabIndex={-1}
        type="button"
      />

      <header
        className={headerClassName}
        data-lenis-prevent={mobileMenuActive ? 'true' : undefined}
        inert={homeHeroPending || undefined}
        ref={headerRef}
      >
        <div className={styles.inner}>
          <Link
            aria-current={pathname === '/' ? 'page' : undefined}
            aria-label={`${siteName}, home`}
            className={styles.identity}
            href="/"
            onClick={closeMobileMenu}
          >
            <span className={styles.identityLong}>{siteName}</span>
            <span aria-hidden="true" className={styles.identityShort}>
              {siteName.slice(0, 1)}
            </span>
          </Link>

          <button
            aria-controls="mobile-primary-navigation"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className={styles.menuToggle}
            onClick={mobileMenuOpen ? dismissMobileMenu : openMobileMenu}
            ref={menuToggleRef}
            type="button"
          >
            <span>{mobileMenuOpen ? 'Close' : 'Menu'}</span>
            <span aria-hidden="true" className={styles.menuIcon}>
              <span />
              <span />
            </span>
          </button>

          <nav
            aria-label="Primary navigation"
            className={styles.navigation}
            id="mobile-primary-navigation"
          >
            {navItems.map((item, index) => (
              <Link
                aria-current={item.section === 'projects' && projectsActive ? 'page' : undefined}
                href={item.href}
                key={item.href}
                onClick={closeMobileMenu}
              >
                <span aria-hidden="true" className={styles.index}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <ContactDrawerTrigger
            ariaLabel="Contact us"
            className={styles.contactAction}
            onBeforeOpen={mobileMenuOpen ? handleMobileContactHandoff : undefined}
            openDelay={mobileMenuOpen ? getMobileContactHandoffDelay : 0}
          >
            <span>Contact us</span>
            <svg aria-hidden="true" className={styles.contactIcon} viewBox="0 0 16 16">
              <path d="M2.5 8h10M8.5 4l4 4-4 4" />
            </svg>
          </ContactDrawerTrigger>
        </div>

        <span aria-hidden="true" className={styles.progress} />
      </header>
    </>
  )
}
