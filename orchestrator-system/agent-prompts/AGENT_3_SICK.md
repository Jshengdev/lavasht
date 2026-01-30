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
/src/components/home/ProductGrid.tsx
/src/components/ui/Button.tsx
/src/components/ui/Badge.tsx
/src/components/ui/StarRating.tsx
/src/components/ui/HeartIcon.tsx
```

---

## IMPORTANT: Project Already Initialized

The Orchestrator has already created the Next.js project. You are working inside an existing project directory.

---

## TASK 1: Install Framer Motion

```bash
npm install framer-motion
```

## TASK 2: Create HeartIcon (PIXEL-PERFECT)

Create `/src/components/ui/HeartIcon.tsx`:

```typescript
'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

// Figma specs: containerSize 34px, iconSize 24px
// emptyColor #333333, filledColor #DB4444
// position top 12px, right 12px (handled by parent)

interface HeartIconProps {
  filled: boolean;
  onClick?: () => void;
  className?: string;
}

export default function HeartIcon({ filled, onClick, className = '' }: HeartIconProps) {
  return (
    <motion.button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      whileTap={{ scale: 0.9 }}
      className={`w-[34px] h-[34px] flex items-center justify-center rounded-full bg-white ${className}`}
    >
      <motion.div
        initial={false}
        animate={filled ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`w-[24px] h-[24px] transition-colors ${
            filled
              ? 'fill-[#DB4444] text-[#DB4444]'
              : 'fill-transparent text-[#333333]'
          }`}
          strokeWidth={1.5}
        />
      </motion.div>
    </motion.button>
  );
}
```

## TASK 3: Create StarRating (PIXEL-PERFECT)

Create `/src/components/ui/StarRating.tsx`:

```typescript
import { Star } from 'lucide-react';

// Figma specs: starSize 16px, starColorFilled #FFAD33, starColorEmpty #E0E0E0
// countFontSize 14px, countColor #7F7F7F

interface StarRatingProps {
  rating: number;
  reviewCount: number;
}

