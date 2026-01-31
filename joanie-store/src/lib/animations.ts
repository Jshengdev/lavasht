'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Animation presets
export const animationPresets = {
  fadeUp: {
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0 },
  },
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  slideInLeft: {
    from: { opacity: 0, x: -50 },
    to: { opacity: 1, x: 0 },
  },
  slideInRight: {
    from: { opacity: 0, x: 50 },
    to: { opacity: 1, x: 0 },
  },
  scaleIn: {
    from: { opacity: 0, scale: 0.95 },
    to: { opacity: 1, scale: 1 },
  },
  // Apple-style subtle animations
  appleSubtle: {
    from: { opacity: 0, y: 20, scale: 0.98 },
    to: { opacity: 1, y: 0, scale: 1 },
  },
};

// Default durations
export const durations = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
  pageTransition: 0.5,
};

// Easing presets
export const easings = {
  smooth: 'power2.out',
  snappy: 'power3.out',
  bounce: 'back.out(1.2)',
  pageTransition: 'power4.inOut',
  spring: 'elastic.out(1, 0.5)',
};

// Stagger settings
export const staggerSettings = {
  fast: 0.05,
  normal: 0.08,
  slow: 0.12,
};

// Scroll trigger defaults
export const scrollTriggerDefaults = {
  start: 'top 85%',
  end: 'bottom 15%',
  toggleActions: 'play none none none',
};

// Check for reduced motion preference
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Create a scroll-triggered animation
export const createScrollAnimation = (
  element: Element | string,
  preset: keyof typeof animationPresets = 'fadeUp',
  options: {
    duration?: number;
    delay?: number;
    ease?: string;
    trigger?: Element | string;
    start?: string;
  } = {}
) => {
  if (prefersReducedMotion()) {
    // Instantly show elements without animation
    gsap.set(element, animationPresets[preset].to);
    return null;
  }

  const animation = animationPresets[preset];
  const trigger = options.trigger || element;

  return gsap.fromTo(element, animation.from, {
    ...animation.to,
    duration: options.duration || durations.normal,
    delay: options.delay || 0,
    ease: options.ease || easings.smooth,
    scrollTrigger: {
      trigger,
      start: options.start || scrollTriggerDefaults.start,
      toggleActions: scrollTriggerDefaults.toggleActions,
    },
  });
};

// Create staggered animation for multiple elements
export const createStaggerAnimation = (
  elements: Element[] | string,
  preset: keyof typeof animationPresets = 'fadeUp',
  options: {
    stagger?: number;
    duration?: number;
    ease?: string;
    trigger?: Element | string;
    start?: string;
  } = {}
) => {
  if (prefersReducedMotion()) {
    gsap.set(elements, animationPresets[preset].to);
    return null;
  }

  const animation = animationPresets[preset];
  const trigger = options.trigger || (typeof elements === 'string' ? elements : elements[0]);

  return gsap.fromTo(elements, animation.from, {
    ...animation.to,
    duration: options.duration || durations.normal,
    stagger: options.stagger || staggerSettings.normal,
    ease: options.ease || easings.smooth,
    scrollTrigger: trigger
      ? {
          trigger,
          start: options.start || scrollTriggerDefaults.start,
          toggleActions: scrollTriggerDefaults.toggleActions,
        }
      : undefined,
  });
};

// Page entrance animation
export const createPageEntranceAnimation = (
  elements: Element[] | string,
  options: {
    stagger?: number;
    duration?: number;
    delay?: number;
  } = {}
) => {
  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0 });
    return null;
  }

  return gsap.fromTo(
    elements,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: options.duration || durations.normal,
      stagger: options.stagger || staggerSettings.normal,
      delay: options.delay || 0.2,
      ease: easings.smooth,
    }
  );
};

// Kill all ScrollTrigger instances (useful for cleanup)
export const killAllScrollTriggers = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};

// Refresh ScrollTrigger (useful after dynamic content loads)
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
};
