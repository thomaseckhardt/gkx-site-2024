import { calcReadingTime } from '../readingTime'
import {
  isRichTextField,
  renderRichText,
  richTextToPlainText,
} from './richtext'

const fields = ['richtext', 'heading', 'overline', 'subheading', 'text']

export const storyRichTextReadingTime = (richtext: string | JSON) => {
  const plainText =
    typeof richtext === 'string'
      ? richtext
      : richTextToPlainText(renderRichText(richtext))
  return calcReadingTime(plainText)
}

export const calcStoryReadingTime = (content = []) => {
  const minutes = content.reduce((minutes, blok) => {
    Object.entries(blok).forEach(([key, value]) => {
      if (fields.includes(key)) {
        if (typeof value === 'string') {
          minutes += calcReadingTime(value)
        }
        if (isRichTextField(value)) {
          minutes += storyRichTextReadingTime(value as JSON)
        }
      }
    })

    return minutes
  }, 0)

  return minutes
}
