export const isNotEmpty = (str: string) => typeof str === 'string' && str !== ''

export const setDefinedString = (str: string, defaultStr: string) =>
  isNotEmpty(str) ? str : defaultStr
