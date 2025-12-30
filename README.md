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

This blog uses [Giscus](https://giscus.app/) for comments. To set it up:

1. Go to [giscus.app](https://giscus.app/)
2. Enter your repository: `devadathanmb/personal-blog`
3. Enable Discussions in your GitHub repository settings
4. Copy the `data-repo-id` and `data-category-id` values
5. Update `src/config.ts`:
   ```ts
   export const GISCUS = {
     enabled: true,
     repoId: "YOUR_REPO_ID",      // Replace with your repo ID
     categoryId: "YOUR_CATEGORY_ID", // Replace with your category ID
     // ... other settings
   };
   ```

Comments will automatically sync with your site theme (light/dark mode).

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




