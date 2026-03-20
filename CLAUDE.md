# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project Overview

Personal blog built with Astro 5, React, Tailwind CSS 4, and TypeScript. Content is written in Markdown. Based on the [AstroPaper](https://github.com/satnaing/astro-paper) theme.

## Development Commands

```bash
pnpm run dev          # Start dev server at http://localhost:4321
pnpm run build        # Build for production
pnpm run format       # Format code
pnpm run lint         # Lint with ESLint
pnpm run typecheck    # Run Astro type checks
```

## After Every Change

Run these before considering any task done:

```bash
pnpm run format       # Format code before verification
pnpm run lint         # Must pass with zero errors
pnpm run build        # Runs astro check (TypeScript) then full build
```

Fix all errors before finishing.

## Content

- **Blog posts**: `src/data/blog/*.md`
- **Projects**: `src/data/projects/*.md`
- **Collections**: defined in `src/content.config.ts` via Astro's Content Layer API
- Files prefixed with `_` are excluded from the blog collection

**Blog post frontmatter** (minimum required: `title`, `description`):
```yaml
title: String (required)
description: String (required)
draft: Boolean
featured: Boolean
tags: String[]
pubDatetime: Date  # set automatically — do not add or edit manually
modDatetime: Date | null  # set automatically — do not add or edit manually
```

**Project frontmatter** (minimum required: `title`, `description`):
```yaml
title: String (required)
description: String (required)
techStack: String[]
repoUrl: String
demoUrl: String
draft: Boolean
featured: Boolean
```

**Querying collections** — always use `postFilter` for blog posts:
```typescript
import { getCollection } from "astro:content";
import postFilter from "@/utils/postFilter";

const posts = (await getCollection("blog")).filter(postFilter);
const projects = await getCollection("projects");
```

## Color System

**Do not introduce new colors.** All UI must use the CSS variables defined in `src/styles/global.css`. They are WCAG AA compliant — do not override them with raw values.

| Variable | Light | Dark |
|---|---|---|
| `--background` | Zinc-100 | Zinc-950 |
| `--foreground` | Zinc-950 | Zinc-200 |
| `--accent` | Blue-600 | Sky-400 |
| `--muted` | Zinc-200 | Zinc-800 |
| `--border` | Zinc-350 | Zinc-700 |
| `--terminal-green` | Green-700 | Emerald-400 |

Terminal and cursor effect variables (`--terminal-bg`, `--terminal-header`, `--terminal-text*`, `--cursor-light*`) are also defined there — use them for any terminal-style UI.

## Components

Existing components in `src/components/` cover most UI needs — check there before creating something new. Use `.astro` for static output and `.tsx` only when client-side interactivity is required.

The `src/components/terminal/` subdirectory has `TerminalLine.astro` and `TerminalOutput.astro` — compose these for any terminal-style UI rather than writing new ones.

## UI & Visual Changes

- Use the `frontend-design` skill when making visual changes to any page or component.
- Every UI change must improve or maintain aesthetic quality — never degrade it.
- Never leave the UI in a broken state: no inconsistent padding, misaligned elements, or broken components. Fix what you touch.
- The goal of any visual change is a polished, intentional result.

## Code Philosophy

- **Boy Scout Rule.** Leave code cleaner than you found it. If a change creates an opportunity to simplify or improve surrounding code, take it.
- **Simplicity over abstraction.** Three similar lines beat a premature helper. Only extract when there is genuine reuse.
- **Always use `@/` for imports from `src/`.** Example: `import postFilter from "@/utils/postFilter"`.
- **No raw color values.** Use CSS variables. Never add inline hex/rgb colors that aren't already in `global.css`.
