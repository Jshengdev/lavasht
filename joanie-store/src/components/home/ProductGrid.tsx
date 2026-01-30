'use client';

import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

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
          transition: { staggerChildren: 0.1 },
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
