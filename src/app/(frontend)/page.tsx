import { cmsIsConfigured, getHomepageContent, mediaData } from '@/lib/cms'
import { heroPlaceholder, previewHeroImagePath, SITE_NAME } from '@/lib/site'

import { PageFooter } from './_components/PageFooter'
import { HeroStudyTwo } from './_components/HeroStudyTwo'
import { PeopleStudy } from './_components/PeopleStudy'
import { PositionStudy } from './_components/PositionStudy'
import { PracticeStudy } from './_components/PracticeStudy'
import { ProjectFieldStudy } from './_components/ProjectFieldStudy'

export const dynamic = 'force-dynamic'

const POSITION_ANCHOR = '#position-study'

/** Placeholder content is a local design affordance, never a production fallback. */
const allowPlaceholderContent = process.env.NODE_ENV !== 'production'

export default async function HomePage() {
  const content = cmsIsConfigured
    ? await getHomepageContent().catch((error: unknown) => {
        console.error('Unable to load homepage content.', error)
        return null
      })
    : null

  if (!content && !allowPlaceholderContent) {
    return <UnavailableState configured={cmsIsConfigured} />
  }

  const hero = content?.homepage.hero
  const heroImage = mediaData(hero?.image, 'wide')
  const position = content?.homepage.position
  const positionImage = mediaData(position?.image, 'wide') ?? heroImage
  const practice = content?.homepage.practice
  const practiceImage = mediaData(practice?.image)
  const people = content?.homepage.people
  const personOneImage = mediaData(people?.personOne?.image)
  const personTwoImage = mediaData(people?.personTwo?.image)
  const closing = content?.homepage.closing
  const closingImage = mediaData(closing?.image)
  const closingHeadingLines = closing?.heading
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const previewImageSrc = content ? null : previewHeroImagePath()
  const heroSummary = hero?.summary || heroPlaceholder.summary
  const heroPracticeDescriptor =
    hero?.practiceDescriptor || heroPlaceholder.practiceDescriptor
  const heroTarget = POSITION_ANCHOR

  return (
    <>
      <main className="site-shell" id="top" tabIndex={-1}>
        <HeroStudyTwo
          brand={hero?.title || SITE_NAME}
          image={heroImage}
          indexHref={heroTarget}
          practiceDescriptor={heroPracticeDescriptor}
          previewImageSrc={previewImageSrc}
          summary={heroSummary}
        />

        <PositionStudy
          descriptionPrimary={position?.descriptionPrimary}
          descriptionSecondary={position?.descriptionSecondary}
          heading={position?.heading}
          image={positionImage}
          previewImageSrc={previewImageSrc}
        />

        {content && (
          <ProjectFieldStudy
            featuredProject={content.featuredProject}
            projects={content.projects}
          />
        )}

        <PracticeStudy
          descriptionPrimary={practice?.descriptionPrimary}
          descriptionSecondary={practice?.descriptionSecondary}
          disciplines={practice?.disciplines}
          headingLineOne={practice?.headingLineOne}
          headingLineTwoEmphasis={practice?.headingLineTwoEmphasis}
          headingLineTwoPrefix={practice?.headingLineTwoPrefix}
          image={practiceImage}
        />
        <PeopleStudy
          description={people?.description}
          heading={people?.heading}
          personOne={{
            description: people?.personOne?.description,
            image: personOneImage,
            name: people?.personOne?.name,
            role: people?.personOne?.role,
          }}
          personTwo={{
            description: people?.personTwo?.description,
            image: personTwoImage,
            name: people?.personTwo?.name,
            role: people?.personTwo?.role,
          }}
          sectionLabel={people?.sectionLabel}
          sectionSummary={people?.sectionSummary}
        />
      </main>
      <PageFooter
        closing={{
          headingLines: closingHeadingLines?.length ? closingHeadingLines : undefined,
          image: closingImage?.url
            ? {
                alt: closingImage.alt,
                src: closingImage.url,
              }
            : undefined,
          label: closing?.label?.trim() || undefined,
        }}
        siteName={SITE_NAME}
      />
    </>
  )
}

/** Production never invents portfolio content. */
function UnavailableState({ configured }: { configured: boolean }) {
  return (
    <main className="site-shell" id="top" tabIndex={-1}>
      <section className="content-preview setup-state">
        <div className="content-preview__inner">
          <p className="utility-label">
            {configured ? 'Content connection unavailable' : 'Architecture website foundation'}
          </p>
          <h1>
            {configured
              ? 'Check the Neon database connection and run the Payload migration.'
              : 'The public experience will appear here once the CMS is connected.'}
          </h1>
          <p className="lede">
            The application is ready; it needs the environment variables in .env.example and an
            initialized database before it can load studio content.
          </p>
        </div>
      </section>
    </main>
  )
}
