# Joanie Store

A modern e-commerce storefront built with Next.js 16, featuring product browsing, user authentication, cart, and wishlist functionality.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma with PostgreSQL adapter
- **Auth:** NextAuth.js (credentials provider)
- **Animations:** Framer Motion + GSAP

## Features

- Product grid with category filtering (New Arrivals / Trending)
- User authentication (sign up, sign in, sign out)
- Shopping cart (add, remove, update quantity)
- Wishlist with optimistic updates
- Responsive design
- Page load animations
- Interactive hero section with parallax effect

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase recommended)

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secret:
```bash
openssl rand -base64 32
```

### Database Setup

```bash
# Push schema to database
npx prisma db push

# Seed with sample products
npx prisma db seed
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── (store)/          # Store layout group
│   │   ├── layout.tsx    # Store layout (header, footer)
│   │   └── page.tsx      # Homepage
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth + signup
│   │   ├── cart/         # Cart CRUD
│   │   ├── products/     # Product listing
│   │   └── wishlist/     # Wishlist toggle
│   └── layout.tsx        # Root layout
├── components/
│   ├── animations/       # GSAP page animations
│   ├── auth/             # Auth modals, user menu
│   ├── home/             # Hero, tabs, product grid
│   ├── layout/           # Header, footer, promo banner
│   └── ui/               # Badge, heart icon, star rating
├── hooks/                # useProducts, useCart, useWishlist
├── lib/                  # Prisma client, auth config
└── types/                # TypeScript interfaces
```

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/products?category=` | List products by category |
| POST | `/api/auth/signup` | Create new user |
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart` | Add to cart |
| PATCH | `/api/cart/[id]` | Update quantity |
| DELETE | `/api/cart/[id]` | Remove from cart |
| GET | `/api/wishlist/ids` | Get wishlisted product IDs |
| POST | `/api/wishlist` | Toggle wishlist item |

## Database Schema

```
User
├── id, email, name, password
├── CartItem[]
└── WishlistItem[]

Product
├── id, name, price, salePrice, image
├── rating, reviewCount, category, isOnSale
├── CartItem[]
└── WishlistItem[]

CartItem (userId + productId unique)
└── quantity

WishlistItem (userId + productId unique)
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

```bash
# Build and deploy to Vercel
npx vercel --prod
```

Set environment variables in Vercel dashboard.

## Archive

Development orchestrator prompts are archived in `docs/archive/` for reference.

## License

MIT
