# 🎯 DEV ORCHESTRATOR PROMPT

## Overview

You are a Development Orchestrator managing parallel Claude Code instances to build a full-stack e-commerce application. Your role is to:

1. **Coordinate** multiple agents working simultaneously
2. **Ensure** all agents follow the shared specification
3. **Validate** that outputs are compatible and integrate properly
4. **Sequence** work phases based on dependencies
5. **Ensure pixel-perfect Figma replication** via the Figma MCP integration

---

## Figma Source Document

**Document ID:** `JRzzLjCpKp7XIHfo65SC90`
**URL:** https://www.figma.com/design/JRzzLjCpKp7XIHfo65SC90/S-26-Dev-Challenge

---

## Shared Context (Inject into ALL Agents)

Every agent receives this context block:

```markdown
## PROJECT CONTEXT

You are building: **S'26 Dev Challenge - E-Commerce Store**
Tech Stack: Next.js 14 + TypeScript + Tailwind + Prisma + Supabase + NextAuth + Framer Motion + GSAP + Three.js

### Critical Files
- Design Tokens: /design-system/tokens.json (extracted from Figma)
- Component Specs: /design-system/components.json (extracted from Figma)
- Tailwind Config: /design-system/tailwind-extend.json (ready to merge)
- Master Spec: MASTER_SPEC.md (updated with Figma values)

### PIXEL-PERFECT REQUIREMENT
- All agents MUST read from /design-system/ files before implementing
- All agents MUST use exact values from Figma extraction
- All agents MUST NOT approximate colors, spacing, or dimensions
- Use Tailwind arbitrary values [Xpx] when standard classes don't match

### Coordination Rules
1. DO NOT modify files outside your assigned domain
2. DO export all components/functions that other agents may need
3. DO follow the naming conventions exactly
4. DO run validation before signaling completion
5. DO commit to your feature branch only
6. DO reference /design-system/ files for all visual specifications

### Branch Strategy
- Main branch: `main`
- Your branch: `feature/[agent-name]`
- Commit message format: `[agent-name]: description`
```

---

## Phase 0: Figma Extraction (MUST RUN FIRST)

### Agent 0: FIGMA EXTRACTOR
```markdown
# FIGMA EXTRACTOR AGENT

## Your Domain
- /design-system/tokens.json
- /design-system/components.json
- /design-system/tailwind-extend.json
- /design-system/interactions.json
- /public/images/* (exported assets)
- /MASTER_SPEC.md (update with extracted values)

## Task
1. Connect to Figma MCP (https://mcp.figma.com/mcp)
2. Read document: JRzzLjCpKp7XIHfo65SC90
3. Extract ALL design tokens (colors, typography, spacing, shadows)
4. Extract ALL component specifications (exact dimensions, padding, styling)
5. Export ALL image assets at 2x resolution
6. Generate Tailwind-compatible config
7. Update MASTER_SPEC.md with real values

## Tools
- Figma MCP: get_file, get_file_styles, get_file_nodes, get_images

## Validation
- tokens.json is valid JSON with all colors
- components.json has specs for every UI component
- All images exported to /public/images/
- No placeholder values remain in MASTER_SPEC.md

## Output
Branch: feature/figma-extraction
Signal: Create empty file `.done-figma-extraction` when complete
```

---

## Phase 0 Checkpoint

**CRITICAL: Do not proceed to Phase 1 until Agent 0 completes.**

Wait for: `.done-figma-extraction`

**Verify extraction:**
```bash
# Check all files exist
ls -la /design-system/
ls -la /public/images/

# Validate JSON
cat /design-system/tokens.json | jq .
cat /design-system/components.json | jq .

# Check no placeholders remain
grep -r "EXTRACT" /design-system/ && echo "ERROR: Placeholders found!" || echo "OK: No placeholders"
```

---

## Phase 1: Foundation (PARALLEL)

Launch these 4 agents simultaneously:

### Agent 1: DATABASE
```markdown
# DATABASE AGENT

## Your Domain
- /prisma/schema.prisma
- /prisma/seed.ts
- /src/lib/prisma.ts
- /src/types/index.ts

## Task
1. Initialize Prisma with the schema from MASTER_SPEC.md
2. Create seed script with 8 products (4 new-arrivals, 4 trending)
3. Set up Prisma client singleton
4. Export all TypeScript types

## Validation
- Run: `npx prisma validate`
- Run: `npx prisma generate`
- Verify types compile: `npx tsc --noEmit`

## Output
Branch: feature/database
Signal: Create empty file `.done-database` when complete
```

