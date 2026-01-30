'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface HeartIconProps {
  filled: boolean;
  onClick?: () => void;
}

export default function HeartIcon({ filled, onClick }: HeartIconProps) {
  return (
    <motion.button
      onClick={e => { e.preventDefault(); e.stopPropagation(); onClick?.(); }}
      whileTap={{ scale: 0.9 }}
      className="w-[34px] h-[34px] flex items-center justify-center rounded-full bg-white"
    >
      <motion.div animate={filled ? { scale: [1, 1.3, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}>
        <Heart
          className={`w-6 h-6 ${filled ? 'fill-[#DB4444] text-[#DB4444]' : 'fill-transparent text-[#333333]'}`}
          strokeWidth={1.5}
        />
      </motion.div>
    </motion.button>
  );
}
