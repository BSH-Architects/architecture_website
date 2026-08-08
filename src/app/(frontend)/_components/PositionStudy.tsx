import Image from 'next/image'

import type { MediaReference } from '@/lib/cms'
import { positionSectionDefaults } from '@/content/homepageDefaults'

import styles from '../position-study.module.css'

type PositionStudyProps = {
  descriptionPrimary?: string | null
  descriptionSecondary?: string | null
  heading?: string | null
  image: MediaReference | null
  previewImageSrc?: string | null
}

function focalPosition(image: MediaReference | null) {
  if (!image) return undefined

  const x = typeof image.focalX === 'number' ? image.focalX : 50
  const y = typeof image.focalY === 'number' ? image.focalY : 50

  return `${x}% ${y}%`
}

export function PositionStudy({
  descriptionPrimary,
  descriptionSecondary,
  heading,
  image,
  previewImageSrc,
}: PositionStudyProps) {
  const source = image?.url ?? previewImageSrc ?? null
  const objectPosition = focalPosition(image)
  const headingLines = (heading?.trim() || positionSectionDefaults.heading)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const descriptions = [
    descriptionPrimary?.trim() || positionSectionDefaults.descriptionPrimary,
    descriptionSecondary?.trim() || positionSectionDefaults.descriptionSecondary,
  ]

  return (
    <section
      aria-labelledby="position-study-title"
      className={styles.section}
      id="position-study"
    >
      <figure className={styles.media}>
        <div className={styles.mediaWindow}>
          {source ? (
            <Image
              alt={image?.alt || ''}
              fill
              sizes="(max-width: 760px) 75vw, 36vw"
              src={source}
              style={objectPosition ? { objectPosition } : undefined}
              unoptimized
            />
          ) : (
            <div aria-hidden="true" className={styles.mediaUnset} />
          )}
        </div>
      </figure>

      <div className={styles.copy}>
        <h2 id="position-study-title">
          {headingLines.map((line, index) => (
            <span key={`${line}-${index}`}>{line}</span>
          ))}
        </h2>

        <div className={styles.description}>
          {descriptions.map((paragraph, index) => (
            <p key={`${paragraph}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
