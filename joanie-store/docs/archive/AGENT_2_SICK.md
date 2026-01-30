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
/src/components/layout/HeaderWithAuth.tsx
/src/components/layout/Footer.tsx
/src/components/home/ValueProps.tsx
/src/app/(store)/layout.tsx
/src/app/(store)/page.tsx
/tailwind.config.ts
```

---

## IMPORTANT: Project Already Initialized

The Orchestrator has already created the Next.js project. You are working inside an existing project directory.

---

## TASK 1: Install Lucide Icons

```bash
npm install lucide-react
```

## TASK 2: Update Tailwind Config (PIXEL-PERFECT)

Update `/tailwind.config.ts` with exact Figma colors:

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
        // From Figma tokens.json - EXACT VALUES
        'promo-banner': '#4A4C6C',
        'page-bg': '#F4F4F4',
        'footer-bg': '#333333',
        'card-bg': '#FFFFFF',
        'btn-dark': '#333333',
        'btn-accent': '#77794E',
        'btn-accent-hover': '#9FA16D',
        'btn-border-light': '#F4F4F4',
        'sale-red': '#DB4444',
        'wishlist-red': '#DB4444',
        'price-red': '#DB4444',
        'star-yellow': '#FFAD33',
        'star-empty': '#E0E0E0',
        'text-primary': '#333333',
        'text-secondary': '#7F7F7F',
        'icon-container-outer': '#F3F3F3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        'page': '1440px',
        'content': '1370px',
      },
      boxShadow: {
        'header': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
```

## TASK 3: Create PromoBanner (PIXEL-PERFECT)

Create `/src/components/layout/PromoBanner.tsx`:

```typescript
// Figma specs: height 41px, bg #4A4C6C, fontSize 14px, fontWeight 400
export default function PromoBanner() {
  return (
    <div data-animate="promo" className="w-full h-[41px] bg-promo-banner flex items-center justify-center">
      <p className="text-[14px] font-normal text-white">
        New here? Save 20% with code: <span className="font-semibold">YES4</span>
      </p>
    </div>
  );
}
```

## TASK 4: Create Header (PIXEL-PERFECT)

Create `/src/components/layout/Header.tsx`:

```typescript
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, User } from 'lucide-react';

// Figma specs: height 70px, padding 20px, nav fontSize 14px fontWeight 500, icons 24px gap 16px

interface HeaderProps {
  isLoggedIn?: boolean;
  onAccountClick?: () => void;
  userMenu?: ReactNode;
}

export default function Header({ isLoggedIn = false, onAccountClick, userMenu }: HeaderProps) {
  const navItems = ['Women', 'Men', 'Kids', 'Sale', 'New', 'Brands'];

  return (
    <header data-animate="header" className="w-full bg-white">
      <div className="mx-auto max-w-content h-[70px] px-[20px] flex items-center justify-between">
        {/* Logo - Bird/arrow geometric icon */}
        <Link href="/" className="flex items-center gap-2">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Geometric bird/arrow shape */}
            <path
              d="M8 24L16 8L24 24L16 18L8 24Z"
              fill="#333333"
            />
          </svg>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-[32px]">
          {navItems.map((item) => (
            <Link
              key={item}
              href="#"
              className="text-[14px] font-medium text-text-primary hover:opacity-70 transition-opacity"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Icons - size 24px, gap 16px */}
        <div className="flex items-center gap-[16px]">
          <button
            className="p-1 hover:opacity-70 transition-opacity"
            aria-label="Wishlist"
          >
            <Heart className="w-[24px] h-[24px] text-text-primary" strokeWidth={1.5} />
          </button>
          <button
            className="p-1 hover:opacity-70 transition-opacity"
            aria-label="Cart"
          >
            <ShoppingCart className="w-[24px] h-[24px] text-text-primary" strokeWidth={1.5} />
          </button>
          {isLoggedIn && userMenu ? (
            userMenu
          ) : (
            <button
              className="p-1 hover:opacity-70 transition-opacity"
              aria-label="Account"
              onClick={onAccountClick}
            >
              <User className="w-[24px] h-[24px] text-text-primary" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
```

