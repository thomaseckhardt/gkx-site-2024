export const useNetlifyFunctionsUrl = (Astro) => {
  return Astro.url.origin.startsWith('http://localhost')
    ? 'http://localhost:8888'
    : Astro.url.origin
}
