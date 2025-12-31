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

The `.husky/pre-commit` hook automatically manages blog post dates:

1. **New posts** (git status `A`): Adds `pubDatetime` if missing
2. **Modified posts** (git status `M`): Updates `modDatetime` (skips drafts)
3. Runs `pnpm run format` and `pnpm run lint`

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
- **Environment variables**: Git commit hash injected via `import.meta.env.GIT_COMMIT_HASH`

### Key Utilities (`src/utils/`)

- `postFilter.ts`: Filters out drafts and future-scheduled posts (respects `SITE.scheduledPostMargin`)
- `getSortedPosts.ts`: Sorts posts by `pubDatetime` descending
- `getPostsByTag.ts`: Filters posts by tag
- `generateOgImages.ts`: Generates Open Graph images using Satori
- `readingTime.ts`: Calculates reading time for posts

### Styling

- **Tailwind CSS 4**: Uses Vite plugin (`@tailwindcss/vite`)
- **Global styles**: `src/styles/global.css`
- **Typography**: Uses `@tailwindcss/typography` for markdown content
- **Font**: Space Mono (loaded from Google Fonts in `Layout.astro`)

### Markdown Processing

- **Shiki syntax highlighting**: Dual themes (github-light/github-dark)
- **Remark plugins**:
  - `remark-toc`: Generates table of contents
  - `remark-collapse`: Collapses TOC sections
- **Custom transformers**:
  - File name display in code blocks (`src/utils/transformers/fileName.ts`)
  - Notation highlighting, word highlighting, diff support

### React Components

React is integrated via `@astrojs/react` for:
- Giscus comments (`@giscus/react`)
- Interactive UI elements

Components can be `.astro` (static) or `.tsx` (interactive).

## Linting & Formatting Rules

- **ESLint**: Uses TypeScript ESLint + Astro plugin, disallows `console.log` (use proper logging)
- **Prettier**: 80-char line width, 2-space tabs, semicolons required, double quotes
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

### Maintainability Checklist

Before committing changes, verify:
- [ ] Did I only change what was necessary?
- [ ] Did I avoid creating new abstractions?
- [ ] Is the code still simple and easy to understand?
- [ ] Did I delete unused code instead of commenting it out?
- [ ] Would someone else understand this change in 6 months?

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
