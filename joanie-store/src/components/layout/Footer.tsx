import type { JSX } from 'react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

interface LinkSection {
  title: string;
  links: readonly string[];
}

interface SocialIcon {
  Icon: LucideIcon;
  label: string;
}

const LINK_SECTIONS: readonly LinkSection[] = [
  { title: 'Shop', links: ['New Arrivals', 'Trending', 'Sale'] },
  { title: 'Help', links: ['FAQs', 'Shipping', 'Returns'] },
  { title: 'About', links: ['Our Story', 'Careers', 'Contact'] },
];

const SOCIAL_ICONS: readonly SocialIcon[] = [
  { Icon: Facebook, label: 'Facebook' },
  { Icon: Instagram, label: 'Instagram' },
  { Icon: Twitter, label: 'Twitter' },
  { Icon: Linkedin, label: 'LinkedIn' },
  { Icon: Youtube, label: 'YouTube' },
];

export default function Footer(): JSX.Element {
  return (
    <footer className="w-full bg-footer-bg text-white">
      <div className="mx-auto max-w-page pt-[58px] pb-[35px] px-[144px]">
        <div className="flex justify-between gap-[43px]">
          <div className="flex flex-col gap-[24px]">
            <h2 className="text-[24px] font-bold">Logo</h2>

            <div className="flex flex-col gap-[8px]">
              <p className="text-[14px] font-normal text-white">Address:</p>
              <p className="text-[14px] font-normal text-text-secondary">USA, California</p>
            </div>

            <div className="flex flex-col gap-[8px]">
              <p className="text-[14px] font-normal text-white">Contact:</p>
              <Link
                href="tel:8001234567"
                className="text-[14px] font-normal text-text-secondary hover:text-white transition-colors"
              >
                (800) 123 4567
              </Link>
              <Link
                href="mailto:joanie2k@gmail.com"
                className="text-[14px] font-normal text-text-secondary hover:text-white transition-colors"
              >
                joanie2k@gmail.com
              </Link>
            </div>
          </div>

          {LINK_SECTIONS.map((section) => (
            <div key={section.title} className="flex flex-col gap-[24px]">
              <h3 className="text-[16px] font-semibold">{section.title}</h3>
              <ul className="flex flex-col gap-[16px]">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-[14px] font-normal text-text-secondary hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="w-full h-[1px] bg-text-secondary/30 mt-[43px] mb-[24px]" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[16px]">
            {SOCIAL_ICONS.map(({ Icon, label }) => (
              <Link
                key={label}
                href="#"
                className="hover:opacity-70 transition-opacity"
                aria-label={label}
              >
                <Icon className="w-[20px] h-[20px] text-white" strokeWidth={1.5} />
              </Link>
            ))}
          </div>

          <p className="text-[14px] font-normal text-text-secondary">
            © 2023 Joanie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
