'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import type { CartItem } from '@/types';

export function useCart() {
  const { data: session } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  async function fetchCart() {
    if (!session?.user?.id) {
      setItems([]);
      setTotalItems(0);
      setTotalPrice(0);
      return;
    }

    const res = await fetch('/api/cart');
    if (res.ok) {
      const data = await res.json();
      setItems(data.items);
      setTotalItems(data.totalItems);
      setTotalPrice(data.totalPrice);
    }
  }

  useEffect(() => {
    fetchCart();
  }, [session?.user?.id]);

  async function addToCart(productId: string, quantity = 1) {
    if (!session?.user?.id) {
      return { success: false, error: 'Please sign in to add items to cart' };
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };

      await fetchCart();
      return { success: true, item: data.item };
    } catch {
      return { success: false, error: 'Failed to add to cart' };
    }
  }

  async function removeFromCart(itemId: string) {
    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        return { success: false, error: data.error };
      }
      await fetchCart();
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to remove from cart' };
    }
  }

  async function updateQuantity(itemId: string, quantity: number) {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });

      if (!res.ok) {
        const data = await res.json();
        return { success: false, error: data.error };
      }

      await fetchCart();
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to update quantity' };
    }
  }

  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
  };
}
