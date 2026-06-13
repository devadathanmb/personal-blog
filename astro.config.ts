import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import robotsTxt from 'astro-robots-txt'
import unocss from 'unocss/astro'
import astroExpressiveCode from 'astro-expressive-code'
import mdx from '@astrojs/mdx'
import { unified } from '@astrojs/markdown-remark'
import cloudflare from '@astrojs/cloudflare'

import { remarkPlugins, rehypePlugins } from './plugins'
import { SITE } from './src/config'

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: SITE.website,
  base: SITE.base,

  build: {
    inlineStylesheets: 'never',
  },

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
    robotsTxt(),
    unocss({ injectReset: true }),
    astroExpressiveCode(),
    mdx(),
  ],

  markdown: {
    syntaxHighlight: false,
    processor: unified({ remarkPlugins, rehypePlugins }),
  },

  image: {
    domains: SITE.imageDomains,
    // https://docs.astro.build/en/guides/images/#responsive-image-behavior
    // Used for all local (except `/public`) and authorized remote images using `![]()` syntax; not configurable per-image
    // Used for all `<Image />` and `<Picture />` components unless overridden with `layout` prop
    layout: 'constrained',
    responsiveStyles: true,
  },

  vite: {
    server: {
      headers: {
        // Allow Giscus iframe to load local styles in dev
        'Access-Control-Allow-Origin': 'https://giscus.app',
      },
    },
    build: { chunkSizeWarningLimit: 1200 },
  },

  // https://docs.astro.build/en/reference/experimental-flags/
  experimental: {
    contentIntellisense: true,
    chromeDevtoolsWorkspace: true,
  },

  adapter: cloudflare(),
})