## TASK 5: Create HeaderWithAuth (Auth Integration)

Create `/src/components/layout/HeaderWithAuth.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Header from './Header';
import SignInModal from '@/components/auth/SignInModal';
import SignUpModal from '@/components/auth/SignUpModal';
import UserMenu from '@/components/auth/UserMenu';

export default function HeaderWithAuth() {
  const { data: session } = useSession();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <>
      <Header
        isLoggedIn={!!session}
        onAccountClick={() => !session && setShowSignIn(true)}
        userMenu={session ? <UserMenu /> : null}
      />
      <SignInModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSwitchToSignUp={() => { setShowSignIn(false); setShowSignUp(true); }}
      />
      <SignUpModal
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSwitchToSignIn={() => { setShowSignUp(false); setShowSignIn(true); }}
      />
    </>
  );
}
```

## TASK 6: Create Footer (PIXEL-PERFECT)

Create `/src/components/layout/Footer.tsx`:

```typescript
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

// Figma specs: height 451px, paddingTop 58px, paddingBottom 35px, paddingX 144px
// bg #333333, logo fontSize 24px fontWeight 700
// socialIcons size 20px gap 16px
// copyright fontSize 14px color #7F7F7F

const linkSections = [
  {
    title: 'Shop',
    links: ['New Arrivals', 'Trending', 'Sale'],
  },
  {
    title: 'Help',
    links: ['FAQs', 'Shipping', 'Returns'],
  },
  {
    title: 'About',
    links: ['Our Story', 'Careers', 'Contact'],
  },
];

const socialIcons = [
  { Icon: Facebook, label: 'Facebook' },
  { Icon: Instagram, label: 'Instagram' },
  { Icon: Twitter, label: 'Twitter' },
  { Icon: Linkedin, label: 'LinkedIn' },
  { Icon: Youtube, label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="w-full bg-footer-bg text-white">
      <div className="mx-auto max-w-page pt-[58px] pb-[35px] px-[144px]">
        {/* Main Footer Content */}
        <div className="flex justify-between gap-[43px]">
          {/* Brand Column */}
          <div className="flex flex-col gap-[24px]">
            {/* Logo */}
            <h2 className="text-[24px] font-bold">Logo</h2>

            {/* Address */}
            <div className="flex flex-col gap-[8px]">
              <p className="text-[14px] font-normal text-white">Address:</p>
              <p className="text-[14px] font-normal text-text-secondary">USA, California</p>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-[8px]">
              <p className="text-[14px] font-normal text-white">Contact:</p>
              <Link
                href="tel:8001234567"
                className="text-[14px] font-normal text-text-secondary hover:text-white transition-colors"
              >
                (800) 123 4567
              </Link>
              <Link
                href="mailto:joanie2k@gmail.com"
                className="text-[14px] font-normal text-text-secondary hover:text-white transition-colors"
              >
                joanie2k@gmail.com
              </Link>
            </div>
          </div>

          {/* Link Sections */}
          {linkSections.map((section) => (
            <div key={section.title} className="flex flex-col gap-[24px]">
              <h3 className="text-[16px] font-semibold">{section.title}</h3>
              <ul className="flex flex-col gap-[16px]">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-[14px] font-normal text-text-secondary hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-text-secondary/30 mt-[43px] mb-[24px]" />

        {/* Bottom Row - Social Icons & Copyright */}
        <div className="flex items-center justify-between">
          {/* Social Icons - size 20px, gap 16px */}
          <div className="flex items-center gap-[16px]">
            {socialIcons.map(({ Icon, label }) => (
              <Link
                key={label}
                href="#"
                className="hover:opacity-70 transition-opacity"
                aria-label={label}
              >
                <Icon className="w-[20px] h-[20px] text-white" strokeWidth={1.5} />
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-[14px] font-normal text-text-secondary">
            © 2023 Joanie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

## TASK 7: Create ValueProps (PIXEL-PERFECT)

Create `/src/components/home/ValueProps.tsx`:

```typescript
import { Truck, Headphones, RefreshCw } from 'lucide-react';

