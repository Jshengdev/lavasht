import { Metadata } from 'next';
import { CartPage } from '@/components/cart';

export const metadata: Metadata = {
  title: 'Shopping Cart | Joanie Store',
  description: 'Review your cart and proceed to checkout',
};

export default function Cart() {
  return <CartPage />;
}
