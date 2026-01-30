# 🔌 AGENT 6: API

## Project Context
You are building: **S'26 Dev Challenge - E-Commerce Store**
Tech Stack: Next.js 14 + TypeScript + Prisma

## Your Role
You are the API specialist. You own all REST endpoints.

## Your Domain (ONLY modify these files)
```
/src/app/api/products/route.ts
/src/app/api/cart/route.ts
/src/app/api/cart/[id]/route.ts
/src/app/api/cart/count/route.ts
/src/app/api/wishlist/route.ts
/src/app/api/wishlist/[id]/route.ts
/src/app/api/wishlist/ids/route.ts
```

## Dependencies
- Requires: Prisma schema from Agent 1 (database)
- Requires: Auth setup from Agent 5 (for protected routes)

---

## IMPORTANT: Project Already Initialized

The Orchestrator has already created the Next.js project. You are working inside an existing project directory.

---

## TASK 1: Create Products API

Create `/src/app/api/products/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const where = category ? { category } : {};

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

## TASK 2: Create Cart API

Create `/src/app/api/cart/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

// GET - Fetch user's cart with items
export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const items = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate totals
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price;
      return sum + price * item.quantity;
    }, 0);

    return NextResponse.json({
      items,
      totalItems,
      totalPrice,
    });
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Upsert cart item (increment quantity if exists)
    const item = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId: session.user.id,
        productId,
        quantity,
      },
      include: { product: true },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}
```

Create `/src/app/api/cart/count/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

// GET - Fetch cart item count (for header badge)
export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 });
    }

    const items = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      select: { quantity: true },
    });

    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Cart count error:', error);
    return NextResponse.json({ count: 0 });
  }
}
```

Create `/src/app/api/cart/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

// DELETE - Remove item from cart
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Verify ownership
    const item = await prisma.cartItem.findUnique({
      where: { id },
    });

    if (!item || item.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}

// PATCH - Update quantity
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const { quantity } = await req.json();

    if (typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json(
        { error: 'Valid quantity required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingItem = await prisma.cartItem.findUnique({
      where: { id },
    });

    if (!existingItem || existingItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    const item = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('Cart PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}
```

## TASK 3: Create Wishlist API

Create `/src/app/api/wishlist/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

// GET - Fetch user's wishlist with products
export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const items = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Wishlist GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST - Toggle wishlist item (add if not exists, remove if exists)
export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existing) {
      // Remove from wishlist
      await prisma.wishlistItem.delete({
        where: { id: existing.id },
      });

      return NextResponse.json({
        success: true,
        action: 'removed',
        isWishlisted: false,
      });
    } else {
      // Add to wishlist
      const item = await prisma.wishlistItem.create({
        data: {
          userId: session.user.id,
          productId,
        },
        include: { product: true },
      });

      return NextResponse.json({
        success: true,
        action: 'added',
        isWishlisted: true,
        item,
      });
    }
  } catch (error) {
    console.error('Wishlist POST error:', error);
    return NextResponse.json(
      { error: 'Failed to update wishlist' },
      { status: 500 }
    );
  }
}
```

Create `/src/app/api/wishlist/ids/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

// GET - Fetch just the product IDs in wishlist (for quick lookup)
export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ productIds: [] });
    }

    const items = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      select: { productId: true },
    });

    const productIds = items.map((item) => item.productId);

    return NextResponse.json({ productIds });
  } catch (error) {
    console.error('Wishlist IDs error:', error);
    return NextResponse.json({ productIds: [] });
  }
}
```

Create `/src/app/api/wishlist/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

// DELETE - Remove item from wishlist by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Verify ownership
    const item = await prisma.wishlistItem.findUnique({
      where: { id },
    });

    if (!item || item.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    await prisma.wishlistItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Wishlist DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}
```

---

## Validation Checklist

```bash
# TypeScript compiles
npx tsc --noEmit

# Test endpoints with curl:

# Products
curl http://localhost:3000/api/products
curl "http://localhost:3000/api/products?category=new-arrivals"
curl "http://localhost:3000/api/products?category=trending"

# Cart count (works without auth, returns 0)
curl http://localhost:3000/api/cart/count

# Wishlist IDs (works without auth, returns empty array)
curl http://localhost:3000/api/wishlist/ids
```

---

## API Endpoints Summary

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/products` | GET | No | List products, optional `?category=` filter |
| `/api/cart` | GET | Yes | Get cart items with totals |
| `/api/cart` | POST | Yes | Add item to cart `{ productId, quantity? }` |
| `/api/cart/count` | GET | No* | Get cart item count for header badge |
| `/api/cart/[id]` | DELETE | Yes | Remove item from cart |
| `/api/cart/[id]` | PATCH | Yes | Update quantity `{ quantity }` |
| `/api/wishlist` | GET | Yes | Get wishlist items |
| `/api/wishlist` | POST | Yes | Toggle wishlist `{ productId }` |
| `/api/wishlist/ids` | GET | No* | Get wishlisted product IDs |
| `/api/wishlist/[id]` | DELETE | Yes | Remove from wishlist |

*Returns empty/zero for unauthenticated users

---

## Files Created

When complete, you should have created:
- `/src/app/api/products/route.ts`
- `/src/app/api/cart/route.ts`
- `/src/app/api/cart/count/route.ts`
- `/src/app/api/cart/[id]/route.ts`
- `/src/app/api/wishlist/route.ts`
- `/src/app/api/wishlist/ids/route.ts`
- `/src/app/api/wishlist/[id]/route.ts`
