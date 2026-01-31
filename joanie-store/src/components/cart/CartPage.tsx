'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks';
import { useToast } from '@/components/ui/Toast';
import { useAuthModal } from '@/components/auth/AuthModalContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import EmptyCart from './EmptyCart';
import { TransitionLink } from '@/components/animations';

export default function CartPage() {
  const { data: session, status } = useSession();
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();
  const { openSignIn } = useAuthModal();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status]);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    const result = await updateQuantity(itemId, quantity);
    if (!result.success) {
      showToast(result.error || 'Failed to update quantity', 'error');
    }
  };

  const handleRemove = async (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    const result = await removeFromCart(itemId);
    if (result.success) {
      showToast(`${item?.product.name || 'Item'} removed from cart`, 'info');
    } else {
      showToast(result.error || 'Failed to remove item', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-[1370px] px-5 py-8">
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            </div>
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
              <ShoppingCart className="w-10 h-10 text-[#7F7F7F]" />
            </div>
            <h2 className="font-teko text-3xl font-bold text-[#333333] uppercase mb-4">
              Sign In to View Your Cart
            </h2>
            <p className="text-[#7F7F7F] text-center max-w-md mb-6">
              Create an account or sign in to add items to your cart and checkout.
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
                Continue Shopping
              </TransitionLink>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyCart />;
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
          My Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CartSummary subtotal={totalPrice} itemCount={totalItems} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
