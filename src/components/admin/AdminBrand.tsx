const PlanMark = ({ compact = false }: { compact?: boolean }) => (
  <svg
    aria-hidden="true"
    className={compact ? 'studio-plan-mark studio-plan-mark--compact' : 'studio-plan-mark'}
    fill="none"
    viewBox="0 0 28 28"
  >
    <path d="M4.5 4.5h12v5h7v14h-12v-5h-7z" />
    <path d="M11.5 4.5v14m5-9v14m-12-10h19" />
  </svg>
)

export function StudioLogo() {
  return (
    <div aria-label="Studio content system" className="studio-admin-logo">
      <PlanMark />
      <span className="studio-admin-logo__type">
        <strong>Studio</strong>
        <small>Content system</small>
      </span>
    </div>
  )
}

export function StudioIcon() {
  return (
    <span aria-label="Studio" className="studio-admin-icon">
      <PlanMark compact />
    </span>
  )
}

export function AdminWelcome() {
  return (
    <header className="studio-admin-welcome">
      <h1>Welcome back</h1>
      <span>Manage projects, imagery, and the published portfolio.</span>
    </header>
  )
}
