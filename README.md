# Personal Blog

A fast, minimal personal blog built with [Astro](https://astro.build/). Features markdown blog posts, project showcases, GitHub Discussions-powered comments, and automatic date management via git hooks.

Based on [AstroPaper](https://github.com/satnaing/astro-paper) theme.

## Screenshots

<!-- Add screenshot of homepage here -->

<!-- Add screenshot of blog post here -->

<!-- Add screenshot of projects page here -->

## Features

- Markdown-based blog posts and project pages
- GitHub Discussions integration for comments (Giscus)
- Automatic post date management with git hooks
- Docker support for easy deployment
- Code formatting and linting

## Setup

### Without Docker

```bash
git clone https://github.com/devadathanmb/personal-blog.git
cd personal-blog
pnpm install  # Automatically sets up git hooks via husky
pnpm run dev
```

Visit `http://localhost:4321`

### With Docker

```bash
git clone https://github.com/devadathanmb/personal-blog.git
cd personal-blog
docker-compose up -d
```

Visit `http://localhost:4321`

## Configuration

### Git Hooks

Automatically manages blog post dates via [husky](https://typicode.github.io/husky/):

- New posts: Adds `pubDatetime` on commit
- Modified posts: Updates `modDatetime` (skips drafts)

### Giscus Comments

Comments powered by GitHub Discussions via [Giscus](https://giscus.app/). Configure in `src/config.ts`.

To set up for your repository:

1. Enable GitHub Discussions in repository settings
2. Generate config at [giscus.app](https://giscus.app/)
3. Update `data-repo-id` and `data-category-id` in `src/config.ts`

## Project Structure

```
src/
├── content/
│   ├── blog/       # Blog posts
│   └── projects/   # Project pages
├── components/     # UI components
├── layouts/        # Page layouts
└── styles/         # Global styles
```

## Commands

| Command            | Description              |
| ------------------ | ------------------------ |
| `pnpm run dev`     | Start development server |
| `pnpm run build`   | Build for production     |
| `pnpm run preview` | Preview production build |
| `pnpm run lint`    | Lint code                |
| `pnpm run format`  | Format code              |

## License

MIT

## Credits

Based on [AstroPaper](https://github.com/satnaing/astro-paper) by [Sat Naing](https://satnaing.dev)
