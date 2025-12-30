# Astro Paper v5.5.0 Migration Plan

**Branch:** `astro-paper-v5-migration`
**Strategy:** Fresh install + incremental customization
**Reference:** Old code at `../personal-blog-old` (git worktree on commit b1d3860)

---

## Migration Status

### ✅ Completed

1. **Branch Setup** - Created `astro-paper-v5-migration` branch
2. **Fresh Install** - Installed Astro Paper v5.5.0 from main branch
3. **Worktree** - Created git worktree at `../personal-blog-old` for reference
4. **Content Migration**
   - Copied 5 blog posts from `src/content/blog/` to `src/data/blog/`
   - Copied 6 projects from `src/content/projects/` to `src/data/projects/`
   - Copied blog assets (images) to `src/assets/`
   - Added projects collection to `src/content.config.ts`
5. **Configuration**
   - Updated `src/config.ts` with site details (title, author, description, etc.)
   - Updated `src/constants.ts` with social links (GitHub, LinkedIn, Mail, Telegram)
6. **Verification** - `pnpm astro check` passes with 0 errors

### 🔄 In Progress

7. **Theme Refactoring** - Applying GitHub color scheme (minimal approach)

### ⏳ Remaining

8. **Theme Testing** - Verify light/dark toggle and colors work
9. **Terminal Component** - Copy and integrate Terminal.astro
10. **Homepage Integration** - Add Terminal to homepage
11. **Footer Enhancement** - Add git commit hash display
12. **Build Testing** - Full build and page verification
13. **Deployment** - Commit, push, and deploy

---

## Key Principles

- **REFACTOR, don't copy** - Extract only essential customizations
- **Minimal changes** - V5 already has theme toggle, just adjust colors
- **Incremental approach** - One feature at a time, test, commit

---

## Current Task: Theme Refactoring

### Goal
Apply GitHub-inspired color palette to Astro Paper v5's theme system.

### Files to Modify

**Primary:** `src/styles/global.css`

### Reference Colors (from old site)

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
**Current Task:** Theme Refactoring (in progress)
