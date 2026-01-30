'use client';

import { useState, useEffect } from 'react';
import type { Product, Category } from '@/types';

export function useProducts(category?: Category) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        const url = category ? `/api/products?category=${category}` : '/api/products';
        const res = await fetch(url);

        if (!res.ok) throw new Error('Failed to fetch products');

        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category]);

  return { products, loading, error };
}
