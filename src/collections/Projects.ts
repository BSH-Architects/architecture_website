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
    defaultColumns: ['title', '_status', 'status', 'year', 'updatedAt'],
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
        description: 'Classifies the project presentation for future template variations.',
      },
    },
    {
      name: 'status',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'For example: Completed, In development, or Competition.',
      },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'year',
      type: 'number',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'scope',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'For example: Architecture / Interiors / Landscape.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'The shared project summary. It appears in Our Work and at the beginning of the project page.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Primary / cover image',
      admin: {
        description: 'Used as the large Our Work image and the project-page cover.',
      },
    },
    {
      name: 'archiveDetailImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Our Work detail image',
      admin: {
        description: 'The second image shown beside this project in the Our Work archive.',
      },
    },
    {
      name: 'closingImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Project-page closing image',
      admin: {
        description: 'Optional. The primary image is reused when this is empty.',
      },
    },
    {
      name: 'intro',
      type: 'richText',
      label: 'Additional introduction',
      admin: {
        description:
          'Optional longer copy shown after the shared description on the project page only.',
      },
    },
    {
      name: 'sections',
      type: 'blocks',
      blocks: [ProjectHero, TextImage, ImageGallery],
      admin: {
        description: 'Add and reorder the project-page narrative, images, and galleries.',
      },
    },
  ],
}
