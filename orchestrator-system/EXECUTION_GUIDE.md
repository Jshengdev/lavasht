# Execution Guide: Running the Multi-Agent Build System

## Overview

This guide explains how to execute the parallel agent system to build the e-commerce store from the Figma design.

**Total Windows Needed:**
- Phase 1: 4 agent windows + 1 orchestrator = 5 windows
- Phase 2: 4 agent windows (reuse from Phase 1) = 4 windows
- **Minimum: 5 terminal windows**

**Estimated Total Time:** 2-3 hours with parallel execution

---

## Pre-Execution Checklist

Before starting, ensure:

- [ ] Node.js 18+ installed
- [ ] Git installed and configured
- [ ] Supabase account created (for DATABASE_URL)
- [ ] Design system files exist in `/design-system/`
- [ ] All agent prompts are ready in `/orchestrator-system/agent-prompts/`

---

## Step 0: Initial Project Setup (Orchestrator Does This)

Open your **Orchestrator Terminal** and run:

```bash
# Navigate to workspace
cd /path/to/workspace

# Create project directory
mkdir joanie-store
cd joanie-store

# Initialize git
git init
git checkout -b main

# Create initial commit
echo "# Joanie E-Commerce Store" > README.md
git add README.md
git commit -m "Initial commit"

# Copy design system files from lavasht
cp -r /Users/johnnysheng/lavasht/design-system ./design-system
cp -r /Users/johnnysheng/lavasht/orchestrator-system ./orchestrator-system

# Create public/images directory for assets
mkdir -p public/images

# Add placeholder images (or copy real assets if available)
# touch public/images/hero-shoe.png
# touch public/images/shoe-{1..8}.png

git add .
git commit -m "Add design system and orchestrator files"
```

---

## Phase 1: Foundation Agents (PARALLEL)

### Launch 4 Terminal Windows

Open 4 separate terminal windows/tabs. In each one:

**Window 1 - DATABASE Agent:**
```bash
cd /path/to/joanie-store
claude
# Then paste the contents of: orchestrator-system/agent-prompts/AGENT_1_DATABASE.md
```

**Window 2 - LAYOUT Agent:**
```bash
cd /path/to/joanie-store
claude
# Then paste the contents of: orchestrator-system/agent-prompts/AGENT_2_LAYOUT.md
```

**Window 3 - COMPONENTS Agent:**
```bash
cd /path/to/joanie-store
claude
# Then paste the contents of: orchestrator-system/agent-prompts/AGENT_3_COMPONENTS.md
```

**Window 4 - EXPERIMENTAL Agent:**
```bash
cd /path/to/joanie-store
claude
# Then paste the contents of: orchestrator-system/agent-prompts/AGENT_4_EXPERIMENTAL.md
```

### Monitor Progress (Orchestrator Window)

In your orchestrator terminal, monitor completion:

```bash
# Watch for completion signals
watch -n 5 'ls -la .done-* 2>/dev/null || echo "No completions yet"'

# Or check manually
ls -la .done-*
```

**Wait for all 4 files:**
- `.done-database`
- `.done-layout`
- `.done-components`
- `.done-experimental`

---

## Phase 1 Checkpoint

Once all 4 agents complete, run these validation steps:

```bash
# 1. Check all branches exist
git branch -a

# 2. Merge all Phase 1 branches
git checkout main
git merge feature/database --no-edit
git merge feature/layout --no-edit
git merge feature/components --no-edit
git merge feature/experimental --no-edit

# 3. Install dependencies
npm install

# 4. Validate TypeScript compiles
npx tsc --noEmit

# 5. Validate Prisma schema
npx prisma validate
npx prisma generate

# 6. Try building
npm run build

# 7. If build succeeds, commit the merge
git add .
git commit -m "Phase 1 complete: Foundation merged"
```

### Handling Merge Conflicts

If conflicts occur:
```bash
# See conflicting files
git status

# For each conflict, choose a resolution:
# Option 1: Keep incoming changes
git checkout --theirs path/to/file

# Option 2: Keep current changes
git checkout --ours path/to/file

# Option 3: Manual resolution
# Edit the file, remove conflict markers, save

# After resolving
git add .
git commit -m "Resolve Phase 1 merge conflicts"
```

### Handling Build Failures

If `npm run build` fails:
```bash
# Check error messages
npm run build 2>&1 | head -50

# Common fixes:
# 1. Missing dependencies - run npm install again
# 2. Type errors - check npx tsc --noEmit for details
# 3. Import errors - verify file paths match

# After fixing, rebuild
npm run build
```

---

## Phase 2: Integration Agents (PARALLEL)

### Launch 4 Terminal Windows (or reuse Phase 1 windows)

**Window 5 - AUTH Agent:**
```bash
cd /path/to/joanie-store
claude
# Paste contents of: orchestrator-system/agent-prompts/AGENT_5_AUTH.md
```

