export default function PromoBanner() {
  return (
    <div data-animate="promo" className="w-full h-[41px] bg-promo-banner flex items-center justify-center">
      <p className="text-sm text-white">
        New here? Save 20% with code: <span className="font-semibold">YES4</span>
      </p>
    </div>
  );
}
