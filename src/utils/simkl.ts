export interface WatchedItem {
  title: string
  subtitle: string
  watchedAt: number
}

export interface LiveWatch {
  title: string
  subtitle: string
  state: 'playing' | 'paused'
  progress: number | null
}

type WatchResult =
  | { status: 'playing' | 'paused'; item: LiveWatch }
  | { status: 'watched'; item: WatchedItem }
  | { status: 'empty' }
  | { status: 'unavailable' }

export async function fetchWatching(): Promise<WatchResult> {
  try {
    const response = await fetch('/api/watching', {
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) return { status: 'unavailable' }
    const data = await response.json()
    const current = data.current
    if (
      current &&
      typeof current.title === 'string' &&
      current.title.trim() &&
      typeof current.subtitle === 'string' &&
      ['playing', 'paused'].includes(current.state) &&
      (current.progress === null ||
        (typeof current.progress === 'number' &&
          Number.isFinite(current.progress) &&
          current.progress >= 0 &&
          current.progress <= 100))
    )
      return { status: current.state, item: current }
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
