import { useStoryblokApi } from '@storyblok/astro'
import { langs, defaultLang } from '../app/langs'

export function parseUrl(url) {
  //converting the current url to an array based on '/'
  let urlToArray = url?.split('/')
  //Setting the fallback language to be english
  //Checking if current url contains a known language
  let isKnownLang = langs.some((l) => l === urlToArray?.[0])
  //setting current language based on above
  let currentLang = url && isKnownLang ? urlToArray[0] : defaultLang
  // removing language from the url and only keeping the slug
  let slug = url
    ? isKnownLang
      ? urlToArray?.slice(1)?.join('/') || undefined
      : urlToArray?.join('/')
    : undefined

  //Same logic for generating the lang switch as we have in getStaticPaths
  let langSwitch = {}
  langs.forEach((lang) => {
    langSwitch = {
      ...langSwitch,
      [lang]:
        lang === defaultLang ? `/${slug ?? ''}` : `/${lang}/${slug ?? ''}`,
    }
  })
  //finally returning the same three variables we also get from getStaticPaths
  return { language: currentLang, slug, langSwitch }
}

type Path = {
  props: {
    language: string
    slug: string
  }
  params: {
    slug: string
  }
}

export async function generateStaticPaths() {
  const storyblokApi = useStoryblokApi()
  const links = await storyblokApi.getAll('cdn/links', {
    version: import.meta.env.PUBLIC_STORYBLOK_VERSION,
  })
  let paths: Path[] = []
  links
    .filter((link) => !link.is_folder)
    .forEach((link: { slug: string }) => {
      langs.forEach((language) => {
        //This slug will be used for fetching data from storyblok
        let slug = link.slug === 'home' ? '' : link.slug
        //This will be used for generating all the urls for astro
        let full_url =
          language === defaultLang ? slug : `${language}/${slug ?? ''}`
        paths.push({
          props: { language, slug },
          params: {
            slug: full_url,
          },
        })
      })
    })
  return paths
}
