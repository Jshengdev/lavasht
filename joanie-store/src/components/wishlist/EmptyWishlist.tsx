'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { TransitionLink } from '@/components/animations';

export default function EmptyWishlist() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="w-24 h-24 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-6">
        <Heart className="w-10 h-10 text-[#7F7F7F]" />
      </div>

      <h2 className="font-teko text-3xl font-bold text-[#333333] uppercase mb-2">
        Your Wishlist is Empty
      </h2>

      <p className="text-[#7F7F7F] mb-8 text-center max-w-md">
        Save items you love by clicking the heart icon. They'll appear here for easy access later.
      </p>

      <TransitionLink href="/">
        <motion.span
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center justify-center h-14 px-8 bg-[#333333] text-white rounded-lg font-semibold text-base hover:bg-[#444444] transition-colors"
        >
          Start Shopping
        </motion.span>
      </TransitionLink>
    </motion.div>
  );
}
