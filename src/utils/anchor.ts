import { slugify } from './slug'

type AnchorLink = {
  id: string
  href: string
  label: string
}

export const getAnchor = (anchor: string = ''): AnchorLink => {
  const id = slugify(anchor) ?? ''
  const href = `#${id}`
  const label = anchor

  return { id, href, label }
}

export const slugifyAnchorName = (str: string | undefined) => {
  return slugify(str)
}
