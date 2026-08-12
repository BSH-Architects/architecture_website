import assert from 'node:assert/strict'
import test from 'node:test'

import {
  chooseAdminRecoveryAction,
  validateRecoveryCredentials,
} from './admin-recovery.ts'

test('normalizes valid recovery credentials', () => {
  assert.deepEqual(validateRecoveryCredentials(' Admin@Example.com ', 'a-secure-password'), {
    email: 'admin@example.com',
    password: 'a-secure-password',
  })
})

test('rejects invalid emails and short passwords', () => {
  assert.throws(
    () => validateRecoveryCredentials('not-an-email', 'a-secure-password'),
    /valid email address/,
  )
  assert.throws(
    () => validateRecoveryCredentials('admin@example.com', 'too-short'),
    /at least 12 characters/,
  )
})

test('creates an administrator only when none exist', () => {
  assert.deepEqual(chooseAdminRecoveryAction([], 0), { kind: 'create' })
})

test('updates the sole administrator', () => {
  assert.deepEqual(chooseAdminRecoveryAction([{ id: 42, role: 'admin' }], 1), {
    id: 42,
    kind: 'update',
  })
})

test('refuses an ambiguous administrator selection', () => {
  assert.throws(
    () =>
      chooseAdminRecoveryAction(
        [
          { id: 1, role: 'admin' },
          { id: 2, role: 'admin' },
        ],
        2,
      ),
    /CMS_RECOVERY_ADMIN_ID/,
  )
})
