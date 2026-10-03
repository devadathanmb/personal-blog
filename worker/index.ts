import { latestWatched } from './simkl'
import type { WatchedItem } from '../src/utils/simkl'

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> }
  SIMKL_CLIENT_ID?: string
  SIMKL_ACCESS_TOKEN?: string
}

interface Snapshot {
  activity: string
  latest: WatchedItem | null
}

interface Credentials {
  clientId: string
  accessToken: string
}

const publicHeaders = {
  'Cache-Control': 'public, max-age=60, s-maxage=300',
  'X-Content-Type-Options': 'nosniff',
}

async function fetchSimkl(
  path: string,
  credentials: Credentials
): Promise<unknown> {
  const url = new URL(`https://api.simkl.com${path}`)
  url.searchParams.set('client_id', credentials.clientId)
  url.searchParams.set('app-name', 'personal-blog')
  url.searchParams.set('app-version', '1.0')
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${credentials.accessToken}`,
      'User-Agent': 'personal-blog/1.0',
    },
    signal: AbortSignal.timeout(10_000),
  })
  if (!response.ok) throw new Error(`SIMKL status ${response.status}`)
  return response.json()
}

async function watchHistory(
  url: URL,
  credentials: Credentials
): Promise<Response> {
  // Scope caches to credentials, not query strings or caller-supplied account IDs.
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(
      `${credentials.clientId}:${credentials.accessToken}`
    )
  )
  const account = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('')
  const cache = (caches as CacheStorage & { default: Cache }).default
  const cacheKey = new Request(`${url.origin}/__watch-cache/${account}`)
  const stateKey = new Request(`${url.origin}/__watch-state/${account}`)
  const cached = await cache.match(cacheKey)
  if (cached) return cached

  const stored = await cache.match(stateKey)
  const previous = stored ? ((await stored.json()) as Snapshot) : null
  // Check activities before pulling the library, as required by SIMKL's sync API.
  const activity = JSON.stringify(
    await fetchSimkl('/sync/activities', credentials)
  )
  const latest =
    previous?.activity === activity
      ? previous.latest
      : latestWatched(
          await fetchSimkl('/sync/all-items?extended=full', credentials)
        )

  await cache.put(
    stateKey,
    Response.json(
      { activity, latest },
      {
        headers: { 'Cache-Control': 'public, max-age=86400' },
      }
    )
  )
  const response = Response.json({ latest }, { headers: publicHeaders })
  await cache.put(cacheKey, response.clone())
  return response
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request)
    if (url.pathname !== '/api/watching')
      return new Response('Not found', { status: 404 })
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', {
        status: 405,
        headers: { Allow: 'GET, HEAD' },
      })
    }
    let response: Response
    if (!env.SIMKL_CLIENT_ID || !env.SIMKL_ACCESS_TOKEN) {
      response = Response.json(
        { error: 'Watch history is not configured' },
        {
          status: 503,
          headers: { 'Cache-Control': 'no-store' },
        }
      )
    } else {
      try {
        response = await watchHistory(url, {
          clientId: env.SIMKL_CLIENT_ID,
          accessToken: env.SIMKL_ACCESS_TOKEN,
        })
      } catch {
        // Do not expose upstream responses, tokens, or other account data.
        response = Response.json(
          { error: 'Watch history is temporarily unavailable' },
          { status: 502, headers: { 'Cache-Control': 'no-store' } }
        )
      }
    }
    return request.method === 'HEAD'
      ? new Response(null, {
          status: response.status,
          headers: response.headers,
        })
      : response
  },
}
