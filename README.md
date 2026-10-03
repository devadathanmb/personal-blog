# devadathanmb.in

My personal blog — engineering notes, tools I use, things I think about.

Built with [Astro](https://astro.build) and deployed as a static site on Cloudflare Workers.

## Running locally

```bash
pnpm install
pnpm dev
```

Build:

```bash
pnpm build
pnpm preview
```

## Watching widget

The `/now` widget shows live Jellyfin playback when configured, otherwise the
latest watch from SIMKL.

### SIMKL history

Set `SIMKL_CLIENT_ID` and `SIMKL_ACCESS_TOKEN` as Worker secrets. Never include
account tokens in client-side configuration.

A five-minute scheduled refresh stores the latest watch in KV. The public API
reads that snapshot; visitors never trigger SIMKL requests. Failed refreshes
retain the last successful result.

### Live Jellyfin playback

Set `JELLYFIN_WEBHOOK_SECRET` (a random bearer token) and `JELLYFIN_USER_ID` as
Worker secrets. In Jellyfin's Webhook plugin, configure a Generic webhook:

- **URL:** your site's full URL followed by `/api/watching/webhook`.
- **Headers:** `Authorization: Bearer <token>` and `Content-Type: application/json`.
- **Notifications:** `PlaybackStart`, `PlaybackProgress`, and `PlaybackStop`.
- **Filters:** movies and episodes, restricted to the same Jellyfin user.
- **Payload:** enable **Send All Properties**.

Keep the token out of the webhook URL and client-side configuration.

A SQLite-backed Durable Object in the existing Worker stores live playback state.
The public API exposes only the title, episode/year, progress, and playing/paused
state—not user or device identifiers. The widget refreshes every 15 seconds and
falls back to SIMKL history on stop or after three minutes without events. Keep
progress notifications enabled so active sessions don't expire. No extra service
or polling job is needed.

### Local development

For local development, copy `.dev.vars.example` to `.dev.vars` and supply the
credentials. Run `pnpm dev:worker` (the real Worker, with local KV and Durable
Object state) alongside `pnpm dev`; the dev server proxies `/api` to it.

To exercise the "watching" widget without a real player:

```sh
pnpm sim:watch playing --progress 77   # Ctrl+C ends the session
pnpm sim:watch paused
pnpm sim:watch watched                 # seeds the local KV snapshot
pnpm sim:watch stop
```

## Credits

This blog is built on top of [astro-antfustyle-theme](https://github.com/lin-stephanie/astro-antfustyle-theme) by [Stephanie Lin](https://github.com/lin-stephanie), which itself draws design inspiration from [antfu.me](https://antfu.me) by [Anthony Fu](https://github.com/antfu).

The previous version of this blog can be found on the [main branch](https://github.com/devadathanmb/personal-blog/tree/main).

## License

MIT — see [LICENSE](./LICENSE) for details.
