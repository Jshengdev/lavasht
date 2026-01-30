import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins (client-side only)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Easing presets from Figma
export const easings = {
  fast: 'power2.out',           // 150ms ease-out
  normal: 'power2.out',         // 300ms ease-out
  spring: 'back.out(1.56)',     // cubic-bezier(0.34, 1.56, 0.64, 1)
  easeInOutBack: 'back.inOut(1.7)', // ease-in-out-back for tabs
};

// Framer Motion variants - for use in components
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
};

// Stagger container for product grids
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 100ms stagger from Figma
      delayChildren: 0.2,
    },
  },
};

// Stagger item
export const staggerItem = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// GSAP animation helpers
export function gsapFadeIn(element: Element, duration = 0.4): gsap.core.Tween {
  return gsap.fromTo(
    element,
    { opacity: 0 },
    { opacity: 1, duration, ease: 'power2.out' }
  );
}

export function gsapSlideDown(element: Element, duration = 0.5): gsap.core.Tween {
  return gsap.fromTo(
    element,
    { y: -100, opacity: 0 },
    { y: 0, opacity: 1, duration, ease: 'power3.out' }
  );
}

export function gsapFadeInUp(element: Element, duration = 0.6): gsap.core.Tween {
  return gsap.fromTo(
    element,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration, ease: 'power3.out' }
  );
}

export function gsapSlideFromLeft(element: Element, duration = 0.4): gsap.core.Tween {
  return gsap.fromTo(
    element,
    { x: -50, opacity: 0 },
    { x: 0, opacity: 1, duration, ease: 'power3.out' }
  );
}
