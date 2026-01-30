# 🧩 AGENT 3: COMPONENTS

## Project Context
You are building: **S'26 Dev Challenge - E-Commerce Store**
Tech Stack: Next.js 14 + TypeScript + Tailwind + Framer Motion

## Your Role
You are the COMPONENTS specialist. You own reusable UI components.

## Your Domain (ONLY modify these files)
```
/src/components/home/ProductCard.tsx
/src/components/home/TabFilter.tsx
/src/components/ui/Button.tsx
/src/components/ui/Badge.tsx
/src/components/ui/StarRating.tsx
/src/components/ui/HeartIcon.tsx
```

---

## 🎨 FIGMA DESIGN REFERENCE (CRITICAL - PIXEL PERFECT)

**You MUST read these files before implementing ANY component:**

```
/design-system/tokens.json           # Colors, typography, spacing
/design-system/components.json       # Exact dimensions for each component
```

### Component Specifications from Figma

**ProductCard - Read from components.json -> productCard:**
```
- Exact width and height
- Image container aspect ratio and background
- Sale badge: position, colors, border-radius, font-size
- Heart icon: size, position, background, colors for filled/unfilled
- Add to Cart button: height, background, text color, font specs
- Product name: font-size, weight, color, line-clamp
- Price: font-size, weight, regular color vs sale color
- Star rating: star size, filled color, empty color, review count style
```

**TabFilter - Read from components.json -> tabFilter:**
```
- Gap between tabs
- Active tab: exact background color, text color, padding, border-radius
- Inactive tab: border color, border width, text color, padding
- Tab labels: exact text from Figma (not hardcoded)
- Font size and weight
```

**UI Primitives:**
- Button: Read padding, border-radius, colors for each variant from tokens
- Badge: Read sale badge specs from productCard.saleBadge
- StarRating: Read star specs from productCard.rating
- HeartIcon: Read from productCard.heartIcon

### PIXEL-PERFECT IMPLEMENTATION RULES

1. **Product Card Dimensions**
   ```typescript
   // DON'T guess
   className="w-[270px] h-[350px]"  // Only if Figma says exactly this

   // DO read from spec
   const { width, height } = require('/design-system/components.json').productCard;
   className={`w-[${width}] h-[${height}]`}
   ```

2. **Colors Must Match Exactly**
   ```typescript
   // DON'T approximate
   className="bg-red-500"  // Wrong - Figma might use #DB4444

   // DO use exact hex
   className="bg-[#DB4444]"  // Or use the semantic token
   className="bg-sale-red"   // If defined in tailwind config
   ```

3. **Spacing Must Be Exact**
   ```typescript
   // DON'T use rough Tailwind classes
   className="p-4"  // This is 16px, but Figma might need 14px

   // DO use arbitrary values when needed
   className="p-[14px]"  // Exact match to Figma
   ```

4. **Typography Must Match**
   ```typescript
   // Read font specs from Figma
   className="text-[14px] font-medium leading-[1.4]"
   ```

5. **Border Radius Must Match**
   ```typescript
   // If Figma shows 5px radius on buttons
   className="rounded-[5px]"
   ```

### Hover States
If Figma shows hover states:
- Read the hover colors/effects from the Figma extraction
- Implement exactly as designed
- If no hover state in Figma, use subtle defaults (scale 1.02, shadow increase)

---

## TASK 0: Install Framer Motion

```bash
npm install framer-motion
```

## TASK 1: Create HeartIcon

Create `/src/components/ui/HeartIcon.tsx`:

```typescript
'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface HeartIconProps {
  filled: boolean;
  onClick?: () => void;
  className?: string;
}

export default function HeartIcon({ filled, onClick, className = '' }: HeartIconProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className={`p-2 rounded-full transition-colors ${className}`}
    >
      <motion.div
        initial={false}
        animate={filled ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`h-5 w-5 transition-colors ${
            filled
              ? 'fill-wishlist-red text-wishlist-red'
              : 'fill-transparent text-gray-400 hover:text-gray-600'
          }`}
        />
      </motion.div>
    </motion.button>
  );
}
```

## TASK 2: Create StarRating

Create `/src/components/ui/StarRating.tsx`:

