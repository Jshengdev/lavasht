'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Heart } from 'lucide-react';
import WishlistItem from './WishlistItem';
import EmptyWishlist from './EmptyWishlist';
import { useCart, useWishlist } from '@/hooks';
import { useToast } from '@/components/ui/Toast';
import { useAuthModal } from '@/components/auth/AuthModalContext';
import { TransitionLink } from '@/components/animations';
import type { WishlistItem as WishlistItemType } from '@/types';

export default function WishlistPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<WishlistItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { openSignIn } = useAuthModal();

  useEffect(() => {
    async function fetchWishlistItems(): Promise<void> {
      if (!session?.user?.id) {
        setItems([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/wishlist');
        if (res.ok) {
          const data = await res.json();
          setItems(data.items);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchWishlistItems();
  }, [session?.user?.id]);

  const handleRemove = async (productId: string) => {
    const item = items.find(i => i.product.id === productId);
    // Optimistic update
    setItems(prev => prev.filter(i => i.product.id !== productId));
    const result = await toggleWishlist(productId);

    if (result.success) {
      showToast(`${item?.product.name || 'Item'} removed from wishlist`, 'info');
    } else {
      // Revert on error - refetch
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
      }
      showToast(result.error || 'Failed to remove item', 'error');
    }
  };

  const handleAddToCart = async (productId: string) => {
    const item = items.find(i => i.product.id === productId);
    const result = await addToCart(productId);

    if (result.success) {
      showToast(`${item?.product.name || 'Item'} added to cart`, 'success');
    } else {
      showToast(result.error || 'Failed to add to cart', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-[1370px] px-5 py-8">
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-[1370px] px-5 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-[#7F7F7F]" />
            </div>
            <h2 className="font-teko text-3xl font-bold text-[#333333] uppercase mb-4">
              Sign In to View Your Wishlist
            </h2>
            <p className="text-[#7F7F7F] text-center max-w-md mb-6">
              Create an account or sign in to save your favorite items and access them anytime.
            </p>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={openSignIn}
                className="px-8 py-3 bg-[#333333] text-white rounded-lg font-medium hover:bg-[#444444] transition-colors"
              >
                Sign In
              </motion.button>
              <TransitionLink
                href="/"
                className="px-8 py-3 border-2 border-[#333333] text-[#333333] rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Start Shopping
              </TransitionLink>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-[1370px] px-5 py-8">
          <EmptyWishlist />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1370px] px-5 py-8">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-teko text-4xl font-bold text-[#333333] uppercase mb-8"
        >
          My Wishlist ({items.length} {items.length === 1 ? 'item' : 'items'})
        </motion.h1>

        {/* Wishlist Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <WishlistItem
                key={item.id}
                item={item}
                onRemove={handleRemove}
                onAddToCart={handleAddToCart}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
