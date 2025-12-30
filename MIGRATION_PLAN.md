# Astro Paper v5.5.0 Migration Plan

**Branch:** `astro-paper-v5-migration`
**Strategy:** Fresh install + incremental customization
**Reference:** Old code at `../personal-blog-old` (git worktree on commit b1d3860)

---

## Migration Status

### ✅ All Tasks Completed!

1. **Branch Setup** - Created `astro-paper-v5-migration` branch
2. **Fresh Install** - Installed Astro Paper v5.5.0 from main branch
3. **Worktree** - Created git worktree at `../personal-blog-old` for reference (commit b1d3860)
4. **Content Migration**
   - Copied 5 blog posts from `src/content/blog/` to `src/data/blog/`
   - Copied 6 projects from `src/content/projects/` to `src/data/projects/`
   - Copied blog assets (images) to `src/assets/`
   - Added projects collection to `src/content.config.ts`
   - Fixed image import paths (`@assets/` → `../../assets/`)
   - Migrated about page content with personal introduction
5. **Configuration**
   - Updated `src/config.ts` with site details (title, author, description, etc.)
   - Updated `src/constants.ts` with social links (GitHub, LinkedIn, Mail, Discord, Telegram)
   - Created Discord icon SVG and added to social links
6. **Theme Refactoring**
   - Applied GitHub color scheme to `src/styles/global.css`
   - Light mode: GitHub white/dark text/blue accent
   - Dark mode: GitHub dark bg/light text/sky blue accent
   - Theme toggle works perfectly with existing v5 mechanism
