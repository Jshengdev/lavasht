import { Truck, Headphones, RefreshCw } from 'lucide-react';

const VALUE_PROPS = [
  { Icon: Truck, title: 'FREE AND FAST DELIVERY', description: 'Free delivery for all orders over $140' },
  { Icon: Headphones, title: '24/7 CUSTOMER SERVICE', description: 'Friendly 24/7 customer support' },
  { Icon: RefreshCw, title: 'MONEY BACK GUARANTEE', description: 'We return money within 30 days' },
];

export default function ValueProps() {
  return (
    <section className="w-full py-16 bg-white">
      <div className="mx-auto max-w-content px-5">
        <div className="flex justify-center gap-12">
          {VALUE_PROPS.map(({ Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-icon-container-outer flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-btn-dark flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="mt-6 text-base font-semibold text-text-primary uppercase">{title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
