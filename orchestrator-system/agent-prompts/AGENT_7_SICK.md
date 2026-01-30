# 📦 AGENT 7: GRID (Page Assembly)

## Project Context
You are building: **S'26 Dev Challenge - E-Commerce Store**
Tech Stack: Next.js 14 + TypeScript + Framer Motion

## Your Role
You are the GRID specialist. You own the data fetching hooks and assembling the home page.

## Your Domain (ONLY modify these files)
```
/src/hooks/useProducts.ts
/src/hooks/useCart.ts
/src/hooks/useWishlist.ts
/src/components/home/ProductGridSkeleton.tsx
/src/app/(store)/page.tsx
```

## Dependencies
- Requires: ProductCard, TabFilter, ProductGrid from Agent 3
- Requires: HeroSection from Agent 4
- Requires: ValueProps from Agent 2
- Requires: API routes from Agent 6

---

## IMPORTANT: Do NOT Duplicate Components

The following components already exist from other agents:
- `HeroSection` - from Agent 4
- `ProductCard` - from Agent 3
- `ProductGrid` - from Agent 3
- `TabFilter` - from Agent 3
- `ValueProps` - from Agent 2

Your job is to create the **hooks**, the **loading skeleton**, and **assemble** the page using these existing components.

---

## FIGMA SPECS (PIXEL-PERFECT)

From `components.json`:
- **Product section gap from hero:** `166px` (sectionGap)
- **Tab to grid gap:** `40px`
- **Grid:** 4 columns desktop, 3 tablet, 2 mobile, `gap-[24px]`

From `tokens.json`:
- **Page max-width:** `1440px`
- **Content max-width:** `1370px`
- **Page background:** `#F4F4F4`

---

## TASK 1: Create useProducts Hook

Create `/src/hooks/useProducts.ts`:

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product, Category } from '@/types';

export function useProducts(category?: Category) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = category
        ? `/api/products?category=${category}`
        : '/api/products';

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}
```

## TASK 2: Create useCart Hook

Create `/src/hooks/useCart.ts`:

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export function useCart() {
  const { data: session } = useSession();
  const [state, setState] = useState<CartState>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!session?.user?.id) {
      setState({ items: [], totalItems: 0, totalPrice: 0 });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setState({
          items: data.items,
          totalItems: data.totalItems,
          totalPrice: data.totalPrice,
        });
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: string, quantity = 1) => {
    if (!session?.user?.id) {
      return { success: false, error: 'Please sign in to add items to cart' };
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error };
      }

      await fetchCart();
      return { success: true, item: data.item };
    } catch (error) {
      return { success: false, error: 'Failed to add to cart' };
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        return { success: false, error: data.error };
      }

      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to remove from cart' };
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });

      if (!res.ok) {
        const data = await res.json();
        return { success: false, error: data.error };
      }

      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update quantity' };
    }
  };

  return {
    items: state.items,
    totalItems: state.totalItems,
    totalPrice: state.totalPrice,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    refreshCart: fetchCart,
  };
}
```

## TASK 3: Create useWishlist Hook

