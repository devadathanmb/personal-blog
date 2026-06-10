// WMO code upper-bound → RI icon class
const WMO_MAP: [number, string][] = [
  [0,  'i-ri-sun-line'],
  [2,  'i-ri-sun-cloudy-line'],
  [3,  'i-ri-cloudy-line'],
  [48, 'i-ri-mist-line'],
  [67, 'i-ri-drizzle-line'],
  [77, 'i-ri-snowy-line'],
  [82, 'i-ri-heavy-showers-line'],
  [86, 'i-ri-snowy-line'],
]
const FALLBACK_ICON = 'i-ri-thunderstorms-line'

export function weatherIcon(code: number): string {
  return WMO_MAP.find(([max]) => code <= max)?.[1] ?? FALLBACK_ICON
}

// Unique icon classes — imported by unocss.config.ts for the safelist
export const WEATHER_ICON_CLASSES = [
  ...new Set([...WMO_MAP.map(([, icon]) => icon), FALLBACK_ICON]),
]
