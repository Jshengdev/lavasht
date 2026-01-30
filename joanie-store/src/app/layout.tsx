import type { Metadata } from 'next';
import { Inter, Teko } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/auth/AuthProvider';

const inter = Inter({ subsets: ['latin'] });
const teko = Teko({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-teko' });

export const metadata: Metadata = {
  title: 'Joanie Store',
  description: "S'26 Dev Challenge - E-Commerce Store",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${teko.variable}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
