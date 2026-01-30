'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

export default function SignInModal({
  isOpen,
  onClose,
  onSwitchToSignUp,
}: SignInModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      onClose();
      setEmail('');
      setPassword('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] bg-white rounded-[5px] shadow-xl z-50 p-[32px]"
          >
            <button
              onClick={onClose}
              className="absolute top-[16px] right-[16px] text-[#7F7F7F] hover:text-[#333333] transition-colors"
            >
              <X className="w-[20px] h-[20px]" />
            </button>

            <h2 className="text-[24px] font-bold text-[#333333] mb-[24px]">Sign In</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
              {error && (
                <div className="p-[12px] bg-[#DB4444]/10 text-[#DB4444] rounded-[5px] text-[14px]">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-medium text-[#333333]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[48px] px-[16px] border border-[#E0E0E0] rounded-[5px] text-[14px] text-[#333333] placeholder-[#7F7F7F] focus:outline-none focus:border-[#333333] transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-medium text-[#333333]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[48px] px-[16px] border border-[#E0E0E0] rounded-[5px] text-[14px] text-[#333333] placeholder-[#7F7F7F] focus:outline-none focus:border-[#333333] transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[48px] bg-[#333333] text-white text-[14px] font-medium rounded-[5px] hover:bg-[#444444] disabled:opacity-50 transition-colors mt-[8px]"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="mt-[24px] text-center text-[14px] text-[#7F7F7F]">
              Don&apos;t have an account?{' '}
              <button
                onClick={onSwitchToSignUp}
                className="text-[#333333] font-medium hover:underline"
              >
                Sign Up
              </button>
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
