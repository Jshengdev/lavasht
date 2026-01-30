'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product, Category } from '@/types';

export function useProducts(category?: Category) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = category
        ? `/api/products?category=${category}`
        : '/api/products';

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}
