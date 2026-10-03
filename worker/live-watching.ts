import { decode } from 'html-entities'
import type { LiveWatch } from '../src/utils/simkl'

interface StoredSession {
  updatedAt: number
  itemId: string
  item: LiveWatch | null
}

export interface LiveWatchingBinding {
  idFromName(name: string): unknown
  get(id: unknown): { fetch(request: Request): Promise<Response> }
}

interface ObjectState {
  storage: {
    get<T>(key: string): Promise<T | undefined>
    put(key: string, value: unknown): Promise<void>
  }
  blockConcurrencyWhile<T>(callback: () => Promise<T>): Promise<T>
}

const staleAfter = 3 * 60_000

function getSubtitle(event: Record<string, unknown>): string {
  if (event.ItemType === 'Episode') {
    const season = event.SeasonNumber
    const episode = event.EpisodeNumber
    if (
      typeof season === 'number' &&
      Number.isSafeInteger(season) &&
      season >= 0 &&
      typeof episode === 'number' &&
      Number.isSafeInteger(episode) &&
      episode > 0
    )
      return `S${season}E${episode}`
    return 'Episode'
  }
  const year = event.Year
  return typeof year === 'number' &&
    Number.isSafeInteger(year) &&
    year > 0 &&
    year <= 9999
    ? String(year)
    : 'Movie'
}

export class LiveWatching {
  constructor(private state: ObjectState) {}

  async fetch(request: Request): Promise<Response> {
    return this.state.blockConcurrencyWhile(async () => {
      const stored =
        await this.state.storage.get<Record<string, StoredSession>>('sessions')
      const sessions = new Map(Object.entries(stored ?? {}))
      const now = Date.now()
      if (request.method === 'POST') {
        let parsed: unknown
        try {
          parsed = await request.json()
        } catch {
          return new Response('Invalid playback event', { status: 400 })
        }
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
          return new Response('Invalid playback event', { status: 400 })
        const event = parsed as Record<string, unknown>
        const kind = event.NotificationType
        const updatedAt = Date.parse(String(event.UtcTimestamp ?? ''))
        const device = event.DeviceId
        const itemId = event.ItemId
        const position = event.PlaybackPositionTicks
        const runtime = event.RunTimeTicks
        if (
          !['PlaybackStart', 'PlaybackProgress', 'PlaybackStop'].includes(
            String(kind)
          ) ||
          !['Movie', 'Episode'].includes(String(event.ItemType)) ||
          typeof device !== 'string' ||
          !device ||
          device.length > 256 ||
          typeof itemId !== 'string' ||
          !itemId ||
          itemId.length > 256 ||
          typeof event.Name !== 'string' ||
          !event.Name.trim() ||
          event.Name.length > 500 ||
          typeof event.IsPaused !== 'boolean' ||
          !Number.isFinite(updatedAt) ||
          Math.abs(now - updatedAt) > staleAfter ||
          typeof position !== 'number' ||
          !Number.isFinite(position) ||
          position < 0 ||
          typeof runtime !== 'number' ||
          !Number.isFinite(runtime) ||
          runtime < 0
        )
          return new Response('Invalid playback event', { status: 400 })

        const previous = sessions.get(device)
        // A player can start its next title before the previous stop arrives.
        if (
          kind === 'PlaybackStop' &&
          previous?.itemId &&
          previous.itemId !== itemId
        )
          return new Response(null, { status: 204 })
        if (!previous || updatedAt > previous.updatedAt) {
          const title =
            event.ItemType === 'Episode' &&
            typeof event.SeriesName === 'string' &&
            event.SeriesName.trim()
              ? event.SeriesName
              : event.Name
          sessions.set(device, {
            updatedAt,
            itemId,
            item:
              kind === 'PlaybackStop'
                ? null
                : {
                    title: decode(title).slice(0, 500),
                    subtitle: getSubtitle(event),
                    state: event.IsPaused ? 'paused' : 'playing',
                    progress:
                      runtime > 0
                        ? Math.min(100, Math.round((position / runtime) * 100))
                        : null,
                  },
          })
          for (const [key, session] of sessions) {
            if (now - session.updatedAt > staleAfter) sessions.delete(key)
          }
          await this.state.storage.put('sessions', Object.fromEntries(sessions))
        }
        return new Response(null, { status: 204 })
      }
      const active = [...sessions.values()]
        .filter(
          (session) => session.item && now - session.updatedAt < staleAfter
        )
        .sort((a, b) => {
          const playing =
            Number(b.item?.state === 'playing') -
            Number(a.item?.state === 'playing')
          return playing || b.updatedAt - a.updatedAt
        })
      return Response.json({ current: active[0]?.item ?? null })
    })
  }
}
