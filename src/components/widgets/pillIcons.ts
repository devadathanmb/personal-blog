export const PILL_WIDGET_ICONS = {
  nowPlayingIdle: 'i-fluent-emoji-headphone',
  github: 'i-line-md:github-loop',
  trakt: 'i-bx:movie-play',
  location: 'i-fluent:location-arrow-12-filled',
  time: 'i-line-md-watch-twotone-loop',
} as const

export const PILL_WIDGET_ICON_CLASSES = {
  nowPlayingIdle: PILL_WIDGET_ICONS.nowPlayingIdle,
  github: `${PILL_WIDGET_ICONS.github} shrink-0 text-lg`,
  trakt: `${PILL_WIDGET_ICONS.trakt} shrink-0 text-xl`,
  location: `${PILL_WIDGET_ICONS.location} shrink-0 text-sm`,
  time: `${PILL_WIDGET_ICONS.time} shrink-0 text-base`,
} as const

export const PILL_WIDGET_ICON_SAFE_LIST = Object.values(PILL_WIDGET_ICONS)
