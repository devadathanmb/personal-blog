import { latestWatched } from './simkl'
import { handleWebhook } from './webhook'
import type { WebhookEnv } from './webhook'
import type { LiveWatch, WatchedItem } from '../src/utils/simkl'
export { LiveWatching } from './live-watching'

interface Env extends WebhookEnv {
  ASSETS: { fetch(request: Request): Promise<Response> }
  WATCH_HISTORY: {
    get(key: string, type: 'json'): Promise<Snapshot | null>
    put(key: string, value: string): Promise<void>
  }
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
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
}

const snapshotKey = 'simkl'

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

async function refreshHistory(
  env: Env,
  credentials: Credentials
): Promise<void> {
  const previous = await env.WATCH_HISTORY.get(snapshotKey, 'json')
  // Check activities before pulling the library, as required by SIMKL's sync API.
  const activity = JSON.stringify(
    await fetchSimkl('/sync/activities', credentials)
  )
  if (previous?.activity === activity) return
  const latest = latestWatched(
    await fetchSimkl('/sync/all-items?extended=full', credentials)
  )
  // Only replace the last successful snapshot after both upstream calls succeed.
  await env.WATCH_HISTORY.put(snapshotKey, JSON.stringify({ activity, latest }))
}

export default {
  async scheduled(_event: unknown, env: Env): Promise<void> {
    if (!env.SIMKL_CLIENT_ID || !env.SIMKL_ACCESS_TOKEN) {
      throw new Error('SIMKL credentials are not configured')
    }
    await refreshHistory(env, {
      clientId: env.SIMKL_CLIENT_ID,
      accessToken: env.SIMKL_ACCESS_TOKEN,
    })
  },

  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request)
    if (url.pathname === '/api/watching/webhook')
      return handleWebhook(request, env)
    if (url.pathname !== '/api/watching')
      return new Response('Not found', { status: 404 })
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', {
        status: 405,
        headers: { Allow: 'GET, HEAD' },
      })
    }
    let response: Response
    try {
      const [snapshot, current] = await Promise.all([
        env.WATCH_HISTORY.get(snapshotKey, 'json').catch(() => null),
        env.LIVE_WATCHING.get(env.LIVE_WATCHING.idFromName('watching'))
          .fetch(new Request('https://live.internal/'))
          .then(async (response) => {
            if (!response.ok) throw new Error('Playback storage is unavailable')
            const data = (await response.json()) as {
              current: LiveWatch | null
            }
            return data.current
          })
          .catch(() => null),
      ])
      response =
        snapshot || current
          ? Response.json(
              { latest: snapshot?.latest ?? null, current },
              { headers: publicHeaders }
            )
          : Response.json(
              { error: 'Watch history is not available yet' },
              { status: 503, headers: { 'Cache-Control': 'no-store' } }
            )
    } catch {
      response = Response.json(
        { error: 'Watch history is temporarily unavailable' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } }
      )
    }
    return request.method === 'HEAD'
      ? new Response(null, {
          status: response.status,
          headers: response.headers,
        })
      : response
  },
}
