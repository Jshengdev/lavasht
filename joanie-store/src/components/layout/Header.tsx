'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, User } from 'lucide-react';

const NAV_ITEMS = ['Women', 'Men', 'Kids', 'Sale', 'New', 'Brands'];

interface HeaderProps {
  isLoggedIn?: boolean;
  onAccountClick?: () => void;
  userMenu?: ReactNode;
}

export default function Header({ isLoggedIn = false, onAccountClick, userMenu }: HeaderProps) {
  return (
    <header data-animate="header" className="w-full bg-white">
      <div className="mx-auto max-w-[1370px] h-[70px] py-5 flex items-center justify-between">
        {/* Logo + Nav */}
        <div className="flex items-center gap-6">
          <Link href="/">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 24L16 8L24 24L16 18L8 24Z" fill="#333333" />
            </svg>
          </Link>

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
          <button aria-label="Wishlist" className="hover:opacity-70">
            <Heart className="w-6 h-6 text-[#333333]" strokeWidth={1.5} />
          </button>

          <button aria-label="Cart" className="hover:opacity-70">
            <ShoppingCart className="w-6 h-6 text-[#333333]" strokeWidth={1.5} />
          </button>

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
