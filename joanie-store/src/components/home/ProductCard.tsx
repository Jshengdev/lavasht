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
      <div className="relative w-[270px] h-[270px] bg-[#F5F5F5] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-[16px]"
        />

        {product.isOnSale && (
          <div className="absolute top-[12px] left-[12px]">
            <Badge variant="sale">-{discountPercent}%</Badge>
          </div>
        )}

        <div className="absolute top-[12px] right-[12px]">
          <HeartIcon
            filled={isWishlisted}
            onClick={() => onToggleWishlist?.(product.id)}
          />
        </div>

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

      <div className="p-[16px] flex flex-col gap-[8px]">
        <h3 className="text-[16px] font-medium text-[#333333] line-clamp-1">
          {product.name}
        </h3>

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

        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
      </div>
    </motion.div>
  );
}
