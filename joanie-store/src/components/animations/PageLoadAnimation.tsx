'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function PageLoadAnimation(): null {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
    });

    // Set initial states
    gsap.set('[data-animate="promo"]', { opacity: 0 });
    gsap.set('[data-animate="header"]', { y: -100, opacity: 0 });
    gsap.set('[data-animate="hero"]', { y: 30, opacity: 0 });
    gsap.set('[data-animate="tabs"]', { x: -50, opacity: 0 });
    gsap.set('[data-animate="product"]', { y: 50, opacity: 0 });

    // Animation sequence with exact Figma timings
    tl.to('[data-animate="promo"]', {
      opacity: 1,
      duration: 0.4, // 400ms
    })
      .to(
        '[data-animate="header"]',
        {
          y: 0,
          opacity: 1,
          duration: 0.5, // 500ms
        },
        '-=0.2' // overlap
      )
      .to(
        '[data-animate="hero"]',
        {
          y: 0,
          opacity: 1,
          duration: 0.6, // 600ms
        },
        '-=0.3' // overlap
      )
      .to(
        '[data-animate="tabs"]',
        {
          x: 0,
          opacity: 1,
          duration: 0.4, // 400ms
        },
        '-=0.2' // overlap
      )
      .to(
        '[data-animate="product"]',
        {
          y: 0,
          opacity: 1,
          duration: 0.5, // 500ms
          stagger: 0.1, // 100ms stagger
        },
        '-=0.2'
      );
  }, []);

  return null; // This component only runs the animation
}
