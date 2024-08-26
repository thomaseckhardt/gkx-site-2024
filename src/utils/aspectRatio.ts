const classes = {
  '': '',

  '2/5': 'aspect-2/5',
  '9/21': 'aspect-9/21',
  '1/2': 'aspect-1/2',
  '9/16': 'aspect-9/16',
  '2/3': 'aspect-2/3',
  '3/4': 'aspect-3/4',

  '1/1': 'aspect-1/1',

  '4/3': 'aspect-4/3',
  '3/2': 'aspect-3/2',
  '16/9': 'aspect-16/9',
  '2/1': 'aspect-2/1',
  '21/9': 'aspect-21/9',
  '5/2': 'aspect-5/2',
}

export type AspectRatio = keyof typeof classes

export const getAspectRatio = (aspectRatio?: AspectRatio) => {
  return classes[aspectRatio ?? '1/1'] ?? classes['1/1']
}
