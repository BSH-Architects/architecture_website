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


export const practiceSectionDefaults = {
  imageSrc: '/api/media/file/practice-model.webp',
  headingLineOne: 'Architecture is a frame',
  headingLineTwoPrefix: 'for',
  headingLineTwoEmphasis: 'ordinary life.',
  descriptionPrimary: 'A connected practice across buildings, interiors, and landscapes.',
  descriptionSecondary: 'Each is shaped around how places are actually lived in.',
  disciplines: [
    {
      title: 'Residential',
      descriptionPrimary: 'Homes shaped around climate and daily routine.',
      descriptionSecondary: 'Designed to support long-term change.',
    },
    {
      title: 'Hospitality',
      descriptionPrimary: 'Sequence and material establish the atmosphere.',
      descriptionSecondary: 'Light carries the experience through each space.',
    },
    {
      title: 'Interiors',
      descriptionPrimary: 'Interior architecture begins with structure and proportion.',
      descriptionSecondary: 'Detail and everyday use are resolved together.',
    },
    {
      title: 'Landscape',
      descriptionPrimary: 'Built and natural systems are developed together.',
      descriptionSecondary: 'One continuous condition extends across the site.',
    },
  ],
} as const
