import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { CollectionConfig } from 'payload'

import { authenticated } from '../access'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    useAsTitle: 'filename',
  },
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'card', width: 900, height: 675, position: 'centre' },
      { name: 'wide', width: 1800, height: 1200, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'A concise description for screen readers and image fallbacks.',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
    },
  ],
}
