import type { MultilinkStoryblok } from '@/types/storyblok'
import { normalizePath } from './url'

export type Link = MultilinkStoryblok

type LinkAttrs = {
  as?: string
  type?: string
  href?: string
  target?: string
  rel?: string
  title?: string
  [k: string]: string | undefined
}

export const getLinkUrl = (link: Link) => {
  return typeof link === 'string'
    ? link
    : link?.story?.full_slug ||
        link?.story?.url ||
        link?.url ||
        link?.cached_url ||
        link?.href
}

export const checkExternalUrl = (url: string) => {
  return /^https?:\/\//.test(url)
}

export const checkAssetUrl = (url: string) => {
  return /^https:\/\/a.storyblok.com/.test(url)
}

export const checkAssetLink = (link: Link) => {
  if (typeof link === 'string') {
    return checkAssetUrl(link)
  }
  return link.linktype === 'asset'
}

export const checkMailUrl = (url: string) => {
  return /^mailto:/.test(url)
}

export const checkMailLink = (link: Link | string) => {
  if (typeof link === 'string') {
    return checkMailUrl(link)
  }
  return link.linktype === 'email' || checkMailUrl(getLinkUrl(link))
}

export const checkStoryLink = (link: Link | string) => {
  if (typeof link === 'string') {
    return false
  }
  return link?.linktype === 'story'
}

export const checkExternalLink = (link: Link | string) => {
  if (typeof link === 'string') {
    return checkExternalUrl(link)
  }
  return (
    checkExternalUrl(getLinkUrl(link)) &&
    (!link.linktype || link.linktype === 'url')
  )
}

export const applyLinkAttrs = (
  linkOrUrl: Link | string | undefined,
): LinkAttrs | undefined => {
  // Heads up: `resolve_links: 'url'
  // @see https://www.storyblok.com/docs/guide/in-depth/rendering-the-link-field

  if (!linkOrUrl) return undefined

  const link = linkOrUrl as Link

  if (link.linktype === 'story') {
    if (link.story?.full_slug?.includes('contact-form-presets')) {
      return {
        'as': ' button',
        'type': 'button',
        'x-data': '',
        'x-on:click': '$store.ui.toggleContact(true)',
      }
    }
  }

  if (
    linkOrUrl === undefined ||
    linkOrUrl === null ||
    linkOrUrl === '' ||
    (link.linktype === 'story' && link.id === '') ||
    (link.linktype === 'url' && link.cached_url === '' && link.url === '')
  ) {
    return {}
  }

  if (link?.anchor === '') delete link.anchor
  if (link?.rel === '') delete link.rel
  if (link?.title === '') delete link.title

  const isStory = checkStoryLink(link)
  const isExternal = checkExternalLink(link)
  const isAsset = checkAssetLink(link)
  const isMail = checkMailLink(link)
  const isInternal =
    typeof linkOrUrl === 'string' && !isExternal && !isMail && !isAsset

  let url = typeof linkOrUrl === 'string' ? linkOrUrl : getLinkUrl(link)

  if (isStory || isInternal) {
    url = normalizePath(url)
    if (link?.anchor && typeof link?.anchor === 'string') {
      url += `#${link.anchor}`
    }
  }
  if (isMail) {
    url = `mailto:${link.href || link.url || link.story?.email || url}`
  }

  let attrs: LinkAttrs = {
    href: url,
    ...(link.target ? { target: link.target } : {}),
  }

  if (isExternal || isAsset) {
    attrs['target'] = attrs.target ?? '_blank'
    // Note:
    // - We filter all Storyblok specific attributes to get only the custom ones added by the editor
    // - This attribute `id` is a reserved name by Storyblok
    const {
      id,
      url,
      linktype,
      fieldtype,
      cached_url,
      story,
      title,
      rel,
      ...customLinkAttrs
    } = link

    attrs = {
      ...attrs,
      // Double check because Storyblok passes `rel` and `title` as blank strings by default
      rel: rel !== '' ? (rel as string) : undefined,
      title: title !== '' ? (title as string) : undefined,
      ...customLinkAttrs,
    }
  }

  if (attrs.target === '_blank') {
    attrs['rel'] = attrs.rel ?? 'noopener noreferrer'
  }

  if (!attrs.as) {
    attrs['as'] = 'a'
  }

  return attrs
}
