# Personal Blog

My personal blog built with [Astro](https://astro.build/), based on the [AstroPaper](https://github.com/satnaing/astro-paper) theme.

## Setup

### Without Docker

1. Clone the repository

   ```bash
   git clone https://github.com/devadathanmb/personal-blog.git
   cd personal-blog
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

   This will also set up git hooks automatically via husky.

3. Start the development server
   ```bash
   pnpm run dev
   ```

The site will be available at `http://localhost:4321`

### With Docker

1. Clone the repository

   ```bash
   git clone https://github.com/devadathanmb/personal-blog.git
   cd personal-blog
   ```

2. Start with docker-compose
   ```bash
   docker-compose up -d
   ```

The site will be available at `http://localhost:4321`

## Git Hooks

This project uses git hooks to automatically manage blog post dates:

- **New posts**: Automatically adds `pubDatetime` when you commit a new blog post
- **Modified posts**: Updates `modDatetime` when you edit published posts (not drafts)

The hooks are managed by [husky](https://typicode.github.io/husky/) and set up automatically during `pnpm install`.

## Giscus Comments

This blog uses [Giscus](https://giscus.app/) for comments powered by GitHub Discussions.

Comments are configured in `src/config.ts`. To disable, set `GISCUS.enabled` to `false`.

### Setup

If you want to use this for your own repository:

1. Enable GitHub Discussions in your repository settings
2. Visit [giscus.app](https://giscus.app/) and enter your repository details
3. Copy the generated `data-repo-id` and `data-category-id` values
4. Update `src/config.ts` with those values
5. Run `pnpm run build`

## Project Structure

```
src/
├── content/
│   ├── blog/       # Blog posts (markdown)
│   └── projects/   # Project pages (markdown)
├── components/     # Reusable components
├── layouts/        # Page layouts
└── styles/         # Global styles
```

## Common Commands

```bash
pnpm run dev        # Start development server
pnpm run build      # Build for production
pnpm run preview    # Preview production build
pnpm run lint       # Lint code
pnpm run format     # Format code
```

---

Based on [AstroPaper](https://github.com/satnaing/astro-paper) by [Sat Naing](https://satnaing.dev)
