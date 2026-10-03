// Drives the local Worker (`pnpm dev:worker`) with fake SIMKL/Jellyfin state,
// so the "watching" pill can be checked without a real player.
//
//   pnpm sim:watch playing [--progress 40] [--title "Name"]  # Ctrl+C to stop
//   pnpm sim:watch paused  [--progress 40] [--title "Name"]
//   pnpm sim:watch watched [--title "Name"]                  # seeds local KV
//   pnpm sim:watch stop
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { parseArgs } from 'node:util'

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    progress: { type: 'string', default: '40' },
    title: { type: 'string', default: 'Bethlehem Kudumba Unit' },
    port: { type: 'string', default: '8787' },
  },
})
const [mode] = positionals
const base = `http://127.0.0.1:${values.port}`

const vars = Object.fromEntries(
  readFileSync(new URL('../.dev.vars', import.meta.url), 'utf8')
    .split('\n')
    .map((line) => line.match(/^(\w+)="?([^"]*)"?$/))
    .filter(Boolean)
    .map(([, key, value]) => [key, value])
)

const RUNTIME = 100 * 60 * 10_000_000 // 100 min, in Jellyfin ticks

async function send(type, { paused = false, progress = 0 } = {}) {
  const response = await fetch(`${base}/api/watching/webhook`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${vars.JELLYFIN_WEBHOOK_SECRET}` },
    body: JSON.stringify({
      NotificationType: type,
      UserId: vars.JELLYFIN_USER_ID,
      ItemType: 'Movie',
      ItemId: 'sim-item',
      DeviceId: 'sim-device',
      Name: values.title,
      Year: 2026,
      IsPaused: paused,
      UtcTimestamp: new Date().toISOString(),
      PlaybackPositionTicks: Math.round((progress / 100) * RUNTIME),
      RunTimeTicks: RUNTIME,
    }),
  })
  if (!response.ok) throw new Error(`webhook ${response.status}`)
}

if (mode === 'playing' || mode === 'paused') {
  let progress = Number(values.progress)
  const tick = () =>
    send('PlaybackProgress', { paused: mode === 'paused', progress })
  await tick()
  console.log(`${mode} at ${progress}% — Ctrl+C to stop`)
  // Sessions go stale after 3 min, so keep reporting like a real player.
  const timer = setInterval(() => {
    progress = Math.min(100, progress + (mode === 'playing' ? 0.5 : 0))
    tick().catch(console.error)
  }, 30_000)
  process.on('SIGINT', async () => {
    clearInterval(timer)
    await send('PlaybackStop', { progress }).catch(console.error)
    process.exit(0)
  })
} else if (mode === 'stop') {
  await send('PlaybackStop')
} else if (mode === 'watched') {
  const snapshot = {
    activity: 'sim',
    latest: {
      title: values.title,
      subtitle: 'Movie',
      watchedAt: Math.floor(Date.now() / 1000) - 3600,
    },
  }
  execFileSync(
    'pnpm',
    [
      'exec',
      'wrangler',
      'kv',
      'key',
      'put',
      '--binding',
      'WATCH_HISTORY',
      '--local',
      'simkl',
      JSON.stringify(snapshot),
    ],
    { stdio: 'inherit' }
  )
} else {
  console.error('usage: sim-watch <playing|paused|watched|stop>')
  process.exit(1)
}
