import type { Metadata } from 'next';
import { Space_Grotesk, Teko } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/auth/AuthProvider';
import { AuthModalProvider } from '@/components/auth/AuthModalContext';
import { TransitionProvider, PageTransition } from '@/components/animations';
import { ToastProvider } from '@/components/ui/Toast';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk'
});
const teko = Teko({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-teko' });

export const metadata: Metadata = {
  title: 'Joanie Store',
  description: "S'26 Dev Challenge - E-Commerce Store",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.className} ${spaceGrotesk.variable} ${teko.variable}`}>
        <AuthProvider>
          <AuthModalProvider>
            <ToastProvider>
              <TransitionProvider>
                {children}
                <PageTransition />
              </TransitionProvider>
            </ToastProvider>
          </AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
