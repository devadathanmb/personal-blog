import type { LiveWatchingBinding } from './live-watching'

export interface WebhookEnv {
  JELLYFIN_WEBHOOK_SECRET?: string
  JELLYFIN_USER_ID?: string
  LIVE_WATCHING: LiveWatchingBinding
}

const maxBodyBytes = 32_768

function isAuthorized(request: Request, secret: string): boolean {
  const encoder = new TextEncoder()
  const expected = encoder.encode(`Bearer ${secret}`)
  const supplied = encoder.encode(request.headers.get('Authorization') ?? '')
  let mismatch = supplied.length ^ expected.length
  for (let i = 0; i < expected.length; i++)
    mismatch |= expected[i] ^ (supplied[i] ?? 0)
  return mismatch === 0
}

async function readBody(request: Request): Promise<string | null> {
  if (Number(request.headers.get('Content-Length')) > maxBodyBytes) return null
  if (!request.body) return ''
  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let size = 0
  let text = ''
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) return text + decoder.decode()
      size += value.byteLength
      if (size > maxBodyBytes) {
        await reader.cancel()
        return null
      }
      text += decoder.decode(value, { stream: true })
    }
  } finally {
    reader.releaseLock()
  }
}

export async function handleWebhook(
  request: Request,
  env: WebhookEnv
): Promise<Response> {
  if (request.method !== 'POST')
    return new Response('Method not allowed', {
      status: 405,
      headers: { Allow: 'POST' },
    })
  if (!env.JELLYFIN_WEBHOOK_SECRET || !env.JELLYFIN_USER_ID)
    return new Response('Webhook not configured', { status: 503 })
  if (!isAuthorized(request, env.JELLYFIN_WEBHOOK_SECRET))
    return new Response('Unauthorized', { status: 401 })

  let text: string
  let event: Record<string, unknown>
  try {
    const body = await readBody(request)
    if (body === null) return new Response('Payload too large', { status: 413 })
    text = body
    const parsed: unknown = JSON.parse(text)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
      return new Response('Invalid playback event', { status: 400 })
    event = parsed as Record<string, unknown>
  } catch {
    return new Response('Invalid playback event', { status: 400 })
  }
  if (typeof event.UserId !== 'string')
    return new Response('Invalid playback event', { status: 400 })
  if (
    event.UserId.replaceAll('-', '').toLowerCase() !==
    env.JELLYFIN_USER_ID.replaceAll('-', '').toLowerCase()
  )
    return new Response(null, { status: 204 })

  try {
    return await env.LIVE_WATCHING.get(
      env.LIVE_WATCHING.idFromName('watching')
    ).fetch(
      new Request('https://live.internal/', { method: 'POST', body: text })
    )
  } catch {
    return new Response('Playback storage is temporarily unavailable', {
      status: 503,
    })
  }
}
