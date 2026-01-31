'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/ui/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        damping: 30,
        stiffness: 200,
      },
    },
  };

  return (
    <div className="min-h-screen flex">
      {/* Brand Section - Left Side */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="hidden lg:flex lg:w-1/2 relative bg-[#333333] overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <Link href="/" className="mb-8 flex flex-col items-center gap-4">
            <Logo size="xl" color="white" />
            <h1 className="font-teko text-5xl font-bold text-white uppercase tracking-wide">
              Joanie
            </h1>
          </Link>

          <div className="relative w-80 h-80 mb-8">
            <Image
              src="/shoes/hero-shoe.png"
              alt="Featured Shoe"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>

          <p className="text-white/80 text-center text-lg max-w-sm">
            Step into style with our curated collection of premium footwear.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#77794E] rounded-full -translate-x-1/2 translate-y-1/2 opacity-50" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#77794E] rounded-full translate-x-1/4 -translate-y-1/4 opacity-30" />
      </motion.div>

      {/* Form Section - Right Side */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 200,
          delay: 0.1,
        }}
        className="w-full lg:w-1/2 flex flex-col"
      >
        {/* Mobile Header */}
        <div className="lg:hidden p-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="font-teko text-2xl font-bold text-[#333333] uppercase">
              Joanie
            </span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[400px]"
          >
            <motion.h2
              variants={itemVariants}
              className="font-teko text-4xl font-bold text-[#333333] uppercase mb-2"
            >
              {title}
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-[#7F7F7F] mb-8"
            >
              {subtitle}
            </motion.p>

            {children}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
