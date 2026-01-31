'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import StarRating from '@/components/ui/StarRating';
import { useCart, useWishlist } from '@/hooks';
import { useToast } from '@/components/ui/Toast';
import { useAuthModal } from '@/components/auth/AuthModalContext';
import type { Product } from '@/types';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { addToCart } = useCart();
  const { wishlistedIds, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const { openSignIn } = useAuthModal();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const isWishlisted = wishlistedIds.includes(product.id);
  const displayPrice = product.salePrice ?? product.price;

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    const result = await addToCart(product.id);
    setIsAddingToCart(false);

    if (result.success) {
      setAddedToCart(true);
      showToast(`${product.name} added to cart`, 'success');
      setTimeout(() => setAddedToCart(false), 2000);
    } else if (result.error?.includes('sign in')) {
      openSignIn();
    } else {
      showToast(result.error || 'Failed to add to cart', 'error');
    }
  };

  const handleToggleWishlist = async () => {
    const wasWishlisted = isWishlisted;
    const result = await toggleWishlist(product.id);

    if (result.success) {
      showToast(
        wasWishlisted
          ? `${product.name} removed from wishlist`
          : `${product.name} added to wishlist`,
        'wishlist'
      );
    } else if (result.error?.includes('sign in')) {
      openSignIn();
    } else {
      showToast(result.error || 'Failed to update wishlist', 'error');
    }
  };

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col justify-center"
    >
      {/* Product Name */}
      <motion.h1
        variants={itemVariants}
        className="font-teko text-4xl md:text-5xl font-bold text-[#333333] uppercase leading-tight mb-4"
      >
        {product.name}
      </motion.h1>

      {/* Rating */}
      <motion.div variants={itemVariants} className="mb-6">
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
      </motion.div>

      {/* Price */}
      <motion.div variants={itemVariants} className="flex items-baseline gap-4 mb-8">
        <span
          className={`text-3xl font-bold ${product.isOnSale ? 'text-[#DB4444]' : 'text-[#333333]'}`}
        >
          ${displayPrice}
        </span>
        {product.isOnSale && product.salePrice && (
          <span className="text-xl text-[#7F7F7F] line-through">${product.price}</span>
        )}
      </motion.div>

      {/* Actions */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className={`flex items-center justify-center gap-3 h-14 px-8 rounded-lg font-semibold text-base transition-colors disabled:opacity-70 ${addedToCart ? 'bg-green-600 text-white' : 'bg-[#333333] text-white hover:bg-[#444444]'}`}
        >
          {addedToCart ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
          {addedToCart && 'Added to Cart'}
          {!addedToCart && isAddingToCart && 'Adding...'}
          {!addedToCart && !isAddingToCart && 'Add to Cart'}
        </motion.button>

        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleToggleWishlist}
          className={`flex items-center justify-center gap-3 h-14 px-8 rounded-lg font-semibold text-base border-2 transition-colors ${isWishlisted ? 'border-[#DB4444] text-[#DB4444] bg-red-50' : 'border-[#333333] text-[#333333] hover:bg-gray-50'}`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
