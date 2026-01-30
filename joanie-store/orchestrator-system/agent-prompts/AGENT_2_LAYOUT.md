# 🎨 AGENT 2: LAYOUT

## Project Context
You are building: **S'26 Dev Challenge - E-Commerce Store**
Tech Stack: Next.js 14 + TypeScript + Tailwind CSS

## Your Role
You are the LAYOUT specialist. You own the page shell components.

## Your Domain (ONLY modify these files)
```
/src/components/layout/PromoBanner.tsx
/src/components/layout/Header.tsx
/src/components/layout/Footer.tsx
/src/components/home/ValueProps.tsx
/src/app/(store)/layout.tsx
/tailwind.config.ts (extend colors only)
```

---

## 🎨 FIGMA DESIGN REFERENCE (CRITICAL - PIXEL PERFECT)

**You MUST read these files before implementing ANY component:**

```
/design-system/tokens.json           # Colors, typography, spacing
/design-system/components.json       # Exact dimensions for each component
/design-system/tailwind-extend.json  # Pre-built Tailwind config extension
```

### How to Use Figma Data

**For PromoBanner:**
```typescript
// Read from components.json -> promoBanner
const specs = require('/design-system/components.json').promoBanner;
// Use: specs.height, specs.backgroundColor, specs.textColor, specs.text
```

**For Header:**
```typescript
// Read from components.json -> header
const specs = require('/design-system/components.json').header;
// Use: specs.height, specs.paddingX, specs.logo, specs.nav.items, specs.icons
```

**For Footer:**
```typescript
// Read from components.json -> footer
const specs = require('/design-system/components.json').footer;
// Use: specs.height, specs.backgroundColor, specs.columns, specs.linkSections
```

**For ValueProps:**
```typescript
// Read from components.json -> valueProps
const specs = require('/design-system/components.json').valueProps;
// Use: specs.items (actual text from Figma), specs.item.iconContainer, etc.
```

### PIXEL-PERFECT RULES

1. **Use exact pixel values** - If Figma says 41px, use `h-[41px]` not `h-10`
2. **Use exact colors** - Copy hex from tokens.json, don't approximate
3. **Use exact text** - Copy promo text, nav items, footer links exactly from Figma
4. **Use exact spacing** - Read padding/margin from components.json
5. **Match the logo** - Use the exported logo from `/public/images/logo.svg` or replicate the SVG exactly

### Tailwind Config
Instead of manually defining colors, merge the extracted config:

```typescript
// tailwind.config.ts
import figmaTokens from './design-system/tailwind-extend.json';

const config = {
  theme: {
    extend: {
      ...figmaTokens,
      // Add any additional customizations
    }
  }
}
```

---

## TASK 0: Extend Tailwind Config

Update `/tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'promo-banner': '#4A4C6C',
        'footer-bg': '#333333',
        'page-bg': '#F4F4F4',
        'sale-red': '#DB4444',
        'wishlist-red': '#DB4444',
        'btn-dark': '#333333',
        'btn-accent': '#B5A642',
        'star-yellow': '#FFAD33',
      },
    },
  },
  plugins: [],
};

export default config;
```

## TASK 1: Install Lucide Icons

```bash
npm install lucide-react
```

## TASK 2: Create PromoBanner

Create `/src/components/layout/PromoBanner.tsx`:

```typescript
export default function PromoBanner() {
  return (
    <div className="w-full bg-promo-banner py-3 text-center">
      <p className="text-sm text-white">
        New here? Save 20% with code: <span className="font-semibold">YES4</span>
      </p>
    </div>
  );
}
```

## TASK 3: Create Header

Create `/src/components/layout/Header.tsx`:

```typescript
'use client';

import Link from 'next/link';
import { Heart, ShoppingCart, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-btn-dark"
          >
            <path
              d="M16 4C12 4 8 8 8 12C8 16 12 20 16 28C20 20 24 16 24 12C24 8 20 4 16 4Z"
              fill="currentColor"
            />
          </svg>
          <span className="text-xl font-bold text-btn-dark">Joanie</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {['Women', 'Men', 'Kids', 'Sale', 'New', 'Brands'].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-btn-dark transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Heart className="h-5 w-5 text-gray-700" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
            <ShoppingCart className="h-5 w-5 text-gray-700" />
            {/* Cart count badge - uncomment when cart state is available
            <span className="absolute -top-1 -right-1 bg-sale-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              2
            </span>
            */}
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <User className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
}
```

## TASK 4: Create Footer

Create `/src/components/layout/Footer.tsx`:

```typescript
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-footer-bg text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Logo</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p className="font-medium text-white">Address:</p>
              <p>USA, California</p>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <p className="font-medium text-white">Contact:</p>
              <p>(800) 123 4567</p>
              <p>joanie2k@gmail.com</p>
            </div>
          </div>

          {/* Quick Links - placeholder columns */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="#" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Trending</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Sale</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Help</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="#" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Shipping</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Returns</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">About</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="#" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-gray-300 transition-colors">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">
              <Youtube className="h-5 w-5" />
            </Link>
          </div>
          <p className="text-sm text-gray-400">
            © 2029 Joanie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

## TASK 5: Create ValueProps

Create `/src/components/home/ValueProps.tsx`:

```typescript
import { Truck, HeadphonesIcon, RefreshCw } from 'lucide-react';

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
  return (
    <section className="w-full py-16 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {props.map((prop) => (
            <div key={prop.title} className="flex flex-col items-center text-center">
              <div className="mb-4 p-4 bg-gray-100 rounded-full">
                <div className="p-2 bg-btn-dark rounded-full">
                  <prop.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-sm font-bold text-btn-dark mb-2">
                {prop.title}
              </h3>
              <p className="text-sm text-gray-600">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## TASK 6: Create Store Layout

Create directory and file `/src/app/(store)/layout.tsx`:

```typescript
import PromoBanner from '@/components/layout/PromoBanner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-page-bg">
      <PromoBanner />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
```

Create placeholder `/src/app/(store)/page.tsx`:

```typescript
export default function HomePage() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-4xl font-bold">Home Page</h1>
      <p className="mt-4 text-gray-600">Layout components working!</p>
    </div>
  );
}
```

---

## Validation Checklist

```bash
# TypeScript compiles
npx tsc --noEmit

# Dev server runs
npm run dev
# Visit http://localhost:3000 - should see layout
```

---

## Output

When complete:
```bash
git checkout -b feature/layout
git add .
git commit -m "layout: Create PromoBanner, Header, Footer, ValueProps, store layout"
touch .done-layout
git add .done-layout
git commit -m "layout: Signal completion"
git push origin feature/layout
```
