# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog/website built with [Astro](https://astro.build) and based on the [Astro Paper](https://astro-paper.pages.dev/) theme. It features blog posts, projects showcase, and uses TypeScript, React components, and Tailwind CSS for styling.

## Essential Commands

### Development
- `npm run dev` or `npm start` - Start Astro dev server
- `npm run build` - Type-check with Astro, build for production, and optimize with jampack
- `npm run preview` - Preview production build locally
- `npm run sync` - Sync Astro content collections

### Code Quality
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check formatting without making changes
- `npm run lint` - Lint code with ESLint

### Git Workflow
- `npm run cz` - Interactive commit using Commitizen (conventional commits)
- The project uses `husky` for git hooks and `lint-staged` to auto-format staged files

## Architecture

### Content Collections

The site uses Astro's content collections with two main types:

1. **Blog Posts** (`src/content/blog/`)
   - Schema defined in `src/content/config.ts`
   - Required frontmatter: `title`, `description`, `pubDatetime`, `tags`
   - Optional: `featured`, `draft`, `modDatetime`, `ogImage`, `canonicalURL`
   - Reading time is automatically calculated via remark plugin

2. **Projects** (`src/content/projects/`)
   - Required: `title`, `description`
   - Optional: `featured`, `draft`, `tags`, `repoUrl`, `demoUrl`, `techStack`, `ogImage`

### Key Directories

- `src/components/` - Astro and React components
  - Mix of `.astro` files (Astro components) and `.tsx` files (React components)
  - React is used for interactive components (Card, Search, etc.)

- `src/layouts/` - Page layout components
  - `Layout.astro` - Base HTML layout with meta tags, fonts
  - `PostDetails.astro`, `ProjectDetails.astro` - Content detail pages
  - Other specialized layouts for different page types

- `src/pages/` - File-based routing
  - `posts/[slug]/` - Dynamic blog post routes with OG image generation
  - `projects/[slug].astro` - Dynamic project routes
  - `tags/[tag]/[page].astro` - Paginated tag pages

- `src/utils/` - Utility functions
  - Post filtering, sorting, pagination utilities
  - `remark-reading-time.mjs` - Remark plugin to inject reading time into frontmatter
  - `generateOgImages.tsx` - Satori-based OG image generation

- `src/styles/` - Global styles and Tailwind base

### Configuration

- **Site Config**: `src/config.ts` contains all site metadata (title, author, social links, posts per page)
- **Astro Config**: `astro.config.ts` defines integrations (Tailwind, React, Sitemap) and markdown plugins
- **Tailwind**: `tailwind.config.cjs` uses custom CSS variables for theming (defined in `src/styles/base.css`)
  - Theme uses "skin" utilities (e.g., `text-skin-base`, `bg-skin-fill`) for light/dark mode support

### Reading Time System

Reading time is calculated in two ways:
1. **Build-time**: `remark-reading-time.mjs` plugin injects reading time into frontmatter during markdown processing
2. **Runtime**: Some pages calculate reading time manually using the `reading-time` package on post body

This dual approach exists because of pagination - the remark plugin processes during build, but paginated pages need to recalculate from the raw body.

### Styling Approach

- Tailwind CSS with custom theme based on CSS variables
- Light/Dark mode toggled via `toggle-theme.js` script in `public/`
- Custom color scheme using `--color-*` CSS variables defined in `src/styles/base.css`
- Typography plugin for markdown content rendering

### Image Handling

- OG images generated dynamically using Satori (React to PNG conversion)
- Templates in `src/utils/og-templates/`
- Generated at build time for each post at `/posts/[slug]/index.png`
- Uses `@resvg/resvg-js` for SVG to PNG conversion (excluded from Vite optimization)

### Special Features

- **Git Commit Hash**: Injected into env via Vite define in `astro.config.ts`
- **Cursor Effect**: Custom cursor effect component (`CursorEffect.astro`)
- **Search**: Client-side search using Fuse.js
- **View Transitions**: Enabled via Astro's ViewTransitions

## Development Notes

- The project uses **arrow function syntax** (`=>`) and **double quotes** for strings (enforced by Prettier)
- ESLint configured for Astro files with TypeScript parser
- Commitizen enforces conventional commit messages
- Build process includes type-checking, Astro build, and jampack optimization
