import { cmsIsConfigured, getHomepageContent, mediaData } from '@/lib/cms'
import { heroPlaceholder, previewHeroImagePath, SITE_NAME } from '@/lib/site'

import { ClosingTransition } from './_components/ClosingTransition'
import { HeroStudyTwo } from './_components/HeroStudyTwo'
import { PeopleStudy } from './_components/PeopleStudy'
import { PositionStudy } from './_components/PositionStudy'
import { PracticeStudy } from './_components/PracticeStudy'
import { ProjectFieldStudy } from './_components/ProjectFieldStudy'
import { SiteNavigation } from './_components/SiteNavigation'

export const dynamic = 'force-dynamic'

const POSITION_ANCHOR = '#position-study'
const PROJECTS_ANCHOR = '#project-field-study'

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
  const previewImageSrc = content ? null : previewHeroImagePath()
  const heroSummary = hero?.summary || heroPlaceholder.summary
  const heroTarget = content ? PROJECTS_ANCHOR : POSITION_ANCHOR

  return (
    <>
      <main className="site-shell" id="top">
        <SiteNavigation activePage="home" />

        <HeroStudyTwo
          brand={hero?.title || SITE_NAME}
          eyebrow={hero?.eyebrow || heroPlaceholder.eyebrow}
          image={heroImage}
          indexHref={heroTarget}
          previewImageSrc={previewImageSrc}
          summary={heroSummary}
        />

        {allowPlaceholderContent && !content && (
          <PositionStudy image={heroImage} previewImageSrc={previewImageSrc} />
        )}

        {content && (
          <ProjectFieldStudy
            featuredProject={content.featuredProject}
            projects={content.projects}
          />
        )}

        {allowPlaceholderContent && !content && <PracticeStudy />}
        {allowPlaceholderContent && !content && <PeopleStudy />}
      </main>
      <ClosingTransition siteName={SITE_NAME} />
    </>
  )
}

/** Production never invents portfolio content. */
function UnavailableState({ configured }: { configured: boolean }) {
  return (
    <main className="site-shell">
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