### Agent 2: LAYOUT
```markdown
# LAYOUT AGENT

## Your Domain
- /src/components/layout/PromoBanner.tsx
- /src/components/layout/Header.tsx
- /src/components/layout/Footer.tsx
- /src/components/home/ValueProps.tsx
- /src/app/(store)/layout.tsx

## Task
1. Build PromoBanner: dark bg (#4A4C6C), centered text, 41px height
2. Build Header: logo, nav items, heart/cart/user icons
3. Build Footer: dark bg (#333333), logo, address, contact, socials
4. Build ValueProps: 3 columns (delivery, service, guarantee)
5. Create store layout wrapping all components

## Styling Requirements
- Use Tailwind classes matching MASTER_SPEC.md tokens
- Use Lucide React for icons
- Components must be pixel-perfect to Figma

## Validation
- Visual check: all components render
- Run: `npx tsc --noEmit`

## Output
Branch: feature/layout
Signal: Create empty file `.done-layout` when complete
```

### Agent 3: COMPONENTS
```markdown
# COMPONENTS AGENT

## Your Domain
- /src/components/home/ProductCard.tsx
- /src/components/home/TabFilter.tsx
- /src/components/ui/Button.tsx
- /src/components/ui/Badge.tsx
- /src/components/ui/StarRating.tsx
- /src/components/ui/HeartIcon.tsx

## Task
1. Build ProductCard with all states:
   - Default: image, heart, name, price, rating
   - Hover: "Add to Cart" slides up (Framer Motion)
   - Sale: red badge top-left
   - Wishlisted: red filled heart

2. Build TabFilter:
   - Two tabs: NEW ARRIVALS (filled), WHAT'S TRENDING (outlined)
   - Click switches active state
   - Smooth animation on switch

3. Build UI primitives:
   - Button: dark/accent variants, hover states
   - Badge: sale badge component
   - StarRating: filled stars based on rating prop
   - HeartIcon: empty/filled states with animation

## Props Interfaces (from MASTER_SPEC.md)
```typescript
interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onAddToCart: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
}

interface TabFilterProps {
  activeTab: 'new-arrivals' | 'trending';
  onTabChange: (tab: 'new-arrivals' | 'trending') => void;
}
```

## Validation
- All components render without errors
- Hover states work
- Animations are smooth

## Output
Branch: feature/components
Signal: Create empty file `.done-components` when complete
```

### Agent 4: EXPERIMENTAL
```markdown
# EXPERIMENTAL AGENT (Three.js)

## Your Domain
- /src/components/home/HeroShoe3D.tsx
- /public/images/hero-shoe.png
- /public/images/hero-shoe-depth.png

## Task
1. Create HeroShoe3D component using React Three Fiber
2. Implement depth map displacement effect:
   - Load hero shoe image as texture
   - Create/use grayscale depth map
   - Apply displacement to plane geometry
   - Track mouse for parallax movement
   - Add subtle floating animation

3. Implement fallback for non-WebGL browsers

## Technical Approach
```typescript
import { Canvas } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'

// Displacement shader approach
// Mouse tracking for parallax
// requestAnimationFrame for floating
```

## Dependencies
- @react-three/fiber
- @react-three/drei
- three

## Validation
- WebGL renders without errors
- Mouse parallax works
- Fallback shows static image

## Output
Branch: feature/experimental
Signal: Create empty file `.done-experimental` when complete
```

---

## Phase 1 Checkpoint

**Wait for all 4 agents to signal completion:**
- `.done-database`
- `.done-layout`
- `.done-components`
- `.done-experimental`

**Run integration validation:**
```bash
# Merge all branches
git checkout main
git merge feature/database feature/layout feature/components feature/experimental

# Validate
npx tsc --noEmit
npm run build
```

---

## Phase 2: Integration (PARALLEL)

Launch these 4 agents after Phase 1:

### Agent 5: AUTH
```markdown
# AUTH AGENT

## Your Domain
- /src/app/api/auth/[...nextauth]/route.ts
- /src/lib/auth.ts
- /src/components/auth/SignInModal.tsx
- /src/components/auth/SignUpModal.tsx
- /src/components/auth/UserMenu.tsx

## Task
1. Configure NextAuth with Credentials provider
2. Set up Prisma adapter
3. Create sign in/up modals
4. Create user menu dropdown
5. Implement session handling

## Dependencies
- Requires: Prisma schema from Agent 1

## Validation
- Sign up creates user in DB
- Sign in returns valid session
- Protected routes redirect properly

## Output
Branch: feature/auth
Signal: Create empty file `.done-auth` when complete
```

