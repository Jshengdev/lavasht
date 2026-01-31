'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Minus, Plus, X } from 'lucide-react';
import type { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const displayPrice = item.product.salePrice ?? item.product.price;
  const itemTotal = displayPrice * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex items-center gap-4 py-6 border-b border-gray-200"
    >
      {/* Product Image */}
      <div className="relative w-24 h-24 bg-[#F5F5F5] rounded-lg flex-shrink-0 overflow-hidden">
        <Image
          src={item.product.image}
          alt={item.product.name}
          fill
          className="object-contain p-2"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-medium text-[#333333] truncate">
          {item.product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-sm font-semibold ${item.product.isOnSale ? 'text-[#DB4444]' : 'text-[#333333]'}`}>
            ${displayPrice}
          </span>
          {item.product.isOnSale && item.product.salePrice && (
            <span className="text-xs text-[#7F7F7F] line-through">
              ${item.product.price}
            </span>
          )}
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
          disabled={item.quantity <= 1}
          className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-[#333333] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4" />
        </motion.button>
        <span className="w-10 text-center font-medium text-[#333333]">
          {item.quantity}
        </span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-[#333333] hover:bg-gray-100"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Item Total */}
      <div className="w-24 text-right">
        <span className="font-semibold text-[#333333]">${itemTotal.toFixed(2)}</span>
      </div>

      {/* Remove Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onRemove(item.id)}
        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-[#DB4444] hover:bg-red-50 transition-colors"
      >
        <X className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
}
