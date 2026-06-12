// WMO code upper-bound → [dayIcon, nightIcon]
const WMO_MAP: [number, string, string][] = [
  [0, 'i-meteocons-clear-day-fill', 'i-meteocons-clear-night-fill'],
  [
    2,
    'i-meteocons-partly-cloudy-day-fill',
    'i-meteocons-partly-cloudy-night-fill',
  ],
  [3, 'i-meteocons-overcast-day-fill', 'i-meteocons-overcast-night-fill'],
  [48, 'i-meteocons-fog-day-fill', 'i-meteocons-fog-night-fill'],
  [67, 'i-meteocons-drizzle-fill', 'i-meteocons-drizzle-fill'],
  [77, 'i-meteocons-snow-fill', 'i-meteocons-snow-fill'],
  [82, 'i-meteocons-rain-fill', 'i-meteocons-rain-fill'],
  [86, 'i-meteocons-snow-fill', 'i-meteocons-snow-fill'],
  [
    99,
    'i-meteocons-thunderstorms-day-fill',
    'i-meteocons-thunderstorms-night-fill',
  ],
]
const FALLBACK_DAY = 'i-meteocons-thunderstorms-day-fill'
const FALLBACK_NIGHT = 'i-meteocons-thunderstorms-night-fill'

export function weatherIcon(code: number, isDay: boolean): string {
  const entry = WMO_MAP.find(([max]) => code <= max)
  if (!entry) return isDay ? FALLBACK_DAY : FALLBACK_NIGHT
  return isDay ? entry[1] : entry[2]
}

// Unique icon classes — imported by unocss.config.ts for the safelist
export const WEATHER_ICON_CLASSES = [
  ...new Set([
    ...WMO_MAP.flatMap(([, day, night]) => [day, night]),
    FALLBACK_DAY,
    FALLBACK_NIGHT,
  ]),
]
