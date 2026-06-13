import type { Site, Ui, Features } from './types'

export const SITE: Site = {
  website: 'https://devadathanmb.in/',
  base: '/',
  title: 'Devadathan M B',
  description:
    "Devadathan's corner of the internet — engineering, tools, and things worth writing down.",
  author: 'Devadathan M B',
  lang: 'en',
  ogLocale: 'en_US',
  imageDomains: ['cdn.bsky.app', 'images.unsplash.com'],
}

export const UI: Ui = {
  internalNavs: [
    {
      path: '/blog',
      title: 'Blog',
      displayMode: 'alwaysText',
      text: 'Blog',
    },
    {
      path: '/thoughts',
      title: 'Thoughts',
      displayMode: 'alwaysText',
      text: 'Thoughts',
    },
    {
      path: '/uses',
      title: 'Uses',
      displayMode: 'alwaysText',
      text: 'Uses',
    },
    {
      path: '/now',
      title: 'Now',
      displayMode: 'alwaysText',
      text: 'Now',
    },
  ],
  socialLinks: [
    {
      link: 'https://github.com/devadathanmb',
      title: 'Devadathan on GitHub',
      displayMode: 'alwaysIcon',
      icon: 'i-uil-github-alt',
    },
    {
      link: 'https://www.linkedin.com/in/devadathanmb/',
      title: 'Devadathan on LinkedIn',
      displayMode: 'alwaysIcon',
      icon: 'i-ri-linkedin-box-fill',
    },
    {
      link: 'mailto:devadathanmb@gmail.com',
      title: 'Email Devadathan',
      displayMode: 'alwaysIcon',
      icon: 'i-ri-mail-line',
    },
  ],
  navBarLayout: {
    left: [],
    right: [
      'internalNavs',
      'hr',
      'socialLinks',
      'hr',
      'searchButton',
      'themeButton',
      'rssLink',
    ],
    mergeOnMobile: true,
  },
  postView: {
    postMetaStyle: 'minimal',
    useCoverAltAsCaption: true,
  },
  groupView: {
    maxGroupColumns: 3,
    showGroupItemColorOnHover: true,
  },
  githubView: {
    monorepos: ['withastro/astro', 'withastro/starlight'],
    mainLogoOverrides: [
      [/starlight/, 'https://starlight.astro.build/favicon.svg'],
    ],
    subLogoMatches: [
      [/theme/, 'i-unjs-theme-colors'],
      [/github/, 'https://github.githubassets.com/favicons/favicon.svg'],
      [/tweet/, 'i-logos-twitter'],
      [/bluesky/, 'i-logos-bluesky'],
    ],
  },
  externalLink: {
    newTab: true,
    cursorType: '',
    showNewTabIcon: true,
  },
}

/**
 * Globally controls whether to enable special features:
 *  - Set to `false` or `[false, {...}]` to disable the feature.
 *  - Set to `[true, {...}]` to enable and configure the feature.
 */
export const FEATURES: Features = {
  slideEnterAnim: [true, { enterStep: 60 }],
  ogImage: [
    true,
    {
      authorOrBrand: `${SITE.title}`,
      fallbackTitle: `${SITE.description}`,
      fallbackBgType: 'dot',
    },
  ],
  toc: [
    true,
    {
      minHeadingLevel: 2,
      maxHeadingLevel: 5,
      displayPosition: 'right',
      displayMode: 'content',
    },
  ],
  share: [
    true,
    {
      twitter: [true, '@devadathanmb'],
      bluesky: false,
      mastodon: false,
      facebook: false,
      pinterest: false,
      reddit: false,
      telegram: false,
      whatsapp: false,
      email: true,
    },
  ],
  giscus: [
    true,
    {
      'data-repo': 'devadathanmb/personal-blog',
      'data-repo-id': 'R_kgDOMTeYEQ',
      'data-category': 'Comments',
      'data-category-id': 'DIC_kwDOMTeYEc4C0Y-6',
      'data-mapping': 'pathname',
      'data-strict': '0',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'bottom',
      'data-lang': 'en',
    },
  ],
  search: [
    true,
    {
      includes: ['blog', 'thoughts'],
      filter: true,
      navHighlight: true,
      batchLoadSize: [true, 5],
      maxItemsPerPage: [true, 3],
    },
  ],
  tag: [
    true,
    {
      displayPosition: 'right',
      displayMode: 'content',
      filterMode: 'AND',
    },
  ],
  nowPlaying: [
    true,
    {
      lastfmUsername: 'dev_on_lastfm',
      lastfmApiKey: '6b3a4890434ad4b6bb7d66f1c298b1a0',
    },
  ],
  location: [
    true,
    {
      label: 'Kerala, India',
      timezone: 'Asia/Kolkata',
      lat: 10.302,
      lon: 76.335,
    },
  ],
}
