'use client';

import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollAnimationOptions {
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale';
  start?: string;
  duration?: number;
  delay?: number;
  stagger?: number;
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement>(null);

  const {
    animation = 'fadeUp',
    start = 'top 80%',  // Figma spec for valueProps
    duration = 0.6,
    delay = 0,
    stagger,
  } = options;

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const animations = {
      fadeUp: { from: { y: 40, opacity: 0 }, to: { y: 0, opacity: 1 } },
      fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
      slideLeft: { from: { x: -50, opacity: 0 }, to: { x: 0, opacity: 1 } },
      slideRight: { from: { x: 50, opacity: 0 }, to: { x: 0, opacity: 1 } },
      scale: { from: { scale: 0.9, opacity: 0 }, to: { scale: 1, opacity: 1 } },
    };

    const anim = animations[animation];

    // If stagger is provided, animate children
    const target = stagger ? element.children : element;

    gsap.set(target, anim.from);

    gsap.to(target, {
      ...anim.to,
      duration,
      delay,
      stagger: stagger ?? 0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start,
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [animation, start, duration, delay, stagger]);

  return ref;
}

// Pre-configured hooks for common patterns

export function useValuePropsAnimation(): RefObject<HTMLDivElement | null> {
  return useScrollAnimation({
    animation: 'fadeUp',
    start: 'top 80%',
    duration: 0.6,
    stagger: 0.15, // 150ms
  });
}

export function useFooterAnimation(): RefObject<HTMLDivElement | null> {
  return useScrollAnimation({
    animation: 'fadeIn',
    start: 'top 90%',
    duration: 0.5,
  });
}
