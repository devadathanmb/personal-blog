# Personal Blog

A modern, minimal, and performant personal blog built with Astro, featuring a terminal-style interface and clean typography.

## 🚀 Features

- **Terminal-style UI**: Unique terminal prompt branding (`Dev@Machine:~$`)
- **Reading Time**: Automatic calculation and display of estimated reading time
- **Dark/Light Theme**: System-aware theme with manual toggle
- **Blog Posts**: Type-safe markdown with frontmatter validation
- **Projects Showcase**: Dedicated section for project portfolio
- **Search**: Fast fuzzy search powered by Pagefind
- **RSS Feed**: Automatic RSS feed generation
- **SEO Optimized**: Dynamic OG images, meta tags, and sitemap
- **Responsive Design**: Mobile-first approach with smooth animations
- **Accessible**: Keyboard navigation and screen-reader friendly

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/) v5
- **Styling**: [TailwindCSS](https://tailwindcss.com/) v4
- **Type Checking**: [TypeScript](https://www.typescriptlang.org/)
- **Search**: [Pagefind](https://pagefind.app/)
- **Icons**: [Tabler Icons](https://tabler-icons.io/)
- **Code Formatting**: [Prettier](https://prettier.io/)
- **Linting**: [ESLint](https://eslint.org)

## 📦 Project Structure

```
/
├── public/              # Static assets
│   ├── assets/         # Images, fonts, etc.
│   └── favicon.svg
├── src/
│   ├── assets/         # Component assets (icons, images)
│   ├── components/     # Reusable UI components
│   ├── content/        # Content collections
│   │   ├── blog/      # Blog post markdown files
│   │   └── projects/  # Project markdown files
│   ├── layouts/        # Page layouts
│   ├── pages/          # File-based routing
│   ├── styles/         # Global styles and typography
│   ├── utils/          # Helper functions
│   ├── config.ts       # Site configuration
│   └── constants.ts    # Constants (social links, etc.)
└── astro.config.ts     # Astro configuration
```

## 🏃 Getting Started

### Prerequisites

- Node.js v20 or higher
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/devadathanmb/personal-blog.git
cd personal-blog
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm run dev
```

4. Open [http://localhost:4321](http://localhost:4321) in your browser

### Docker (Alternative)

You can also run the project using Docker:

```bash
# Build the image
docker build -t personal-blog .

# Run the container
docker run -p 4321:80 personal-blog

# Or use docker-compose
docker-compose up -d
```

## 📝 Available Commands

| Command                 | Action                                      |
| :---------------------- | :------------------------------------------ |
| `pnpm install`          | Install dependencies                        |
| `pnpm run dev`          | Start dev server at `localhost:4321`        |
| `pnpm run build`        | Build for production to `./dist/`           |
| `pnpm run preview`      | Preview production build locally            |
| `pnpm run format`       | Format code with Prettier                   |
| `pnpm run format:check` | Check code formatting                       |
| `pnpm run lint`         | Lint code with ESLint                       |
| `pnpm run astro check`  | Check Astro types                           |

## ✍️ Adding Content

### Blog Posts

Create a new markdown file in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
description: "A brief description"
pubDatetime: 2025-01-01T12:00:00Z
tags: ["tag1", "tag2"]
draft: false
---

Your content here...
```

### Projects

Create a new markdown file in `src/content/projects/`:

```markdown
---
title: "Project Name"
description: "Project description"
techStack: ["React", "Node.js"]
repoUrl: "https://github.com/user/repo"
demoUrl: "https://demo.example.com"
featured: true
---

Project details...
```

## ⚙️ Configuration

Edit `src/config.ts` to customize:
- Site title, description, author
- Social media links
- Timezone and locale
- OG image settings
- Featured posts count

## 📄 License

MIT License - Copyright © 2025

---

Built with [Astro](https://astro.build/) • Based on [AstroPaper](https://github.com/satnaing/astro-paper) theme by [Sat Naing](https://satnaing.dev)

