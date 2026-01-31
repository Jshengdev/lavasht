import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Joanie Store',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
