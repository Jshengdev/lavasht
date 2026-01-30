# Master Design Specification
## S'26 Dev Challenge - E-Commerce Store

**Figma Source:** https://www.figma.com/design/JRzzLjCpKp7XIHfo65SC90/S-26-Dev-Challenge
**Document ID:** `JRzzLjCpKp7XIHfo65SC90`
**Extracted:** January 30, 2026

---

## Tech Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| Framework | Next.js 14 (App Router) | React-based, API routes, server components, Vercel deployment |
| Database | PostgreSQL (Supabase) | Relational, proper for e-commerce relationships |
| ORM | Prisma | Type-safe queries, migrations, auto-generated types |
| Auth | NextAuth.js | Session management, OAuth support, Next.js integration |
| Styling | Tailwind CSS | Utility-first, fast iteration, Figma-to-code workflow |
| Animations | Framer Motion + GSAP | Declarative React animations + timeline control |
| 3D Effects | Three.js + React Three Fiber | Depth map displacement for hero shoe |
| Deployment | Vercel | Built for Next.js, instant deploys |

---

## 1. COLOR PALETTE (FROM FIGMA)

### Primary Colors
| Name | Hex | Tailwind Token | Usage |
|------|-----|----------------|-------|
| Promo Banner | `#4A4C6C` | `promo-banner` | Top promotional banner background |
| Page Background | `#F4F4F4` | `page-bg` | Main page background |
| Footer Background | `#333333` | `footer-bg` | Footer dark background |
| Card Background | `#FFFFFF` | `card-bg` | Product cards, content areas |