**Window 6 - API Agent:**
```bash
cd /path/to/joanie-store
claude
# Paste contents of: orchestrator-system/agent-prompts/AGENT_6_API.md
```

**Window 7 - GRID Agent:**
```bash
cd /path/to/joanie-store
claude
# Paste contents of: orchestrator-system/agent-prompts/AGENT_7_GRID.md
```

**Window 8 - ANIMATIONS Agent:**
```bash
cd /path/to/joanie-store
claude
# Paste contents of: orchestrator-system/agent-prompts/AGENT_8_ANIMATIONS.md
```

### Monitor Progress

```bash
# Watch for completion signals
watch -n 5 'ls -la .done-* 2>/dev/null | grep -E "(auth|api|grid|animations)"'
```

**Wait for all 4 files:**
- `.done-auth`
- `.done-api`
- `.done-grid`
- `.done-animations`

---

## Phase 2 Checkpoint

```bash
# 1. Merge all Phase 2 branches
git checkout main
git merge feature/auth --no-edit
git merge feature/api --no-edit
git merge feature/grid --no-edit
git merge feature/animations --no-edit

# 2. Install any new dependencies
npm install

# 3. Validate build
npm run build

# 4. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values:
# - DATABASE_URL (from Supabase)
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - NEXTAUTH_URL=http://localhost:3000

# 5. Push database schema
npx prisma db push

# 6. Seed the database
npx prisma db seed

# 7. Start development server
npm run dev
```

---

## Final Validation Checklist

Open http://localhost:3000 and verify:

- [ ] Page loads without errors
- [ ] Promo banner displays with correct text and color
- [ ] Header shows logo, nav, and icons
- [ ] Hero section displays with shoe image
- [ ] Tab buttons work (NEW ARRIVALS / WHAT'S TRENDING)
- [ ] Product grid displays 4 columns
- [ ] Product cards show image, name, price, rating
- [ ] Hover on product card shows "Add to Cart"
- [ ] Sale badges appear on discounted products
- [ ] Heart icons toggle on click (when signed in)
- [ ] Value props section displays correctly
- [ ] Footer displays with all content
- [ ] Sign up creates a new user
- [ ] Sign in works with created user
- [ ] Add to cart works (when signed in)
- [ ] Page load animations play
- [ ] All colors match Figma specs

---

## Deployment

Once everything works locally:

```bash
# 1. Commit final state
git add .
git commit -m "Build complete: Ready for deployment"

# 2. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/joanie-store.git
git push -u origin main

# 3. Deploy to Vercel
npx vercel

# 4. Set environment variables in Vercel dashboard
# - DATABASE_URL
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL (your Vercel URL)

# 5. Deploy to production
npx vercel --prod
```

---

## Troubleshooting

### Agent Gets Stuck
1. Check the terminal for errors
2. If blocked, provide clarification
3. If completely stuck, restart the agent with the same prompt

### Agent Modifies Wrong Files
1. Immediately stop the agent
2. `git checkout -- <file>` to restore
3. Remind agent of its domain in follow-up message

### Build Fails After Merge
1. Check `npx tsc --noEmit` for type errors
2. Check `npm run lint` for lint errors
3. Look for missing imports or circular dependencies
4. May need to manually fix integration points

### Database Issues
1. Verify DATABASE_URL is correct
2. Run `npx prisma db push` to sync schema
3. Run `npx prisma generate` to regenerate client
4. Check Supabase dashboard for connection issues

---

## Quick Reference: Agent Domains

| Agent | Branch | Files Owned |
|-------|--------|-------------|
| DATABASE | feature/database | /prisma/*, /src/lib/prisma.ts, /src/types/* |
| LAYOUT | feature/layout | /src/components/layout/*, /src/app/(store)/layout.tsx |
| COMPONENTS | feature/components | /src/components/ui/*, /src/components/home/ProductCard.tsx, TabFilter.tsx |
| EXPERIMENTAL | feature/experimental | /src/components/home/HeroShoe3D.tsx, /public/images/hero-* |
| AUTH | feature/auth | /src/app/api/auth/*, /src/lib/auth.ts, /src/components/auth/* |
| API | feature/api | /src/app/api/products/*, cart/*, wishlist/* |
| GRID | feature/grid | /src/components/home/ProductGrid.tsx, Hero.tsx, /src/hooks/*, page.tsx |
| ANIMATIONS | feature/animations | Animation utilities, GSAP sequences, Framer Motion polish |

---

## Success Criteria

The build is complete when:
1. All 8 agents have signaled completion
2. All branches merged cleanly to main
3. `npm run build` succeeds
4. App runs locally without errors
5. Core user flows work (browse, filter, auth, cart, wishlist)
6. Animations are smooth (60fps)
7. Design matches Figma pixel-perfect
8. Deployed to Vercel successfully

---

**Good luck with your build!**
