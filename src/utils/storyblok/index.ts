import type { SbBlokData } from '@storyblok/astro'
import { storyblokEditable } from '@storyblok/astro'

export * from './asset.js'
export * from './date'
export * from './fetchStories'
export * from './readingTime'
export * from './richtext'
export * from './storyblokEditable'

export const storyblokComponentProps = (blok: SbBlokData) => {
  return storyblokEditable(blok)
  // const devProps = blok._editable
  //   ? { 'data-component': blok?.component }
  //   : undefined

  // return {
  //   ...storyblokEditable(blok),
  //   ...devProps,
  // }
}
