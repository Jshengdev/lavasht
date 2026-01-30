'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
}

export default function SignUpModal({ isOpen, onClose, onSwitchToSignIn }: SignUpModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      await signIn('credentials', { email, password, redirect: false });
      onClose();
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] bg-white rounded shadow-xl z-50 p-8"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-[#7F7F7F] hover:text-[#333333]">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-[#333333] mb-6">Create Account</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="p-3 bg-[#DB4444]/10 text-[#DB4444] rounded text-sm">{error}</div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#333333]">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="h-12 px-4 border border-[#E0E0E0] rounded text-sm focus:outline-none focus:border-[#333333]"
                  placeholder="Enter your name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#333333]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="h-12 px-4 border border-[#E0E0E0] rounded text-sm focus:outline-none focus:border-[#333333]"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#333333]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="h-12 px-4 border border-[#E0E0E0] rounded text-sm focus:outline-none focus:border-[#333333]"
                  placeholder="Create a password (min 6 characters)"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-12 bg-[#333333] text-white text-sm font-medium rounded hover:bg-[#444444] disabled:opacity-50 mt-2"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#7F7F7F]">
              Already have an account?{' '}
              <button onClick={onSwitchToSignIn} className="text-[#333333] font-medium hover:underline">
                Sign In
              </button>
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
