import { Metadata } from 'next';
import { WishlistPage } from '@/components/wishlist';

export const metadata: Metadata = {
  title: 'Wishlist | Joanie Store',
  description: 'View your saved items and add them to your cart',
};

export default function Wishlist() {
  return <WishlistPage />;
}
