'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session) return null;

  const initial = session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U';

  return (
    <div className="relative z-50">
      <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:opacity-70">
        {session.user?.image ? (
          <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center">
            <span className="text-sm font-medium text-white">{initial}</span>
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[100]"
            />

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-[200px] bg-white rounded-lg shadow-xl border border-[#E0E0E0] z-[101] overflow-hidden"
            >
              <div className="p-4 border-b border-[#E0E0E0]">
                <p className="text-sm font-medium text-[#333333] truncate">{session.user?.name || 'User'}</p>
                <p className="text-xs text-[#7F7F7F] truncate">{session.user?.email}</p>
              </div>

              <div className="p-2">
                <Link
                  href="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#333333] hover:bg-[#F4F4F4] rounded"
                >
                  <Heart className="w-[18px] h-[18px]" />
                  Wishlist
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#333333] hover:bg-[#F4F4F4] rounded"
                >
                  <ShoppingBag className="w-[18px] h-[18px]" />
                  My Cart
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#DB4444] hover:bg-[#DB4444]/10 rounded"
                >
                  <LogOut className="w-[18px] h-[18px]" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
