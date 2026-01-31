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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      damping: 25,
      stiffness: 200,
    },
  },
};

export default function ProductGrid({
  products,
  wishlistedIds = [],
  onAddToCart,
  onToggleWishlist,
}: ProductGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6"
    >
      {products.map(product => (
        <motion.div key={product.id} variants={itemVariants} data-animate="product">
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
