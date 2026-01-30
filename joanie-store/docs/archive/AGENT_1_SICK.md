# 🗄️ AGENT 1: DATABASE

## Project Context
You are building: **S'26 Dev Challenge - E-Commerce Store**
Tech Stack: Next.js 14 + TypeScript + Tailwind + Prisma + Supabase + NextAuth

## Your Role
You are the DATABASE specialist. You own all database infrastructure.

## Your Domain (ONLY modify these files)
```
/prisma/schema.prisma
/prisma/seed.ts
/src/lib/prisma.ts
/src/types/index.ts
```

---

## 🎨 FIGMA DESIGN REFERENCE (CRITICAL)

**Before starting, read the extracted Figma data:**

```
/design-system/tokens.json       # Design tokens
/design-system/components.json   # Component specifications
/design-system/products.json     # Product data from Figma (if exists)
```

### Product Data Source
Your seed data MUST match the products shown in Figma:
1. Read `/design-system/components.json` for product card content
2. Use the exact product names, prices, and ratings from the Figma design
3. Match the number of products in each category (new-arrivals vs trending)
4. If Figma shows specific sale items, mark those exact products as `isOnSale: true`

### Image References
Product images should reference the files exported by Agent 0:
- `/public/images/shoe-1.png`, `/public/images/shoe-2.png`, etc.
- Match image filenames to the order products appear in Figma

---

## IMPORTANT: Project Already Initialized

The Orchestrator has already created the Next.js project. You are working inside an existing project directory. Do NOT run `create-next-app`.

## TASK 1: Install Dependencies

```bash
npm install prisma @prisma/client
npm install -D ts-node
npx prisma init
```

## TASK 2: Create Prisma Schema

Create `/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String         @id @default(cuid())
  email         String         @unique
  name          String?
  image         String?
  password      String?
  accounts      Account[]
  cartItems     CartItem[]
  wishlistItems WishlistItem[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Product {
  id            String         @id @default(cuid())
  name          String
  price         Float
  salePrice     Float?
  image         String
  rating        Float          @default(0)
  reviewCount   Int            @default(0)
  category      String
  isOnSale      Boolean        @default(false)
  cartItems     CartItem[]
  wishlistItems WishlistItem[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  @@index([category])
  @@index([isOnSale])
}

model CartItem {
  id        String   @id @default(cuid())
  quantity  Int      @default(1)
  userId    String
  productId String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, productId])
  @@index([userId])
  @@index([productId])
}

model WishlistItem {
  id        String   @id @default(cuid())
  userId    String
  productId String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, productId])
  @@index([userId])
  @@index([productId])
}
```

## TASK 3: Create Prisma Client Singleton

Create `/src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
```

## TASK 4: Create TypeScript Types

Create `/src/types/index.ts`:

```typescript
export type Category = 'new-arrivals' | 'trending'

export interface Product {
  id: string
  name: string
  price: number
  salePrice?: number | null
  image: string
  rating: number
  reviewCount: number
  category: Category
  isOnSale: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface WishlistItem {
  id: string
  productId: string
  product: Product
  userId: string
  createdAt: Date
}

export interface User {
  id: string
  email: string
  name?: string | null
  image?: string | null
}
```

## TASK 5: Create Seed Script

Create `/prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const REGULAR_PRODUCT = {
  name: 'HAVIT HV-G92 Gamepad',
  price: 160,
  rating: 5.0,
  reviewCount: 88,
  isOnSale: false,
} as const

const SALE_PRODUCT = {
  name: 'HAVIT HV-G92 Gamepad',
  price: 1160,
  salePrice: 960,
  rating: 4.0,
  reviewCount: 75,
  isOnSale: true,
} as const

async function main(): Promise<void> {
  await prisma.$transaction([
    prisma.wishlistItem.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.product.deleteMany(),
    prisma.user.deleteMany(),
  ])

  const products = [
    { ...REGULAR_PRODUCT, image: '/images/shoe-1.png', category: 'new-arrivals' },
    { ...REGULAR_PRODUCT, image: '/images/shoe-2.png', category: 'new-arrivals' },
    { ...REGULAR_PRODUCT, image: '/images/shoe-3.png', category: 'new-arrivals' },
    { ...SALE_PRODUCT, image: '/images/shoe-4.png', category: 'new-arrivals' },
    { ...REGULAR_PRODUCT, image: '/images/shoe-5.png', category: 'trending' },
    { ...SALE_PRODUCT, image: '/images/shoe-6.png', category: 'trending' },
    { ...REGULAR_PRODUCT, image: '/images/shoe-7.png', category: 'trending' },
    { ...SALE_PRODUCT, image: '/images/shoe-8.png', category: 'trending' },
  ]

  const result = await prisma.product.createMany({ data: products })
  console.log(`Seeded ${result.count} products`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
```

Update `package.json` to add the prisma seed script configuration. Add this to the root level of package.json:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

## TASK 6: Create .env.example

Create `.env.example` (template for database connection - actual credentials added later by Orchestrator):

```
# Database - Supabase PostgreSQL
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

## TASK 7: Validate Schema (DO NOT run migrations yet)

The Orchestrator will handle database connection and migrations in Phase 3.
For now, just validate that everything compiles:

```bash
# Validate schema syntax
npx prisma validate

# Generate Prisma client (works without database connection)
npx prisma generate
```

---

## Validation Checklist

Run these commands and ensure they pass:

```bash
# Schema syntax is valid
npx prisma validate

# Prisma client generated
npx prisma generate

# TypeScript compiles without errors
npx tsc --noEmit
```

**Note:** Database seeding will be run by the Orchestrator in Phase 3 after Supabase is configured.

---

## Output

When complete:
1. Commit to branch: `feature/database`
2. Create empty file: `touch .done-database`
3. Push: `git push origin feature/database`

```bash
git checkout -b feature/database
git add .
git commit -m "database: Initialize Prisma schema, types, and seed data"
touch .done-database
git add .done-database
git commit -m "database: Signal completion"
git push origin feature/database
```
