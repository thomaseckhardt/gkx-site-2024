import isString from 'lodash/isString'

export const getAssetBasename = (url, extension) => {
  if (!isString(url)) return url
  const basename = url.substring(url.lastIndexOf('/') + 1)
  const dotExtension =
    extension && !extension.startsWith('.') ? `.${extension}` : extension
  const filename = dotExtension ? basename.replace(dotExtension, '') : basename
  return filename
}

export const getExtension = (url, { withoutDot }) => {
  if (typeof url !== 'string') return
  let ext = url.toLowerCase().substring(url.lastIndexOf('.') + 1)
  if (!withoutDot) ext = '.' + ext

  ext = ext.replace(/jpeg/, 'jpg')

  return ext
}

export const getAssetExtension = (asset, { withoutDot = false }) => {
  if (!asset.filename) return

  return getExtension(asset.filename, { withoutDot })
}

export const getAssetDimensionsFromFilename = (filename) => {
  if (!filename) return {}

  const urlSegments = filename.split('/')
  const dimensionsUrlSegment = urlSegments.length >= 5 ? urlSegments[5] : '0x0'
  const [width, height] = dimensionsUrlSegment.split('x')
  const fromFilename = {
    width: parseInt(width),
    height: parseInt(height),
    aspectRatio: width / height,
    aspectRatioInverse: height / width,
  }

  return {
    fromFilename,
    width: fromFilename.width,
    height: fromFilename.height,
    aspectRatio: fromFilename.aspectRatio,
    aspectRatioInverse: fromFilename.aspectRatioInverse,
  }
}

export const getAsseWidthFromFilename = (filename) => {
  const { width } = getAssetDimensionsFromFilename(filename)
  return width
}

export const getAsseHeightFromFilename = (filename) => {
  const { height } = getAssetDimensionsFromFilename(filename)
  return height
}

export const getAssetDimensions = (asset) => {
  if (!asset?.filename) return undefined

  const fromFilename = getAssetDimensionsFromFilename(asset?.filename)
  const metaWidth = parseInt(asset?.meta_data?.width)
  const metaHeight = parseInt(asset?.meta_data?.height)
  const fromMeta =
    isNaN(metaWidth) || isNaN(metaHeight)
      ? {}
      : {
          width: metaWidth,
          height: metaHeight,
          aspectRatio: metaWidth / metaHeight,
          aspectRatioInverse: metaHeight / metaWidth,
        }

  const consolidated = {
    ...fromFilename,
    ...fromMeta,
    fromMeta,
  }
  return consolidated
}

export const checkStoryblokImage = (imageObj) => {
  if (typeof imageObj !== 'object') return false
  return imageObj?.filename?.includes('https://a.storyblok.com/')
}

export const getValidImage = (image) => {
  if (image?.filename) return image
  return undefined
}
