import type { MultilinkStoryblok } from '@/types/storyblok'
import type { ISbStoriesParams, ISbStoryData } from '@storyblok/astro'
import { useStoryblokApi } from '@storyblok/astro'
import type { StoryblokLink } from './types'

// Fetches stories from the Storyblok API.
// https://www.storyblok.com/docs/api/content-delivery/v2#core-resources/stories/retrieve-multiple-stories
export async function fetchStories(
  query: ISbStoriesParams = {},
): Promise<ISbStoryData[] | undefined> {
  const storyblokApi = useStoryblokApi()
  const storyblokEntryVersion =
    import.meta.env.PUBLIC_STORYBLOK_VERSION ?? 'published'

  try {
    const finalQuery = {
      version: storyblokEntryVersion,
      resolve_links: 'url' as const,
      ...query,
    }
    let stories: ISbStoryData[] = []
    if (query.per_page) {
      const result = await storyblokApi.get('cdn/stories', finalQuery)
      stories = result.data.stories
    } else {
      stories = await storyblokApi.getAll('cdn/stories', finalQuery)
    }

    return stories ?? []
  } catch (error) {
    console.error(JSON.stringify(error))
    // return error as ISbError
  }
}

// Fetch a single story from Storyblok
// https://www.storyblok.com/docs/api/content-delivery/v2#core-resources/stories/retrieve-one-story
export async function fetchStory(
  slug: string,
  query = {},
): Promise<ISbStoryData | undefined> {
  const storyblokApi = useStoryblokApi()
  const storyblokEntryVersion =
    import.meta.env.PUBLIC_STORYBLOK_VERSION ?? 'published'

  try {
    const response = await storyblokApi.getStory(slug, {
      version: storyblokEntryVersion,
      resolve_links: 'url' as const,
      ...query,
    })
    return response.data.story
  } catch (error) {
    console.error(error)
  }
}

export async function fetchTags(query = {}): Promise<string[] | undefined> {
  const storyblokApi = useStoryblokApi()
  const storyblokEntryVersion =
    import.meta.env.PUBLIC_STORYBLOK_VERSION ?? 'published'

  try {
    const { data } = await storyblokApi.get('cdn/tags/', {
      version: storyblokEntryVersion,
      ...query,
    })
    return data?.tags ?? []
  } catch (error) {
    console.error(error)
    // return error as ISbError
  }
}

// Retrieve Multiple Links
// https://www.storyblok.com/docs/api/content-delivery/v2#core-resources/links/retrieve-multiple-links
type FetchLinksQuery = {
  starts_with?: string
  version?: 'draft' | 'published'
  paginated?: undefined | 1
  per_page?: number
  page?: number
  with_parent?: number
}
export async function fetchLinks(
  query: FetchLinksQuery = {},
): Promise<StoryblokLink[]> {
  const storyblokApi = useStoryblokApi()
  const storyblokEntryVersion =
    import.meta.env.PUBLIC_STORYBLOK_VERSION ?? 'published'

  // TODO: Add pagination to load all links
  try {
    const { data } = await storyblokApi.get('cdn/links/', {
      version: storyblokEntryVersion,
      // per_page: 1000,
      paginated: 0,
      ...query,
    })
    return typeof data?.links === 'object' ? Object.values(data.links) : []
  } catch (error) {
    console.error(error)
  }

  return []
}

export async function fetchAllLinks(
  query: FetchLinksQuery = {},
): Promise<StoryblokLink[]> {
  const storyblokApi = useStoryblokApi()
  const storyblokEntryVersion =
    import.meta.env.PUBLIC_STORYBLOK_VERSION ?? 'published'

  try {
    const links = await storyblokApi.getAll('cdn/links', {
      version: storyblokEntryVersion,
      ...query,
    })
    return links
  } catch (error) {
    console.error(error)
  }

  return []
}

export async function fetchFolders(query = {}): Promise<MultilinkStoryblok[]> {
  const links = await fetchLinks({ ...query })
  if (!links) return []
  const folders = links.filter(
    (link: MultilinkStoryblok) => link?.is_folder,
  ) as MultilinkStoryblok[]
  return folders
}

export async function fetchPostCategories() {
  try {
    const linksFoldersWithPosts = await fetchFolders({
      'starts_with': 'posts/',
    })
    const categories = linksFoldersWithPosts.map((link) => {
      return {
        name: link.name,
        fullSlug: link.slug,
        search: `${link.slug}/*`,
        slug: link.slug.replace(/posts\//, ''),
      }
    })

    return categories
  } catch (error) {
    console.error(error)
  }
}