7. **Terminal Component**
   - Copied `Terminal.astro` from old blog
   - Added to homepage with responsive GitHub-themed styling
   - **Refined to match authentic terminal aesthetics**:
     - Username: "Dev" (capitalized for personal branding)
     - Commands (`whoami`, `cat`, `ls`) in bright green
     - Hostname in terminal green
     - Username and @ symbol in white (#e6edf3)
     - Directories in bright blue (#58a6ff) - matching real terminal colors
     - Files in white/light gray
     - Removed excessive noise (no permission details, clean output)
     - Clean `ls` output showing just directories and files
     - Normal font weight (400) for natural appearance
   - Better semantic HTML with specific classes for each element type
   - Consistent styling between dark and light themes
   - Authentic terminal look without being cluttered
8. **Header Enhancement**
   - Migrated terminal-style prompt logo: `Dev@Machine:~$_`
   - Added terminal-green color variable to theme
   - Added blinking cursor animation
   - Proper color scheme: blue accent, green for "Machine", blinking cursor
9. **Homepage Layout Refinement**
   - Wrapped Terminal and blog sections in consistent container (max-w-5xl)
   - Applied proper spacing and alignment for visual hierarchy
   - Featured and Recent Posts sections now match Terminal width
   - Fixed nested section issue causing width constraint problems
   - Changed inner sections to divs to avoid CSS conflicts
   - Improved responsive behavior with proper padding
   - Added letter-spacing: -0.025em to body for tighter text
   - Added tracking-tight to card titles for better readability
   - Added mt-2 spacing between card date and description
10. **Footer Enhancement**
   - Added git commit hash injection via Vite define in `astro.config.ts`
   - Footer displays clickable commit hash linking to GitHub
   - Added animated shine effect to deployed commit text
   - Shine animation moves gradient across text (7s linear infinite)
   - Different gradients for light/dark themes
   - Hover pauses animation and restores normal text color
11. **Projects Pages**
    - Created `/projects` listing page
    - Created `/projects/[slug]` detail page route
    - Created `ProjectCard.astro` component
    - Added `IconExternalLink.svg` icon
    - Adapted to Astro v5 content collection API (render function, id instead of slug)
    - Fixed typography styling to use `app-prose` class for consistent styling
    - Fixed description color from `opacity-80` to `text-foreground/90` for better readability
    - Removed `prose-lg` to use default prose sizing matching blog posts
12. **Testing & Verification**
    - Build passes: 35 pages generated (28 base + 7 project pages)
    - `pnpm astro check` passes with 0 errors
    - All blog posts, projects, and assets loading correctly
13. **Reading Time Feature**
    - Installed `reading-time` package (v1.5.0)
    - Created `src/utils/readingTime.ts` utility with proper TypeScript types
    - Updated `Datetime.astro` component to accept and display reading time
    - Updated `Card.astro` to calculate reading time from post body
    - Updated `PostDetails.astro` layout to show reading time on individual posts
    - Reading time displays in format "X min read" alongside date
    - Separated by bullet point (•) for clean visual hierarchy
14. **Cursor Animation Effect**
    - Migrated `CursorEffect.astro` component from old blog
    - **Refactored for better code quality**:
      - Removed unnecessary OOP class structure (single-instance usage)
      - Removed redundant `CursorPosition` interface
      - Simplified to module-level functions and variables
      - Named constants: `THROTTLE_MS` (10), `HIDE_DELAY_MS` (100)
      - Fixed TypeScript types with `ReturnType<typeof setTimeout>`
      - Reduced code from 55 to 37 lines (33% reduction)
    - Added cursor CSS variables and styles to `global.css`:
      - Dual radial gradients (15px core + 600px glow)
      - Smooth opacity transitions (0 → 1)
      - Pulse animation when active
      - Theme-aware colors (blue in both themes)
      - Progressive enhancement with @supports
    - Integrated into `Layout.astro` for global availability
    - Performant with throttling, z-index 999, pointer-events none
15. **Git Hooks Setup**
    - Created `.husky/pre-commit` hook for automatic date management
    - **For modified posts** (draft: false):
      - Auto-updates `modDatetime` to current UTC time
      - Only applies to published posts, not drafts
    - **For new posts**:
      - Auto-adds `pubDatetime` if missing
    - Added `"prepare": "husky"` script to package.json
    - Hooks set up automatically on `pnpm install`
    - Based on AstroPaper article: https://astro-paper.pages.dev/posts/setting-dates-via-git-hooks/
16. **Cleanup & Documentation**
    - Removed AstroPaper-specific artifacts:
      - Deleted `.github/` folder (CODE_OF_CONDUCT, CONTRIBUTING, issue templates, PR template)
      - Removed `AstroPaper-lighthouse-score.svg`
      - Removed `cz.yaml` (Commitizen config)
      - Kept Docker files (Dockerfile, docker-compose.yml, .dockerignore)
    - Restored CI workflow (`.github/workflows/ci.yml`):
      - Runs linting, format checking, and builds on PRs
      - Updated to pnpm v10.15.0
    - **Improved README**:
      - Added numbered steps for setup (with/without Docker)
      - Added Git Hooks section explaining auto-date feature
      - Added Project Structure overview
      - Added Common Commands reference
      - Better organization while staying concise

### 📦 Ready for Deployment

All essential features migrated successfully. Branch ready to push and merge.

---

## Key Principles

- **REFACTOR, don't copy** - Extract only essential customizations
- **Minimal changes** - V5 already has theme toggle, just adjust colors
- **Incremental approach** - One feature at a time, test, commit

---

## Migration Complete! 🎉

All essential features have been successfully migrated and refactored:
- ✅ Fresh Astro Paper v5.5.0 installation
- ✅ Content migrated (5 blog posts + 6 projects)
- ✅ GitHub color theme applied
- ✅ Terminal component on homepage (refactored with authentic colors)
- ✅ Header with terminal logo and blinking cursor
- ✅ Footer with animated shine effect on git commit hash
- ✅ Reading time feature on all posts
- ✅ Cursor gradient animation effect (refactored from class to functions)
- ✅ Git hooks for automatic date management
- ✅ Projects listing and detail pages
- ✅ CI workflow for quality checks
- ✅ Cleaned up AstroPaper artifacts
- ✅ Improved README with clear setup instructions
- ✅ Build passing (35+ pages generated)

**Total Commits:** 10+ commits with detailed changelogs
**Code Quality:** All checks passing, refactored where needed
**Documentation:** README updated, git hooks explained

Ready for merge and deployment!

---

## Implementation Reference

### Theme Colors Applied

**GitHub Dark Theme:**
```css
--color-fill: 13, 17, 23;           /* background */
--color-text-base: 230, 237, 243;   /* text */
--color-accent: 56, 189, 248;       /* vibrant sky blue */
--color-card: 22, 27, 34;           /* card background */
--color-border: 48, 54, 61;         /* borders */
```

**GitHub Light Theme:**
```css
--color-fill: 255, 255, 255;        /* white background */
--color-text-base: 36, 41, 47;      /* dark gray text */
--color-accent: 9, 105, 218;        /* blue */
--color-card: 246, 248, 250;        /* light gray */
--color-border: 208, 215, 222;      /* border gray */
```

### Current V5 Theme (global.css:6-21)

```css
:root,
html[data-theme="light"] {
  --background: #fdfdfd;
  --foreground: #282728;
  --accent: #006cac;
  --muted: #e6e6e6;
  --border: #ece9e9;
}

html[data-theme="dark"] {
  --background: #212737;
  --foreground: #eaedf3;
  --accent: #ff6b01;
  --muted: #343f60;
  --border: #ab4b08;
}
```

### Action Required

Replace v5's color variables with GitHub palette:

```css
:root,
html[data-theme="light"] {
  --background: rgb(255 255 255);      /* GitHub white */
  --foreground: rgb(36 41 47);         /* GitHub dark text */
  --accent: rgb(9 105 218);            /* GitHub blue */
  --muted: rgb(246 248 250);           /* GitHub light gray */
  --border: rgb(208 215 222);          /* GitHub border */
}

html[data-theme="dark"] {
  --background: rgb(13 17 23);         /* GitHub dark bg */
  --foreground: rgb(230 237 243);      /* GitHub light text */
  --accent: rgb(56 189 248);           /* Vibrant blue */
  --muted: rgb(22 27 34);              /* GitHub dark card */
  --border: rgb(48 54 61);             /* GitHub dark border */
}
```

**Note:** V5 uses hex colors, but GitHub theme uses RGB format. Convert appropriately.

---

## Next Task: Terminal Component

### Goal
Add Terminal hero component to homepage.

### Files Involved

**Source:** `../personal-blog-old/src/components/Terminal.astro`
**Destination:** `src/components/Terminal.astro`

### Steps

1. Copy Terminal component: `cp ../personal-blog-old/src/components/Terminal.astro src/components/`
2. Check for dependencies (CSS, imports, assets)
3. Update `src/pages/index.astro` to import and use Terminal
4. Test rendering: `pnpm dev`

### Integration Point (index.astro)

Add Terminal above hero section:

```astro
---
import Terminal from "@/components/Terminal.astro";
// ... other imports
---
<Layout>
  <Header />
  <Main pageTitle="Home">
    <Terminal />

    <!-- existing hero content -->
  </Main>
</Layout>
```

---

## Next Task: Footer Git Commit Hash

### Goal
Display deployed git commit hash in footer.

### Files to Modify

1. **`astro.config.ts`** - Inject git hash via Vite
2. **`src/components/Footer.astro`** - Display commit hash

### Step 1: astro.config.ts

Add git commit injection:

```typescript
import { execSync } from "child_process";

export default defineConfig({
  // ... existing config
  vite: {
    define: {
      "import.meta.env.GIT_COMMIT_HASH": JSON.stringify(
        execSync("git rev-parse --short HEAD").toString().trim()
      ),
    },
  },
});
```

### Step 2: Footer.astro

Reference old footer for styling: `../personal-blog-old/src/components/Footer.astro`

Add commit display section:

```astro
---
const commitHash = import.meta.env.GIT_COMMIT_HASH || "unknown";
const githubRepo = "https://github.com/devadathanmb/personal-blog";
---

<footer>
  <!-- existing footer content -->

  <div class="deployed-commit">
    <span>Deployed commit: </span>
    <a
      href={`${githubRepo}/commit/${commitHash}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {commitHash}
    </a>
  </div>
</footer>
```

**Optional:** Copy shine animation styling from old footer if desired.

---

## Testing Checklist

Before considering migration complete, verify:

### Build
- [ ] `pnpm astro check` - No errors
- [ ] `pnpm build` - Builds successfully
- [ ] Pagefind index generated (if search is used)

### Content
- [ ] All 5 blog posts display
- [ ] All 6 projects display
- [ ] Blog images load correctly
- [ ] Post metadata (dates, tags) correct

### Features
- [ ] Theme toggle works (light/dark)
- [ ] GitHub colors applied correctly
- [ ] Terminal component renders
- [ ] Footer shows commit hash
- [ ] Navigation works
- [ ] Social links correct

### Pages
- [ ] Homepage (`/`)
- [ ] Blog listing (`/posts/`)
- [ ] Individual post (`/posts/[slug]/`)
- [ ] Projects listing (`/projects/` - may need to create)
- [ ] Individual project (`/projects/[slug]` - may need to create)
- [ ] About page (`/about/`)
- [ ] Tags page (`/tags/`)
- [ ] Search page (`/search/`)

### Responsive
- [ ] Desktop (1920px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

---

## Projects Page Setup

**Note:** Astro Paper v5.5.0 may not include projects page by default. Need to verify and potentially create.

### Check if exists:
```bash
ls src/pages/projects*
```

### If missing, reference old implementation:
- `../personal-blog-old/src/pages/projects.astro`
- `../personal-blog-old/src/pages/projects/[slug].astro`
- `../personal-blog-old/src/components/ProjectCard.tsx` (convert to .astro)

### Files to create:
1. `src/pages/projects.astro` - Projects listing
2. `src/pages/projects/[slug].astro` - Individual project page
3. `src/components/ProjectCard.astro` - Project card component

---

## Commit Strategy

Commit after each major task:

```bash
git add .
git commit -m "feat: [description]"
```

**Commit messages so far:**
1. ✅ `chore: Clear for fresh Astro Paper v5 install`
2. ✅ `feat: Install Astro Paper v5.5.0`
3. ✅ `feat: Copy blog posts, projects, and assets from old site`
4. ✅ `feat: Update site configuration (title, author, socials)`

**Upcoming commits:**
5. `feat: Apply GitHub color theme`
6. `feat: Add Terminal component to homepage`
7. `feat: Add git commit hash to footer`
8. `feat: Add projects listing and detail pages` (if needed)

---

## Deployment Checklist

Before merging to main:

1. [ ] All tests pass
2. [ ] Build succeeds
3. [ ] Preview deployed site works
4. [ ] No console errors
5. [ ] Lighthouse scores acceptable (>90)

### Final commit:
```bash
git add .
git commit -m "feat: Complete Astro Paper v5.5.0 migration

- Fresh v5.5.0 base with GitHub color theme
- Terminal component on homepage
- Git commit hash in footer
- All blog posts and projects migrated
- Site configuration updated

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

git push origin astro-paper-v5-migration
```

### Create PR:
```bash
gh pr create --title "Migrate to Astro Paper v5.5.0" --body "Migration with essential customizations"
```

---

## Cleanup After Merge

```bash
# Remove worktree
git worktree remove ../personal-blog-old

# Delete migration branch locally (after merge)
git branch -d astro-paper-v5-migration
```

---

## Optional Future Enhancements

After migration is stable, consider adding:

1. **Reading time plugin** - Copy `remark-reading-time.mjs` from old
2. **Cursor effect** - Copy `CursorEffect.astro` component
3. **Links page** - Copy `links.md` and `LinksLayout.astro`
4. **Custom fonts** - Add Maple Mono, JetBrains Mono
5. **Shine animation** - Add to footer commit link
6. **Custom animations** - Gradient text, blink cursor, etc.

Add incrementally: one feature → test → commit → repeat.

---

## Important Notes

### Content Paths
- **Old:** `src/content/blog/`, `src/content/projects/`
- **New:** `src/data/blog/`, `src/data/projects/`

### Import Aliases
- **V5 uses:** `@/` prefix (e.g., `@/config`, `@/components`)
- **Old used:** `@` prefix without slash

### Tailwind
- **V5:** Tailwind v4 with CSS-first config in `global.css`
- **Old:** Tailwind v3 with JS config in `tailwind.config.cjs`

### Theme Toggle
- V5 already has fully working light/dark toggle
- Just need to update color values
- Toggle script at `public/toggle-theme.js`

---

## Troubleshooting

### If content doesn't load:
```bash
pnpm astro sync
pnpm astro check
```

### If build fails:
Check for missing dependencies in `package.json`

### If projects page 404s:
Need to create projects routes (see "Projects Page Setup" above)

### If theme doesn't apply:
Clear `.astro` cache: `rm -rf .astro`

---

## Agent Continuation Guide

If picking up this migration:

1. **Check current status:**
   ```bash
   git log --oneline -10
   git status
   ```

2. **Find last completed task** in "Migration Status" section above

3. **Continue from next task** in sequence

4. **Reference this plan** for file paths, code snippets, and testing steps

5. **Update "Migration Status"** when completing tasks

6. **Commit frequently** using the commit strategy outlined above

---

**Last Updated:** 2025-12-30
**Current Branch:** astro-paper-v5-migration
**Status:** ✅ **MIGRATION COMPLETE** - All essential features implemented, build passing, ready for deployment
