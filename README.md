# Personal Blog

A fast, minimal personal blog built with [Astro 🚀](https://astro.build/)

Features markdown blog posts, project showcases, GitHub Discussions-powered comments, and automatic date management via git hooks.

Based on [AstroPaper](https://github.com/satnaing/astro-paper) theme.

## Screenshots

<!-- Dark Mode -->
<img width="5088" height="3366" alt="image" src="https://github.com/user-attachments/assets/26c2df58-9edb-4fea-9174-1912f4d55186" />
<img width="5088" height="3366" alt="image" src="https://github.com/user-attachments/assets/222fdf9f-720e-4082-a942-96aea0894b22" />

<!-- Light Mode -->
<img width="5088" height="3366" alt="image" src="https://github.com/user-attachments/assets/f1115852-66bf-4aff-8e5c-4b498c583baf" />
<img width="5088" height="3366" alt="image" src="https://github.com/user-attachments/assets/b6918201-c2c1-4d73-a0bd-aa29f73c6064" />

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

Comments powered by GitHub Discussions via [Giscus](https://giscus.app/). Configure in `src/config.ts`

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