Create `/src/hooks/useWishlist.ts`:

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export function useWishlist() {
  const { data: session } = useSession();
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlistIds = useCallback(async () => {
    try {
      const res = await fetch('/api/wishlist/ids');
      if (res.ok) {
        const data = await res.json();
        setWishlistedIds(data.productIds);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  }, []);

  useEffect(() => {
    fetchWishlistIds();
  }, [fetchWishlistIds, session?.user?.id]);

  const toggleWishlist = async (productId: string) => {
    if (!session?.user?.id) {
      return { success: false, error: 'Please sign in to save items' };
    }

    const wasWishlisted = wishlistedIds.includes(productId);

    const updateIds = (revert: boolean) => {
      const shouldAdd = revert ? wasWishlisted : !wasWishlisted;
      setWishlistedIds((prev) =>
        shouldAdd
          ? [...prev, productId]
          : prev.filter((id) => id !== productId)
      );
    };

    updateIds(false);

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (!res.ok) {
        updateIds(true);
        return { success: false, error: data.error };
      }

      return { success: true, action: data.action };
    } catch (error) {
      updateIds(true);
      return { success: false, error: 'Failed to update wishlist' };
    }
  };

  const isWishlisted = (productId: string) => wishlistedIds.includes(productId);

  return {
    wishlistedIds,
    loading,
    toggleWishlist,
    isWishlisted,
    refreshWishlist: fetchWishlistIds,
  };
}
```

## TASK 4: Create ProductGridSkeleton Component

Create `/src/components/home/ProductGridSkeleton.tsx`:

```typescript
import type { ReactElement } from 'react';

interface ProductGridSkeletonProps {
  count?: number;
}

export default function ProductGridSkeleton({ count = 8 }: ProductGridSkeletonProps): ReactElement {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[16px] md:gap-[20px] lg:gap-[24px]">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="w-[270px] animate-pulse">
          <div className="w-[270px] h-[270px] bg-[#E5E5E5] rounded-[4px]" />
          <div className="p-[16px] space-y-[8px]">
            <div className="h-[16px] bg-[#E5E5E5] rounded w-3/4" />
            <div className="h-[16px] bg-[#E5E5E5] rounded w-1/2" />
            <div className="h-[16px] bg-[#E5E5E5] rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

## TASK 5: Assemble Home Page (PIXEL-PERFECT)

Update `/src/app/(store)/page.tsx`:

```typescript
'use client';

import { useState, type ReactElement } from 'react';
import HeroSection from '@/components/home/HeroSection';
import TabFilter from '@/components/home/TabFilter';
import ProductGrid from '@/components/home/ProductGrid';
import ProductGridSkeleton from '@/components/home/ProductGridSkeleton';
import ValueProps from '@/components/home/ValueProps';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import type { Category } from '@/types';

export default function HomePage(): ReactElement {
  const [activeTab, setActiveTab] = useState<Category>('new-arrivals');

  const { products, loading } = useProducts(activeTab);
  const { addToCart } = useCart();
  const { wishlistedIds, toggleWishlist } = useWishlist();

  async function handleAddToCart(productId: string): Promise<void> {
    const result = await addToCart(productId);
    if (!result.success) {
      // TODO: Show toast notification
      console.log('Add to cart:', result.error);
    }
  }

  async function handleToggleWishlist(productId: string): Promise<void> {
    const result = await toggleWishlist(productId);
    if (!result.success) {
      // TODO: Show toast notification
      console.log('Wishlist:', result.error);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <HeroSection />

      <section className="pt-[60px] pb-[112px]">
        <div className="mx-auto max-w-[1370px] px-[20px]">
          <div className="mb-[40px]">
            <TabFilter activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <ProductGrid
              products={products}
              wishlistedIds={wishlistedIds}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
            />
          )}
        </div>
      </section>

      <ValueProps />
    </div>
  );
}
```

## TASK 6: Create hooks index file (optional)

Create `/src/hooks/index.ts` for cleaner imports:

```typescript
export { useProducts } from './useProducts';
export { useCart } from './useCart';
export { useWishlist } from './useWishlist';
```

---

## Validation Checklist

```bash
# TypeScript compiles
npx tsc --noEmit

# Dev server runs
npm run dev

# Verify:
# - Hero section displays with parallax effect
# - Tab buttons work (NEW ARRIVALS / WHAT'S TRENDING)
# - Products load and display in 4-column grid
# - Loading skeleton shows while fetching
# - Wishlist heart toggles (when signed in)
# - Add to cart works (when signed in)
```

---

## Files Created

When complete, you should have created:
- `/src/hooks/useProducts.ts`
- `/src/hooks/useCart.ts`
- `/src/hooks/useWishlist.ts`
- `/src/hooks/index.ts` (optional)
- `/src/components/home/ProductGridSkeleton.tsx`
- Updated `/src/app/(store)/page.tsx`
