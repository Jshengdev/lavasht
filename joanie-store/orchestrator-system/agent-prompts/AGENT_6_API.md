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
/src/app/api/wishlist/route.ts
/src/app/api/wishlist/[id]/route.ts
```

## Dependencies
- Requires: Prisma schema from Agent 1 (database)
- Requires: Auth setup from Agent 5 (for protected routes)

---

## 🎨 FIGMA DESIGN REFERENCE

**API responses should match the data structure shown in Figma:**

```
/design-system/components.json       # Product card data structure
```

### Product Response Shape
The API response must include all fields needed by the ProductCard component:
- Read `components.json -> productCard` to see what data is displayed
- Ensure all required fields are returned: name, price, salePrice, rating, reviewCount, isOnSale, image

### Category Values
Read the tab labels from `components.json -> tabFilter.tabs` to determine:
- Exact category string values (e.g., "new-arrivals", "trending")
- These must match what the frontend sends as query params

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

    const where = category
      ? { category }
      : {};

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

// GET - Fetch user's cart
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

    return NextResponse.json({ items });
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

    // Upsert cart item (increment quantity if exists)
    const item = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
      update: {
        quantity: { increment: 1 },
      },
      create: {
        userId: session.user.id,
        productId,
        quantity: 1,
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

    // Verify ownership
    const item = await prisma.cartItem.findUnique({
      where: { id: params.id },
    });

    if (!item || item.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: params.id },
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

    const { quantity } = await req.json();

    if (typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json(
        { error: 'Valid quantity required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingItem = await prisma.cartItem.findUnique({
      where: { id: params.id },
    });

    if (!existingItem || existingItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    const item = await prisma.cartItem.update({
      where: { id: params.id },
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

// GET - Fetch user's wishlist
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

Create `/src/app/api/wishlist/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

// DELETE - Remove item from wishlist
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

    // Verify ownership
    const item = await prisma.wishlistItem.findUnique({
      where: { id: params.id },
    });

    if (!item || item.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    await prisma.wishlistItem.delete({
      where: { id: params.id },
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

# Test endpoints with curl or Thunder Client:

# Products
curl http://localhost:3000/api/products
curl http://localhost:3000/api/products?category=new-arrivals

# Cart (requires auth cookie)
# - Test GET, POST, DELETE, PATCH

# Wishlist (requires auth cookie)
# - Test GET, POST (toggle), DELETE
```

---

## Output

When complete:
```bash
git checkout -b feature/api
git add .
git commit -m "api: Create Products, Cart, and Wishlist REST endpoints"
touch .done-api
git add .done-api
git commit -m "api: Signal completion"
git push origin feature/api
```
