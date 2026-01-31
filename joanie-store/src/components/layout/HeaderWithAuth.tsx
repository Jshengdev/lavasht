'use client';

import { useSession } from 'next-auth/react';
import Header from './Header';
import UserMenu from '@/components/auth/UserMenu';
import { useAuthModal } from '@/components/auth/AuthModalContext';
import { useCart, useWishlist } from '@/hooks';

export default function HeaderWithAuth() {
  const { data: session } = useSession();
  const { openSignIn } = useAuthModal();
  const { totalItems: cartCount } = useCart();
  const { wishlistedIds } = useWishlist();

  return (
    <Header
      isLoggedIn={!!session}
      onAccountClick={openSignIn}
      userMenu={session ? <UserMenu /> : null}
      cartCount={cartCount}
      wishlistCount={wishlistedIds.length}
    />
  );
}
