import Image from 'next/image'

import styles from '../practice-study.module.css'

const disciplines = [
  {
    title: 'Residential',
    description: 'Homes shaped around climate, routine, and long-term change.',
  },
  {
    title: 'Hospitality',
    description: 'Places where sequence, material, and light establish atmosphere.',
  },
  {
    title: 'Interiors',
    description: 'Interior architecture carried through from structure and proportion.',
  },
  {
    title: 'Landscape',
    description: 'Built and natural systems developed as one continuous condition.',
  },
] as const

export function PracticeStudy() {
  return (
    <section aria-labelledby="practice-study-title" className={styles.section} id="practice-study">
      <div className={styles.media}>
        <Image
          alt=""
          fill
          sizes="100vw"
          src="https://cdn.prod.website-files.com/69e60b77c36e562efcf3a092/6a0209b5b80c1f21303cae07_model-section.webp"
          unoptimized
        />
      </div>
      <div aria-hidden="true" className={styles.grade} />
      <div aria-hidden="true" className={styles.rules} />

      <div className={styles.manifesto}>
        <h2 id="practice-study-title">
          <span>Architecture is a frame</span>
          <span>
            for <em>ordinary life.</em>
          </span>
        </h2>

        <div className={styles.manifestoCopy}>
          <p>A connected practice across buildings, interiors, and landscapes.</p>
          <p>Each is shaped around how places are actually lived in.</p>
        </div>
      </div>

      <div className={styles.disciplines}>
        {disciplines.map((discipline, index) => (
          <article className={styles.discipline} key={discipline.title}>
            <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
            <h3>{discipline.title}</h3>
            <p>{discipline.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
