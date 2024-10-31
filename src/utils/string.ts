export const isNotEmpty = (str: string) => typeof str === 'string' && str !== ''

export const getDefinedString = (str: string, defaultStr: string = '') =>
  isNotEmpty(str) ? str : defaultStr
