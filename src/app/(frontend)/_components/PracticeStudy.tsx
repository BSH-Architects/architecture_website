import Image from 'next/image'

import styles from '../practice-study.module.css'

const disciplines = [
  {
    title: 'Residential',
    description:
      'Homes organized around climate, routine, and long-term adaptability rather than a single visual gesture.',
  },
  {
    title: 'Hospitality',
    description:
      'Places where sequence, material warmth, and natural light establish atmosphere before branding does.',
  },
  {
    title: 'Interiors',
    description:
      'Interior architecture carried through from structure, proportion, and the material logic of the building.',
  },
  {
    title: 'Landscape',
    description:
      'Built and natural systems developed together so each project belongs to a wider environmental condition.',
  },
] as const

export function PracticeStudy() {
  return (
    <section aria-labelledby="practice-study-title" className={styles.section}>
      <div className={styles.media}>
        <Image
          alt=""
          fill
          sizes="100vw"
          src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=2400&q=88"
          unoptimized
        />
      </div>
      <div aria-hidden="true" className={styles.grade} />

      <div className={styles.grid}>
        <div className={styles.heading}>
          <h2 className={styles.title} id="practice-study-title">
            <span>Architecture is</span>
            <span>a frame for</span>
            <span>ordinary life.</span>
          </h2>
          <p>
            A connected practice across buildings, interiors, and landscapes—shaped around how
            places are actually lived in.
          </p>
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
      </div>
    </section>
  )
}
