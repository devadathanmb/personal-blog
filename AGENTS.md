# Personal Blog

Devadathan's personal blog at devadathanmb.in — built with Astro 5, deployed to Cloudflare Workers via SSR adapter. Current dev branch is `v2`; `main` is production.

## Commands

| Command             | Purpose                                |
| ------------------- | -------------------------------------- |
| `pnpm dev`          | Dev server                             |
| `pnpm build`        | Build (also runs `pagefind` postbuild) |
| `pnpm preview`      | Build + `wrangler dev` locally         |
| `pnpm check`        | `astro check` (TypeScript)             |
| `pnpm lint`         | ESLint (0 warnings allowed)            |
| `pnpm format:write` | Prettier with cache                    |

Pre-commit hook: `lint-staged` (ESLint fix) + `prettier` + `astro check`. CI runs check + lint + build on push/PR to `main`.

## Stack

- Astro 5, MDX, `@astrojs/cloudflare` SSR adapter
- UnoCSS (Wind3 + Attributify + Icons + WebFonts) — no Tailwind
- Expressive Code for syntax highlighting (themes: vitesse-dark / vitesse-light)
- Pagefind for client-side search (runs post-build, strips `pre` elements, includes `<>` chars)
- Giscus (GitHub Discussions) for comments
- Last.fm API for now-playing widget; Trakt API for watching widget; Open-Meteo for weather (no key needed)
- Satori + Sharp for OG image generation at build time

## Key Directories

- `src/config.ts` — SITE, UI, FEATURES (primary config)
- `src/content/blog/YYYY/` — blog posts; `src/content/thoughts/` — short-form; `src/content/home/` — home page content
- `src/schema.ts` — postSchema, pageSchema (zod)
- `src/pages/` — MDX pages (index, blog/index, thoughts, uses, now, colophon, 404, rss.xml)
- `src/layouts/` — `BaseLayout` (root HTML shell), `PageLayout` (aside + panel composition), `StandardLayout` (title/subtitle wrapper for content pages)
- `src/utils/` — `data.ts`, `datetime.ts`, `fs.ts` (build-time file checks), `lastfm.ts`, `misc.ts` (DOM/scroll utilities), `path.ts`, `toc.ts`, `trakt.ts`, `weather.ts`
- `plugins/index.ts` — remark + rehype pipeline
- `src/data/uses.json` — powers /uses page + UnoCSS safelist

## Post Frontmatter (required + notable)

```yaml
title: string          # required, max 60 chars
pubDate: ISO date      # required
tags: []               # optional array
draft: false           # true = dev-only, excluded from prod
toc: true              # disable per-post with false
giscus: true           # disable comments per-post
cover: ./image.jpg     # relative path or URL
series: ''             # display name override for series (auto-derived from dir if empty)
order: 1               # explicit sort within a series
```

Series: 3+ path segments deep (`2025/postgres/1.md`) auto-groups as a series. Name defaults to humanized dir; override with `series` frontmatter field.

## Config Patterns

All site config lives in `src/config.ts` (SITE, UI, FEATURES). Features use the pattern `false | [boolean, config]`. Example:

```ts
toc: [true, { minHeadingLevel: 2, maxHeadingLevel: 5, displayPosition: 'right', displayMode: 'content' }]
```

## UnoCSS Gotchas

- Dynamically constructed class strings (icons, uses.json items) must be added to the `safelist` in `unocss.config.ts` — UnoCSS won't detect them at build time
- Icons follow `i-<collection>-<icon>` or `i-<collection>:<icon>` format from `@iconify/json`
- Content files (`src/content/**`) are not piped through Vite in Astro 5 — listed explicitly in `unocss.config.ts` `content.filesystem`
- Custom breakpoint: `lgp` at `1128px` (in addition to standard Wind3 breakpoints)

## Markdown Pipeline

Remark: `remark-directive`, `remark-directive-sugar` (badge/link/image directives), `remark-imgattr`, `remark-math`, reading-time, OG image generation.

Rehype: heading IDs, KaTeX, callouts (vitepress theme), external links (auto new-tab + icon), autolink headings, table wrapping in `<div>`.

Syntax highlighting: Expressive Code only — `syntaxHighlight: false` in astro.config (Astro's built-in is off).

## Design

Minimal aesthetic — match the existing page. No decorative additions (animations, gradients, drop shadows) unless explicitly requested.

## Content Notes

- Prose tone is intentional — do not rewrite for SEO optimization
- Post images live in `src/assets/<post-slug>/` (co-located, processed by Astro image pipeline)

## Path Aliases

Both `~/` and `@/` resolve to `src/` (`tsconfig.json`). Prefer `~/` — `@/` exists for legacy compatibility only.

## Dead Code / Duplication (Fallow)

Fallow is configured (`.fallowrc.json`) for dead-code and duplication analysis. Run manually after heavy refactors:

```sh
npx fallow
```

Docs: https://fallow.tools/llms.txt
