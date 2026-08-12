import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

import { chooseAdminRecoveryAction, validateRecoveryCredentials } from './lib/admin-recovery'

const recoveryEmail = process.env.CMS_RECOVERY_EMAIL ?? ''
const recoveryPassword = process.env.CMS_RECOVERY_PASSWORD ?? ''
const recoveryName = process.env.CMS_RECOVERY_NAME?.trim()
const requestedAdminID = process.env.CMS_RECOVERY_ADMIN_ID?.trim()

delete process.env.CMS_RECOVERY_PASSWORD

async function recoverAdministrator() {
  const credentials = validateRecoveryCredentials(recoveryEmail, recoveryPassword)
  let payload: Payload | undefined

  try {
    payload = await getPayload({ config })

    if (requestedAdminID) {
      const requestedAdministrator = await payload.findByID({
        collection: 'users',
        id: requestedAdminID,
        depth: 0,
        overrideAccess: true,
      })

      if (requestedAdministrator.role !== 'admin') {
        throw new Error('CMS_RECOVERY_ADMIN_ID must identify an existing administrator.')
      }

      await payload.update({
        collection: 'users',
        id: requestedAdministrator.id,
        data: {
          email: credentials.email,
          password: credentials.password,
          ...(recoveryName ? { name: recoveryName } : {}),
        },
        depth: 0,
        overrideAccess: true,
      })

      console.log(`Recovered administrator ${requestedAdministrator.id} as ${credentials.email}.`)
      return
    }

    const administrators = await payload.find({
      collection: 'users',
      depth: 0,
      limit: 2,
      overrideAccess: true,
      where: { role: { equals: 'admin' } },
    })
    const action = chooseAdminRecoveryAction(administrators.docs, administrators.totalDocs)

    if (action.kind === 'update') {
      await payload.update({
        collection: 'users',
        id: action.id,
        data: {
          email: credentials.email,
          password: credentials.password,
          ...(recoveryName ? { name: recoveryName } : {}),
        },
        depth: 0,
        overrideAccess: true,
      })

      console.log(`Recovered the administrator account as ${credentials.email}.`)
      return
    }

    await payload.create({
      collection: 'users',
      data: {
        email: credentials.email,
        name: recoveryName || 'Studio Administrator',
        password: credentials.password,
        role: 'admin',
      },
      depth: 0,
      overrideAccess: true,
    })

    console.log(`Created the administrator account ${credentials.email}.`)
  } finally {
    await payload?.destroy()
  }
}

try {
  await recoverAdministrator()
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  throw new Error(`Administrator recovery failed: ${message}`)
}
