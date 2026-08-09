export const positionSectionDefaults = {
  heading:
    'Architecture begins with what\nis already there and makes room\nfor what comes next.',
  descriptionPrimary:
    'We start with climate, terrain, movement, views, and the routines that give a place its character.',
  descriptionSecondary:
    'Plans are reduced until structure, material, and daily use read as one clear idea. The result is quiet by design: spaces shaped by proportion, daylight, and the way they are lived in.',
} as const

export const peopleSectionDefaults = {
  sectionLabel: 'Studio / People',
  sectionSummary: 'Two founders · One practice',
  heading: 'The practice is a conversation.',
  description:
    'Two independent ways of seeing, held together by a shared commitment to clarity, material, and the life of each place.',
  personOne: {
    name: 'Person one',
    role: 'Co-founder',
    description: 'Architecture / Design direction',
    imageSrc: '/api/media/file/studio-person-one.jpg',
    imageAlt: 'Temporary editorial portrait for the first founder',
  },
  personTwo: {
    name: 'Person two',
    role: 'Co-founder',
    description: 'Architecture / Practice direction',
    imageSrc: '/api/media/file/studio-person-two.jpg',
    imageAlt: 'Temporary editorial portrait for the second founder',
  },
} as const

export const closingSectionDefaults = {
  heading: 'Made to hold the\nlife that follows.',
  label: 'Architecture / Interiors / Landscape',
  imageSrc: '/api/media/file/residence-landscape-closing.jpg',
  imageAlt: 'Bright contemporary residence framed by white concrete and open sky',
} as const
