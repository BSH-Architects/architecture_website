import type { CollectionConfig } from 'payload'

import {
  administrators,
  administratorsField,
  administratorsOrSelf,
} from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: administrators,
    delete: administrators,
    read: administratorsOrSelf,
    update: administratorsOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role', 'updatedAt'],
    useAsTitle: 'email',
  },
  auth: true,
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        if (operation === 'create' && !req.user) {
          return { ...data, role: 'admin' }
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      access: {
        create: administratorsField,
        update: administratorsField,
      },
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
    },
  ],
}
