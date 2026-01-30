import type { JSX } from 'react';

export default function PromoBanner(): JSX.Element {
  return (
    <div data-animate="promo" className="w-full h-[41px] bg-promo-banner flex items-center justify-center">
      <p className="text-[14px] font-normal text-white">
        New here? Save 20% with code: <span className="font-semibold">YES4</span>
      </p>
    </div>
  );
}
