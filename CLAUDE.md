# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An Astro-based personal blog with markdown content, built using Astro 5, React, Tailwind CSS 4, and TypeScript. Features blog posts, project showcases, GitHub Discussions-powered comments (Giscus), and automatic date management via git hooks.

Based on the [AstroPaper](https://github.com/satnaing/astro-paper) theme.

## Development Commands

```bash
# Development
pnpm install          # Install dependencies and set up git hooks
pnpm run dev          # Start dev server at http://localhost:4321

# Code Quality
pnpm run format       # Auto-format code with Prettier
pnpm run format:check # Check formatting without writing
pnpm run lint         # Lint with ESLint

# Build & Deploy
pnpm run build        # Type-check, build, generate search index, copy pagefind to public/
pnpm run preview      # Preview production build
pnpm run sync         # Sync Astro types
```

## Architecture & Key Concepts

### Content Layer System

This project uses Astro's **Content Layer API** (not the legacy `src/content/` pattern):

- **Blog posts**: `src/data/blog/*.md`
- **Projects**: `src/data/projects/*.md`
- **Collections defined in**: `src/content.config.ts` using `glob()` loaders
- Files prefixed with `_` are ignored by the blog collection

### Frontmatter Schema

**Blog posts** (`src/data/blog/*.md`):
```yaml
---
author: String (defaults to SITE.author)
pubDatetime: Date (auto-added by git hook for new posts)
modDatetime: Date | null (auto-updated by git hook on commit)
title: String (required)
featured: Boolean
draft: Boolean
tags: String[] (defaults to ["others"])
ogImage: String | Image
description: String (required)
canonicalURL: String
hideEditPost: Boolean
timezone: String
---
```

**Projects** (`src/data/projects/*.md`):
```yaml
---
title: String (required)
description: String (required)
featured: Boolean
draft: Boolean
tags: String[]
techStack: String[]
repoUrl: String
demoUrl: String
ogImage: String | Image
---
```

### Git Hooks (Husky)

The `.husky/pre-commit` hook runs in this order:

1. Runs `pnpm run format` and `pnpm run lint`
2. **Modified posts** (git status `M`): Updates `modDatetime` (skips drafts)
3. **New posts** (git status `A`): Adds `pubDatetime` if missing

**Important**: If manually editing dates, ensure they're in UTC ISO format: `YYYY-MM-DDTHH:MM:SSZ`

### Build Process & Search

The build command chains multiple steps:
```bash
astro check && astro build && pagefind --site dist && cp -r dist/pagefind public/
```

- `astro check`: TypeScript validation
- `astro build`: Builds to `dist/`
- `pagefind --site dist`: Generates search index from built HTML
- `cp -r dist/pagefind public/`: Copies search index for deployment

**Note**: Pagefind runs on the built output, so content must be rendered to HTML before indexing.

### Configuration Files

- **Site config**: `src/config.ts` - Contains `SITE` and `GISCUS` configuration objects
- **Astro config**: `astro.config.ts` - Integrations, markdown plugins, Vite setup
- **Path aliases**: `@/*` resolves to `src/*` (configured in `tsconfig.json`)
- **Environment variables**: `GIT_COMMIT_HASH` (build time), `PUBLIC_GOOGLE_SITE_VERIFICATION` (optional)

### Key Utilities (`src/utils/`)

- `postFilter.ts`: Filters out drafts and future-scheduled posts (respects `SITE.scheduledPostMargin`)
- `getSortedPosts.ts`: Sorts posts by `pubDatetime` descending
- `getPostsByTag.ts`: Filters posts by tag
- `getPostsByGroupCondition.ts`: Generic grouping utility (accepts a grouping function)
- `getUniqueTags.ts`: Extracts and deduplicates tags from all posts
- `getPath.ts`: Constructs full URL paths for blog posts
- `slugify.ts`: `slugifyStr()` and `slugifyAll()` using lodash kebabcase
- `generateOgImages.ts`: Generates Open Graph images using Satori
- `loadGoogleFont.ts`: Loads Google Fonts as ArrayBuffer for OG image generation
- `readingTime.ts`: Calculates reading time for posts

### Styling

- **Tailwind CSS 4**: Uses Vite plugin (`@tailwindcss/vite`)
- **Global styles**: `src/styles/global.css` (CSS variables, theme colors)
- **Typography styles**: `src/styles/typography.css`
- **Font**: IBM Plex Mono (monospace font stack)

### Color System

**IMPORTANT**: All colors are WCAG AA compliant. Do NOT modify without verifying contrast ratios (use WebAIM or browser DevTools).

**Light Mode** (`src/styles/global.css`):
- Background: `rgb(244 244 245)` - Zinc-100
- Foreground: `rgb(24 24 27)` - Zinc-950
- Accent: `rgb(37 99 235)` - Blue-600
- Muted: `rgb(228 228 231)` - Zinc-200
- Border: `rgb(186 186 190)` - Zinc-350
- Terminal Green: `rgb(22 101 52)` - Green-700

**Dark Mode**:
- Background: `rgb(9 9 11)` - Zinc-950
- Foreground: `rgb(228 228 231)` - Zinc-200
- Accent: `rgb(56 189 248)` - Sky-400
- Muted: `rgb(39 39 42)` - Zinc-800
- Border: `rgb(63 63 70)` - Zinc-700
- Terminal Green: `rgb(74 222 128)` - Green-400

There are also terminal-specific and cursor effect variables (`--terminal-bg`, `--terminal-header`, `--terminal-text*`, `--cursor-light*`) — see `global.css` for the full list.

### Markdown Processing

- **Shiki syntax highlighting**: Dual themes (`github-light-default` / `github-dark-default`)
- **Remark plugins**:
  - `remark-toc`: Generates table of contents
  - `remark-collapse`: Collapses TOC sections
- **Custom transformers** (`src/utils/transformers/`):
  - `fileName.js`: File name display in code blocks
  - Notation highlighting, word highlighting, diff support (via shiki transformers)

### React Components

React is integrated via `@astrojs/react` for:
- Giscus comments (`@giscus/react`) — `Comments.tsx`
- Interactive UI elements

Components can be `.astro` (static) or `.tsx` (interactive).

## Linting & Formatting Rules

- **ESLint**: Uses TypeScript ESLint + Astro plugin (flat config), disallows `console.log`
- **Prettier**: 80-char line width, 2-space tabs, semicolons required, double quotes, `arrowParens: "avoid"`, LF line endings
- **Prettier plugins**: `prettier-plugin-astro`, `prettier-plugin-tailwindcss`

## Code Philosophy & Maintainability

### NEVER Over-Engineer

This codebase values **simplicity and maintainability** over clever abstractions. Follow these principles:

**1. Question Every Refactor**
- When asked to refactor, ALWAYS run `git diff` first to see what actually changed
- Critically evaluate: Does this code actually need refactoring?
- Ask: Is the current code causing real problems, or just "not perfect"?
- **Default to NO** - only refactor if there's a concrete benefit

**2. Avoid Premature Abstraction**
- Three similar lines of code is better than a premature abstraction
- Don't create utilities, helpers, or abstractions for one-time operations
- Don't extract functions "for readability" unless there's genuine code reuse
- Inline and explicit is better than clever and indirect

**3. Keep Changes Minimal**
- Only change what's necessary to solve the immediate problem
- Don't "clean up" surrounding code unless explicitly asked
- Don't add "nice-to-have" features or improvements
- A bug fix should fix the bug, nothing more

**4. Resist the Urge to "Improve"**
- Don't add error handling for scenarios that can't happen
- Don't add configuration options for things that don't need configuring
- Don't add comments to self-evident code
- Don't add type annotations to code you didn't change

**5. Delete, Don't Deprecate**
- If something is unused, delete it completely
- No `_unusedVar` renames, no `// removed` comments
- No backwards-compatibility hacks for internal code
- Clean breaks are better than accumulated cruft

**Remember**: The best code is no code. The second best is boring, obvious code.

## Common Patterns

### Adding a New Blog Post

1. Create `src/data/blog/my-post.md`
2. Add required frontmatter (at minimum: `title`, `description`, `draft: false`)
3. Commit - the git hook will add `pubDatetime` automatically
4. Use `draft: true` for unpublished posts

### Adding a New Project

1. Create `src/data/projects/my-project.md`
2. Include: `title`, `description`, `techStack`, `repoUrl`/`demoUrl` as needed
3. No automatic date management for projects

### Filtering Posts

Always use `postFilter()` when querying blog posts to exclude:
- Drafts
- Posts scheduled for future publication (unless in dev mode)

### Working with Collections

```typescript
import { getCollection } from "astro:content";
import postFilter from "@/utils/postFilter";

const posts = (await getCollection("blog")).filter(postFilter);
const projects = await getCollection("projects");
```

## Important Notes

- **No `src/content/` directory**: This project uses `src/data/` with the Content Layer API
- **Pagefind generated during build**: Search won't work in dev mode without a prior build
- **UTC timestamps**: All dates should be in UTC with `Z` suffix
- **Path imports**: Always use `@/` alias for imports from `src/`
- **No console.log**: ESLint will error - remove debug statements before committing
