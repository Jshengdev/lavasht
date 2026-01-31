'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface WishlistResult {
  success: boolean;
  error?: string;
}

export function useWishlist() {
  const { data: session } = useSession();
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchWishlist(): Promise<void> {
      const res = await fetch('/api/wishlist/ids');
      if (res.ok) {
        const data = await res.json();
        setWishlistedIds(data.productIds);
      }
    }
    fetchWishlist();
  }, [session?.user?.id]);

  const toggleWishlist = useCallback(async (productId: string): Promise<WishlistResult> => {
    if (!session?.user?.id) {
      return { success: false, error: 'Please sign in to save items' };
    }

    const wasWishlisted = wishlistedIds.includes(productId);

    // Optimistic update
    setWishlistedIds(prev =>
      wasWishlisted ? prev.filter(id => id !== productId) : [...prev, productId]
    );

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        // Revert on error
        setWishlistedIds(prev =>
          wasWishlisted ? [...prev, productId] : prev.filter(id => id !== productId)
        );
        const data = await res.json();
        return { success: false, error: data.error };
      }

      return { success: true };
    } catch {
      // Revert on error
      setWishlistedIds(prev =>
        wasWishlisted ? [...prev, productId] : prev.filter(id => id !== productId)
      );
      return { success: false, error: 'Failed to update wishlist' };
    }
  }, [session?.user?.id, wishlistedIds]);

  const isWishlisted = useCallback(
    (id: string): boolean => wishlistedIds.includes(id),
    [wishlistedIds]
  );

  return { wishlistedIds, toggleWishlist, isWishlisted };
}
