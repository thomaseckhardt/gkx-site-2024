import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'
import alpine from '@astrojs/alpinejs'
import netlify from '@astrojs/netlify'
// import icon from 'astro-icon'
import storyblok from '@storyblok/astro'
import tailwind from '@astrojs/tailwind'

const env = loadEnv(process.env.NODE_ENV, process.cwd(), '')

const isPublished = env.STORYBLOK_VERSION === 'published'
const isPreview = env.PUBLIC_ENV === 'preview'
const isProduction = env.PUBLIC_ENV === 'production'
// const output = isProduction ? 'hybrid' : 'server'
const output = 'server'
const storyblokBridge = !isPublished

// https://astro.build/config
export default defineConfig({
  site: env.SITE_URL,
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
  integrations: [
    storyblok({
      accessToken: env.STORYBLOK_TOKEN,
      // Using the Storyblok Bridge
      // https://github.com/storyblok/storyblok-astro?tab=readme-ov-file#using-the-storyblok-bridge
      bridge: storyblokBridge
        ? {
          preventClicks: true,
        }
        : undefined,
      apiOptions: {
        region: 'eu',
      },
      components: {
        // Blocks
        // HeadlineBlock: 'components/shared/HeadlineBlock',
        // Sections
        Text: 'components/sections/Text',
        Headline: 'components/sections/Headline',
        VideoPlayer: 'components/sections/VideoPlayer',
        Gallery: 'components/sections/Gallery',
        Storefront: 'components/sections/Storefront',
        StorefrontProject: 'components/sections/StorefrontProject',
        ProjectCarousel: 'components/sections/ProjectCarousel',
        // Content Types
        Project: 'components/pages/Project',
        Page: 'components/pages/Page',
      },
      componentsDir: 'src',
      enableFallbackComponent: true,
      useCustomApi: false,
    }),
    tailwind({ applyBaseStyles: false }),
    // icon(),
    alpine({ entrypoint: '/src/alpine/entrypoint' }),
  ],
  output,
  adapter: netlify({
    imageCDN: false,
  }),
  image: {
    domains: ["a.storyblok.com"],
    remotePatterns: [{ protocol: "https" }],
  },
  devToolbar: {
    enabled: false,
  },
})
