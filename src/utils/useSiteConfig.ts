import type { SiteConfigurationStoryblok } from '@/types/storyblok'
import { fetchStories } from '@/utils/storyblok'

const configs = {}

export const fetchSiteConfig = async (
  language: string,
): Promise<SiteConfigurationStoryblok> => {
  const params = {
    content_type: 'SiteConfiguration',
    language,
  }
  const [sbConfigStory] = (await fetchStories(params)) ?? []
  const sbConfig = sbConfigStory?.content as SiteConfigurationStoryblok

  return {
    ...sbConfig,
  }
}

export const useSiteConfig = async (
  language,
): Promise<SiteConfigurationStoryblok> => {
  let config = configs[language]
  if (!config) {
    config = await fetchSiteConfig(language)
    if (config) {
      configs[language] = config
    }
  }

  return config
}
