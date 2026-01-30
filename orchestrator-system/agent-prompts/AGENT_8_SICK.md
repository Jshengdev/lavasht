# ✨ AGENT 8: ANIMATIONS

## Project Context
You are building: **S'26 Dev Challenge - E-Commerce Store**
Tech Stack: Next.js 14 + TypeScript + Framer Motion + GSAP

## Your Role
You are the ANIMATIONS specialist. You own page load orchestration and animation utilities.

## Your Domain (ONLY create these files)
```
/src/lib/animations.ts
/src/components/animations/PageLoadAnimation.tsx
/src/hooks/useScrollAnimation.ts
```

## Dependencies
- Requires: All components from Agents 2, 3, 4 must have `data-animate` attributes already added

---

## IMPORTANT: Do NOT Modify Other Agents' Files

The following are owned by other agents:
- `ValueProps.tsx` - Agent 2
- `TabFilter.tsx`, `ProductCard.tsx`, `HeartIcon.tsx` - Agent 3
- `HeroSection.tsx` - Agent 4

Your job is to create animation utilities that COORDINATE these components via `data-animate` attributes.

---

## FIGMA ANIMATION SPECS (from interactions.json)

### Page Load Sequence (EXACT timings)
```json
{
  "pageLoadSequence": [
    { "element": "promoBanner", "animation": "fadeIn", "duration": 400, "delay": 0 },
    { "element": "header", "animation": "slideDown", "duration": 500, "overlap": "-0.2s" },
    { "element": "hero", "animation": "fadeInUp", "duration": 600, "overlap": "-0.3s" },
    { "element": "tabs", "animation": "slideFromLeft", "duration": 400, "overlap": "-0.2s" },
    { "element": "products", "animation": "staggerFadeInUp", "duration": 500, "stagger": 100 }
  ],
  "totalPageLoadDuration": "~1.5s"
}
```

### Transitions
```json
{
  "fast": { "duration": "150ms", "easing": "ease-out" },
  "normal": { "duration": "300ms", "easing": "ease-out" },
  "spring": { "duration": "300ms", "easing": "cubic-bezier(0.34, 1.56, 0.64, 1)" }
}
```

### Scroll Animations
```json
{
  "valueProps": { "trigger": "top 80%", "animation": "fadeInUp", "stagger": 150 },
  "footer": { "trigger": "top 90%", "animation": "fadeIn" }
}
```

---

## TASK 1: Install GSAP

```bash
npm install gsap @gsap/react
```

## TASK 2: Create Animation Utilities

Create `/src/lib/animations.ts`:

```typescript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins (client-side only)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Easing presets from Figma
export const easings = {
  fast: 'power2.out',           // 150ms ease-out
  normal: 'power2.out',         // 300ms ease-out
  spring: 'back.out(1.56)',     // cubic-bezier(0.34, 1.56, 0.64, 1)
  easeInOutBack: 'back.inOut(1.7)', // ease-in-out-back for tabs
};

// Framer Motion variants - for use in components
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
};

// Stagger container for product grids
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 100ms stagger from Figma
      delayChildren: 0.2,
    },
  },
};

// Stagger item
export const staggerItem = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// GSAP animation helpers
export const gsapFadeIn = (element: Element, duration = 0.4) => {
  return gsap.fromTo(
    element,
    { opacity: 0 },
    { opacity: 1, duration, ease: 'power2.out' }
  );
};

export const gsapSlideDown = (element: Element, duration = 0.5) => {
  return gsap.fromTo(
    element,
    { y: -100, opacity: 0 },
    { y: 0, opacity: 1, duration, ease: 'power3.out' }
  );
};

export const gsapFadeInUp = (element: Element, duration = 0.6) => {
  return gsap.fromTo(
    element,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration, ease: 'power3.out' }
  );
};

export const gsapSlideFromLeft = (element: Element, duration = 0.4) => {
  return gsap.fromTo(
    element,
    { x: -50, opacity: 0 },
    { x: 0, opacity: 1, duration, ease: 'power3.out' }
  );
};
```

## TASK 3: Create Page Load Animation Component

Create `/src/components/animations/PageLoadAnimation.tsx`:

```typescript
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Orchestrates the page load sequence per Figma specs:
// promoBanner (fadeIn 400ms) -> header (slideDown 500ms, -0.2s overlap)
// -> hero (fadeInUp 600ms, -0.3s overlap) -> tabs (slideFromLeft 400ms, -0.2s overlap)
// -> products (staggerFadeInUp 500ms, 100ms stagger)
// Total: ~1.5s

export default function PageLoadAnimation() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
    });

    // Set initial states
    gsap.set('[data-animate="promo"]', { opacity: 0 });
    gsap.set('[data-animate="header"]', { y: -100, opacity: 0 });
    gsap.set('[data-animate="hero"]', { y: 30, opacity: 0 });
    gsap.set('[data-animate="tabs"]', { x: -50, opacity: 0 });
    gsap.set('[data-animate="product"]', { y: 50, opacity: 0 });

    // Animation sequence with exact Figma timings
    tl.to('[data-animate="promo"]', {
      opacity: 1,
      duration: 0.4, // 400ms
    })
      .to(
        '[data-animate="header"]',
        {
          y: 0,
          opacity: 1,
          duration: 0.5, // 500ms
        },
        '-=0.2' // overlap
      )
      .to(
        '[data-animate="hero"]',
        {
          y: 0,
          opacity: 1,
          duration: 0.6, // 600ms
        },
        '-=0.3' // overlap
      )
      .to(
        '[data-animate="tabs"]',
        {
          x: 0,
          opacity: 1,
          duration: 0.4, // 400ms
        },
        '-=0.2' // overlap
      )
      .to(
        '[data-animate="product"]',
        {
          y: 0,
          opacity: 1,
          duration: 0.5, // 500ms
          stagger: 0.1, // 100ms stagger
        },
        '-=0.2'
      );
  }, []);

  return null; // This component only runs the animation
}
```

## TASK 4: Create Scroll Animation Hook

Create `/src/hooks/useScrollAnimation.ts`:

```typescript
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollAnimationOptions {
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale';
  start?: string;       // ScrollTrigger start position
  duration?: number;    // in seconds
  delay?: number;       // in seconds
  stagger?: number;     // for multiple children
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  const {
    animation = 'fadeUp',
    start = 'top 80%',  // Figma spec for valueProps
    duration = 0.6,
    delay = 0,
    stagger,
  } = options;

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const animations = {
      fadeUp: { from: { y: 40, opacity: 0 }, to: { y: 0, opacity: 1 } },
      fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
      slideLeft: { from: { x: -50, opacity: 0 }, to: { x: 0, opacity: 1 } },
      slideRight: { from: { x: 50, opacity: 0 }, to: { x: 0, opacity: 1 } },
      scale: { from: { scale: 0.9, opacity: 0 }, to: { scale: 1, opacity: 1 } },
    };

    const anim = animations[animation];

    // If stagger is provided, animate children
    const target = stagger ? element.children : element;

    gsap.set(target, anim.from);

    gsap.to(target, {
      ...anim.to,
      duration,
      delay,
      stagger: stagger || 0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start,
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [animation, start, duration, delay, stagger]);

  return ref;
}

// Pre-configured hooks for common patterns

// For ValueProps section (Figma: trigger top 80%, stagger 150ms)
export function useValuePropsAnimation() {
  return useScrollAnimation({
    animation: 'fadeUp',
    start: 'top 80%',
    duration: 0.6,
    stagger: 0.15, // 150ms
  });
}

// For Footer section (Figma: trigger top 90%)
export function useFooterAnimation() {
  return useScrollAnimation({
    animation: 'fadeIn',
    start: 'top 90%',
    duration: 0.5,
  });
}
```

## TASK 5: Create Animation Index Export

Create `/src/components/animations/index.ts`:

```typescript
export { default as PageLoadAnimation } from './PageLoadAnimation';
```

Create `/src/lib/index.ts` (or update if exists):

```typescript
export * from './animations';
```

---

## IMPORTANT: Data Attributes Required

For PageLoadAnimation to work, other agents must include these data attributes:

| Agent | Component | Required Attribute |
|-------|-----------|-------------------|
| 2 | PromoBanner | `data-animate="promo"` |
| 2 | Header | `data-animate="header"` |
| 4 | HeroSection | `data-animate="hero"` |
| 3 | TabFilter wrapper | `data-animate="tabs"` |
| 3 | ProductCard wrapper | `data-animate="product"` |

**If these attributes are missing, inform the orchestrator to add them during integration.**

---

## Validation Checklist

```bash
# TypeScript compiles
npx tsc --noEmit

# Dev server runs
npm run dev

# Verify:
# - Page load animation sequence plays (~1.5s total)
# - Elements animate in order: promo -> header -> hero -> tabs -> products
# - Scroll animations trigger on ValueProps section
# - All animations run at 60fps (no jank)
# - Animations don't cause layout shift
```

---

## Files Created

When complete, you should have created:
- `/src/lib/animations.ts`
- `/src/components/animations/PageLoadAnimation.tsx`
- `/src/components/animations/index.ts`
- `/src/hooks/useScrollAnimation.ts`

Signal completion:
```bash
touch .done-animations
```
