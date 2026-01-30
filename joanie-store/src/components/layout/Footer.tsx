import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

const SOCIAL_LINKS = [
  { Icon: Facebook, label: 'Facebook' },
  { Icon: Instagram, label: 'Instagram' },
  { Icon: Twitter, label: 'Twitter' },
  { Icon: Linkedin, label: 'LinkedIn' },
  { Icon: Youtube, label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#333333]">
      <div className="px-9 pt-9 pb-6">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <span className="text-xl font-bold text-white" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
            Logo
          </span>

          {/* Address */}
          <div className="flex flex-col gap-1">
            <p className="text-base font-bold text-white" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
              Address:
            </p>
            <p className="text-base text-[#7F7F7F]">USA, California</p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-1">
            <p className="text-base font-bold text-white" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
              Contact:
            </p>
            <Link href="tel:8001234567" className="text-base text-[#7F7F7F] hover:text-white">
              (800) 123 4567
            </Link>
            <Link href="mailto:joanie2k@gmail.com" className="text-base text-[#7F7F7F] hover:text-white">
              joanie2k@gmail.com
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ Icon, label }) => (
              <Link key={label} href="#" aria-label={label} className="hover:opacity-70">
                <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#7F7F7F]/30 py-6">
        <p className="text-sm text-[#7F7F7F] text-center">© 2023 Joanie. All rights reserved.</p>
      </div>
    </footer>
  );
}
