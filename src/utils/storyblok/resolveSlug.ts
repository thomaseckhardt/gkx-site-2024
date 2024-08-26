const isProduction = process.env.PROD

export const resolveFullSlug = (fullSlug: string) => {
  if (!isProduction) return '/' + fullSlug
  // fullSlug is something like
  // "sites/de/projekte/weitere-unterseite"
  // "en/sites/de/projects/another-subpage"

  const slugIndex = fullSlug.startsWith('sites/') ? 2 : 3
  const slug = fullSlug.split('/').slice(slugIndex).join('/')
  return '/' + slug
}
