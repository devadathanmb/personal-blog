import { withBasePath } from '~/utils/path'

export async function GET() {
  // https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest
  const manifest = {
    id: withBasePath('/'),
    name: 'Devadathan M B',
    short_name: 'Devadathan',
    description:
      "Devadathan's corner of the internet — engineering, tools, and things worth writing down.",
    icons: [
      {
        src: withBasePath('icon-192.png'),
        type: 'image/png',
        sizes: '192x192',
      },
      {
        src: withBasePath('icon-512.png'),
        type: 'image/png',
        sizes: '512x512',
      },
      {
        src: withBasePath('icon-mask.png'),
        type: 'image/png',
        sizes: '512x512',
        purpose: 'maskable',
      },
    ],
    scope: withBasePath('/'),
    start_url: withBasePath('/'),
    display: 'standalone',
    theme_color: '#111111',
    background_color: '#111111',
  }

  return new Response(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
    },
  })
}
