import type { JSX, ReactNode } from 'react';
import PromoBanner from '@/components/layout/PromoBanner';
import HeaderWithAuth from '@/components/layout/HeaderWithAuth';
import Footer from '@/components/layout/Footer';
import PageLoadAnimation from '@/components/animations/PageLoadAnimation';

interface StoreLayoutProps {
  children: ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-page-bg">
      <PageLoadAnimation />
      <PromoBanner />
      <HeaderWithAuth />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
