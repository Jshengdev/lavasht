'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/');
    }
  }

  // Animation variants for form fields
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
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue shopping"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-[#DB4444]/10 text-[#DB4444] rounded text-sm"
          >
            {error}
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#333333]">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="h-12 px-4 border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:border-[#333333] focus:ring-1 focus:ring-[#333333] transition-all"
            placeholder="Enter your email"
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#333333]">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="h-12 px-4 border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:border-[#333333] focus:ring-1 focus:ring-[#333333] transition-all"
            placeholder="Enter your password"
            required
          />
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="h-12 bg-[#333333] text-white text-sm font-semibold rounded-lg hover:bg-[#444444] disabled:opacity-50 transition-colors mt-2"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </motion.button>
      </form>

      <motion.p
        variants={itemVariants}
        className="mt-8 text-center text-sm text-[#7F7F7F]"
      >
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-[#333333] font-semibold hover:text-[#77794E] transition-colors">
          Sign Up
        </Link>
      </motion.p>
    </AuthLayout>
  );
}
