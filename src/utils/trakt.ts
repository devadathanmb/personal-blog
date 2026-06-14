interface TraktEpisode {
  season: number
  number: number
}

interface TraktShow {
  title: string
  ids: { slug: string }
}

interface TraktMovie {
  title: string
  ids: { slug: string }
}

interface TraktWatchingResponse {
  type: 'episode' | 'movie'
  episode?: TraktEpisode
  show?: TraktShow
  movie?: TraktMovie
}

interface TraktHistoryItem {
  watched_at: string
  type: 'episode' | 'movie'
  episode?: TraktEpisode
  show?: TraktShow
  movie?: TraktMovie
}

export interface TraktWatching {
  title: string
  subtitle: string
  url: string
  isWatching: boolean
  watchedAt?: number
}

function traktHeaders(clientId: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'trakt-api-version': '2',
    'trakt-api-key': clientId,
  }
}

function formatEp(episode: TraktEpisode): string {
  const s = String(episode.season).padStart(2, '0')
  const e = String(episode.number).padStart(2, '0')
  return `S${s}E${e}`
}

export async function fetchWatching(
  username: string,
  clientId: string
): Promise<TraktWatching | null> {
  const headers = traktHeaders(clientId)

  try {
    const watchingRes = await fetch(
      `https://api.trakt.tv/users/${username}/watching`,
      { headers }
    )

    if (watchingRes.status === 200) {
      const data = (await watchingRes.json()) as TraktWatchingResponse
      if (data.type === 'episode' && data.show && data.episode) {
        const { season, number } = data.episode
        return {
          title: data.show.title,
          subtitle: formatEp(data.episode),
          url: `https://trakt.tv/shows/${data.show.ids.slug}/seasons/${season}/episodes/${number}`,
          isWatching: true,
        }
      }
      if (data.type === 'movie' && data.movie) {
        return {
          title: data.movie.title,
          subtitle: 'Movie',
          url: `https://trakt.tv/movies/${data.movie.ids.slug}`,
          isWatching: true,
        }
      }
    }

    const historyRes = await fetch(
      `https://api.trakt.tv/users/${username}/history?limit=1`,
      { headers }
    )
    if (!historyRes.ok) return null

    const history = (await historyRes.json()) as TraktHistoryItem[]
    if (!history.length) return null

    const item = history[0]
    const watchedAt = Math.floor(new Date(item.watched_at).getTime() / 1000)

    if (item.type === 'episode' && item.show && item.episode) {
      const { season, number } = item.episode
      return {
        title: item.show.title,
        subtitle: formatEp(item.episode),
        url: `https://trakt.tv/shows/${item.show.ids.slug}/seasons/${season}/episodes/${number}`,
        isWatching: false,
        watchedAt,
      }
    }
    if (item.type === 'movie' && item.movie) {
      return {
        title: item.movie.title,
        subtitle: 'Movie',
        url: `https://trakt.tv/movies/${item.movie.ids.slug}`,
        isWatching: false,
        watchedAt,
      }
    }

    return null
  } catch {
    return null
  }
}
