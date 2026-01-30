import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // From Figma tokens.json - EXACT VALUES
        'promo-banner': '#4A4C6C',
        'page-bg': '#F4F4F4',
        'footer-bg': '#333333',
        'card-bg': '#FFFFFF',
        'btn-dark': '#333333',
        'btn-accent': '#77794E',
        'btn-accent-hover': '#9FA16D',
        'btn-border-light': '#F4F4F4',
        'sale-red': '#DB4444',
        'wishlist-red': '#DB4444',
        'price-red': '#DB4444',
        'star-yellow': '#FFAD33',
        'star-empty': '#E0E0E0',
        'text-primary': '#333333',
        'text-secondary': '#7F7F7F',
        'icon-container-outer': '#F3F3F3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        'page': '1440px',
        'content': '1370px',
      },
      boxShadow: {
        'header': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
