'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export function useWishlist() {
  const { data: session } = useSession();
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlistIds = useCallback(async () => {
    // This endpoint works without auth (returns empty array)
    try {
      const res = await fetch('/api/wishlist/ids');
      if (res.ok) {
        const data = await res.json();
        setWishlistedIds(data.productIds);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  }, []);

  useEffect(() => {
    fetchWishlistIds();
  }, [fetchWishlistIds, session?.user?.id]);

  const toggleWishlist = async (productId: string) => {
    if (!session?.user?.id) {
      return { success: false, error: 'Please sign in to save items' };
    }

    const wasWishlisted = wishlistedIds.includes(productId);

    const updateIds = (revert: boolean) => {
      const shouldAdd = revert ? wasWishlisted : !wasWishlisted;
      setWishlistedIds((prev) =>
        shouldAdd
          ? [...prev, productId]
          : prev.filter((id) => id !== productId)
      );
    };

    updateIds(false);

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (!res.ok) {
        updateIds(true);
        return { success: false, error: data.error };
      }

      return { success: true, action: data.action };
    } catch (error) {
      updateIds(true);
      return { success: false, error: 'Failed to update wishlist' };
    }
  };

  const isWishlisted = (productId: string) => wishlistedIds.includes(productId);

  return {
    wishlistedIds,
    loading,
    toggleWishlist,
    isWishlisted,
    refreshWishlist: fetchWishlistIds,
  };
}
