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
import { useToast } from '@/components/ui/Toast';
import { useAuthModal } from '@/components/auth/AuthModalContext';
import type { Category } from '@/types';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Category>('new-arrivals');
  const { products, loading } = useProducts(activeTab);
  const { addToCart } = useCart();
  const { wishlistedIds, toggleWishlist, isWishlisted } = useWishlist();
  const { showToast } = useToast();
  const { openSignIn } = useAuthModal();

  const handleAddToCart = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    const result = await addToCart(productId);

    if (result.success) {
      showToast(`${product?.name || 'Item'} added to cart`, 'success');
    } else if (result.error?.includes('sign in')) {
      openSignIn();
    } else {
      showToast(result.error || 'Failed to add to cart', 'error');
    }
  };

  const handleToggleWishlist = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    const wasWishlisted = isWishlisted(productId);
    const result = await toggleWishlist(productId);

    if (result.success) {
      showToast(
        wasWishlisted
          ? `${product?.name || 'Item'} removed from wishlist`
          : `${product?.name || 'Item'} added to wishlist`,
        'wishlist'
      );
    } else if (result.error?.includes('sign in')) {
      openSignIn();
    } else {
      showToast(result.error || 'Failed to update wishlist', 'error');
    }
  };

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
