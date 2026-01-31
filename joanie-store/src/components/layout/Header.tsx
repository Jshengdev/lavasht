'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, User } from 'lucide-react';
import { TransitionLink } from '@/components/animations';
import Logo from '@/components/ui/Logo';

const NAV_ITEMS = ['Women', 'Men', 'Kids', 'Sale', 'New', 'Brands'];

interface HeaderProps {
  isLoggedIn?: boolean;
  onAccountClick?: () => void;
  userMenu?: ReactNode;
  cartCount?: number;
  wishlistCount?: number;
}

export default function Header({
  isLoggedIn = false,
  onAccountClick,
  userMenu,
  cartCount = 0,
  wishlistCount = 0,
}: HeaderProps) {
  return (
    <header data-animate="header" className="w-full bg-white relative z-50">
      <div className="mx-auto max-w-[1370px] h-[70px] py-5 flex items-center justify-between">
        {/* Logo + Nav */}
        <div className="flex items-center gap-6">
          <TransitionLink href="/" aria-label="Joanie Store Home">
            <Logo size="md" />
          </TransitionLink>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map(item => (
              <Link key={item} href="#" className="text-sm font-medium text-[#333333] hover:opacity-70">
                {item}
              </Link>
            ))}
          </nav>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6">
          <TransitionLink href="/wishlist" aria-label="Wishlist" className="relative hover:opacity-70">
            <Heart className="w-6 h-6 text-[#333333]" strokeWidth={1.5} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#DB4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </TransitionLink>

          <TransitionLink href="/cart" aria-label="Cart" className="relative hover:opacity-70">
            <ShoppingCart className="w-6 h-6 text-[#333333]" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#DB4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </TransitionLink>

          {isLoggedIn && userMenu ? (
            userMenu
          ) : (
            <button aria-label="Account" onClick={onAccountClick} className="hover:opacity-70">
              <User className="w-6 h-6 text-[#333333]" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
