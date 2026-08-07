import type { Access, FieldAccess, PayloadRequest } from 'payload'

type StudioUser = {
  id: number | string
  role?: 'admin' | 'editor' | null
}

const getUser = (req: PayloadRequest) => req.user as StudioUser | null

export const authenticated: Access = ({ req }) => Boolean(getUser(req))

export const administrators: Access = ({ req }) => getUser(req)?.role === 'admin'

export const administratorsOrSelf: Access = ({ req }) => {
  const user = getUser(req)

  if (!user) return false
  if (user.role === 'admin') return true

  return { id: { equals: user.id } }
}

export const administratorsField: FieldAccess = ({ req }) =>
  getUser(req)?.role === 'admin'

export const publishedOrAuthenticated: Access = ({ req }) =>
  getUser(req) ? true : { _status: { equals: 'published' } }
