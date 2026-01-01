# Personal Blog

A fast, minimal personal blog built with [Astro](https://astro.build/). Features markdown blog posts, project showcases, GitHub Discussions-powered comments, and automatic date management via git hooks.

Based on [AstroPaper](https://github.com/satnaing/astro-paper) theme.

## Screenshots

<!-- Dark Mode -->
<img width="5088" height="3366" alt="image" src="https://github.com/user-attachments/assets/bec3425b-69fa-4b7b-8012-7010ef0b5e8a" />
<img width="5088" height="3366" alt="image" src="https://github.com/user-attachments/assets/7cf74d65-812c-4b81-9e1c-68b7e27a965a" />

<!-- Light Mode -->
<img width="5088" height="3366" alt="image" src="https://github.com/user-attachments/assets/ba20fe50-de35-476f-afd4-e61be623bb68" />
<img width="5088" height="3366" alt="image" src="https://github.com/user-attachments/assets/cd0aa7c2-6a50-4258-a840-b195b27cfd2d" />


## Features

- Markdown-based blog posts and project pages
- GitHub Discussions integration for comments (Giscus)
- Automatic post date management with git hooks

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
