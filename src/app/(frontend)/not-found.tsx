import type { Metadata } from 'next'
import Link from 'next/link'

import styles from './error-state.module.css'

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: 'Page not found',
}

export default function NotFound() {
  return (
    <main className={`site-shell ${styles.page}`} id="top" tabIndex={-1}>
      <section aria-labelledby="not-found-heading" className={styles.state}>
        <h1 id="not-found-heading">This page is not in the archive.</h1>
        <div className={styles.support}>
          <p>
            The address may have changed, or the project may no longer be published. Continue with
            the current project archive or return to the studio homepage.
          </p>
          <nav aria-label="Page not found recovery" className={styles.actions}>
            <Link href="/projects">View project archive</Link>
            <Link href="/">Return home</Link>
          </nav>
        </div>
      </section>
    </main>
  )
}
