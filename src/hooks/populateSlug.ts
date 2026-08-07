import type { FieldHook } from 'payload'

export function createSlug(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const populateSlug: FieldHook = ({ siblingData, value }) => {
  const source = typeof value === 'string' && value.trim() ? value : siblingData.title
  return typeof source === 'string' ? createSlug(source) : value
}
