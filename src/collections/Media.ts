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
    defaultColumns: ['filename', 'assetGroup', 'alt', 'updatedAt'],
    useAsTitle: 'filename',
  },
  upload: {
    focalPoint: true,
    staticDir: path.resolve(dirname, '../../media'),
    // Raster formats only: they are safe to transform and suitable for the public image pipeline.
    mimeTypes: ['image/avif', 'image/jpeg', 'image/png', 'image/webp'],
    imageSizes: [
      {
        name: 'card',
        width: 900,
        height: 675,
        position: 'centre',
        withoutEnlargement: true,
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
      {
        name: 'wide',
        width: 1800,
        height: 1200,
        position: 'centre',
        withoutEnlargement: true,
        formatOptions: { format: 'webp', options: { quality: 84 } },
      },
    ],
  },
  fields: [
    {
      name: 'assetGroup',
      type: 'select',
      required: true,
      defaultValue: 'website',
      options: [
        { label: 'Website', value: 'website' },
        { label: 'Project', value: 'project' },
        { label: 'Identity', value: 'identity' },
        { label: 'Editorial / press', value: 'editorial' },
        { label: 'Archive', value: 'archive' },
      ],
      admin: {
        description: 'Organizes the CMS library. It does not change the immutable B2 object key.',
      },
    },
    {
      name: 'relatedProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.assetGroup === 'project',
        description: 'Optional cross-reference for project-library images; images may be reused.',
      },
    },
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
    {
      name: 'credit',
      type: 'text',
      admin: {
        description: 'Photographer, studio, or rights attribution when needed.',
      },
    },
    {
      name: 'tags',
      type: 'array',
      labels: { plural: 'Tags', singular: 'Tag' },
      fields: [{ name: 'tag', type: 'text', required: true }],
    },
  ],
}
