'use client';

import type { JSX, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Heart, ShoppingCart, User } from 'lucide-react';

const NAV_ITEMS = ['Women', 'Men', 'Kids', 'Sale', 'New', 'Brands'] as const;

interface HeaderProps {
  isLoggedIn?: boolean;
  onAccountClick?: () => void;
  userMenu?: ReactNode;
}

interface IconButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

function IconButton({ icon: Icon, label, onClick }: IconButtonProps): JSX.Element {
  return (
    <button
      className="p-1 hover:opacity-70 transition-opacity"
      aria-label={label}
      onClick={onClick}
    >
      <Icon className="w-[24px] h-[24px] text-text-primary" strokeWidth={1.5} />
    </button>
  );
}

export default function Header({
  isLoggedIn = false,
  onAccountClick,
  userMenu
}: HeaderProps): JSX.Element {
  return (
    <header data-animate="header" className="w-full bg-white">
      <div className="mx-auto max-w-content h-[70px] px-[20px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 24L16 8L24 24L16 18L8 24Z" fill="#333333" />
          </svg>
        </Link>

        <nav className="hidden md:flex items-center gap-[32px]">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item}
              href="#"
              className="text-[14px] font-medium text-text-primary hover:opacity-70 transition-opacity"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-[16px]">
          <IconButton icon={Heart} label="Wishlist" />
          <IconButton icon={ShoppingCart} label="Cart" />
          {isLoggedIn && userMenu ? (
            userMenu
          ) : (
            <IconButton icon={User} label="Account" onClick={onAccountClick} />
          )}
        </div>
      </div>
    </header>
  );
}
