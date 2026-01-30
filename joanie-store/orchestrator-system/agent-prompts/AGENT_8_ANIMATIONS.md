# ✨ AGENT 8: ANIMATIONS

## Project Context
You are building: **S'26 Dev Challenge - E-Commerce Store**
Tech Stack: Next.js 14 + TypeScript + Framer Motion + GSAP

## Your Role
You are the ANIMATIONS specialist. You own all animation polish and page transitions.

## Your Domain (Enhance existing files)
```
- Page load sequences
- Scroll-triggered animations
- Micro-interactions polish
- Cart icon bounce
- Global animation utilities
```

## Dependencies
- Requires: All components from Agents 2, 3, 7

---

## 🎨 FIGMA DESIGN REFERENCE (CRITICAL)

**Read animation specifications from Figma:**

```
/design-system/interactions.json     # Prototype transitions and timings
/design-system/components.json       # Hover states if documented
```

### If Figma Has Prototypes
Agent 0 will extract transition data into `interactions.json`:
```json
{
  "transitions": {
    "pageTransition": { "type": "dissolve", "duration": "300ms" },
    "buttonHover": { "scale": 1.02, "duration": "150ms" }
  },
  "pageLoadSequence": [
    { "element": "promoBanner", "animation": "fadeIn", "delay": 0 },
    { "element": "header", "animation": "slideDown", "delay": 200 },
    ...
  ]
}
```

**Use these exact timings and easings in your GSAP/Framer Motion code.**

### If No Prototype Data
Use sensible defaults that match the design's feel:
- Fast, snappy for e-commerce (200-400ms transitions)
- Subtle micro-interactions (scale 1.02, not 1.1)
- Stagger delays of 50-100ms between items

### Animation Must Not Alter Layout
- Animations enhance the static design, they don't change it
- Elements must end up in their exact Figma positions
- No animation should cause layout shift or janky behavior

### Hover States
If Figma shows hover states for buttons, cards, links:
- Extract the exact hover color/shadow/scale
- Implement with matching duration and easing

---

## TASK 0: Install GSAP

```bash
npm install gsap @gsap/react
```

## TASK 1: Create Animation Utilities

Create `/src/lib/animations.ts`:

```typescript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Easing presets
export const easings = {
  smooth: 'power2.out',
  bounce: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.3)',
  snappy: 'power4.out',
};

// Animation presets
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
};

// Stagger container
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Stagger item
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};
```

## TASK 2: Create Page Load Animation Component

Create `/src/components/animations/PageLoadAnimation.tsx`:

```typescript
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function PageLoadAnimation() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
    });

    // Initial states
    gsap.set('[data-animate="header"]', { y: -100, opacity: 0 });
    gsap.set('[data-animate="promo"]', { opacity: 0 });
    gsap.set('[data-animate="hero"]', { opacity: 0, y: 30 });
    gsap.set('[data-animate="tabs"]', { x: -50, opacity: 0 });
    gsap.set('[data-animate="product"]', { y: 50, opacity: 0 });

    // Animation sequence
    tl.to('[data-animate="promo"]', {
      opacity: 1,
      duration: 0.4,
    })
      .to(
        '[data-animate="header"]',
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
        },
        '-=0.2'
      )
      .to(
        '[data-animate="hero"]',
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        '-=0.3'
      )
      .to(
        '[data-animate="tabs"]',
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
        },
        '-=0.2'
      )
      .to(
        '[data-animate="product"]',
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
        },
        '-=0.2'
      );
  }, []);

  return null;
}
```

## TASK 3: Create Scroll Animations Hook

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
  trigger?: string;
  start?: string;
  duration?: number;
  delay?: number;
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  const {
    animation = 'fadeUp',
    start = 'top 80%',
    duration = 0.6,
    delay = 0,
  } = options;

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const animations = {
      fadeUp: { from: { y: 50, opacity: 0 }, to: { y: 0, opacity: 1 } },
      fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
      slideLeft: { from: { x: -50, opacity: 0 }, to: { x: 0, opacity: 1 } },
      slideRight: { from: { x: 50, opacity: 0 }, to: { x: 0, opacity: 1 } },
      scale: { from: { scale: 0.9, opacity: 0 }, to: { scale: 1, opacity: 1 } },
    };

    const anim = animations[animation];

    gsap.set(element, anim.from);

    gsap.to(element, {
      ...anim.to,
      duration,
      delay,
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
  }, [animation, start, duration, delay]);

  return ref;
}
```

## TASK 4: Create Cart Icon with Bounce Animation

Create `/src/components/animations/AnimatedCartIcon.tsx`:

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';
import gsap from 'gsap';

interface AnimatedCartIconProps {
  itemCount: number;
  onClick?: () => void;
}

export default function AnimatedCartIcon({
  itemCount,
  onClick,
}: AnimatedCartIconProps) {
  const iconRef = useRef<HTMLButtonElement>(null);
  const prevCountRef = useRef(itemCount);

  useEffect(() => {
    if (itemCount > prevCountRef.current && iconRef.current) {
      // Bounce animation when item added
      gsap.fromTo(
        iconRef.current,
        { scale: 1 },
        {
          scale: 1.3,
          duration: 0.15,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        }
      );

      // Badge pop animation
      const badge = iconRef.current.querySelector('[data-badge]');
      if (badge) {
        gsap.fromTo(
          badge,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.3,
            ease: 'back.out(1.7)',
          }
        );
      }
    }

    prevCountRef.current = itemCount;
  }, [itemCount]);

  return (
    <button
      ref={iconRef}
      onClick={onClick}
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
    >
      <ShoppingCart className="h-5 w-5 text-gray-700" />
      {itemCount > 0 && (
        <span
          data-badge
          className="absolute -top-1 -right-1 bg-sale-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}
```

