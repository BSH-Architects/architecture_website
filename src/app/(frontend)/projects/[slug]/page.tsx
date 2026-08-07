import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { cmsIsConfigured, getPublishedProject, mediaData } from '@/lib/cms'

export const dynamic = 'force-dynamic'

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!cmsIsConfigured) {
    notFound()
  }

  const { slug } = await params
  const project = await getPublishedProject(slug)

  if (!project) {
    notFound()
  }

  const image = mediaData(project.coverImage)

  return (
    <main className="site-shell">
      <article className="content-preview project-detail">
        <div className="content-preview__inner">
          <Link className="back-link" href="/">
            Back to work
          </Link>
          <p className="utility-label">{project.layout || 'Project'}</p>
          <h1>{project.title}</h1>
          {(project.location || project.year) && (
            <p className="lede">{[project.location, project.year].filter(Boolean).join(' · ')}</p>
          )}
          {image?.url && (
            <div className="project-detail__image">
              <Image
                alt={image.alt || ''}
                fill
                priority
                sizes="(max-width: 1152px) 100vw, 1152px"
                src={image.url}
                unoptimized
              />
            </div>
          )}
          <p className="template-note">
            This is the content preview. The selected {project.layout || 'project'} template and its reusable
            sections are available in Payload, ready for the final site design.
          </p>
        </div>
      </article>
    </main>
  )
}
