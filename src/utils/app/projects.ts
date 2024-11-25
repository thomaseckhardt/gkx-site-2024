import { fetchStories } from '../storyblok/fetchStories'

export const loadNextProjects = async (story) => {
  const filterDate =
    story.content.date ??
    story.sort_by_date ??
    story.published_at ??
    story.created_at
  const nextStoryQuery = {
    'per_page': 1,
    'sort_by': 'content.date:asc',
    'filter_query': {
      'date': {
        'gt_date': filterDate,
      },
    },
  }
  const nextStories = await fetchStories(nextStoryQuery)
  if (nextStories && nextStories.length >= 1) {
    return nextStories[0]
  }

  const firstStoryQuery = {
    'per_page': 1,
    'sort_by': 'content.date:desc',
  }
  const firstStories = await fetchStories(firstStoryQuery)
  if (firstStories && firstStories.length > 0) {
    return firstStories[0]
  }

  return undefined
}
