export const pullZoneID = import.meta.env.PUBLIC_BUNNY_PULL_ZONE_ID
export const videoLibraryID = import.meta.env.PUBLIC_BUNNY_VIDEO_LIBRARY_ID
export const baseUrl = 'https://iframe.mediadelivery.net/embed'
export const pullZoneUrl = `https://${pullZoneID}.b-cdn.net`

// Bunny Embed Video Options
// @see https://docs.bunny.net/docs/stream-embedding-videos
type VideoPlayerOptions = {
  autoplay?: boolean
  preload?: boolean
  responsive?: boolean
  chromecast?: boolean
  disableAirplay?: boolean
  disableIosPlayer?: boolean
  showHeatmap?: boolean
  muted?: boolean
  loop?: boolean
  playsinline?: boolean
  showSpeed?: boolean
}

type VideoResolution = 360 | 480 | 720 | 1080 | 1440 | 2160

export function getVideoUrl(videoID: string) {
  return `${baseUrl}/${videoLibraryID}/${videoID}`
}

export function getVideoPlayerUrl(
  videoID: string | undefined,
  options: VideoPlayerOptions = {},
) {
  if (!videoID) return undefined

  const params = Object.entries(options)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  const url = `${baseUrl}/${videoLibraryID}/${videoID}?${params}`
  return url
}

export function getThumbnailUrl(videoID: string | undefined) {
  if (!videoID) return undefined

  const url = `${pullZoneUrl}/${videoID}/thumbnail.jpg`
  return url
}

export function getMP4(
  videoID: string | undefined,
  resolution: VideoResolution = 720,
) {
  if (!videoID) return undefined

  const resolutionHeight = resolution
  const url = `${pullZoneUrl}/${videoID}/play_${resolutionHeight}p.mp4`

  return url
}