// Figma specs: paddingY 64px, gap 48px, bg white
// iconContainer: outer 80px #F3F3F3, inner 56px #333333, borderRadius 50%
// icon: 24px white
// title: fontSize 16px, fontWeight 600, marginTop 24px, uppercase
// description: fontSize 14px, color #7F7F7F, marginTop 8px

const valueProps = [
  {
    Icon: Truck,
    title: 'FREE AND FAST DELIVERY',
    description: 'Free delivery for all orders over $140',
  },
  {
    Icon: Headphones,
    title: '24/7 CUSTOMER SERVICE',
    description: 'Friendly 24/7 customer support',
  },
  {
    Icon: RefreshCw,
    title: 'MONEY BACK GUARANTEE',
    description: 'We return money within 30 days',
  },
];

export default function ValueProps() {
  return (
    <section className="w-full py-[64px] bg-white">
      <div className="mx-auto max-w-content px-[20px]">
        <div className="flex justify-center gap-[48px]">
          {valueProps.map(({ Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center">
              {/* Icon Container - outer 80px, inner 56px */}
              <div className="w-[80px] h-[80px] rounded-full bg-icon-container-outer flex items-center justify-center">
                <div className="w-[56px] h-[56px] rounded-full bg-btn-dark flex items-center justify-center">
                  <Icon className="w-[24px] h-[24px] text-white" strokeWidth={1.5} />
                </div>
              </div>

              {/* Title */}
              <h3 className="mt-[24px] text-[16px] font-semibold text-text-primary uppercase">
                {title}
              </h3>

              {/* Description */}
              <p className="mt-[8px] text-[14px] font-normal text-text-secondary">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## TASK 8: Create Store Layout

Create directory structure and `/src/app/(store)/layout.tsx`:

```bash
mkdir -p src/app/\(store\)
mkdir -p src/components/layout
mkdir -p src/components/home
```

Create `/src/app/(store)/layout.tsx`:

```typescript
import PromoBanner from '@/components/layout/PromoBanner';
import HeaderWithAuth from '@/components/layout/HeaderWithAuth';
import Footer from '@/components/layout/Footer';
import PageLoadAnimation from '@/components/animations/PageLoadAnimation';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-page-bg">
      <PageLoadAnimation />
      <PromoBanner />
      <HeaderWithAuth />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
```

## TASK 9: Create Placeholder Home Page

Create `/src/app/(store)/page.tsx`:

```typescript
import ValueProps from '@/components/home/ValueProps';

export default function HomePage() {
  return (
    <div>
      {/* Hero section will be added by Agent 4 */}
      <div className="py-20 text-center">
        <h1 className="text-4xl font-bold text-text-primary">Joanie Store</h1>
        <p className="mt-4 text-text-secondary">Layout components loaded successfully</p>
      </div>

      {/* Product section will be added by Agent 3 */}

      {/* Value Props */}
      <ValueProps />
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
# Visit http://localhost:3000 - should see layout with:
# - Purple promo banner (41px tall) with data-animate="promo"
# - White header with logo, nav, icons with data-animate="header"
# - Gray page background (#F4F4F4)
# - Value props section with circular icons
# - Dark footer with links and social icons
# - Page load animation sequence
# - Auth modals when clicking account icon (when not logged in)
```

---

## Files Created

When complete, you should have created:
- `/tailwind.config.ts` (updated)
- `/src/components/layout/PromoBanner.tsx`
- `/src/components/layout/Header.tsx`
- `/src/components/layout/HeaderWithAuth.tsx`
- `/src/components/layout/Footer.tsx`
- `/src/components/home/ValueProps.tsx`
- `/src/app/(store)/layout.tsx`
- `/src/app/(store)/page.tsx`
