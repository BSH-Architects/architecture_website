import type { Block } from 'payload'

export const ProjectHero: Block = {
  slug: 'projectHero',
  interfaceName: 'ProjectHeroBlock',
  labels: { singular: 'Project hero', plural: 'Project heroes' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'summary', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}

export const TextImage: Block = {
  slug: 'textImage',
  interfaceName: 'TextImageBlock',
  labels: { singular: 'Text and image', plural: 'Text and image sections' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'body', type: 'richText', required: true },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Image right', value: 'right' },
        { label: 'Image left', value: 'left' },
      ],
    },
  ],
}

export const ImageGallery: Block = {
  slug: 'imageGallery',
  interfaceName: 'ImageGalleryBlock',
  labels: { singular: 'Image gallery', plural: 'Image galleries' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        { name: 'caption', type: 'text' },
      ],
    },
  ],
}
