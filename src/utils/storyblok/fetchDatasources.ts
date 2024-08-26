import { useStoryblokApi } from '@storyblok/astro'

type DataSourceEntry = {
  id: number
  name: string
  value: string | null
  dimension_value: string | null
}

export async function fetchDatasources() {
  const storyblokApi = useStoryblokApi()
  const storyblokEntryVersion =
    import.meta.env.PUBLIC_STORYBLOK_VERSION ?? 'published'

  try {
    const items = await storyblokApi.getAll('cdn/datasources', {
      version: storyblokEntryVersion,
    })

    return items
  } catch (error) {
    console.error(JSON.stringify(error))
    // return error as ISbError
  }
}

// Fetches stories from the Storyblok API.
// https://www.storyblok.com/docs/api/content-delivery/v2#core-resources/stories/retrieve-multiple-stories
export async function fetchDatasourceEntries(datasourceIdOrSlug, query = {}) {
  const storyblokApi = useStoryblokApi()
  const storyblokEntryVersion =
    import.meta.env.PUBLIC_STORYBLOK_VERSION ?? 'published'

  try {
    // const { data } = await storyblokApi.getStories({
    //   version: storyblokEntryVersion,
    //   ...query,
    // })
    const items = (await storyblokApi.getAll('cdn/datasource_entries', {
      version: storyblokEntryVersion,
      per_page: 1000,
      datasource: datasourceIdOrSlug,
      ...query,
    })) as DataSourceEntry[]

    const entries = items.map((entry) => ({
      ...entry,
      defaultValue: entry.value,
      value: entry.dimension_value ?? entry.value,
    }))
    // console.log('entries', entries)

    return entries
  } catch (error) {
    console.error(JSON.stringify(error))
    // return error as ISbError
  }
}
