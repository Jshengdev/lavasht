'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export function useCart() {
  const { data: session } = useSession();
  const [state, setState] = useState<CartState>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!session?.user?.id) {
      setState({ items: [], totalItems: 0, totalPrice: 0 });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setState({
          items: data.items,
          totalItems: data.totalItems,
          totalPrice: data.totalPrice,
        });
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: string, quantity = 1) => {
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

      if (!res.ok) {
        return { success: false, error: data.error };
      }

      await fetchCart();
      return { success: true, item: data.item };
    } catch (error) {
      return { success: false, error: 'Failed to add to cart' };
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        return { success: false, error: data.error };
      }

      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to remove from cart' };
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
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
    } catch (error) {
      return { success: false, error: 'Failed to update quantity' };
    }
  };

  return {
    items: state.items,
    totalItems: state.totalItems,
    totalPrice: state.totalPrice,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    refreshCart: fetchCart,
  };
}
