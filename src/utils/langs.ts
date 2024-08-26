export const defaultLanguage = import.meta.env.PUBLIC_DEFAULT_LANGUAGE || 'de'
export const languages = import.meta.env.PUBLIC_LANGUAGES?.split(',') || [
  defaultLanguage,
]

// export const getTransLink = (language, slug) => {
//   return language === defaultLanguage ? slug : `/${language}${slug}`
// }
