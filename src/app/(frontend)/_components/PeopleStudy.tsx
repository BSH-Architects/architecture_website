import Image from 'next/image'

import styles from '../people-study.module.css'

const founders = [
  {
    name: 'Person one',
    detail: 'Architecture / Design direction',
    image: '/api/media/file/studio-person-one.jpg',
    alt: 'Temporary editorial portrait for the first founder',
    className: styles.first,
  },
  {
    name: 'Person two',
    detail: 'Architecture / Practice direction',
    image: '/api/media/file/studio-person-two.jpg',
    alt: 'Temporary editorial portrait for the second founder',
    className: styles.second,
  },
] as const

export function PeopleStudy() {
  return (
    <section aria-labelledby="people-study-title" className={styles.section} id="people-study">
      <div aria-hidden="true" className={styles.rules} />

      <header className={styles.sectionHead}>
        <span>Studio / People</span>
        <span>Two founders · One practice</span>
      </header>

      <div className={styles.intro}>
        <h2 id="people-study-title">The practice is a conversation.</h2>
        <p>
          Two independent ways of seeing, held together by a shared commitment to clarity,
          material, and the life of each place.
        </p>
      </div>

      <div className={styles.people}>
        {founders.map((founder) => (
          <article className={`${styles.person} ${founder.className}`} key={founder.name}>
            <div className={styles.portrait}>
              <Image
                alt={founder.alt}
                fill
                sizes="(max-width: 760px) calc(100vw - 3rem), 36vw"
                src={founder.image}
                unoptimized
              />
            </div>

            <div className={styles.caption}>
              <div>
                <h3>{founder.name}</h3>
                <p>Co-founder</p>
              </div>
              <span>{founder.detail}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
