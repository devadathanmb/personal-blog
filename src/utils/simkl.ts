export interface WatchedItem {
  title: string
  subtitle: string
  watchedAt: number
}

type WatchResult =
  | { status: 'watched'; item: WatchedItem }
  | { status: 'empty' }
  | { status: 'unavailable' }

export async function fetchLastWatched(): Promise<WatchResult> {
  try {
    const response = await fetch('/api/watching', {
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) return { status: 'unavailable' }
    const data = await response.json()
    if (data.latest === null) return { status: 'empty' }
    const item = data.latest
    if (
      typeof item?.title !== 'string' ||
      !item.title.trim() ||
      typeof item?.subtitle !== 'string' ||
      typeof item?.watchedAt !== 'number' ||
      !Number.isFinite(item.watchedAt) ||
      item.watchedAt <= 0
    )
      return { status: 'unavailable' }
    return { status: 'watched', item }
  } catch {
    return { status: 'unavailable' }
  }
}
