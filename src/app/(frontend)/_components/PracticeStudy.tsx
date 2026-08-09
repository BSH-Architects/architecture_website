import Image from 'next/image'

import { practiceSectionDefaults } from '@/content/homepageDefaults'
import type { MediaReference } from '@/lib/cms'

import styles from '../practice-study.module.css'

type DisciplineContent = {
  descriptionPrimary?: string | null
  descriptionSecondary?: string | null
  title?: string | null
}

type PracticeStudyProps = {
  descriptionPrimary?: string | null
  descriptionSecondary?: string | null
  disciplines?: DisciplineContent[] | null
  headingLineOne?: string | null
  headingLineTwoEmphasis?: string | null
  headingLineTwoPrefix?: string | null
  image?: MediaReference | null
}

function text(value: string | null | undefined, fallback: string) {
  return value?.trim() || fallback
}

export function PracticeStudy({
  descriptionPrimary,
  descriptionSecondary,
  disciplines: disciplineContent,
  headingLineOne,
  headingLineTwoEmphasis,
  headingLineTwoPrefix,
  image,
}: PracticeStudyProps) {
  const disciplines = practiceSectionDefaults.disciplines.map((fallback, index) => {
    const discipline = disciplineContent?.[index]

    return {
      title: text(discipline?.title, fallback.title),
      descriptions: [
        text(discipline?.descriptionPrimary, fallback.descriptionPrimary),
        text(discipline?.descriptionSecondary, fallback.descriptionSecondary),
      ],
    }
  })
  return (
    <section aria-labelledby="practice-study-title" className={styles.section} id="practice-study">
      <div className={styles.media}>
        <Image
          alt=""
          fill
          sizes="100vw"
          src={image?.url || practiceSectionDefaults.imageSrc}
          unoptimized
        />
      </div>
      <div aria-hidden="true" className={styles.grade} />
      <div aria-hidden="true" className={styles.rules} />

      <div className={styles.manifesto}>
        <h2 id="practice-study-title">
          <span>{text(headingLineOne, practiceSectionDefaults.headingLineOne)}</span>
          <span>
            {text(headingLineTwoPrefix, practiceSectionDefaults.headingLineTwoPrefix)}{' '}
            <em>
              {text(
                headingLineTwoEmphasis,
                practiceSectionDefaults.headingLineTwoEmphasis,
              )}
            </em>
          </span>
        </h2>

        <div className={styles.manifestoCopy}>
          <p>{text(descriptionPrimary, practiceSectionDefaults.descriptionPrimary)}</p>
          <p>{text(descriptionSecondary, practiceSectionDefaults.descriptionSecondary)}</p>
        </div>
      </div>

      <div className={styles.disciplines}>
        {disciplines.map((discipline, index) => (
          <article className={styles.discipline} key={`discipline-${index}`}>
            <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
            <h3>{discipline.title}</h3>
            <div className={styles.disciplineCopy}>
              {discipline.descriptions.map((description, descriptionIndex) => (
                <p key={`${index}-${descriptionIndex}`}>{description}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
