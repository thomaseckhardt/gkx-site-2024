import type { AssetStoryblok } from '@/types/storyblok'

const AspectRatioSeparators = ['x', ':', '/']
const findSeparator = (str: string) => {
  if (!str) return
  str = str.trim()
  return AspectRatioSeparators.find((sep) => str.includes(sep))
}

export const getAspectRatioFromString = (str: string = '') => {
  const separator = findSeparator(str)
  if (!separator) return

  const [width, height] = str.split(separator)
  const aspect = parseFloat(width) / parseFloat(height)

  if (Number.isNaN(aspect)) return
  return aspect
}

export const isVideo = (asset: AssetStoryblok) => {
  return (
    asset?.filename?.endsWith('mp4') ||
    asset?.src?.endsWith('mp4') ||
    asset?.filename?.endsWith('mov') ||
    asset?.src?.endsWith('mov')
  )
}

export const isImageUrl = (url: string) => {
  return (
    url.endsWith('.jpg') ||
    url.endsWith('.jpeg') ||
    url.endsWith('.png') ||
    url.endsWith('.gif') ||
    url.endsWith('.webp') ||
    url.endsWith('.avif') ||
    url.endsWith('.svg')
  )
}
