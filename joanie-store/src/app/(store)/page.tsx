'use client';

import { useState } from 'react';
import HeroSection from '@/components/home/HeroSection';
import TabFilter from '@/components/home/TabFilter';
import ProductGrid from '@/components/home/ProductGrid';
import ProductGridSkeleton from '@/components/home/ProductGridSkeleton';
import ValueProps from '@/components/home/ValueProps';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import type { Category } from '@/types';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Category>('new-arrivals');
  const { products, loading } = useProducts(activeTab);
  const { addToCart } = useCart();
  const { wishlistedIds, toggleWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />

      <section className="pt-[60px] pb-28">
        <div className="mx-auto max-w-[1370px] px-5">
          <div className="mb-10">
            <TabFilter activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {loading ? (
            <ProductGridSkeleton />
          ) : (
            <ProductGrid
              products={products}
              wishlistedIds={wishlistedIds}
              onAddToCart={id => addToCart(id)}
              onToggleWishlist={id => toggleWishlist(id)}
            />
          )}
        </div>
      </section>

      <ValueProps />
    </div>
  );
}
