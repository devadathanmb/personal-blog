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

## Watch-history widget

The `/now` widget displays the latest watch from SIMKL through a server-side
Worker route. Set `SIMKL_CLIENT_ID` and `SIMKL_ACCESS_TOKEN` as Worker secrets;
never include the account token in client-side configuration.

For local development, copy `.dev.vars.example` to `.dev.vars`, supply the
credentials, and run `pnpm preview`. `pnpm dev` serves only the static site,
without the Worker API.

## Credits

This blog is built on top of [astro-antfustyle-theme](https://github.com/lin-stephanie/astro-antfustyle-theme) by [Stephanie Lin](https://github.com/lin-stephanie), which itself draws design inspiration from [antfu.me](https://antfu.me) by [Anthony Fu](https://github.com/antfu).

The previous version of this blog can be found on the [main branch](https://github.com/devadathanmb/personal-blog/tree/main).

## License

MIT — see [LICENSE](./LICENSE) for details.
