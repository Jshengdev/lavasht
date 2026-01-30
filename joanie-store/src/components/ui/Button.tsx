'use client';

import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'dark' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'dark',
  size = 'md',
  onClick,
  className = '',
  fullWidth = false,
}: ButtonProps) {
  const variantClasses = {
    dark: 'bg-[#333333] text-white border border-[#F4F4F4] rounded-[5px] hover:bg-[#444444]',
    accent: 'bg-transparent text-[#77794E] border-4 border-[#77794E] rounded-[100px] hover:border-[#9FA16D] hover:text-[#9FA16D]',
  };

  const sizeClasses = {
    sm: 'px-[16px] py-[8px] text-[12px]',
    md: 'px-[20px] py-[12px] text-[14px]',
    lg: 'px-[33px] py-[16px] text-[16px]',
  };

  const classes = [
    'font-medium transition-colors',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className,
  ].filter(Boolean).join(' ');

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={classes}
    >
      {children}
    </motion.button>
  );
}
