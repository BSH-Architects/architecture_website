import Image from 'next/image'

import type { MediaReference } from '@/lib/cms'

import styles from '../position-study.module.css'

const POSITION_COPY = {
  title: 'Architecture begins with what is already there and makes room for what comes next.',
  description: [
    'We start with climate, terrain, movement, views, and the routines that give a place its character.',
    'Plans are reduced until structure, material, and daily use read as one clear idea. The result is quiet by design: spaces shaped by proportion, daylight, and the way they are lived in.',
  ],
} as const

type PositionStudyProps = {
  image: MediaReference | null
  previewImageSrc?: string | null
}

function focalPosition(image: MediaReference | null) {
  if (!image) return undefined

  const x = typeof image.focalX === 'number' ? image.focalX : 50
  const y = typeof image.focalY === 'number' ? image.focalY : 50

  return `${x}% ${y}%`
}

export function PositionStudy({ image, previewImageSrc }: PositionStudyProps) {
  const source = image?.url ?? previewImageSrc ?? null
  const objectPosition = focalPosition(image)

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
              sizes="(max-width: 760px) calc(100vw - 2.25rem), 34vw"
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
        <h2 id="position-study-title">{POSITION_COPY.title}</h2>

        <div className={styles.description}>
          {POSITION_COPY.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
