import type { GlobalConfig } from 'payload'

import { authenticated } from '../access'
import {
  closingSectionDefaults,
  peopleSectionDefaults,
  positionSectionDefaults,
  practiceSectionDefaults,
} from '../content/homepageDefaults'

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
      name: 'practice',
      type: 'group',
      label: 'Practice section — Architecture is a frame',
      admin: {
        description:
          'Controls the background, statement, and four discipline panels. The composition, numbering, emphasis, and panel count remain fixed.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Landscape or crop-safe architectural imagery works best here.',
          },
        },
        {
          name: 'headingLineOne',
          type: 'text',
          required: true,
          maxLength: 60,
          label: 'Heading — first line',
          defaultValue: practiceSectionDefaults.headingLineOne,
        },
        {
          name: 'headingLineTwoPrefix',
          type: 'text',
          required: true,
          maxLength: 20,
          label: 'Heading — second-line prefix',
          defaultValue: practiceSectionDefaults.headingLineTwoPrefix,
        },
        {
          name: 'headingLineTwoEmphasis',
          type: 'text',
          required: true,
          maxLength: 50,
          label: 'Heading — emphasized phrase',
          defaultValue: practiceSectionDefaults.headingLineTwoEmphasis,
        },
        {
          name: 'descriptionPrimary',
          type: 'textarea',
          required: true,
          maxLength: 180,
          label: 'Manifesto — first paragraph',
          defaultValue: practiceSectionDefaults.descriptionPrimary,
          admin: { rows: 3 },
        },
        {
          name: 'descriptionSecondary',
          type: 'textarea',
          required: true,
          maxLength: 180,
          label: 'Manifesto — second paragraph',
          defaultValue: practiceSectionDefaults.descriptionSecondary,
          admin: { rows: 3 },
        },
        {
          name: 'disciplines',
          type: 'array',
          required: true,
          minRows: 4,
          maxRows: 4,
          labels: { plural: 'Disciplines', singular: 'Discipline' },
          defaultValue: practiceSectionDefaults.disciplines.map((discipline) => ({
            title: discipline.title,
            descriptionPrimary: discipline.descriptionPrimary,
            descriptionSecondary: discipline.descriptionSecondary,
          })),
          admin: {
            description:
              'Exactly four panels are required. Drag to reorder them; the visible 01–04 numbers follow this order.',
            initCollapsed: true,
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              maxLength: 50,
            },
            {
              name: 'descriptionPrimary',
              type: 'textarea',
              required: true,
              maxLength: 180,
              label: 'First paragraph',
              admin: { rows: 3 },
            },
            {
              name: 'descriptionSecondary',
              type: 'textarea',
              required: true,
              maxLength: 180,
              label: 'Second paragraph',
              admin: { rows: 3 },
            },
          ],
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
      name: 'closing',
      type: 'group',
      label: 'Closing section',
      admin: {
        description:
          'Controls the full-width image and two text values immediately below the People section. The reveal animation and layout remain fixed.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Landscape or crop-safe architectural imagery works best here.',
          },
        },
        {
          name: 'heading',
          type: 'textarea',
          required: true,
          defaultValue: closingSectionDefaults.heading,
          admin: {
            description: 'Use a line break to control the two-line heading.',
            rows: 2,
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          defaultValue: closingSectionDefaults.label,
          label: 'Category label',
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
