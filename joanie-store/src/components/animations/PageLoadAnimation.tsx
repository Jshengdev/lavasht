'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function PageLoadAnimation() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // Set initial hidden states
    gsap.set('[data-animate="promo"]', { opacity: 0 });
    gsap.set('[data-animate="header"]', { y: -100, opacity: 0 });
    gsap.set('[data-animate="hero"]', { y: 30, opacity: 0 });
    gsap.set('[data-animate="tabs"]', { x: -50, opacity: 0 });
    gsap.set('[data-animate="product"]', { y: 50, opacity: 0 });

    // Animate in sequence
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('[data-animate="promo"]', { opacity: 1, duration: 0.4 })
      .to('[data-animate="header"]', { y: 0, opacity: 1, duration: 0.5 }, '-=0.2')
      .to('[data-animate="hero"]', { y: 0, opacity: 1, duration: 0.6 }, '-=0.3')
      .to('[data-animate="tabs"]', { x: 0, opacity: 1, duration: 0.4 }, '-=0.2')
      .to('[data-animate="product"]', { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, '-=0.2');
  }, []);

  return null;
}
