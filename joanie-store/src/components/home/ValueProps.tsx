import type { JSX } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Truck, Headphones, RefreshCw } from 'lucide-react';

interface ValueProp {
  Icon: LucideIcon;
  title: string;
  description: string;
}

const VALUE_PROPS: readonly ValueProp[] = [
  {
    Icon: Truck,
    title: 'FREE AND FAST DELIVERY',
    description: 'Free delivery for all orders over $140',
  },
  {
    Icon: Headphones,
    title: '24/7 CUSTOMER SERVICE',
    description: 'Friendly 24/7 customer support',
  },
  {
    Icon: RefreshCw,
    title: 'MONEY BACK GUARANTEE',
    description: 'We return money within 30 days',
  },
];

export default function ValueProps(): JSX.Element {
  return (
    <section className="w-full py-[64px] bg-white">
      <div className="mx-auto max-w-content px-[20px]">
        <div className="flex justify-center gap-[48px]">
          {VALUE_PROPS.map(({ Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <div className="w-[80px] h-[80px] rounded-full bg-icon-container-outer flex items-center justify-center">
                <div className="w-[56px] h-[56px] rounded-full bg-btn-dark flex items-center justify-center">
                  <Icon className="w-[24px] h-[24px] text-white" strokeWidth={1.5} />
                </div>
              </div>

              <h3 className="mt-[24px] text-[16px] font-semibold text-text-primary uppercase">
                {title}
              </h3>

              <p className="mt-[8px] text-[14px] font-normal text-text-secondary">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
