export type AdminReference = {
  id: number | string
  role?: 'admin' | 'editor' | null
}

export type AdminRecoveryAction =
  | { kind: 'create' }
  | { id: number | string; kind: 'update' }

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateRecoveryCredentials(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()

  if (!emailPattern.test(normalizedEmail)) {
    throw new Error('CMS_RECOVERY_EMAIL must be a valid email address.')
  }

  if (password.length < 12) {
    throw new Error('CMS_RECOVERY_PASSWORD must contain at least 12 characters.')
  }

  return { email: normalizedEmail, password }
}

export function chooseAdminRecoveryAction(
  administrators: AdminReference[],
  totalAdministrators = administrators.length,
): AdminRecoveryAction {
  if (totalAdministrators === 0) return { kind: 'create' }

  if (totalAdministrators === 1 && administrators[0]) {
    return { id: administrators[0].id, kind: 'update' }
  }

  throw new Error(
    'Multiple administrators exist. Set CMS_RECOVERY_ADMIN_ID to the account that should be recovered.',
  )
}
