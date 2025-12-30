# Giscus Comments Integration Plan

**Branch:** `giscus-comments`  
**Status:** WIP - Build failing, needs debugging  
**Reference:** https://astro-paper.pages.dev/posts/how-to-integrate-giscus-comments/

---

## Current Status

### ✅ Completed
1. **Package Installation**
   - Installed `@giscus/react` package
   - Added to package.json dependencies

2. **Configuration Setup**
   - Added `GISCUS` config object to `src/config.ts`
   - Includes all necessary settings (repo, repoId, categoryId, etc.)
   - Placeholder values for IDs (need actual setup)

3. **Component Creation**
   - Created `src/components/Comments.tsx` React component
   - Theme-aware: syncs with site's light/dark mode
   - MutationObserver watches for theme changes
   - Lazy loading enabled
   - Conditional rendering based on config

4. **Integration**
   - Added to `src/layouts/PostDetails.astro`
   - Positioned after ShareLinks, before prev/next navigation
   - Uses `client:only="react"` for proper React hydration

5. **Documentation**
   - Updated README.md with Giscus setup instructions
   - Added step-by-step guide for getting IDs from giscus.app

### ❌ Issues

1. **Build Failure**
   - Build process fails (exact error unknown)
   - Needs investigation
   - Possible causes:
     - React integration issue with Astro
     - Missing dependencies
     - Hydration mismatch
     - TypeScript configuration

---

## Implementation Details

### Files Modified

1. **package.json**
   - Added: `@giscus/react: ^3.1.0`

2. **src/config.ts**
   ```typescript
   export const GISCUS = {
     enabled: true,
     repo: "devadathanmb/personal-blog",
     repoId: "YOUR_REPO_ID", // TODO: Get from giscus.app
     category: "Comments",
     categoryId: "YOUR_CATEGORY_ID", // TODO: Get from giscus.app
     mapping: "pathname",
     reactionsEnabled: true,
     emitMetadata: false,
     inputPosition: "top",
     theme: "preferred_color_scheme",
     lang: "en",
   };
   ```

3. **src/components/Comments.tsx**
   - React component with Giscus integration
   - Theme observer using MutationObserver
   - Props converted to giscus string format ("1"/"0")

4. **src/layouts/PostDetails.astro**
   - Added `<Comments client:only="react" />`
   - Imports Comments component

5. **README.md**
   - Added "Giscus Comments" section
   - Setup instructions with links

---

## TODO - Debug & Fix

### 1. Investigate Build Error
- [ ] Run `pnpm build` and capture full error output
- [ ] Check Astro logs for specific failure point
- [ ] Verify React integration is working
- [ ] Test with `pnpm dev` to see if it's build-specific

### 2. Verify Dependencies
- [ ] Check if React is properly installed
- [ ] Verify `@giscus/react` compatibility with current Astro version
- [ ] Check for peer dependency warnings
- [ ] Ensure all TypeScript types are available

### 3. Test Astro + React Integration
- [ ] Create simple test React component to verify integration works
- [ ] Test different `client:*` directives (`client:load`, `client:visible`, etc.)
- [ ] Check if issue is specific to Giscus or general React issue

### 4. Alternative Approaches (if needed)
- [ ] Try vanilla JavaScript implementation instead of React
- [ ] Use Astro's native `<script>` tag to load Giscus
- [ ] Consider server-side rendering approach
- [ ] Check if `client:only` needs specific config

### 5. Configuration
- [ ] Enable GitHub Discussions in repository
- [ ] Visit https://giscus.app/ to generate IDs
- [ ] Update `src/config.ts` with actual `repoId` and `categoryId`
- [ ] Test comments in production environment

---

## Debugging Checklist

### Build Error Investigation
```bash
# Run build with verbose output
pnpm build 2>&1 | tee build-error.log

# Check Astro dev mode
pnpm dev

# Verify React integration
pnpm astro check
```

### Common Issues to Check
1. **React Runtime**
   - Is React properly configured in Astro?
   - Are React types installed?

2. **Hydration**
   - Does `client:only="react"` need additional setup?
   - Try `client:load` as alternative

3. **TypeScript**
   - Are all types properly resolved?
   - Check tsconfig.json for React JSX settings

4. **Imports**
   - Verify all import paths are correct
   - Check if `@/` alias works with React components

---

## Success Criteria

- [ ] Build completes without errors
- [ ] Comments section appears on blog post pages
- [ ] Theme switching works (light/dark sync)
- [ ] Comments can be posted via GitHub
- [ ] No console errors in browser
- [ ] Performance remains good (lazy loading works)

---

## Notes

- This is a non-critical feature - can be tackled later
- Branch `astro-paper-v5-migration` is clean and working
- All work is safely contained in `giscus-comments` branch
- Can cherry-pick fixes back to main branch once working

---

## Resources

- [Giscus Official Site](https://giscus.app/)
- [AstroPaper Giscus Guide](https://astro-paper.pages.dev/posts/how-to-integrate-giscus-comments/)
- [Astro React Integration](https://docs.astro.build/en/guides/integrations-guide/react/)
- [@giscus/react NPM](https://www.npmjs.com/package/@giscus/react)
