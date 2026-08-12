'use client'

import {
  createContext,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLenis } from 'lenis/react'

import styles from '../contact-drawer.module.css'

type ContactDrawerContextValue = {
  close: () => void
  isOpen: boolean
  open: () => void
}

type ContactDrawerProviderProps = {
  children: ReactNode
  contactEmail: string
  contactPhone: string
  siteName: string
}

type ContactDrawerTriggerProps = {
  ariaLabel?: string
  children: ReactNode
  className?: string
}

const ContactDrawerContext = createContext<ContactDrawerContextValue | null>(null)
const DRAWER_ID = 'contact-drawer'
const DRAWER_CLOSE_DURATION = 560
const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function ContactDrawerProvider({
  children,
  contactEmail,
  contactPhone,
  siteName,
}: ContactDrawerProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [formStatus, setFormStatus] = useState('')
  const lenis = useLenis()
  const panelRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const closeTimerRef = useRef<number | null>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()

  const open = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setFormStatus('')
    setIsClosing(false)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setIsClosing(true)

    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current)
    closeTimerRef.current = window.setTimeout(() => {
      setIsClosing(false)
      closeTimerRef.current = null
    }, DRAWER_CLOSE_DURATION)
  }, [])

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current)
    },
    [],
  )

  const shouldLockScroll = isOpen || isClosing

  useEffect(() => {
    if (!shouldLockScroll) return

    const documentElement = document.documentElement
    const body = document.body
    const lockedScrollY = window.scrollY
    const previousHtmlOverflow = documentElement.style.overflow
    const previousBodyOverflow = body.style.overflow
    const previousBodyPaddingRight = body.style.paddingRight
    const previousBodyPosition = body.style.position
    const previousBodyTop = body.style.top
    const previousBodyWidth = body.style.width
    const scrollbarWidth = Math.max(window.innerWidth - documentElement.clientWidth, 0)
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())

    lenis?.stop()
    documentElement.dataset.contactDrawer = 'open'
    documentElement.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${lockedScrollY}px`
    body.style.width = '100%'
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => element.getClientRects().length > 0)

      if (focusable.length === 0) {
        event.preventDefault()
        panelRef.current.focus()
        return
      }

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

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', handleKeyDown)
      delete documentElement.dataset.contactDrawer
      documentElement.style.overflow = previousHtmlOverflow
      body.style.overflow = previousBodyOverflow
      body.style.paddingRight = previousBodyPaddingRight
      body.style.position = previousBodyPosition
      body.style.top = previousBodyTop
      body.style.width = previousBodyWidth
      window.scrollTo(0, lockedScrollY)
      lenis?.scrollTo(lockedScrollY, { force: true, immediate: true })
      lenis?.start()
      window.requestAnimationFrame(() => openerRef.current?.focus())
    }
  }, [close, lenis, shouldLockScroll])

  const contextValue = useMemo(() => ({ close, isOpen, open }), [close, isOpen, open])

  const handleBackdropPointerDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) close()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') || '').trim()
    const replyTo = String(formData.get('email') || '').trim()
    const phone = String(formData.get('phone') || '').trim()
    const projectType = String(formData.get('projectType') || '').trim()
    const location = String(formData.get('location') || '').trim()
    const message = String(formData.get('message') || '').trim()
    const subject = `Project enquiry — ${name || 'New conversation'}`
    const body = [
      `Name: ${name}`,
      `Email: ${replyTo}`,
      `Phone: ${phone || 'Not provided'}`,
      `Project type: ${projectType}`,
      `Location: ${location || 'Not provided'}`,
      '',
      message,
    ].join('\n')

    setFormStatus('Opening a new email with your project details…')
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <ContactDrawerContext.Provider value={contextValue}>
      {children}

      <div
        aria-hidden={isOpen ? undefined : true}
        className={styles.backdrop}
        data-closing={isClosing ? 'true' : undefined}
        data-lenis-prevent
        data-open={isOpen ? 'true' : 'false'}
        inert={isOpen || isClosing ? undefined : true}
        onMouseDown={handleBackdropPointerDown}
      >
        <section
          aria-describedby={descriptionId}
          aria-labelledby={titleId}
          aria-modal="true"
          className={styles.panel}
          data-lenis-prevent
          id={DRAWER_ID}
          ref={panelRef}
          role="dialog"
          tabIndex={-1}
        >
          <header className={styles.panelHeader}>
            <span className={styles.panelIdentity}>{siteName}</span>
            <button
              aria-label="Close project enquiry"
              className={styles.closeButton}
              onClick={close}
              ref={closeButtonRef}
              type="button"
            >
              <span>Close</span>
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </header>

          <div className={styles.content}>
            <div className={styles.introduction}>
              <h2 id={titleId}>Start with a conversation.</h2>
              <p id={descriptionId}>
                Tell us about the place, the brief, and what you hope it can become. We
                welcome early conversations across architecture, interiors, and landscape.
              </p>
            </div>

            <div className={styles.rule} />

            <section className={styles.enquirySection} aria-labelledby={`${titleId}-form`}>
              <div className={styles.sectionHeading}>
                <h3 id={`${titleId}-form`}>Your project</h3>
                <p>Share what is known. The rest can take shape together.</p>
              </div>

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.fieldPair}>
                  <label className={styles.field}>
                    <span>
                      Name <small>Required</small>
                    </span>
                    <input autoComplete="name" name="name" placeholder="Your name" required />
                  </label>

                  <label className={styles.field}>
                    <span>
                      Email <small>Required</small>
                    </span>
                    <input
                      autoComplete="email"
                      inputMode="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                      type="email"
                    />
                  </label>
                </div>

                <div className={styles.fieldPair}>
                  <label className={styles.field}>
                    <span>Phone</span>
                    <input
                      autoComplete="tel"
                      inputMode="tel"
                      name="phone"
                      placeholder="Optional"
                      type="tel"
                    />
                  </label>

                  <label className={styles.field}>
                    <span>
                      Project type <small>Required</small>
                    </span>
                    <select defaultValue="" name="projectType" required>
                      <option disabled value="">
                        Select one
                      </option>
                      <option>New residence</option>
                      <option>Renovation or extension</option>
                      <option>Interior</option>
                      <option>Landscape</option>
                      <option>Workplace or hospitality</option>
                      <option>Other collaboration</option>
                    </select>
                  </label>
                </div>

                <label className={styles.field}>
                  <span>Site or location</span>
                  <input
                    autoComplete="street-address"
                    name="location"
                    placeholder="City, region, or address if known"
                  />
                </label>

                <label className={styles.field}>
                  <span>
                    Tell us about it <small>Required</small>
                  </span>
                  <textarea
                    minLength={20}
                    name="message"
                    placeholder="A few words about the site, ambition, timing, and approximate scope."
                    required
                    rows={7}
                  />
                </label>

                <button className={styles.submitButton} type="submit">
                  <span>Draft project email</span>
                  <svg aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </button>

                <p aria-live="polite" className={styles.formStatus} role="status">
                  {formStatus}
                </p>
              </form>
            </section>

            <div className={styles.rule} />

            <section className={styles.contactDetails} aria-labelledby={`${titleId}-contact`}>
              <h3 id={`${titleId}-contact`}>Direct contact</h3>
              <div className={styles.contactMethods}>
                <div>
                  <p>Email</p>
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                </div>
                <div>
                  <p>Phone · Placeholder</p>
                  <span>{contactPhone}</span>
                </div>
              </div>
              <p className={styles.responseNote}>
                Include your location and a short description of the project. Drawings and
                reference material can follow once the conversation begins.
              </p>
            </section>
          </div>
        </section>
      </div>
    </ContactDrawerContext.Provider>
  )
}

export function ContactDrawerTrigger({
  ariaLabel,
  children,
  className,
}: ContactDrawerTriggerProps) {
  const context = useContext(ContactDrawerContext)

  if (!context) throw new Error('ContactDrawerTrigger must be used inside ContactDrawerProvider')

  return (
    <button
      aria-controls={DRAWER_ID}
      aria-expanded={context.isOpen}
      aria-label={ariaLabel}
      className={className}
      onClick={context.open}
      type="button"
    >
      {children}
    </button>
  )
}
