import { renderRichText as sbRenderRichText } from '@storyblok/astro'
import uniqBy from 'lodash/uniqBy'
import type { RichtextStoryblok } from '@/types/storyblok'

const richTextFieldNames = ['richtext', 'text', 'content']

export const renderRichText = (richtext) => {
  return sbRenderRichText(richtext)
}

export const richTextToPlainText = (html) => {
  return html.replace(/<[^>]+>/g, '')
}

export const isRichTextField = (field) => {
  if (field?.type !== 'doc') return false
  if (!field?.content?.length) return false
  if (field?.content?.length === 1 && !field?.content?.[0]?.content)
    return false

  return true
}

export const filterRichTextFields = (bloks = []): RichtextStoryblok[] => {
  const richTextFields = bloks.reduce((all, blok) => {
    Object.entries(blok).forEach(([key, value]) => {
      if (richTextFieldNames.includes(key))
        if (isRichTextField(value)) {
          all.push(value as RichtextStoryblok) // Type assertion added here
        }
    })
    return all
  }, [] as RichtextStoryblok[])

  return richTextFields
}

export const filterHeadings = (bloks = []) => {
  const richTextFields = filterRichTextFields(bloks)
  const content = richTextFields.reduce((all, blok) => {
    return all.concat(blok.content as RichtextStoryblok[])
  }, [] as RichtextStoryblok[])
  const headings = content.filter((blok) => blok.type === 'heading')
  return headings
}

export const filterLinks = (richtext: RichtextStoryblok) => {
  const traverse = (obj, collection: any[] = []) => {
    Object.entries(obj).forEach(([k, v]) => {
      if (k === 'marks' && Array.isArray(v)) {
        collection = [
          ...collection,
          ...v.filter((mark) => mark.type === 'link').map((link) => link.attrs),
        ]
      }
      if (v && typeof v === 'object') {
        collection = traverse(v, collection)
      }
    })
    return collection
  }
  const foundLinks = traverse(richtext)

  const uniqueLinks = uniqBy(foundLinks, (link) => link.href)
  return uniqueLinks
}
