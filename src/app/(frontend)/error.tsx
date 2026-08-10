'use client'

import Link from 'next/link'

import styles from './error-state.module.css'

export default function FrontendError({ retry }: { retry: () => void }) {
  return (
    <main className={`site-shell ${styles.page}`} id="top" tabIndex={-1}>
      <section aria-labelledby="error-heading" className={styles.state}>
        <h1 id="error-heading">The page could not be loaded.</h1>
        <div className={styles.support}>
          <p>
            The content connection was interrupted. Try the request again; if it still fails,
            return to the homepage and continue from there.
          </p>
          <div className={styles.actions}>
            <button onClick={retry} type="button">
              Try again
            </button>
            <Link href="/">Return home</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
