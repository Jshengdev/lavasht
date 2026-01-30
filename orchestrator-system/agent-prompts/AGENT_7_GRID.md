# 📦 AGENT 7: GRID

## Project Context
You are building: **S'26 Dev Challenge - E-Commerce Store**
Tech Stack: Next.js 14 + TypeScript + Framer Motion

## Your Role
You are the GRID specialist. You own the product display and data fetching logic.

## Your Domain (ONLY modify these files)
```
/src/components/home/ProductGrid.tsx
/src/components/home/Hero.tsx
/src/hooks/useCart.ts
/src/hooks/useWishlist.ts
/src/hooks/useProducts.ts
/src/app/(store)/page.tsx
```

## Dependencies
- Requires: ProductCard from Agent 3 (components)
- Requires: TabFilter from Agent 3 (components)
- Requires: HeroShoe3D from Agent 4 (experimental)
- Requires: API routes from Agent 6 (api)

---

## 🎨 FIGMA DESIGN REFERENCE (CRITICAL - PIXEL PERFECT)

**Read these files for exact layout specifications:**

```
/design-system/tokens.json           # Spacing, colors
/design-system/components.json       # Grid specs, Hero specs, page layout
```

### Product Grid Specifications
From `components.json -> productGrid`:
```
- columns.desktop: Number of columns on large screens
- columns.tablet: Number of columns on medium screens
- columns.mobile: Number of columns on small screens
- gap: Horizontal gap between cards
- rowGap: Vertical gap between rows (may differ from column gap)
- maxWidth: Max container width
```

**Implementation:**
```typescript
// Read from Figma specs
const gridSpecs = require('/design-system/components.json').productGrid;

// Apply exact values
className={`
  grid
  grid-cols-${gridSpecs.columns.mobile}
  md:grid-cols-${gridSpecs.columns.tablet}
  lg:grid-cols-${gridSpecs.columns.desktop}
  gap-[${gridSpecs.gap}]
`}
```

### Hero Section Specifications
From `components.json -> hero`:
```
- height, width, backgroundColor
- backgroundText (the large "SHOP" text)
- decorativeFrame (green border)
- labels (ADJUSTABLE, SOFT PAD)
- brandBadge (purple "sania" badge)
```

**Match the Figma layout exactly:**
- Position of labels
- Size and opacity of background text
- Frame border styling
- Badge position and styling

### Page Layout Specifications
From `components.json -> page`:
```
- maxWidth: Overall page max-width
- backgroundColor: Page background
```

From `tokens.json -> spacing`:
```
- section-gap: Space between major sections
- page-padding-x: Horizontal page padding
- page-padding-y: Vertical section padding
```

---

## TASK 1: Create useProducts Hook

Create `/src/hooks/useProducts.ts`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import type { Product, TabCategory } from '@/types';

export function useProducts(category?: TabCategory) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
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
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return { products, loading, error };
}
```

## TASK 2: Create useCart Hook

Create `/src/hooks/useCart.ts`:

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import type { CartItem } from '@/types';

export function useCart() {
  const { data: session } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!session) return;

    setLoading(true);
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: string) => {
    if (!session) {
      // Could trigger sign-in modal here
      return { success: false, error: 'Please sign in' };
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        const data = await res.json();
        await fetchCart(); // Refresh cart
        return { success: true, item: data.item };
      } else {
        const error = await res.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      return { success: false, error: 'Failed to add to cart' };
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== itemId));
        return { success: true };
      }
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

      if (res.ok) {
        const data = await res.json();
        setItems((prev) =>
          prev.map((item) => (item.id === itemId ? data.item : item))
        );
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: 'Failed to update quantity' };
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) =>
      sum +
      (item.product.isOnSale && item.product.salePrice
        ? item.product.salePrice
        : item.product.price) *
        item.quantity,
    0
  );

  return {
    items,
    loading,
    itemCount,
    total,
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
import type { WishlistItem } from '@/types';

export function useWishlist() {
  const { data: session } = useSession();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!session) return;

    setLoading(true);
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (productId: string) => {
    if (!session) {
      return { success: false, error: 'Please sign in' };
    }

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        const data = await res.json();

        if (data.action === 'added') {
          setItems((prev) => [...prev, data.item]);
        } else {
          setItems((prev) =>
            prev.filter((item) => item.productId !== productId)
          );
        }

        return { success: true, action: data.action };
      }
    } catch (error) {
      return { success: false, error: 'Failed to update wishlist' };
    }
  };

  const isWishlisted = (productId: string) =>
    items.some((item) => item.productId === productId);

  return {
    items,
    loading,
    toggleWishlist,
    isWishlisted,
    refreshWishlist: fetchWishlist,
  };
}
```

