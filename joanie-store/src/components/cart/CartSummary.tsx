'use client';

import { motion } from 'framer-motion';

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
}

export default function CartSummary({ subtotal, itemCount }: CartSummaryProps) {
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-[#F5F5F5] rounded-lg p-6"
    >
      <h2 className="font-teko text-2xl font-bold text-[#333333] uppercase mb-6">
        Order Summary
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-[#7F7F7F]">Subtotal ({itemCount} items)</span>
          <span className="font-medium text-[#333333]">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-[#7F7F7F]">Shipping</span>
          {shipping === 0 ? (
            <span className="font-medium text-green-600">Free</span>
          ) : (
            <span className="font-medium text-[#333333]">${shipping.toFixed(2)}</span>
          )}
        </div>

        {subtotal < 100 && subtotal > 0 && (
          <div className="text-xs text-[#77794E] bg-[#77794E]/10 rounded p-2">
            Add ${(100 - subtotal).toFixed(2)} more for free shipping!
          </div>
        )}

        <div className="border-t border-gray-300 pt-4 mt-4">
          <div className="flex justify-between">
            <span className="font-semibold text-[#333333]">Total</span>
            <span className="font-bold text-xl text-[#333333]">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full h-14 mt-6 bg-[#333333] text-white rounded-lg font-semibold text-base hover:bg-[#444444] transition-colors"
      >
        Proceed to Checkout
      </motion.button>

      <p className="text-xs text-center text-[#7F7F7F] mt-4">
        Secure checkout powered by Stripe
      </p>
    </motion.div>
  );
}
