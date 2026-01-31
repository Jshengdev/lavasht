'use client';

import { useRef, useEffect } from 'react';
import { Truck, Headphones, RefreshCw } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/animations';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const VALUE_PROPS = [
  { Icon: Truck, title: 'FREE AND FAST DELIVERY', description: 'Free delivery for all orders over $140' },
  { Icon: Headphones, title: '24/7 CUSTOMER SERVICE', description: 'Friendly 24/7 customer support' },
  { Icon: RefreshCw, title: 'MONEY BACK GUARANTEE', description: 'We return money within 30 days' },
];

export default function ValueProps() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const items = itemsRef.current.filter(Boolean);
    if (!items.length) return;

    // Set initial state
    gsap.set(items, { opacity: 0, y: 30 });

    // Animate on scroll
    const tl = gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-16 bg-white">
      <div className="mx-auto max-w-content px-5">
        <div className="flex justify-center gap-12">
          {VALUE_PROPS.map(({ Icon, title, description }, index) => (
            <div
              key={title}
              ref={el => { if (el) itemsRef.current[index] = el; }}
              className="flex flex-col items-center text-center"
            >
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
