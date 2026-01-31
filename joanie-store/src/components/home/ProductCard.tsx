'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import HeartIcon from '@/components/ui/HeartIcon';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import { TransitionLink } from '@/components/animations';
import type { Product } from '@/types';

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

  const displayPrice = product.salePrice ?? product.price;
  const discountPercent = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <motion.div
      className="w-[270px] flex flex-col bg-white rounded overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Image Container */}
      <div className="relative w-[270px] h-[270px] bg-[#F5F5F5] overflow-hidden">
        <TransitionLink href={`/product/${product.id}`} className="block w-full h-full">
          <motion.div
            className="w-full h-full"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-4"
            />
          </motion.div>
        </TransitionLink>

        {/* Sale Badge */}
        {product.isOnSale && discountPercent > 0 && (
          <div className="absolute top-3 left-3 pointer-events-none">
            <Badge variant="sale">-{discountPercent}%</Badge>
          </div>
        )}

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
          <HeartIcon
            filled={isWishlisted}
            onClick={() => onToggleWishlist?.(product.id)}
          />
        </div>

        {/* Add to Cart Button */}
        <AnimatePresence>
          {isHovered && (
            <motion.button
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart?.(product.id);
              }}
              className="absolute bottom-0 left-0 right-0 h-[41px] bg-[#333333] text-white text-sm font-medium hover:bg-[#444444] transition-colors z-10"
            >
              Add To Cart
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info */}
      <TransitionLink href={`/product/${product.id}`} className="block p-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-medium text-[#333333] line-clamp-1 hover:text-[#77794E] transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-3">
            <span className={`text-base font-semibold ${product.isOnSale ? 'text-[#DB4444]' : 'text-[#333333]'}`}>
              ${displayPrice}
            </span>
            {product.isOnSale && product.salePrice && (
              <span className="text-sm text-[#7F7F7F] line-through">
                ${product.price}
              </span>
            )}
          </div>

          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>
      </TransitionLink>
    </motion.div>
  );
}