export default function StarRating({ rating, reviewCount }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-[8px]">
      <div className="flex gap-[2px]">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-[16px] h-[16px] ${
              i < fullStars
                ? 'fill-[#FFAD33] text-[#FFAD33]'
                : i === fullStars && hasHalfStar
                ? 'fill-[#FFAD33]/50 text-[#FFAD33]'
                : 'fill-[#E0E0E0] text-[#E0E0E0]'
            }`}
          />
        ))}
      </div>
      <span className="text-[14px] font-normal text-[#7F7F7F]">({reviewCount})</span>
    </div>
  );
}
```

## TASK 4: Create Badge (PIXEL-PERFECT)

Create `/src/components/ui/Badge.tsx`:

```typescript
// Figma specs: bg #DB4444, textColor white, borderRadius 4px, fontSize 12px, fontWeight 500
// format: "-XX%" for sale percentage

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'sale' | 'new';
}

export default function Badge({ children, variant = 'sale' }: BadgeProps) {
  const variantClasses = {
    sale: 'bg-[#DB4444] text-white',
    new: 'bg-[#00FF66] text-white',
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-[8px] py-[4px] text-[12px] font-medium rounded-[4px] ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
```

## TASK 5: Create Button (PIXEL-PERFECT)

Create `/src/components/ui/Button.tsx`:

```typescript
'use client';

import { motion } from 'framer-motion';

// Figma specs:
// dark: bg #333333, text white, border 1px solid #F4F4F4, borderRadius 5px
// accent: bg transparent, text #77794E, border 4px solid #77794E, borderRadius 100px
// hover accent: border #9FA16D, text #9FA16D

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'dark' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'dark',
  size = 'md',
  onClick,
  className = '',
  fullWidth = false,
}: ButtonProps) {
  const variantClasses = {
    dark: 'bg-[#333333] text-white border border-[#F4F4F4] rounded-[5px] hover:bg-[#444444]',
    accent: 'bg-transparent text-[#77794E] border-4 border-[#77794E] rounded-[100px] hover:border-[#9FA16D] hover:text-[#9FA16D]',
  };

  const sizeClasses = {
    sm: 'px-[16px] py-[8px] text-[12px]',
    md: 'px-[20px] py-[12px] text-[14px]',
    lg: 'px-[33px] py-[16px] text-[16px]',
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        font-medium transition-colors
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
```

## TASK 6: Create TabFilter (PIXEL-PERFECT)

Create `/src/components/home/TabFilter.tsx`:

```typescript
'use client';

import { motion } from 'framer-motion';

// Figma specs:
// gap: 16px
// activeTab: h-45px, padding 12px 20px 11px 20px, borderRadius 5px, bg #333333, text white, border 1px solid #F4F4F4, fontSize 14px, fontWeight 500
// inactiveTab: h-57px, padding 16px 33px, borderRadius 100px (PILL), bg transparent, border 4px solid #77794E, text #77794E, fontSize 14px, fontWeight 500
// animation: smart-animate, ease-in-out-back, 300ms

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
    <div data-animate="tabs" className="flex items-center gap-[16px]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              text-[14px] font-medium transition-all duration-300
              ${
                isActive
                  ? 'h-[45px] px-[20px] pt-[12px] pb-[11px] bg-[#333333] text-white border border-[#F4F4F4] rounded-[5px]'
                  : 'h-[57px] px-[33px] py-[16px] bg-transparent text-[#77794E] border-4 border-[#77794E] rounded-[100px] hover:border-[#9FA16D] hover:text-[#9FA16D]'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            layout
            transition={{
              layout: { duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }, // ease-in-out-back
            }}
          >
            {tab.label}
          </motion.button>
        );
      })}
    </div>
  );
}
```

## TASK 7: Create ProductCard (PIXEL-PERFECT)

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

// Figma specs:
// card: w-270px, h-350px (or auto), bg #FFFFFF, borderRadius 4px
// imageContainer: w-270px h-270px, bg #F5F5F5
// saleBadge: position top 12px left 12px, format "-XX%"
// heartIcon: position top 12px right 12px
// addToCartButton: w-100%, bg #333333, text white, animation slide-up-on-hover
// content: padding 16px, gap 8px
// productName: fontSize 16px, fontWeight 500, color #333333
// price: fontSize 16px, fontWeight 600, color #333333
// salePrice: color #DB4444
// originalPrice: fontSize 14px, color #7F7F7F, line-through

interface ProductCardProps {
  product: Product;
  isWishlisted?: boolean;
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
}

export default function ProductCard({
  product,
  isWishlisted = false,
  onAddToCart,
  onToggleWishlist,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const displayPrice = product.isOnSale && product.salePrice
    ? product.salePrice
    : product.price;

  // Calculate discount percentage for sale badge
  const discountPercent = product.isOnSale && product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <motion.div
      className="w-[270px] flex flex-col bg-white rounded-[4px] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Container - 270x270, bg #F5F5F5 */}
      <div className="relative w-[270px] h-[270px] bg-[#F5F5F5] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-[16px]"
        />

        {/* Sale Badge - position top 12px left 12px */}
        {product.isOnSale && (
          <div className="absolute top-[12px] left-[12px]">
            <Badge variant="sale">-{discountPercent}%</Badge>
          </div>
        )}

        {/* Wishlist Heart - position top 12px right 12px */}
        <div className="absolute top-[12px] right-[12px]">
          <HeartIcon
            filled={isWishlisted}
            onClick={() => onToggleWishlist?.(product.id)}
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
                onClick={() => onAddToCart?.(product.id)}
                className="w-full h-[41px] bg-[#333333] text-white text-[14px] font-medium hover:bg-[#444444] transition-colors"
              >
                Add To Cart
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info - padding 16px, gap 8px */}
      <div className="p-[16px] flex flex-col gap-[8px]">
        {/* Product Name - fontSize 16px, fontWeight 500 */}
        <h3 className="text-[16px] font-medium text-[#333333] line-clamp-1">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-[12px]">
          <span className={`text-[16px] font-semibold ${product.isOnSale ? 'text-[#DB4444]' : 'text-[#333333]'}`}>
            ${displayPrice}
          </span>
          {product.isOnSale && product.salePrice && (
            <span className="text-[14px] font-normal text-[#7F7F7F] line-through">
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

## TASK 8: Create ProductGrid

Create `/src/components/home/ProductGrid.tsx`:

```typescript
'use client';

import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

// Figma specs:
// columns: desktop 4, tablet 3, mobile 2
// gap: desktop 24px, tablet 20px, mobile 16px

interface ProductGridProps {
  products: Product[];
  wishlistedIds?: string[];
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
}

export default function ProductGrid({
  products,
  wishlistedIds = [],
  onAddToCart,
  onToggleWishlist,
}: ProductGridProps) {
  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[16px] md:gap-[20px] lg:gap-[24px]"
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
          data-animate="product"
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

---

## Validation Checklist

```bash
# TypeScript compiles
npx tsc --noEmit

# Dev server runs
npm run dev
```

---

## Files Created

When complete, you should have created:
- `/src/components/ui/HeartIcon.tsx`
- `/src/components/ui/StarRating.tsx`
- `/src/components/ui/Badge.tsx`
- `/src/components/ui/Button.tsx`
- `/src/components/home/TabFilter.tsx`
- `/src/components/home/ProductCard.tsx`
- `/src/components/home/ProductGrid.tsx`
