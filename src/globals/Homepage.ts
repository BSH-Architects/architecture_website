import type { GlobalConfig } from 'payload'

import { authenticated } from '../access'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  access: {
    read: authenticated,
    update: authenticated,
  },
  admin: {
    group: 'Content',
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', label: 'Eyebrow' },
        { name: 'title', type: 'text', required: true },
        { name: 'summary', type: 'textarea' },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'featuredProject',
      type: 'relationship',
      relationTo: 'projects',
      admin: {
        description: 'The star project shown directly after the hero.',
      },
    },
    {
      name: 'projectOrder',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      admin: {
        description:
          'Choose and drag projects into the exact order they should appear on the homepage.',
      },
    },
  ],
}
