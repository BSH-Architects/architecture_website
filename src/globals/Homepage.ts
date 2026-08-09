import type { GlobalConfig } from 'payload'

import { authenticated } from '../access'
import { peopleSectionDefaults, positionSectionDefaults } from '../content/homepageDefaults'

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
      name: 'position',
      type: 'group',
      label: 'Position section',
      admin: {
        description:
          'Controls the image and statement directly below the homepage hero. This image is independent from the hero and project images.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Portrait-oriented or crop-safe architectural imagery works best here.',
          },
        },
        {
          name: 'heading',
          type: 'textarea',
          required: true,
          defaultValue: positionSectionDefaults.heading,
          admin: {
            description: 'Use line breaks to control the three-line editorial heading.',
            rows: 3,
          },
        },
        {
          name: 'descriptionPrimary',
          type: 'textarea',
          required: true,
          label: 'Description — first paragraph',
          defaultValue: positionSectionDefaults.descriptionPrimary,
          admin: { rows: 3 },
        },
        {
          name: 'descriptionSecondary',
          type: 'textarea',
          required: true,
          label: 'Description — second paragraph',
          defaultValue: positionSectionDefaults.descriptionSecondary,
          admin: { rows: 4 },
        },
      ],
    },
    {
      name: 'people',
      type: 'group',
      label: 'People section',
      admin: {
        description:
          'Controls every line of copy and both portraits in the homepage People section. The two-person layout remains fixed.',
      },
      fields: [
        {
          name: 'sectionLabel',
          type: 'text',
          required: true,
          label: 'Section label',
          defaultValue: peopleSectionDefaults.sectionLabel,
        },
        {
          name: 'sectionSummary',
          type: 'text',
          required: true,
          label: 'Section summary',
          defaultValue: peopleSectionDefaults.sectionSummary,
        },
        {
          name: 'heading',
          type: 'textarea',
          required: true,
          defaultValue: peopleSectionDefaults.heading,
          admin: { rows: 2 },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          defaultValue: peopleSectionDefaults.description,
          admin: { rows: 3 },
        },
        {
          name: 'personOne',
          type: 'group',
          label: 'First person',
          admin: {
            description: 'Appears as the lower portrait on the left at desktop widths.',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Use a portrait-oriented or crop-safe image.',
              },
            },
            {
              name: 'name',
              type: 'text',
              required: true,
              defaultValue: peopleSectionDefaults.personOne.name,
            },
            {
              name: 'role',
              type: 'text',
              required: true,
              defaultValue: peopleSectionDefaults.personOne.role,
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              label: 'Description / focus',
              defaultValue: peopleSectionDefaults.personOne.description,
              admin: { rows: 2 },
            },
          ],
        },
        {
          name: 'personTwo',
          type: 'group',
          label: 'Second person',
          admin: {
            description: 'Appears as the upper portrait on the right at desktop widths.',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Use a portrait-oriented or crop-safe image.',
              },
            },
            {
              name: 'name',
              type: 'text',
              required: true,
              defaultValue: peopleSectionDefaults.personTwo.name,
            },
            {
              name: 'role',
              type: 'text',
              required: true,
              defaultValue: peopleSectionDefaults.personTwo.role,
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              label: 'Description / focus',
              defaultValue: peopleSectionDefaults.personTwo.description,
              admin: { rows: 2 },
            },
          ],
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
