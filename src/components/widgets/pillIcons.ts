export const PILL_WIDGET_ICONS = {
  nowPlayingIdle: 'i-fluent-emoji-headphone',
  github: 'i-line-md:github-loop',
  simkl: 'i-bx:movie-play',
  location: 'i-fluent:location-arrow-12-filled',
  time: 'i-line-md-watch-twotone-loop',
} as const

// Icon sizes are deliberately not utilities here: classes that only exist in a
// constants module aren't reliably generated. Each widget sizes its own icon in
// its <style> (glyphs differ in built-in padding, so sizes are tuned per icon).
export const PILL_WIDGET_ICON_CLASSES = {
  nowPlayingIdle: PILL_WIDGET_ICONS.nowPlayingIdle,
  github: `${PILL_WIDGET_ICONS.github} shrink-0`,
  simkl: `${PILL_WIDGET_ICONS.simkl} shrink-0`,
  location: `${PILL_WIDGET_ICONS.location} shrink-0`,
  time: `${PILL_WIDGET_ICONS.time} shrink-0`,
} as const

export const PILL_WIDGET_ICON_SAFE_LIST = Object.values(PILL_WIDGET_ICONS)
