import {
  defineConfig,
  presetWind3,
  presetAttributify,
  presetIcons,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

import { UI } from './src/config'
import usesData from './src/data/uses.json'
import colophonData from './src/data/colophon.json'
import { PILL_WIDGET_ICON_SAFE_LIST } from './src/components/widgets/pillIcons'
import { WEATHER_ICON_CLASSES } from './src/utils/weather'

import type {
  IconNavItem,
  ResponsiveNavItem,
  IconSocialItem,
  ResponsiveSocialItem,
} from './src/types'

const { internalNavs, socialLinks } = UI

interface CardSection {
  categories: { items: { icon: string; btnClass: string }[] }[]
}

const cardIcons = (data: CardSection[]) =>
  data.flatMap((s) => s.categories.flatMap((c) => c.items.map((i) => i.icon)))
const cardClasses = (data: CardSection[]) =>
  data.flatMap((s) =>
    s.categories.flatMap((c) =>
      c.items.map((i) => `card-${i.btnClass.replace('btn-', '')}`)
    )
  )
const navIcons = internalNavs
  .filter(
    (item) =>
      item.displayMode !== 'alwaysText' &&
      item.displayMode !== 'textHiddenOnMobile'
  )
  .map((item) => (item as IconNavItem | ResponsiveNavItem).icon)
const socialIcons = socialLinks
  .filter(
    (item) =>
      item.displayMode !== 'alwaysText' &&
      item.displayMode !== 'textHiddenOnMobile'
  )
  .map((item) => (item as IconSocialItem | ResponsiveSocialItem).icon)

export default defineConfig({
  // Pre-scan all source files at startup so __uno.css is populated before the first page request
  // (avoids the initial FOUC where utility classes arrive late via HMR)
  content: {
    filesystem: [
      './src/**/*.{astro,ts,tsx}',
      './src/{content,pages}/**/*.{md,mdx}',
    ],
  },

  // will be deep-merged to the default theme
  extendTheme: (theme) => {
    return {
      ...theme,
      breakpoints: {
        ...theme.breakpoints,
        lgp: '1128px',
      },
    }
  },

  // define utility classes and the resulting CSS
  rules: [],

  // combine multiple rules as utility classes
  shortcuts: [
    [
      'mobile-panel',
      'z-200 fixed top-10% left-50% translate-x--50% overflow-y-auto flex flex-col w-90% max-h-80vh py-4 px-6 rounded-lg bg-[var(--c-bg)] shadow-custom_0_0_10_0 text-[var(--c-text)]',
    ],
    [
      /^(\w+)-transition(?:-(\d+))?$/,
      (match) =>
        `transition-${match[1] === 'op' ? 'opacity' : match[1]} duration-${match[2] ? match[2] : '300'} ease-in-out`,
    ],
    [
      /^shadow-custom_(-?\d+)_(-?\d+)_(-?\d+)_(-?\d+)$/,
      ([_, x, y, blur, spread]) =>
        `shadow-[${x}px_${y}px_${blur}px_${spread}px_rgba(0,0,0,0.2)] dark:shadow-[${x}px_${y}px_${blur}px_${spread}px_rgba(255,255,255,0.25)]`,
    ],
    [
      /^card-(\w+)$/,
      ([_, color]) =>
        `flex items-start gap-3 px-4 py-3.5 border border-[#8884]! rounded-xl no-underline! transition-all duration-200 ease-out hover:(border-${color}/35! bg-${color}/10)`,
    ],
  ],

  // presets are partial configurations
  presets: [
    presetWind3(),
    presetAttributify({
      strict: true,
      prefix: 'u-',
      prefixedOnly: false,
    }),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'height': '1.2em',
        'width': '1.2em',
        'vertical-align': 'text-bottom',
      },
    }),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,600,800',
        mono: 'DM Mono:400,600',
        condensed: 'Roboto Condensed',
      },
    }),
  ],

  // provides a unified interface to transform source code in order to support conventions
  transformers: [transformerDirectives(), transformerVariantGroup()],

  // work around the limitation of dynamically constructed utilities
  // https://unocss.dev/guide/extracting#limitations
  safelist: [
    ...navIcons,
    ...socialIcons,

    /* UsesSection cards — derived from data files, auto-update when data changes */
    ...cardIcons(usesData),
    ...cardClasses(usesData),
    ...cardIcons(colophonData),
    ...cardClasses(colophonData),

    /* BaseLayout, TagSidebar, TocSidebar — skip-link and panel toggles */
    'focus:not-sr-only',
    'focus:fixed',
    'focus:start-1',
    'focus:top-1.5',
    'focus:op-20',

    /* Toc */
    'i-ri-menu-2-fill',

    /* Pill widgets — classes are set through constants in src/components/widgets/pillIcons.ts */
    ...PILL_WIDGET_ICON_SAFE_LIST,

    /* NowPlaying — floating note icons are constructed in JS at runtime */
    'i-ri-music-2-fill',
    'i-ri-music-fill',

    /* LocationTimeWidget — derived from src/utils/weather.ts */
    ...WEATHER_ICON_CLASSES,
  ],
})
