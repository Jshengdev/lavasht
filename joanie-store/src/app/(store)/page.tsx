'use client';

import { useState, type ReactElement } from 'react';
import HeroSection from '@/components/home/HeroSection';
import TabFilter from '@/components/home/TabFilter';
import ProductGrid from '@/components/home/ProductGrid';
import ProductGridSkeleton from '@/components/home/ProductGridSkeleton';
import ValueProps from '@/components/home/ValueProps';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import type { Category } from '@/types';

export default function HomePage(): ReactElement {
  const [activeTab, setActiveTab] = useState<Category>('new-arrivals');

  const { products, loading } = useProducts(activeTab);
  const { addToCart } = useCart();
  const { wishlistedIds, toggleWishlist } = useWishlist();

  async function handleAddToCart(productId: string): Promise<void> {
    const result = await addToCart(productId);
    if (!result.success) {
      // TODO: Show toast notification
      console.log('Add to cart:', result.error);
    }
  }

  async function handleToggleWishlist(productId: string): Promise<void> {
    const result = await toggleWishlist(productId);
    if (!result.success) {
      // TODO: Show toast notification
      console.log('Wishlist:', result.error);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <HeroSection />

      <section className="pt-[60px] pb-[112px]">
        <div className="mx-auto max-w-[1370px] px-[20px]">
          <div className="mb-[40px]">
            <TabFilter activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <ProductGrid
              products={products}
              wishlistedIds={wishlistedIds}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
            />
          )}
        </div>
      </section>

      <ValueProps />
    </div>
  );
}