## TASK 4: Create ProductGrid

Create `/src/components/home/ProductGrid.tsx`:

```typescript
'use client';

import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  wishlistedIds: string[];
  onAddToCart: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
}

// Skeleton loader
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  );
}

export default function ProductGrid({
  products,
  loading,
  wishlistedIds,
  onAddToCart,
  onToggleWishlist,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <ProductCard
            product={product}
            isWishlisted={wishlistedIds.includes(product.id)}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
```

## TASK 5: Create Hero Component

Create `/src/components/home/Hero.tsx`:

```typescript
'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamic import for Three.js component (client-side only)
const HeroShoe3D = dynamic(() => import('./HeroShoe3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg" />
  ),
});

export default function Hero() {
  return (
    <section className="relative w-full bg-page-bg overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="relative flex items-center justify-center min-h-[500px]">
          {/* Background Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 0.1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <h1 className="text-[15vw] font-black text-btn-dark tracking-tighter">
              SHOP
            </h1>
          </motion.div>

          {/* 3D Shoe */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative w-full max-w-2xl aspect-[4/3] z-10"
          >
            {/* Decorative Frame */}
            <div className="absolute inset-4 border-2 border-green-600 rounded-lg pointer-events-none" />

            {/* 3D Shoe Component */}
            <div className="w-full h-full">
              <HeroShoe3D />
            </div>

            {/* Labels */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="absolute top-8 left-8 text-sm font-medium text-gray-700"
            >
              ADJUSTABLE
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 1 }}
              className="absolute bottom-8 right-8 text-sm font-medium text-gray-700"
            >
              SOFT PAD
            </motion.div>
          </motion.div>

          {/* Brand Tag */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="absolute top-4 left-4 bg-purple-600 text-white px-4 py-2 rounded font-bold text-sm"
          >
            sania
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

## TASK 6: Create Home Page

Create `/src/app/(store)/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import Hero from '@/components/home/Hero';
import TabFilter from '@/components/home/TabFilter';
import ProductGrid from '@/components/home/ProductGrid';
import ValueProps from '@/components/home/ValueProps';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import type { TabCategory } from '@/types';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabCategory>('new-arrivals');
  const { products, loading } = useProducts(activeTab);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted, items: wishlistItems } = useWishlist();

  const handleAddToCart = async (productId: string) => {
    const result = await addToCart(productId);
    if (!result.success) {
      // Could show toast notification here
      console.log(result.error);
    }
  };

  const handleToggleWishlist = async (productId: string) => {
    const result = await toggleWishlist(productId);
    if (!result.success) {
      console.log(result.error);
    }
  };

  const wishlistedIds = wishlistItems.map((item) => item.productId);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Products Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          {/* Tabs */}
          <div className="mb-12">
            <TabFilter activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={products}
            loading={loading}
            wishlistedIds={wishlistedIds}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
          />
        </div>
      </section>

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

# Verify:
# - Products load
# - Tab filtering works
# - Add to cart works (when signed in)
# - Wishlist toggle works (when signed in)
# - Skeleton loaders show during loading
```

---

## Output

When complete:
```bash
git checkout -b feature/grid
git add .
git commit -m "grid: Create ProductGrid, Hero, hooks, and assemble home page"
touch .done-grid
git add .done-grid
git commit -m "grid: Signal completion"
git push origin feature/grid
```
