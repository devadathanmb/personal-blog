# AGENTS.md

## Commands
```bash
pnpm run dev          # Dev server at localhost:4321
pnpm run build        # Type-check + build + pagefind search index
pnpm run format       # Format with Prettier
pnpm run lint         # Lint with ESLint
```
No test suite in this project.

## Architecture
Astro 5 blog with React, Tailwind CSS 4, TypeScript. Content in `src/data/blog/*.md` and `src/data/projects/*.md` (Content Layer API, not `src/content/`). Collections defined in `src/content.config.ts`. Config in `src/config.ts`. Utilities in `src/utils/`. Git hooks auto-manage `pubDatetime`/`modDatetime`.

## Code Style
- Use `@/` path alias for imports from `src/`
- Prettier: 80-char lines, 2-space indent, semicolons, double quotes
- ESLint: No `console.log` allowed
- Dates in UTC ISO format: `YYYY-MM-DDTHH:MM:SSZ`
- Always filter posts with `postFilter()` to exclude drafts/future posts
- Value simplicity: avoid abstractions, keep changes minimal, delete unused code
- See CLAUDE.md for full details
