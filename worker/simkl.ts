import type { WatchedItem } from '../src/utils/simkl'

interface LibraryItem {
  last_watched_at?: string
  last_watched?: string
  movie?: { title?: string }
  show?: { title?: string }
}

/** List status "watching" is not live playback; only actual watch dates count. */
export function latestWatched(library: unknown): WatchedItem | null {
  if (!library || typeof library !== 'object') return null

  let latest: WatchedItem | null = null
  for (const category of ['movies', 'shows', 'anime']) {
    const items = (library as Record<string, unknown>)[category]
    if (!Array.isArray(items)) continue

    for (const item of items as (LibraryItem | null)[]) {
      if (!item || typeof item !== 'object') continue
      const title = item.movie?.title ?? item.show?.title
      if (typeof item.last_watched_at !== 'string') continue
      const watchedAt = Date.parse(item.last_watched_at) / 1000
      if (
        typeof title !== 'string' ||
        !title.trim() ||
        !Number.isFinite(watchedAt) ||
        watchedAt <= 0
      )
        continue
      if (latest && latest.watchedAt >= watchedAt) continue

      latest = {
        title,
        subtitle: item.movie
          ? 'Movie'
          : typeof item.last_watched === 'string' && item.last_watched
            ? item.last_watched
            : 'Episode',
        watchedAt,
      }
    }
  }
  return latest
}