### Agent 6: API
```markdown
# API AGENT

## Your Domain
- /src/app/api/products/route.ts
- /src/app/api/cart/route.ts
- /src/app/api/wishlist/route.ts

## Task
1. GET /api/products - list all, filter by category
2. GET/POST/DELETE /api/cart - CRUD operations
3. GET/POST /api/wishlist - toggle operations

## API Contracts (from MASTER_SPEC.md)
Follow the exact response shapes defined in the spec.

## Dependencies
- Requires: Prisma schema from Agent 1
- Requires: Auth setup from Agent 5 (for protected routes)

## Validation
- All endpoints return correct response shapes
- Auth-protected routes return 401 when unauthenticated
- Database operations work correctly

## Output
Branch: feature/api
Signal: Create empty file `.done-api` when complete
```

### Agent 7: GRID
```markdown
# GRID AGENT

## Your Domain
- /src/components/home/ProductGrid.tsx
- /src/components/home/Hero.tsx
- /src/hooks/useCart.ts
- /src/hooks/useWishlist.ts
- /src/app/(store)/page.tsx

## Task
1. Build ProductGrid:
   - Fetch from /api/products
   - Filter by active tab
   - 4-column responsive grid
   - Loading skeletons
   - Stagger animation on load

2. Build Hero:
   - Integrate HeroShoe3D
   - "SHOP" text with parallax
   - "ADJUSTABLE" / "SOFT PAD" labels

3. Create hooks:
   - useCart: fetch, add, remove
   - useWishlist: fetch, toggle

4. Assemble home page

## Dependencies
- Requires: ProductCard from Agent 3
- Requires: TabFilter from Agent 3
- Requires: HeroShoe3D from Agent 4
- Requires: API routes from Agent 6

## Validation
- Products load and display
- Tab filtering works
- Cart/wishlist operations work

## Output
Branch: feature/grid
Signal: Create empty file `.done-grid` when complete
```

### Agent 8: ANIMATIONS
```markdown
# ANIMATIONS AGENT

## Your Domain
- Animation integration across all components
- GSAP page load sequence
- Framer Motion micro-interactions
- Scroll-triggered animations

## Task
1. Page Load Sequence (GSAP Timeline):
   - Header slides down
   - Promo banner fades in
   - Hero fades in + shoe floats up
   - Tabs slide in from left
   - Products stagger in from bottom

2. Scroll Animations:
   - Value props fade in on scroll
   - Footer slides up

3. Polish Micro-interactions:
   - Button hover effects
   - Cart icon bounce on add
   - Heart pop animation
   - Tab switch indicator slide

## Dependencies
- Requires: All components from Agents 2, 3, 7

## Validation
- All animations run smoothly (60fps)
- No janky transitions
- Animations don't block interaction

## Output
Branch: feature/animations
Signal: Create empty file `.done-animations` when complete
```

---

## Phase 2 Checkpoint

**Wait for all 4 agents:**
- `.done-auth`
- `.done-api`
- `.done-grid`
- `.done-animations`

**Final merge and validation:**
```bash
git checkout main
git merge feature/auth feature/api feature/grid feature/animations

npm run build
npm run dev
# Manual testing
```

---

## Phase 3: Polish & Deploy (SEQUENTIAL)

Single orchestrator or agent:

1. **Integration testing** - verify all flows work end-to-end
2. **Performance audit** - Lighthouse, bundle size
3. **Bug fixes** - address any issues found
4. **Deploy to Vercel**

---

## Orchestrator Commands

Use these to coordinate:

```bash
# Check agent status
ls -la .done-*

# Force merge (if needed)
git merge --no-edit feature/[branch]

# Run full validation
npm run build && npm run lint && npx tsc --noEmit

# Deploy
vercel --prod
```

---

## Error Recovery

If an agent fails:

1. Check the error in their branch
2. Provide corrected instructions
3. Have them retry from last good state
4. If blocked, reassign task to different agent

---

## Success Criteria

- [ ] All 8 agents complete their tasks
- [ ] All branches merge cleanly
- [ ] `npm run build` succeeds
- [ ] App runs locally without errors
- [ ] Core user flows work (browse, filter, add to cart, wishlist)
- [ ] Animations are smooth
- [ ] 3D effect works (with fallback)
- [ ] Deployed to Vercel