```typescript
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount: number;
}

export default function StarRating({ rating, reviewCount }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < fullStars
                ? 'fill-star-yellow text-star-yellow'
                : i === fullStars && hasHalfStar
                ? 'fill-star-yellow/50 text-star-yellow'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-500">({reviewCount})</span>
    </div>
  );
}
```

## TASK 3: Create Badge

Create `/src/components/ui/Badge.tsx`:

```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'sale' | 'new';
}

export default function Badge({ children, variant = 'sale' }: BadgeProps) {
  const variantClasses = {
    sale: 'bg-sale-red text-white',
    new: 'bg-green-500 text-white',
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
```

## TASK 4: Create Button

Create `/src/components/ui/Button.tsx`:

```typescript
'use client';

import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'dark' | 'accent' | 'outline';
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'dark',
  onClick,
  className = '',
  fullWidth = false,
}: ButtonProps) {
  const variantClasses = {
    dark: 'bg-btn-dark text-white hover:bg-gray-800',
    accent: 'bg-btn-accent text-white hover:bg-amber-600',
    outline: 'bg-transparent border border-btn-accent text-btn-accent hover:bg-btn-accent/10',
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        px-6 py-3 rounded-[5px] font-medium text-sm transition-colors
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
```

## TASK 5: Create TabFilter

Create `/src/components/home/TabFilter.tsx`:

```typescript
'use client';

import { motion } from 'framer-motion';

type TabCategory = 'new-arrivals' | 'trending';

interface TabFilterProps {
  activeTab: TabCategory;
  onTabChange: (tab: TabCategory) => void;
}

const tabs: { id: TabCategory; label: string }[] = [
  { id: 'new-arrivals', label: 'NEW ARRIVALS' },
  { id: 'trending', label: "WHAT'S TRENDING" },
];

export default function TabFilter({ activeTab, onTabChange }: TabFilterProps) {
  return (
    <div className="flex gap-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            relative px-6 py-3 rounded-[5px] font-medium text-sm transition-colors
            ${
              activeTab === tab.id
                ? 'bg-btn-dark text-white'
                : 'bg-transparent border border-btn-accent text-btn-accent hover:bg-btn-accent/10'
            }
          `}
        >
          {tab.label}
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-btn-dark rounded-[5px] -z-10"
              transition={{ type: 'spring', duration: 0.5 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
```

## TASK 6: Create ProductCard

Create `/src/components/home/ProductCard.tsx`:

```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import HeartIcon from '@/components/ui/HeartIcon';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onAddToCart: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
}

export default function ProductCard({
  product,
  isWishlisted,
  onAddToCart,
  onToggleWishlist,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const displayPrice = product.isOnSale && product.salePrice
    ? product.salePrice
    : product.price;

  return (
    <motion.div
      className="group relative flex flex-col bg-white rounded-lg overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4"
        />

        {/* Sale Badge */}
        {product.isOnSale && (
          <div className="absolute top-3 left-3">
            <Badge variant="sale">Sale</Badge>
          </div>
        )}

        {/* Wishlist Heart */}
        <div className="absolute top-3 right-3">
          <HeartIcon
            filled={isWishlisted}
            onClick={() => onToggleWishlist(product.id)}
            className="bg-white/80 hover:bg-white"
          />
        </div>

        {/* Add to Cart - Slides up on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-0 right-0"
            >
              <button
                onClick={() => onAddToCart(product.id)}
                className="w-full py-3 bg-btn-dark text-white text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Add To Cart
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-medium text-sm text-gray-900 line-clamp-1">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className={`font-bold ${product.isOnSale ? 'text-sale-red' : 'text-gray-900'}`}>
            ${displayPrice}
          </span>
          {product.isOnSale && product.salePrice && (
            <span className="text-gray-400 line-through text-sm">
              ${product.price}
            </span>
          )}
        </div>

        {/* Rating */}
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
      </div>
    </motion.div>
  );
}
```

---

## Validation Checklist

```bash
# TypeScript compiles
npx tsc --noEmit

# Create a test page to verify components render
# Add to /src/app/(store)/page.tsx temporarily to test
```

---

## Output

When complete:
```bash
git checkout -b feature/components
git add .
git commit -m "components: Create ProductCard, TabFilter, and UI primitives with Framer Motion animations"
touch .done-components
git add .done-components
git commit -m "components: Signal completion"
git push origin feature/components
```
