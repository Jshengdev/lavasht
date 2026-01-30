'use client';

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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
      {products.map(product => (
        <div key={product.id} data-animate="product">
          <ProductCard
            product={product}
            isWishlisted={wishlistedIds.includes(product.id)}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
          />
        </div>
      ))}
    </div>
  );
}
