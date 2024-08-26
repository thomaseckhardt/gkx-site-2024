export const storyHasContent = (story) => {
  if (!story) return false
  if (!story.content) return false

  const contentKeys = Object.keys(story?.content)
  if (contentKeys.length <= 3) return false

  return true
}
