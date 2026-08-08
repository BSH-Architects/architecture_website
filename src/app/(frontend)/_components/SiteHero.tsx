import Image from 'next/image'
import Link from 'next/link'

import type { MediaReference } from '@/lib/cms'

import styles from '../hero.module.css'

type SiteHeroProps = {
  /** Practice wordmark shown at the top left. */
  brand: string
  /** Short uppercase datum shown in the rail. */
  eyebrow?: string | null
  /** CMS photograph, already resolved to the `wide` rendition. */
  image: MediaReference | null
  /** Anchor the scroll cue and rail index point at. */
  indexHref: string
  /** Practice descriptor under the first meta rule. */
  practice: string
  /** Count of published projects, or null when the CMS is unavailable. */
  projectCount: number | null
  /** Local development photograph, used only when `image` is absent. */
  previewImageSrc?: string | null
  /** Stable anchor used by the local hero-study navigator. */
  sectionID?: string
  /** The hero paragraph. */
  summary?: string | null
  /** The oversized statement. Required by the CMS. */
  title: string
}

/**
 * Percentages come from Payload's focal point, so the subject of a photograph
 * survives every crop instead of drifting to the centre.
 */
function focalPosition(image: MediaReference | null) {
  if (!image) return undefined

  const x = typeof image.focalX === 'number' ? image.focalX : 50
  const y = typeof image.focalY === 'number' ? image.focalY : 50

  return `${x}% ${y}%`
}

export function SiteHero({
  brand,
  eyebrow,
  image,
  indexHref,
  practice,
  previewImageSrc,
  projectCount,
  sectionID,
  summary,
  title,
}: SiteHeroProps) {
  const source = image?.url ?? previewImageSrc ?? null
  const objectPosition = focalPosition(image)

  return (
    <section aria-labelledby="hero-statement" className={styles.hero} id={sectionID}>
      {source ? (
        <div className={styles.media}>
          <Image
            alt={image?.alt || ''}
            fill
            priority
            sizes="100vw"
            src={source}
            style={objectPosition ? { objectPosition } : undefined}
            unoptimized
          />
        </div>
      ) : (
        <div aria-hidden="true" className={styles.mediaUnset} />
      )}

      <div aria-hidden="true" className={styles.grade} />
      <div aria-hidden="true" className={styles.rules} />

      <header className={styles.rail}>
        <p className={styles.brand}>{brand}</p>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : <span />}
        <Link className={styles.indexLink} href={indexHref}>
          <span>Index</span>
          {projectCount !== null && (
            <span className={styles.indexCount}>{String(projectCount).padStart(2, '0')}</span>
          )}
        </Link>
      </header>

      <div className={styles.statement}>
        <h1 className={styles.title} id="hero-statement">
          {title}
        </h1>
      </div>

      <div className={styles.meta}>
        <div className={`${styles.cell} ${styles.cellPractice}`}>
          <span className={styles.cellLabel}>Practice</span>
          <p className={styles.cellValue}>{practice}</p>
        </div>

        {summary && (
          <div className={`${styles.cell} ${styles.cellPosition}`}>
            <span className={styles.cellLabel}>Position</span>
            <p className={styles.cellValue}>{summary}</p>
          </div>
        )}

        <div className={`${styles.cell} ${styles.cellIndex}`}>
          <span className={styles.cellLabel}>Index</span>
          <Link className={styles.scrollCue} href={indexHref}>
            Selected work
          </Link>
        </div>
      </div>
    </section>
  )
}
