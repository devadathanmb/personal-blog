import { SITE } from '../config'

/**
 * Formats a given date into a human-readable string.
 */
export function formatDate(d: Date | string, showYear = true, useUTC = false) {
  const date = typeof d === 'string' ? new Date(d) : d
  if (isNaN(date.getTime())) throw new Error('Invalid Date')

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    ...(showYear && { year: 'numeric' }),
    ...(useUTC && { timeZone: 'UTC' }),
  }

  return date.toLocaleDateString(SITE.lang, options)
}

/**
 * Gets the year from a given date.
 */
export function getYear(a: Date | string | number) {
  return new Date(a).getFullYear()
}

/**
 * Retrieves the current time formatted as a string in 'HH:MM:SS' format.
 */
export function getCurrentFormattedTime() {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')

  return `${hours}:${minutes}:${seconds}`
}
