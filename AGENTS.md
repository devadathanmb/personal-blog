# Personal Blog

Devadathan's personal blog at devadathanmb.in — built with Astro 6, shipped as a **fully static site** (`output` defaults to `static`; no SSR adapter) and deployed to Cloudflare Workers (static assets). **`v2` is the current production branch** — pushing to `v2` deploys to production (devadathanmb.in). `main` is a separate, older version of the site, not what's live.

## Commands

| Command             | Purpose                                |
| ------------------- | -------------------------------------- |
| `pnpm dev`          | Dev server                             |
| `pnpm build`        | Build (also runs `pagefind` postbuild) |
| `pnpm preview`      | Build + `wrangler dev` locally         |
| `pnpm check`        | `astro check` (TypeScript)             |
| `pnpm lint`         | ESLint (0 warnings allowed)            |
| `pnpm format:write` | Prettier with cache                    |
| `pnpm deploy`       | Build + `wrangler deploy` (`dist/`)    |

Pre-commit hook: `lint-staged` (ESLint fix on JS/TS/Astro) + full `prettier` + `astro check`. `lint-staged` also runs `scripts/bump-last-updated.mjs` on any committed `src/pages/**/*.mdx`, rewriting its `<LastUpdated date="…" />` to today's date (no-op if already today or the page has no widget) and re-staging it — so a page's "last updated" always reflects its last shipped change, regardless of editor. CI runs check + lint + build on push/PR to `v2`. Node ≥ 22.12, pnpm 10.

## Stack

- Astro 6 + MDX — static output (no adapter). `wrangler deploy` serves `dist/` as static assets (`wrangler.jsonc`, `not_found_handling: 404-page`)
- UnoCSS (Wind3 + Attributify `u-` prefix + Icons + WebFonts: Inter / DM Mono / Roboto Condensed) — no Tailwind
- Expressive Code for syntax highlighting (config in `ec.config.mjs`; themes vitesse-dark / vitesse-light, toggled by `:root.dark`)
- Pagefind for client-side search (runs post-build, strips `pre` elements, includes `<>` chars)
- Giscus (GitHub Discussions) for comments
- Last.fm API for now-playing widget; Trakt API for watching widget; Open-Meteo for weather (no key needed) — all fetched client-side
- Satori + Sharp generate OG images at build time (`plugins/remark-generate-og-image.ts` + `plugins/og-template/`). `public/og-images/` is a **committed cache** — the plugin skips generation when the PNG already exists. After adding a page/post with `ogImage` enabled, commit the generated `public/og-images/<slug>.png`; otherwise every build regenerates it and leaves it untracked.

## Key Directories

- `src/config.ts` — SITE, UI, FEATURES (primary config); `src/types.ts` — the `Site`/`Ui`/`Features` types it implements
- `src/content.config.ts` — content collections (`blog`, `thoughts`, `home`, plus a schema-only `pages` collection that exists solely so `astro check` validates MDX page frontmatter)
- `src/content/blog/YYYY/` — blog posts; `src/content/thoughts/` — short-form; `src/content/home/` — home page content (`_`-prefixed files are ignored by the loader)
- `src/schema.ts` — `postSchema`, `pageSchema` (zod); each field carries a `.describe()` doc string — read it before adding frontmatter
- `src/pages/` — MDX pages (index, blog/index, thoughts, uses, now, colophon, 404, rss.xml) + dynamic `blog/[...slug]` and `thoughts/[...slug]`
- `src/layouts/` — `BaseLayout` (root HTML shell), `PageLayout` (aside + panel composition), `StandardLayout` (title/subtitle wrapper for content pages)
- `src/components/` — grouped by role: `base/`, `nav/`, `tags/`, `toc/`, `views/` (list/post renderers), `widgets/` (now-playing, GitHub, Trakt, weather, share, etc.), `backgrounds/` (the `bgType` options)
- `src/utils/` — `data.ts`, `datetime.ts`, `fs.ts` (build-time file checks), `lastfm.ts`, `misc.ts` (DOM/scroll utilities), `path.ts`, `toc.ts`, `trakt.ts`, `weather.ts`
- `src/styles/` — `main.css`, `prose.css`, `markdown.css`
- `plugins/` — `index.ts` (remark + rehype pipeline), `remark-reading-time.ts`, `remark-generate-og-image.ts`, `og-template/`
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

- Dynamically constructed class strings (icons, uses.json items) must be added to the `safelist` in `unocss.config.ts` — UnoCSS won't detect them at build time. This includes literal class strings that live in a `.ts`/constants module and are applied via a `class={…}` binding (e.g. `src/components/widgets/pillIcons.ts`): static extraction can't follow the binding, so they need safelisting even though the token appears literally in a scanned file. A class written directly in markup (`.astro`/`.mdx`) does not.
- Icons follow `i-<collection>-<icon>` or `i-<collection>:<icon>` format from `@iconify/json`
- Content files (`src/content/**`) are not piped through Vite in Astro 6 — listed explicitly in `unocss.config.ts` `content.filesystem`
- Custom breakpoint: `lgp` at `1128px` (in addition to standard Wind3 breakpoints)
- Utility CSS is split into per-component chunks; a page only links the chunks its loaded components reference. Utilities that appear **only** in a shared/nested component (e.g. `PillWidget`, rendered via other widgets) can be dropped from a page's CSS. For a component's own **structural** styles that must always render, author them as plain CSS in the component's `<style>` block (always bundled when it renders) rather than utility classes — see `PillWidget.astro`'s `.pill` shell

## Markdown Pipeline

Remark: `remark-directive`, `remark-directive-sugar` (badge/link/image directives), `remark-imgattr`, `remark-math`, reading-time, OG image generation.

Rehype: heading IDs, KaTeX, callouts (vitepress theme), external links (auto new-tab + icon), autolink headings, table wrapping in `<div>`.

Syntax highlighting: Expressive Code only — `syntaxHighlight: false` in astro.config (Astro's built-in is off).

### MDX inline-JSX + Prettier gotcha

Never hand-write a standalone inline JSX element that mixes text and tags in MDX, e.g. `<em>text <Link/> more text</em>` on its own line. Prettier expands it across lines, and MDX then parses the breaks as separate paragraphs (prettier [#16589](https://github.com/prettier/prettier/issues/16589)/[#6274](https://github.com/prettier/prettier/issues/6274)) — the line renders broken. Inline links _inside_ a normal prose paragraph are fine (`proseWrap: preserve` keeps them on one line); only standalone JSX blocks break.

For the common "italic note with one link" case (the closing line on `/uses`, `/now`, `/colophon`), use `~/components/base/ProseNote.astro` — a prop-only self-closing tag Prettier can't split. For other one-off cases, move the markup into an `.astro` component so the MDX only holds a single self-closing tag.

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
