# Joanie Store - E-Commerce Platform

## Project Overview
A modern, production-ready e-commerce storefront for shoes/footwear built with cutting-edge web technologies. Features a pixel-perfect UI with sophisticated GSAP and Framer Motion animations.

## Tech Stack
- **Framework**: Next.js 16.1.6 (App Router)
- **UI**: React 19.2.3, TypeScript 5
- **Styling**: Tailwind CSS 4
- **Animations**: GSAP 3.14.2, Framer Motion 12.29.2
- **Database**: PostgreSQL via Supabase, Prisma 7.3.0 ORM
- **Auth**: NextAuth.js 4.24.13 (JWT strategy)
- **Icons**: Lucide React

## Project Structure
```
src/
├── app/
│   ├── (store)/          # Main store pages (home, product, cart, wishlist)
│   ├── (auth)/           # Authentication pages (sign-in, sign-up)
│   ├── api/              # REST API endpoints
│   └── layout.tsx        # Root layout with providers
├── components/
│   ├── animations/       # GSAP page transitions & animations
│   ├── auth/             # Auth forms & modals
│   ├── cart/             # Shopping cart components
│   ├── home/             # Homepage sections
│   ├── layout/           # Header, Footer, PromoBanner
│   ├── product/          # Product detail components
│   ├── ui/               # Reusable UI elements
│   └── wishlist/         # Wishlist components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities (prisma, auth, animations)
└── types/                # TypeScript interfaces
```

## Key Commands
- `npm run dev` - Start development server
- `npm run build` - Production build
- `npx prisma db push` - Sync schema to database
- `npx prisma db seed` - Seed sample data

## Design System

### Colors
- Primary Dark: #333333
- Accent (Olive): #77794E
- Sale Red: #DB4444
- Promo Banner: #4A4C6C
- Background: #F4F4F4

### Fonts
- Display: Teko (bold uppercase headings)
- Body: Inter (system UI)

### Animation Patterns
- Page transitions: GSAP curtain reveal
- Scroll reveals: GSAP ScrollTrigger
- Micro-interactions: Framer Motion
- Data attributes: `data-animate="..."` for GSAP targeting

## API Endpoints
- `GET /api/products?category=` - List products
- `GET /api/products/[id]` - Single product
- `POST /api/auth/signup` - Register
- `GET/POST /api/cart` - Cart operations
- `GET/POST /api/wishlist` - Wishlist operations

## Database Models
User, Product, CartItem, WishlistItem (see prisma/schema.prisma)

## Environment Variables
- `DATABASE_URL` - Supabase pooled connection
- `DIRECT_URL` - Supabase direct connection
- `NEXTAUTH_SECRET` - Auth encryption key
- `NEXTAUTH_URL` - Base URL for auth callbacks
