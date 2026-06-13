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
import { WEATHER_ICON_CLASSES } from './src/utils/weather'

import type {
  IconNavItem,
  ResponsiveNavItem,
  IconSocialItem,
  ResponsiveSocialItem,
} from './src/types'

const { internalNavs, socialLinks } = UI

const usesIcons = usesData.flatMap((s) =>
  s.categories.flatMap((c) => c.items.map((i) => i.icon))
)
const usesBtnClasses = usesData.flatMap((s) =>
  s.categories.flatMap((c) => c.items.map((i) => i.btnClass))
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
      /^btn-(\w+)$/,
      ([_, color]) =>
        `px-2.5 py-1 border border-[#8884]! rounded op-50 transition-all duration-200 ease-out no-underline! hover:(op-100 text-${color} bg-${color}/10)`,
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

    /* UsesSection — derived from uses.json, auto-updates when data changes */
    ...usesIcons,
    ...usesBtnClasses,

    /* BaseLayout, TagSidebar, TocSidebar — skip-link and panel toggles */
    'focus:not-sr-only',
    'focus:fixed',
    'focus:start-1',
    'focus:top-1.5',
    'focus:op-20',

    /* Toc */
    'i-ri-menu-2-fill',

    /* NowPlaying — floating note icons are constructed in JS at runtime */
    'i-ri-music-2-fill',
    'i-ri-music-fill',

    /* LocationTimeWidget — derived from src/utils/weather.ts */
    ...WEATHER_ICON_CLASSES,
  ],
})