### Button Colors
| Name | Hex | Tailwind Token | Usage |
|------|-----|----------------|-------|
| Button Dark | `#333333` | `btn-dark` | Primary dark button, NEW ARRIVALS active |
| Button Accent | `#77794E` | `btn-accent` | Outlined button border (WHAT'S TRENDING) |
| Button Accent Hover | `#9FA16D` | `btn-accent-hover` | Outlined button hover state |
| Button Border Light | `#F4F4F4` | `btn-border-light` | Dark button border color |

### Accent Colors
| Name | Hex | Tailwind Token | Usage |
|------|-----|----------------|-------|
| Sale/Wishlist Red | `#DB4444` | `sale-red` / `wishlist-red` | Sale badges, filled hearts, sale prices |
| Star Yellow | `#FFAD33` | `star-yellow` | Star ratings filled |
| Star Empty | `#E0E0E0` | `star-empty` | Star ratings empty |

### Text Colors
| Name | Hex | Tailwind Token | Usage |
|------|-----|----------------|-------|
| Primary Text | `#333333` | `text-primary` | Main headings, body text |
| Secondary Text | `#7F7F7F` | `text-secondary` | Descriptions, muted text, rating counts |
| White Text | `#FFFFFF` | `text-white` | Text on dark backgrounds |

---

## 2. TYPOGRAPHY

### Font Family
```
Primary: Inter (or system sans-serif fallback)
Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
```

### Text Styles
| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Promo Banner Text | 14px | 400 | #FFFFFF |
| Navigation Links | 14px | 500 | #333333 |
| Section Headers | 24-32px | 700 | #333333 |
| Button Text (Large) | 16px | 600 | varies |
| Button Text (Small) | 14px | 500 | varies |
| Product Name | 16px | 500 | #333333 |
| Price | 16px | 600 | #333333 or #DB4444 (sale) |
| Original Price (struck) | 14px | 400 | #7F7F7F |
| Rating Count | 14px | 400 | #7F7F7F |
| Footer Links | 14px | 400 | #FFFFFF |

---

## 3. LAYOUT SPECIFICATIONS

### Page Structure
| Element | Dimensions | Notes |
|---------|------------|-------|
| Page Width | 1440px | Max content width |
| Page Min Height | 2919px | Full page height |
| Content Container | 1370px | Inner content max-width |
| Section Gap | 112px | Vertical gap between major sections |

### Component Dimensions
| Component | Width | Height | Notes |
|-----------|-------|--------|-------|
| Promo Banner | 100% | 41px | Padding: 12px vertical |
| Header | 1370px | 70px | Padding: 20px, Gap: 752px between sections |
| Hero Section | 1090px | 578px | 3D shoe effect, decorative frame |
| Product Section | 1279px | 1058px | Gap: 166px between tabs and grid |
| Product Card | 270px | 350px | Gap: 16px internal, vertical flow |
| Footer | 1440px | 451px | Padding: 58/144/35/144 (T/X/B/X) |

---

## 4. COMPONENT SPECIFICATIONS

### Tab Buttons

#### NEW ARRIVALS (Filled - Active State)
```
Width: hug (140px min)
Height: 45px
Padding: 12px top, 20px right, 11px bottom, 20px left
Border Radius: 5px
Background: #333333
Text Color: #FFFFFF
Border: 1px solid #F4F4F4
Font: 14px / 500
```

#### WHAT'S TRENDING (Outlined - Inactive State)
```
Width: hug (250px min)
Height: 57px
Padding: 16px top, 33px right, 16px bottom, 33px left
Border Radius: 100px (pill)
Background: transparent
Border: 4px solid #77794E
Text Color: #77794E
Font: 14px / 500

Hover:
- Border: 4px solid #9FA16D
- Text Color: #9FA16D
- Animation: smart-animate, ease-in-out-back, 300ms
```

### Product Card
```
Dimensions: 270px × 350px
Flow: vertical
Gap: 16px
Background: #FFFFFF
Border Radius: 4px

Image Container:
- Size: 270px × 270px (square)
- Background: #F5F5F5

Sale Badge:
- Position: top-left (12px, 12px)
- Background: #DB4444
- Text: #FFFFFF
- Border Radius: 4px
- Format: "-XX%"

Heart Icon:
- Container: 34px × 34px
- Icon: 24px
- Position: top-right (12px, 12px)
- Empty: #333333 outline
- Filled: #DB4444 fill

Add to Cart Button:
- Position: bottom of image
- Width: 100%
- Background: #333333
- Text: #FFFFFF
- Animation: slide up on hover

Content Area:
- Padding: 16px
- Gap: 8px

Product Name: 16px / 500 / #333333
Price: 16px / 600 / #333333
Sale Price: 16px / 600 / #DB4444
Original Price: 14px / 400 / #7F7F7F / line-through
Stars: 16px / filled #FFAD33 / empty #E0E0E0
Rating Count: 14px / 400 / #7F7F7F
```

### Value Props
```
Columns: 3
Gap: 48px
Background: #FFFFFF
Padding: 64px vertical

Icon Container:
- Outer: 80px circle, #F3F3F3
- Inner: 56px circle, #333333
- Icon: 24px, #FFFFFF

Title: 16px / 600 / #333333 / uppercase
Description: 14px / 400 / #7F7F7F

Items:
1. Truck icon - "FREE AND FAST DELIVERY" - "Free delivery for all orders over $140"
2. Headphones icon - "24/7 CUSTOMER SERVICE" - "Friendly 24/7 customer support"
3. Refresh icon - "MONEY BACK GUARANTEE" - "We return money within 30 days"
```

### Footer
```
Dimensions: 1440px × 451px
Background: #333333
Padding: 58px top, 144px sides, 35px bottom
Gap: 43px

Logo: "Logo" text (placeholder for actual logo)
Address: USA, California
Contact: (800) 123 4567, joanie2k@gmail.com

Link Sections: Shop, Help, About
Social Icons: Facebook, Instagram, X, LinkedIn, YouTube (20px, 16px gap)
Copyright: "© 2023 Joanie. All rights reserved." (14px, #7F7F7F, center)
```

---

## 5. ANIMATION SPECIFICATIONS

### Button Interactions
```
Hover: scale 1.0 → 1.02, add subtle shadow
Active: scale 1.02 → 0.98
Duration: 150ms
```

### Tab Switch Animation
```
Type: Layout animation (Framer Motion layoutId)
Spring: stiffness 500, damping 30
Effect: Active background slides between tabs
```

### Heart Icon Animation
```
On Fill:
- Scale: 1 → 1.4 → 1 (pop effect)
- Duration: 0.15s per phase (0.3s total)
- Particle burst: 8 particles explode outward
```

### Product Card Hover
```
Add to Cart Button:
- Initial: translateY(100%), opacity 0
- Hover: translateY(0), opacity 1
- Duration: 0.3s
- Easing: ease-out
```

### Page Load Sequence (GSAP)
```
1. Promo banner fades in (0.4s)
2. Header slides down (0.5s, -0.2s overlap)
3. Hero fades in + rises (0.6s, -0.3s overlap)
4. Tabs slide from left (0.4s, -0.2s overlap)
5. Products stagger in from bottom (0.5s each, 0.1s stagger)

Total: ~1.5s
```

---

## 6. SPACING SYSTEM

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight padding, icon gaps |
| sm | 8px | Small gaps |
| md | 12px | Button padding vertical |
| lg | 16px | Card gaps, section padding |
| xl | 20px | Button padding horizontal |
| 2xl | 24px | Grid gaps |
| 3xl | 33px | Large button padding |
| 4xl | 43px | Footer gap |
| section | 112px | Between major sections |
| hero-gap | 166px | Tab to product grid |

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| sm | 4px | Badges, cards |
| md | 5px | Standard buttons |
| pill | 100px | Pill buttons (WHAT'S TRENDING) |
| full | 50% | Circular elements |

---

## 7. RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Grid Columns | Gap |
|------------|-------|--------------|-----|
| Mobile | < 640px | 2 columns | 16px |
| Tablet | 640-1024px | 3 columns | 20px |
| Desktop | > 1024px | 4 columns | 24px |

---

## 8. SHARED TYPESCRIPT TYPES

```typescript
// src/types/index.ts

export interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  image: string;
  rating: number;
  reviewCount: number;
  category: 'new-arrivals' | 'trending';
  isOnSale: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  userId: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

export type TabCategory = 'new-arrivals' | 'trending';
```

---

## 9. FILE STRUCTURE

```
/src
  /app
    /api
      /auth/[...nextauth]/route.ts
      /auth/signup/route.ts
      /products/route.ts
      /cart/route.ts
      /cart/[id]/route.ts
      /wishlist/route.ts
    /(store)
      page.tsx
      layout.tsx
    layout.tsx
    globals.css
  /components
    /layout
      PromoBanner.tsx
      Header.tsx
      Footer.tsx
    /home
      Hero.tsx
      HeroShoe3D.tsx
      TabFilter.tsx
      ProductGrid.tsx
      ProductCard.tsx
      ValueProps.tsx
    /ui
      Button.tsx
      Badge.tsx
      StarRating.tsx
      HeartIcon.tsx
    /auth
      AuthProvider.tsx
      SignInModal.tsx
      SignUpModal.tsx
      UserMenu.tsx
  /hooks
    useProducts.ts
    useCart.ts
    useWishlist.ts
  /lib
    prisma.ts
    auth.ts
  /types
    index.ts
    next-auth.d.ts
/prisma
  schema.prisma
  seed.ts
/public
  /images
    hero-shoe.png       # Placeholder - replace with actual asset
    shoe-1.png          # Placeholder - replace with actual asset
    shoe-2.png          # ...
    shoe-3.png
    shoe-4.png
    shoe-5.png
    shoe-6.png
    shoe-7.png
    shoe-8.png
    logo.svg            # Placeholder - replace with actual asset
/design-system
  tokens.json
  components.json
  tailwind-extend.json
  interactions.json
```

---

## 10. API CONTRACTS

### GET /api/products
```typescript
// Query: ?category=new-arrivals|trending (optional)
// Response:
{ products: Product[] }
```

### GET /api/cart
```typescript
// Requires auth
// Response:
{ items: CartItem[] }
```

### POST /api/cart
```typescript
// Body: { productId: string }
// Response:
{ success: boolean, item: CartItem }
```

### POST /api/wishlist
```typescript
// Body: { productId: string }
// Toggles: add if not exists, remove if exists
// Response:
{ success: boolean, action: 'added' | 'removed', item?: WishlistItem }
```

---

## 11. SEED DATA

```typescript
// Products (8 total: 4 new-arrivals, 4 trending)
// Use placeholder names - actual product images will be provided separately

const products = [
  // New Arrivals
  { name: "HAVIT HV-G92 Gamepad", price: 160, category: "new-arrivals", rating: 5, reviewCount: 88 },
  { name: "HAVIT HV-G92 Gamepad", price: 160, category: "new-arrivals", rating: 5, reviewCount: 98 },
  { name: "HAVIT HV-G92 Gamepad", price: 160, category: "new-arrivals", rating: 5, reviewCount: 88 },
  { name: "HAVIT HV-G92 Gamepad", price: 960, salePrice: 1160, isOnSale: true, category: "new-arrivals", rating: 4, reviewCount: 75 },

  // Trending
  { name: "HAVIT HV-G92 Gamepad", price: 180, category: "trending", rating: 5, reviewCount: 88 },
  { name: "HAVIT HV-G92 Gamepad", price: 960, salePrice: 1160, isOnSale: true, category: "trending", rating: 4, reviewCount: 79 },
  { name: "HAVIT HV-G92 Gamepad", price: 180, category: "trending", rating: 5, reviewCount: 98 },
  { name: "HAVIT HV-G92 Gamepad", price: 960, salePrice: 1160, isOnSale: true, category: "trending", rating: 4, reviewCount: 75 },
];
```

---

## 12. ASSETS REQUIRED (PLACEHOLDERS)

### Images (to be provided)
- `/public/images/hero-shoe.png` - Hero 3D shoe
- `/public/images/shoe-1.png` through `shoe-8.png` - Product images
- `/public/images/logo.svg` - Logo icon

### Icons (Lucide React)
- Heart, ShoppingCart, User (header)
- Truck, Headphones, RefreshCw (value props)
- Star (ratings)
- Facebook, Instagram, Twitter, Linkedin, Youtube (footer)

---

**END OF MASTER SPECIFICATION**

*All values extracted from Figma. Assets are placeholders - replace with actual exported images.*
