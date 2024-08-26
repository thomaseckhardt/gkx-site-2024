import normalize from 'normalize-url'

export const normalizeUrl = (url, options?: object) => {
  if (typeof url !== 'string') return url

  return normalize(url, options)
}

export const normalizePath = (url, options?: object) => {
  if (typeof url !== 'string') return url
  if (url === '') return '/'

  // @TODO: Not working for links with hash
  // url = normalize(url, {
  //   ...options,
  //   stripProtocol: true,
  // })

  url = addLeadingSlash(url)

  return url
}

export const addLeadingSlash = (url: string | undefined) => {
  if (typeof url !== 'string') return url
  if (url.startsWith('/') || url.startsWith('http') || url.includes('@')) {
    return url
  }
  return `/${url}`
}

export const removeLeadingSlash = (url) => {
  if (typeof url !== 'string') return url
  if (url.startsWith('/')) {
    return url.slice(1)
  }
  return url
}

export const addTrailingSlash = (url) => {
  if (typeof url !== 'string') return url
  if (url.endsWith('//')) {
    url = url.slice(0, -1)
  }
  if (
    url.endsWith('/') ||
    url.includes('?') ||
    url.includes('#') ||
    url.includes('@')
  ) {
    return url
  }
  return `${url}/`
}

export const removeTrailingSlash = (url) => {
  if (typeof url !== 'string') return url
  return url.replace(/\/+$/, '')
}
