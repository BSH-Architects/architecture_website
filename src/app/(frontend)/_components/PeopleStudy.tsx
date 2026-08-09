import Image from 'next/image'

import { peopleSectionDefaults } from '@/content/homepageDefaults'
import type { MediaReference } from '@/lib/cms'

import styles from '../people-study.module.css'

type PersonContent = {
  description?: string | null
  image?: MediaReference | null
  name?: string | null
  role?: string | null
}

type PeopleStudyProps = {
  description?: string | null
  heading?: string | null
  personOne?: PersonContent | null
  personTwo?: PersonContent | null
  sectionLabel?: string | null
  sectionSummary?: string | null
}

function text(value: string | null | undefined, fallback: string) {
  return value?.trim() || fallback
}

export function PeopleStudy({
  description,
  heading,
  personOne,
  personTwo,
  sectionLabel,
  sectionSummary,
}: PeopleStudyProps) {
  const founders = [
    {
      key: 'person-one',
      name: text(personOne?.name, peopleSectionDefaults.personOne.name),
      role: text(personOne?.role, peopleSectionDefaults.personOne.role),
      description: text(
        personOne?.description,
        peopleSectionDefaults.personOne.description,
      ),
      image: personOne?.image,
      fallbackImageSrc: peopleSectionDefaults.personOne.imageSrc,
      fallbackImageAlt: peopleSectionDefaults.personOne.imageAlt,
      className: styles.first,
    },
    {
      key: 'person-two',
      name: text(personTwo?.name, peopleSectionDefaults.personTwo.name),
      role: text(personTwo?.role, peopleSectionDefaults.personTwo.role),
      description: text(
        personTwo?.description,
        peopleSectionDefaults.personTwo.description,
      ),
      image: personTwo?.image,
      fallbackImageSrc: peopleSectionDefaults.personTwo.imageSrc,
      fallbackImageAlt: peopleSectionDefaults.personTwo.imageAlt,
      className: styles.second,
    },
  ]

  return (
    <section aria-labelledby="people-study-title" className={styles.section} id="people-study">
      <div aria-hidden="true" className={styles.rules} />

      <header className={styles.sectionHead}>
        <span>{text(sectionLabel, peopleSectionDefaults.sectionLabel)}</span>
        <span>{text(sectionSummary, peopleSectionDefaults.sectionSummary)}</span>
      </header>

      <div className={styles.intro}>
        <h2 id="people-study-title">{text(heading, peopleSectionDefaults.heading)}</h2>
        <p>{text(description, peopleSectionDefaults.description)}</p>
      </div>

      <div className={styles.people}>
        {founders.map((founder) => (
          <article className={`${styles.person} ${founder.className}`} key={founder.key}>
            <div className={styles.portrait}>
              <Image
                alt={founder.image?.alt || founder.fallbackImageAlt}
                fill
                sizes="(max-width: 760px) calc(100vw - 3rem), 36vw"
                src={founder.image?.url || founder.fallbackImageSrc}
                unoptimized
              />
            </div>

            <div className={styles.caption}>
              <div>
                <h3>{founder.name}</h3>
                <p>{founder.role}</p>
              </div>
              <span>{founder.description}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
