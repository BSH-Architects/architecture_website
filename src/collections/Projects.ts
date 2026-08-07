import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access'
import { ImageGallery, ProjectHero, TextImage } from '../blocks/ProjectBlocks'
import { populateSlug } from '../hooks/populateSlug'

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: publishedOrAuthenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', '_status', 'layout', 'updatedAt'],
    group: 'Content',
    useAsTitle: 'title',
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [populateSlug],
      },
      admin: {
        position: 'sidebar',
        description: 'Generated from the title; edit it only when the public URL must differ.',
      },
    },
    {
      name: 'layout',
      type: 'select',
      required: true,
      defaultValue: 'editorial',
      options: [
        { label: 'Editorial', value: 'editorial' },
        { label: 'Gallery-led', value: 'gallery' },
        { label: 'Technical detail', value: 'technical' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Select the presentation template before adding sections.',
      },
    },
    { name: 'location', type: 'text', admin: { position: 'sidebar' } },
    { name: 'year', type: 'number', admin: { position: 'sidebar' } },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    { name: 'intro', type: 'richText' },
    {
      name: 'sections',
      type: 'blocks',
      blocks: [ProjectHero, TextImage, ImageGallery],
    },
  ],
}
