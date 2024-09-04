const spacing: Spacing = {
  'auto': {
    cmsLabel: 'Automatisch',
  },
  'none': {
    cmsLabel: 'Kein Abstand',
    classes: '!mt-0',
  },
  'paragraph': {
    cmsLabel: 'paragraph',
    classes: '!mt-em',
  },
  'xs': {
    cmsLabel: 'xs',
    classes: 'mt-5',
  },
  'sm': {
    cmsLabel: 'sm',
    classes: 'mt-10',
  },
  'md': {
    cmsLabel: 'md',
    classes: 'mt-20',
  },
  'lg': {
    cmsLabel: 'lg',
    classes: 'mt-32',
  },
  'xl': {
    cmsLabel: 'xl',
    classes: 'mt-44',
  },
}

type Spacing = {
  [key in string]: {
    cmsLabel: string
    classes?: string
  }
}

export type SpacingKey = keyof typeof spacing

export const addSpacing = (spacingKey: SpacingKey, defaultSpacing = '') => {
  return spacing[spacingKey]?.classes ?? spacing[defaultSpacing]?.classes
}
