'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Heart, ShoppingBag } from 'lucide-react';

function getUserInitial(name?: string | null, email?: string | null): string {
  if (name) return name.charAt(0);
  if (email) return email.charAt(0);
  return 'U';
}

export default function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-[4px] hover:opacity-70 transition-opacity"
      >
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt="Profile"
            className="w-[32px] h-[32px] rounded-full"
          />
        ) : (
          <div className="w-[32px] h-[32px] rounded-full bg-[#333333] flex items-center justify-center">
            <span className="text-[14px] font-medium text-white">
              {getUserInitial(session.user?.name, session.user?.email)}
            </span>
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
              className="fixed inset-0 z-40"
            />

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-[8px] w-[200px] bg-white rounded-[5px] shadow-lg border border-[#E0E0E0] z-50 overflow-hidden"
            >
              <div className="p-[16px] border-b border-[#E0E0E0]">
                <p className="text-[14px] font-medium text-[#333333] truncate">
                  {session.user?.name || 'User'}
                </p>
                <p className="text-[12px] text-[#7F7F7F] truncate">
                  {session.user?.email}
                </p>
              </div>

              <div className="p-[8px]">
                <button className="w-full flex items-center gap-[12px] px-[12px] py-[10px] text-[14px] text-[#333333] hover:bg-[#F4F4F4] rounded-[5px] transition-colors">
                  <Heart className="w-[18px] h-[18px]" />
                  Wishlist
                </button>
                <button className="w-full flex items-center gap-[12px] px-[12px] py-[10px] text-[14px] text-[#333333] hover:bg-[#F4F4F4] rounded-[5px] transition-colors">
                  <ShoppingBag className="w-[18px] h-[18px]" />
                  Orders
                </button>
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-[12px] px-[12px] py-[10px] text-[14px] text-[#DB4444] hover:bg-[#DB4444]/10 rounded-[5px] transition-colors"
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
