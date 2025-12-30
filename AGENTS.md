# AGENTS.md

Personal blog built with Astro 5.x, based on AstroPaper theme.

## Setup commands

```bash
# Install dependencies (MUST use pnpm)
pnpm install

# Start dev server (http://localhost:4321)
pnpm dev

# Build for production
pnpm run build

# Preview production build
pnpm preview
```

## Before committing

**Always run these in order:**

```bash
pnpm run format  # Auto-format with Prettier
pnpm run lint    # Check ESLint rules
pnpm run build   # Verify build succeeds
pnpm preview     # Test in browser
```

## Code style

- **TypeScript strict mode** - explicit types required
- **Prettier enforced** - 2 spaces, double quotes, semicolons, 80 char width
- **ESLint rule:** `no-console` is an error - remove debug logs before committing
- **Imports:** Use `@/` path alias for `src/` imports: `import { SITE } from "@/config"`
- **Naming:**
  - Components: PascalCase (`BlogCard.astro`)
  - Files/folders: kebab-case (`blog-post.md`, `date-utils.ts`)
  - Constants: UPPER_SNAKE_CASE (`SITE`, `BLOG_PATH`)
  - Variables/functions: camelCase (`getPostBySlug`)

## Project structure

```
src/
├── data/
│   ├── blog/        # Blog posts (markdown) - main content
│   └── projects/    # Project pages (markdown)
├── components/      # Astro/React components
├── layouts/         # Page layouts
├── pages/           # Routes (Astro file-based routing)
├── styles/          # Global CSS + Tailwind
├── utils/           # Helper functions
├── config.ts        # SITE object - site metadata
└── content.config.ts # Content schema (Astro Content Layer)
```

## Content guidelines

### Blog posts (`src/data/blog/*.md`)

**Required frontmatter:**
```yaml
---
title: "Post Title"
description: "Brief description"
pubDatetime: 2025-01-15T10:00:00Z  # Auto-added by git hook if missing
tags: ["tech", "tutorial"]         # Defaults to ["others"]
---
```

**Optional fields:**
- `modDatetime` - Auto-updated by git hook on file modification (if `draft: false`)
- `featured: true` - Shows on homepage
- `draft: true` - Hides post from build
- `author` - Defaults to `SITE.author`
- `ogImage` - Custom OG image path
- `canonicalURL` - For cross-posted content

**File naming:** Use kebab-case (`my-awesome-post.md`). Files starting with `_` are ignored.

**Git hook behavior:**
- On `git add` (new file): Adds `pubDatetime` if missing
- On `git commit` (modified file): Updates `modDatetime` if `draft: false`

### Projects (`src/data/projects/*.md`)

**Required:**
```yaml
---
title: "Project Name"
description: "Project description"
---
```

**Optional:** `featured`, `draft`, `tags`, `techStack`, `repoUrl`, `demoUrl`, `ogImage`

## Tech stack

- **Framework:** Astro 5.x (static site generation)
- **Styling:** Tailwind CSS v4 (with `@tailwindcss/vite` plugin)
- **Content:** Astro Content Layer with glob loader
- **Search:** Pagefind (generated during build)
- **Package manager:** pnpm (required - do NOT use npm/yarn)

## Testing changes

1. Save file → check dev server for errors
2. Run format + lint: `pnpm run format && pnpm run lint`
3. Build: `pnpm run build` (includes type check, Astro build, search index generation)
4. Preview: `pnpm preview` → open browser → verify visually
5. Check responsive design (mobile/tablet/desktop)
6. Toggle dark mode if styling changed

## Common issues

**"Module not found" error:**
- Check path aliases use `@/` correctly
- Verify file exists at import path

**Lint error "no-console":**
- Remove all `console.log()` statements

**Content not showing:**
- Check frontmatter matches schema in `src/content.config.ts`
- Ensure `draft: false` or field is absent
- File name must not start with `_`

**Search not working:**
- Rebuild project - Pagefind generates index during `pnpm run build`
- Index is in `dist/pagefind/` and copied to `public/pagefind/`

## Configuration files

- **`src/config.ts`** - Site metadata (`SITE` object) - used throughout app
- **`src/content.config.ts`** - Content schemas (blog/project frontmatter structure)
- **`astro.config.ts`** - Framework config, integrations, markdown plugins
- **`.prettierrc.mjs`** - Code formatting rules (enforced)
- **`eslint.config.js`** - Linting rules (TypeScript + Astro recommended)

After changing schemas: `pnpm astro sync`

## Astro conventions

- Prefer `.astro` components over React (use React only when interactivity needed)
- Use `client:*` directives for React hydration: `<Button client:load />`
- Mobile-first Tailwind styling
- Dark mode: Use `dark:` prefix (automatically works)

## Git hooks (Husky)

Pre-commit hook (`.husky/pre-commit`):
1. Updates `modDatetime` for modified blog posts (only if `draft: false`)
2. Adds `pubDatetime` for new blog posts if missing

Hooks auto-install via `pnpm install` (package.json `prepare` script).

**Note:** The `prepare` script uses `husky || true` to prevent build failures in production environments (like Vercel) where devDependencies aren't installed.
