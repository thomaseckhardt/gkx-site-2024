import clsx, { type ClassValue } from 'clsx'

export type JustifyType =
  | 'start'
  | 'end'
  | 'center'
  | 'between'
  | 'around'
  | 'evenly'

export const JustifyClasses = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

export const addJustify = (justify: JustifyType) => {
  return JustifyClasses[justify]
}

const cssPositions = [
  'static',
  'relative',
  'absolute',
  'fixed',
  'sticky',
] as const

export type CssPosition = (typeof cssPositions)[number]

export const getPositionIfNotExists = (
  className: string = '',
  position: CssPosition,
) => {
  return cssPositions.some((position) => className.includes(position))
    ? undefined
    : (position as ClassValue)
}

export const addPositionIfNotExists = (
  className: string,
  position: CssPosition,
) => {
  return clsx(getPositionIfNotExists(className, position))
}
