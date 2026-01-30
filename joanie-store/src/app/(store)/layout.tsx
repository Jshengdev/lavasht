import PromoBanner from '@/components/layout/PromoBanner';
import HeaderWithAuth from '@/components/layout/HeaderWithAuth';
import Footer from '@/components/layout/Footer';
import PageLoadAnimation from '@/components/animations/PageLoadAnimation';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <PageLoadAnimation />
      <PromoBanner />
      <HeaderWithAuth />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
