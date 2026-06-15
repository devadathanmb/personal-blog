interface LastFmTrack {
  'name': string
  'url': string
  'artist': { '#text': string }
  '@attr'?: { nowplaying: 'true' | 'false' }
  'date'?: { 'uts': string; '#text': string }
}

interface LastFmResponse {
  recenttracks?: {
    track?: LastFmTrack[]
  }
}

export async function fetchRecentTrack(
  username: string,
  apiKey: string
): Promise<LastFmTrack | null> {
  if (!username || !apiKey) return null

  try {
    const url = new URL('https://ws.audioscrobbler.com/2.0/')
    url.search = new URLSearchParams({
      method: 'user.getrecenttracks',
      user: username,
      api_key: apiKey,
      format: 'json',
      limit: '1',
    }).toString()

    const res = await fetch(url)

    if (!res.ok) {
      console.error('Failed to fetch Last.fm data:', res.statusText)
      return null
    }

    const data = (await res.json()) as LastFmResponse

    if (data.recenttracks?.track && data.recenttracks.track.length > 0) {
      return data.recenttracks.track[0]
    }
  } catch (err) {
    console.error('Error fetching Last.fm data:', err)
  }

  return null
}
