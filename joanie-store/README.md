# Joanie Store

A modern e-commerce shoe store built with Next.js 16, featuring a polished UI with smooth animations, full shopping cart/wishlist functionality, and user authentication.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Features Breakdown](#features-breakdown)
   - [Authentication](#authentication)
   - [Shopping Cart](#shopping-cart)
   - [Wishlist](#wishlist)
   - [Hero Section](#hero-section)
   - [Toast Notifications](#toast-notifications)
5. [API Reference](#api-reference)
6. [Database Schema](#database-schema)
7. [Design System](#design-system)
8. [Environment Variables](#environment-variables)

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables (see Environment Variables section)
cp .env.example .env

# 3. Push database schema
npx prisma db push

# 4. Seed sample products
npx prisma db seed

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma 7 |
| Auth | NextAuth.js (JWT) |
| Animations | Framer Motion + GSAP |
| Icons | Lucide React |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (providers wrapped here)
│   ├── (store)/                  # Store pages group
│   │   ├── page.tsx              # Homepage
│   │   ├── cart/page.tsx         # Cart page
│   │   ├── wishlist/page.tsx     # Wishlist page
│   │   └── product/[id]/page.tsx # Product detail page
│   └── api/                      # REST API endpoints
│       ├── auth/                 # NextAuth + signup
│       ├── cart/                 # Cart CRUD operations
│       ├── products/             # Product listing
│       └── wishlist/             # Wishlist operations
│
├── components/
│   ├── auth/                     # Authentication UI
│   │   ├── AuthModalContext.tsx  # Global modal state (WHY: trigger sign-in from anywhere)
│   │   ├── SignInModal.tsx       # Sign in form modal
│   │   ├── SignUpModal.tsx       # Sign up form modal
│   │   └── UserMenu.tsx          # Logged-in user dropdown
│   │
│   ├── cart/                     # Shopping cart UI
│   │   ├── CartPage.tsx          # Main cart view with items + summary
│   │   ├── CartItem.tsx          # Single cart item row (quantity controls)
│   │   ├── CartSummary.tsx       # Order total + checkout button
│   │   └── EmptyCart.tsx         # Empty state with CTA
│   │
│   ├── wishlist/                 # Wishlist UI
│   │   ├── WishlistPage.tsx      # Grid of wishlisted items
│   │   ├── WishlistItem.tsx      # Single wishlist card (add to cart button)
│   │   └── EmptyWishlist.tsx     # Empty state with CTA
│   │
│   ├── home/                     # Homepage components
│   │   ├── HeroSection.tsx       # Animated hero with floating shoe + shadow
│   │   ├── ProductGrid.tsx       # Product cards grid
│   │   ├── ProductCard.tsx       # Single product card (heart + add to cart)
│   │   └── TabFilter.tsx         # Category tabs (New Arrivals / Trending)
│   │
│   ├── product/                  # Product detail page
│   │   ├── ProductDetail.tsx     # Full product view layout
│   │   └── ProductInfo.tsx       # Name, price, add to cart, wishlist buttons
│   │
│   ├── layout/                   # Global layout components
│   │   ├── Header.tsx            # Nav, icons, cart/wishlist badges
│   │   └── HeaderWithAuth.tsx    # Header wrapper with auth state
│   │
│   └── ui/                       # Reusable UI primitives
│       ├── Toast.tsx             # Toast notification system
│       ├── HeartIcon.tsx         # Animated heart toggle
│       ├── Badge.tsx             # Sale/new badges
│       └── StarRating.tsx        # 5-star rating display
│
├── hooks/                        # Custom React hooks
│   ├── useCart.ts                # Cart state + API calls
│   ├── useWishlist.ts            # Wishlist state + optimistic updates
│   └── useProducts.ts            # Product fetching by category
│
├── lib/                          # Utilities
│   ├── prisma.ts                 # Prisma client singleton
│   └── auth.ts                   # NextAuth configuration
│
└── types/                        # TypeScript definitions
    ├── index.ts                  # Product, CartItem, WishlistItem types
    └── next-auth.d.ts            # Extend NextAuth session type
```

---

## Features Breakdown

### Authentication

**Why:** Users need accounts to persist their cart and wishlist across sessions.

**What:** Modal-based sign in/sign up with JWT sessions.

**Where:**
| File | Purpose |
|------|---------|
| `lib/auth.ts` | NextAuth config with credentials provider |
| `components/auth/AuthModalContext.tsx` | Global context to open modals from anywhere |
| `components/auth/SignInModal.tsx` | Sign in form |
| `components/auth/SignUpModal.tsx` | Sign up form |
| `components/auth/UserMenu.tsx` | Dropdown when logged in |
| `api/auth/[...nextauth]/route.ts` | NextAuth API handler |
| `api/auth/signup/route.ts` | User registration endpoint |

**How it works:**
1. User clicks profile icon → `AuthModalContext.openSignIn()` opens modal
2. Form submits to NextAuth credentials provider
3. JWT token stored in cookie, user ID added to session
4. All API routes check `getAuthSession()` for user ID

---

### Shopping Cart

**Why:** Core e-commerce functionality - users add products, adjust quantities, checkout.

**What:** Full CRUD cart with real-time updates and visual feedback.

**Where:**
| File | Purpose |
|------|---------|
| `hooks/useCart.ts` | Cart state management + API calls |
| `components/cart/CartPage.tsx` | Main cart view |
| `components/cart/CartItem.tsx` | Item row with +/- quantity controls |
| `components/cart/CartSummary.tsx` | Subtotal, shipping, total |
| `api/cart/route.ts` | GET (list) + POST (add item) |
| `api/cart/[id]/route.ts` | PATCH (update qty) + DELETE (remove) |

**How it works:**
1. Click "Add to Cart" → `useCart().addToCart(productId)`
2. Hook calls `POST /api/cart` → upserts item (creates or increments)
3. Hook refetches cart → UI updates
4. Toast shows confirmation
5. Header badge updates via shared hook state

**Cart features:**
- Quantity +/- buttons (minimum 1)
- Remove item (X button)
- Free shipping over $100
- Persistent across sessions (stored in DB)

---

### Wishlist

**Why:** Let users save items for later without committing to purchase.

**What:** Heart toggle with optimistic UI updates.

**Where:**
| File | Purpose |
|------|---------|
| `hooks/useWishlist.ts` | Wishlist state + optimistic toggle |
| `components/wishlist/WishlistPage.tsx` | Grid of saved items |
| `components/wishlist/WishlistItem.tsx` | Card with "Add to Cart" |
| `components/ui/HeartIcon.tsx` | Animated heart button |
| `api/wishlist/route.ts` | GET (list) + POST (toggle) |
| `api/wishlist/ids/route.ts` | GET just product IDs (for heart state) |

**How it works:**
1. Click heart → `useWishlist().toggleWishlist(productId)`
2. **Optimistic update:** Heart fills immediately
3. API call `POST /api/wishlist` toggles in DB
4. If API fails → revert heart state
5. Toast shows confirmation

**Why optimistic updates?** Instant feedback feels snappy. The heart fills immediately instead of waiting for the server.

---

### Hero Section

**Why:** Eye-catching landing that showcases the product with premium feel.

**What:** Floating shoe with parallax mouse tracking and animated shadow.

**Where:**
| File | Purpose |
|------|---------|
| `components/home/HeroSection.tsx` | All hero logic + animations |

**Animation breakdown:**
```tsx
// Mouse parallax - shoe tilts/moves based on cursor position
const rotateX = useTransform(y, [-0.5, 0.5], [5, -5]);
const rotateY = useTransform(x, [-0.5, 0.5], [-5, 5]);

// Floating animation - shoe bobs up and down
animate={{ y: [0, -15, 0] }}
transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}

// Shadow animation - opposite of shoe, gets lighter/bigger when shoe is up
animate={{
  y: [0, 4, 0],           // Moves DOWN when shoe moves UP
  scaleX: [1, 1.08, 1],   // Gets slightly bigger
  opacity: [0.4, 0.3, 0.4], // Gets lighter (further away)
  filter: ['blur(18px)', 'blur(22px)', 'blur(18px)'], // More diffuse
}}
```

---

### Toast Notifications

**Why:** Give users feedback when actions succeed or fail.

**What:** Bottom-right toast stack with auto-dismiss.

**Where:**
| File | Purpose |
|------|---------|
| `components/ui/Toast.tsx` | ToastProvider + useToast hook |
| `app/layout.tsx` | Provider wrapped at root |

**Toast types:**
| Type | Color | Use case |
|------|-------|----------|
| `success` | Green | Item added to cart |
| `error` | Red | API failure, auth required |
| `info` | Dark gray | Item removed |
| `wishlist` | Red + heart | Wishlist toggle |

**Usage:**
```tsx
const { showToast } = useToast();
showToast('Added to cart', 'success');
showToast('Please sign in', 'error');
```

---

## API Reference

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products?category=new-arrivals` | List products by category |
| GET | `/api/products/[id]` | Single product details |

### Cart (requires auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart with items + totals |
| POST | `/api/cart` | Add item (body: `{productId, quantity}`) |
| PATCH | `/api/cart/[id]` | Update quantity (body: `{quantity}`) |
| DELETE | `/api/cart/[id]` | Remove item |

### Wishlist (requires auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wishlist` | Get full wishlist with products |
| GET | `/api/wishlist/ids` | Get just product IDs (fast) |
| POST | `/api/wishlist` | Toggle item (body: `{productId}`) |
| DELETE | `/api/wishlist/[id]` | Remove specific item |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account (body: `{name, email, password}`) |
| POST | `/api/auth/[...nextauth]` | NextAuth handlers (signin, signout, etc) |

---

## Database Schema

```
┌─────────────────┐       ┌─────────────────┐
│      User       │       │     Product     │
├─────────────────┤       ├─────────────────┤
│ id visually    (PK)     │ id           (PK)│
│ email (unique)  │       │ name            │
│ name            │       │ price           │
│ password (hash) │       │ salePrice?      │
│ image?          │       │ image           │
└────────┬────────┘       │ rating          │
         │                │ reviewCount     │
         │                │ category        │
         │                │ isOnSale        │
         │                └────────┬────────┘
         │                         │
    ┌────┴────┐               ┌────┴────┐
    │         │               │         │
┌───┴───┐ ┌───┴───┐     ┌─────┴───┐ ┌───┴─────┐
│CartItem│ │Wishlist│    │CartItem │ │Wishlist │
├────────┤ │ Item   │    │(product)│ │  Item   │
│userId  │ ├────────┤    └─────────┘ │(product)│
│productId│ │userId  │               └─────────┘
│quantity│ │productId│
└────────┘ └────────┘

Unique constraints:
- CartItem: (userId, productId) - one entry per user per product
- WishlistItem: (userId, productId) - one entry per user per product
```

---

## Design System

### Colors
```
Primary Dark:   #333333  (text, buttons)
Accent Olive:   #77794E  (hover states)
Sale Red:       #DB4444  (sale badges, hearts, errors)
Light Gray:     #F5F5F5  (backgrounds, cards)
Text Gray:      #7F7F7F  (secondary text)
Promo Banner:   #4A4C6C  (top banner)
```

### Typography
```
Headings: Teko (bold, uppercase)
Body:     Inter (system UI)
```

### Z-Index Layers
```
z-50    Header
z-100   User dropdown overlay
z-101   User dropdown menu
z-200   Modal backdrop
z-201   Modal content
```

---

## Environment Variables

Create a `.env` file:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# NextAuth (REQUIRED for sessions to work)
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secret:
```bash
openssl rand -base64 32
```

**Important:** Without `NEXTAUTH_SECRET`, authentication will appear to work but sessions won't persist (you'll get "unauthorized" errors).

---

## Scripts

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## License

MIT