## TASK 5: Create Heart Pop Animation Component

Update or create `/src/components/ui/AnimatedHeart.tsx`:

```typescript
'use client';

import { useRef, useEffect } from 'react';
import { Heart } from 'lucide-react';
import gsap from 'gsap';

interface AnimatedHeartProps {
  filled: boolean;
  onClick?: () => void;
  className?: string;
}

export default function AnimatedHeart({
  filled,
  onClick,
  className = '',
}: AnimatedHeartProps) {
  const heartRef = useRef<HTMLButtonElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const prevFilledRef = useRef(filled);

  useEffect(() => {
    if (filled && !prevFilledRef.current && heartRef.current) {
      // Heart pop animation
      gsap.fromTo(
        heartRef.current.querySelector('svg'),
        { scale: 1 },
        {
          scale: 1.4,
          duration: 0.15,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        }
      );

      // Particle burst
      if (particlesRef.current) {
        const particles = particlesRef.current.children;
        gsap.fromTo(
          particles,
          {
            scale: 0,
            opacity: 1,
            x: 0,
            y: 0,
          },
          {
            scale: 1,
            opacity: 0,
            x: (i) => (Math.random() - 0.5) * 40,
            y: (i) => (Math.random() - 0.5) * 40,
            duration: 0.5,
            stagger: 0.02,
            ease: 'power2.out',
          }
        );
      }
    }

    prevFilledRef.current = filled;
  }, [filled]);

  return (
    <button
      ref={heartRef}
      onClick={onClick}
      className={`relative p-2 rounded-full transition-colors ${className}`}
    >
      <Heart
        className={`h-5 w-5 transition-colors ${
          filled
            ? 'fill-wishlist-red text-wishlist-red'
            : 'fill-transparent text-gray-400 hover:text-gray-600'
        }`}
      />

      {/* Particle container */}
      <div
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-wishlist-red rounded-full"
            style={{ opacity: 0 }}
          />
        ))}
      </div>
    </button>
  );
}
```

## TASK 6: Create Scroll-Triggered Value Props

Update `/src/components/home/ValueProps.tsx` to add scroll animations:

```typescript
'use client';

import { useRef, useEffect } from 'react';
import { Truck, HeadphonesIcon, RefreshCw } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const props = [
  {
    icon: Truck,
    title: 'FREE AND FAST DELIVERY',
    description: 'Free delivery for all orders over $140',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 CUSTOMER SERVICE',
    description: 'Friendly 24/7 customer support',
  },
  {
    icon: RefreshCw,
    title: 'MONEY BACK GUARANTEE',
    description: 'We return money within 30 days',
  },
];

export default function ValueProps() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const items = itemsRef.current.filter(Boolean);

    gsap.set(items, { y: 40, opacity: 0 });

    gsap.to(items, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-16 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {props.map((prop, index) => (
            <div
              key={prop.title}
              ref={(el) => (itemsRef.current[index] = el)}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 p-4 bg-gray-100 rounded-full">
                <div className="p-2 bg-btn-dark rounded-full">
                  <prop.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-sm font-bold text-btn-dark mb-2">
                {prop.title}
              </h3>
              <p className="text-sm text-gray-600">{prop.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## TASK 7: Add Tab Slide Animation

Update `/src/components/home/TabFilter.tsx` to enhance the animation:

```typescript
'use client';

import { motion } from 'framer-motion';

type TabCategory = 'new-arrivals' | 'trending';

interface TabFilterProps {
  activeTab: TabCategory;
  onTabChange: (tab: TabCategory) => void;
}

const tabs: { id: TabCategory; label: string }[] = [
  { id: 'new-arrivals', label: 'NEW ARRIVALS' },
  { id: 'trending', label: "WHAT'S TRENDING" },
];

export default function TabFilter({ activeTab, onTabChange }: TabFilterProps) {
  return (
    <div className="flex gap-4" data-animate="tabs">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            relative px-6 py-3 rounded-[5px] font-medium text-sm transition-colors overflow-hidden
            ${
              activeTab === tab.id
                ? 'text-white'
                : 'bg-transparent border border-btn-accent text-btn-accent hover:bg-btn-accent/10'
            }
          `}
        >
          {/* Animated background */}
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTabBg"
              className="absolute inset-0 bg-btn-dark"
              initial={false}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
              }}
            />
          )}

          <span className="relative z-10">{tab.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
```

---

## TASK 8: Add Data Attributes to Layout Components

Update the layout components to include `data-animate` attributes for the page load animation:

In `PromoBanner.tsx`:
```tsx
<div data-animate="promo" className="...">
```

In `Header.tsx`:
```tsx
<header data-animate="header" className="...">
```

In `Hero.tsx`:
```tsx
<section data-animate="hero" className="...">
```

In `ProductGrid.tsx` - wrap each product card:
```tsx
<motion.div data-animate="product" ...>
```

---

## Validation Checklist

```bash
# TypeScript compiles
npx tsc --noEmit

# Dev server runs
npm run dev

# Verify:
# - Page load animation sequence plays
# - Scroll animations trigger on ValueProps
# - Tab switch has smooth animation
# - Cart icon bounces when item added
# - Heart has particle burst when wishlisted
# - All animations run at 60fps (no jank)
```

---

## Output

When complete:
```bash
git checkout -b feature/animations
git add .
git commit -m "animations: Add GSAP page load sequence, scroll animations, and micro-interactions"
touch .done-animations
git add .done-animations
git commit -m "animations: Signal completion"
git push origin feature/animations
```
