'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import { TransitionLink } from '@/components/animations';
import StarRating from '@/components/ui/StarRating';
import type { WishlistItem as WishlistItemType } from '@/types';

interface WishlistItemProps {
  item: WishlistItemType;
  onRemove: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

export default function WishlistItem({ item, onRemove, onAddToCart }: WishlistItemProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const displayPrice = item.product.salePrice ?? item.product.price;
  const discountPercent = item.product.salePrice
    ? Math.round(((item.product.price - item.product.salePrice) / item.product.price) * 100)
    : 0;

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await onAddToCart(item.product.id);
    setIsAddingToCart(false);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-lg overflow-hidden border border-gray-100 group"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-[#F5F5F5] overflow-hidden">
        <TransitionLink href={`/product/${item.product.id}`} className="block w-full h-full">
          <Image
            src={item.product.image}
            alt={item.product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        </TransitionLink>

        {/* Sale Badge */}
        {item.product.isOnSale && discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-[#DB4444] text-white text-xs font-semibold px-2 py-1 rounded">
            -{discountPercent}%
          </div>
        )}

        {/* Remove from Wishlist */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onRemove(item.product.id)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-[#DB4444] hover:bg-red-50 transition-colors"
        >
          <Heart className="w-4 h-4 fill-current" />
        </motion.button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <TransitionLink href={`/product/${item.product.id}`}>
          <h3 className="text-base font-medium text-[#333333] line-clamp-1 hover:text-[#77794E] transition-colors">
            {item.product.name}
          </h3>
        </TransitionLink>

        <div className="flex items-center gap-2 mt-2">
          <span className={`text-base font-semibold ${item.product.isOnSale ? 'text-[#DB4444]' : 'text-[#333333]'}`}>
            ${displayPrice}
          </span>
          {item.product.isOnSale && item.product.salePrice && (
            <span className="text-sm text-[#7F7F7F] line-through">
              ${item.product.price}
            </span>
          )}
        </div>

        <div className="mt-2">
          <StarRating rating={item.product.rating} reviewCount={item.product.reviewCount} />
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className={`w-full h-10 mt-4 flex items-center justify-center gap-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-70 ${addedToCart ? 'bg-green-600 text-white' : 'bg-[#333333] text-white hover:bg-[#444444]'}`}
        >
          {addedToCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          {addedToCart && 'Added'}
          {!addedToCart && isAddingToCart && 'Adding...'}
          {!addedToCart && !isAddingToCart && 'Add to Cart'}
        </motion.button>
      </div>
    </motion.div>
  );
}
