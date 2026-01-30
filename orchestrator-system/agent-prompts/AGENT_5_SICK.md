# 🔐 AGENT 5: AUTH

## Project Context
You are building: **S'26 Dev Challenge - E-Commerce Store**
Tech Stack: Next.js 14 + TypeScript + NextAuth.js + Prisma

## Your Role
You are the AUTH specialist. You own authentication and user session management.

## Your Domain (ONLY modify these files)
```
/src/app/api/auth/[...nextauth]/route.ts
/src/app/api/auth/signup/route.ts
/src/lib/auth.ts
/src/components/auth/SignInModal.tsx
/src/components/auth/SignUpModal.tsx
/src/components/auth/UserMenu.tsx
/src/components/auth/AuthProvider.tsx
/src/types/next-auth.d.ts
```

## Dependencies
- Requires: Prisma schema from Agent 1 (database)

---

## IMPORTANT: Project Already Initialized

The Orchestrator has already created the Next.js project. You are working inside an existing project directory.

---

## DESIGN SYSTEM CONSISTENCY

Use these exact values from the design tokens for consistent styling:

```
Colors:
- Primary button: bg-[#333333], text-white
- Button hover: bg-[#444444]
- Error/danger: #DB4444
- Text primary: #333333
- Text secondary: #7F7F7F
- Border: #E0E0E0
- Background: #FFFFFF

Border Radius:
- Buttons: rounded-[5px]
- Cards/Modals: rounded-[5px]
- Inputs: rounded-[5px]

Typography:
- Headings: text-[24px] font-bold
- Labels: text-[14px] font-medium
- Body: text-[14px] font-normal
- Small: text-[12px]
```

---

## TASK 1: Install Auth Dependencies

```bash
npm install next-auth @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs
```

## TASK 2: Create Auth Configuration

Create `/src/lib/auth.ts`:

```typescript
import { NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('No user found with this email');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
};

export const getAuthSession = () => getServerSession(authOptions);
```

## TASK 3: Create Auth API Route

Create `/src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

## TASK 4: Create Sign Up API Route

Create `/src/app/api/auth/signup/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
```

## TASK 5: Create Auth Provider

Create `/src/components/auth/AuthProvider.tsx`:

```typescript
'use client';

import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

## TASK 6: Update Root Layout

Update `/src/app/layout.tsx` to wrap with AuthProvider:

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/auth/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Joanie Store',
  description: 'E-Commerce Store',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

## TASK 7: Create SignInModal (PIXEL-PERFECT)

Create `/src/components/auth/SignInModal.tsx`:

```typescript
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] bg-white rounded-[5px] shadow-xl z-50 p-[32px]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-[16px] right-[16px] text-[#7F7F7F] hover:text-[#333333] transition-colors"
            >
              <X className="w-[20px] h-[20px]" />
            </button>

            {/* Title */}
            <h2 className="text-[24px] font-bold text-[#333333] mb-[24px]">Sign In</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
              {/* Error Message */}
              {error && (
                <div className="p-[12px] bg-[#DB4444]/10 text-[#DB4444] rounded-[5px] text-[14px]">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-medium text-[#333333]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[48px] px-[16px] border border-[#E0E0E0] rounded-[5px] text-[14px] text-[#333333] placeholder-[#7F7F7F] focus:outline-none focus:border-[#333333] transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-medium text-[#333333]">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[48px] px-[16px] border border-[#E0E0E0] rounded-[5px] text-[14px] text-[#333333] placeholder-[#7F7F7F] focus:outline-none focus:border-[#333333] transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[48px] bg-[#333333] text-white text-[14px] font-medium rounded-[5px] hover:bg-[#444444] disabled:opacity-50 transition-colors mt-[8px]"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Switch to Sign Up */}
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
```

## TASK 8: Create SignUpModal (PIXEL-PERFECT)

Create `/src/components/auth/SignUpModal.tsx`:

```typescript
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

export default function SignUpModal({
  isOpen,
  onClose,
  onSwitchToSignIn,
}: SignUpModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Auto sign in after signup
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      onClose();
      setName('');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] bg-white rounded-[5px] shadow-xl z-50 p-[32px]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-[16px] right-[16px] text-[#7F7F7F] hover:text-[#333333] transition-colors"
            >
              <X className="w-[20px] h-[20px]" />
            </button>

            {/* Title */}
            <h2 className="text-[24px] font-bold text-[#333333] mb-[24px]">Create Account</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
              {/* Error Message */}
              {error && (
                <div className="p-[12px] bg-[#DB4444]/10 text-[#DB4444] rounded-[5px] text-[14px]">
                  {error}
                </div>
              )}

              {/* Name Field */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-medium text-[#333333]">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-[48px] px-[16px] border border-[#E0E0E0] rounded-[5px] text-[14px] text-[#333333] placeholder-[#7F7F7F] focus:outline-none focus:border-[#333333] transition-colors"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-medium text-[#333333]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[48px] px-[16px] border border-[#E0E0E0] rounded-[5px] text-[14px] text-[#333333] placeholder-[#7F7F7F] focus:outline-none focus:border-[#333333] transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-medium text-[#333333]">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[48px] px-[16px] border border-[#E0E0E0] rounded-[5px] text-[14px] text-[#333333] placeholder-[#7F7F7F] focus:outline-none focus:border-[#333333] transition-colors"
                  placeholder="Create a password (min 6 characters)"
                  required
                  minLength={6}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[48px] bg-[#333333] text-white text-[14px] font-medium rounded-[5px] hover:bg-[#444444] disabled:opacity-50 transition-colors mt-[8px]"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            {/* Switch to Sign In */}
            <p className="mt-[24px] text-center text-[14px] text-[#7F7F7F]">
              Already have an account?{' '}
              <button
                onClick={onSwitchToSignIn}
                className="text-[#333333] font-medium hover:underline"
              >
                Sign In
              </button>
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

## TASK 9: Create UserMenu (PIXEL-PERFECT)

Create `/src/components/auth/UserMenu.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Heart, ShoppingBag } from 'lucide-react';

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
              {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
            </span>
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-[8px] w-[200px] bg-white rounded-[5px] shadow-lg border border-[#E0E0E0] z-50 overflow-hidden"
            >
              {/* User Info */}
              <div className="p-[16px] border-b border-[#E0E0E0]">
                <p className="text-[14px] font-medium text-[#333333] truncate">
                  {session.user?.name || 'User'}
                </p>
                <p className="text-[12px] text-[#7F7F7F] truncate">
                  {session.user?.email}
                </p>
              </div>

              {/* Menu Items */}
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
```

## TASK 10: Add NextAuth Types

Create `/src/types/next-auth.d.ts`:

```typescript
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}
```

---

## Validation Checklist

```bash
# TypeScript compiles
npx tsc --noEmit

# Dev server runs
npm run dev

# Test flows:
# 1. Open sign up modal, create account
# 2. Sign out
# 3. Sign in with created account
# 4. User menu shows with name initial
# 5. Sign out works
```

---

## Files Created

When complete, you should have created:
- `/src/lib/auth.ts`
- `/src/app/api/auth/[...nextauth]/route.ts`
- `/src/app/api/auth/signup/route.ts`
- `/src/components/auth/AuthProvider.tsx`
- `/src/components/auth/SignInModal.tsx`
- `/src/components/auth/SignUpModal.tsx`
- `/src/components/auth/UserMenu.tsx`
- `/src/types/next-auth.d.ts`
- Updated `/src/app/layout.tsx`
