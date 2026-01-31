'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  animationPresets,
  durations,
  easings,
  staggerSettings,
  scrollTriggerDefaults,
  prefersReducedMotion,
  killAllScrollTriggers,
} from '@/lib/animations';

// Register plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Hook for scroll-triggered reveal animations
export function useScrollReveal<T extends HTMLElement>(
  options: {
    preset?: keyof typeof animationPresets;
    duration?: number;
    delay?: number;
    ease?: string;
    start?: string;
  } = {}
) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefersReducedMotion()) {
      if (element) gsap.set(element, { opacity: 1, y: 0 });
      return;
    }

    const preset = options.preset || 'fadeUp';
    const animation = animationPresets[preset];

    gsap.set(element, animation.from);

    const trigger = gsap.to(element, {
      ...animation.to,
      duration: options.duration || durations.normal,
      delay: options.delay || 0,
      ease: options.ease || easings.smooth,
      scrollTrigger: {
        trigger: element,
        start: options.start || scrollTriggerDefaults.start,
        toggleActions: scrollTriggerDefaults.toggleActions,
      },
    });

    return () => {
      trigger.scrollTrigger?.kill();
      trigger.kill();
    };
  }, [options.preset, options.duration, options.delay, options.ease, options.start]);

  return elementRef;
}

// Hook for staggered animations on child elements
export function useStaggerAnimation<T extends HTMLElement>(
  selector: string,
  options: {
    preset?: keyof typeof animationPresets;
    stagger?: number;
    duration?: number;
    ease?: string;
    start?: string;
  } = {}
) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll(selector);
    if (!elements.length) return;

    if (prefersReducedMotion()) {
      gsap.set(elements, { opacity: 1, y: 0 });
      return;
    }

    const preset = options.preset || 'fadeUp';
    const animation = animationPresets[preset];

    gsap.set(elements, animation.from);

    const tl = gsap.to(elements, {
      ...animation.to,
      duration: options.duration || durations.normal,
      stagger: options.stagger || staggerSettings.normal,
      ease: options.ease || easings.smooth,
      scrollTrigger: {
        trigger: container,
        start: options.start || scrollTriggerDefaults.start,
        toggleActions: scrollTriggerDefaults.toggleActions,
      },
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [selector, options.preset, options.stagger, options.duration, options.ease, options.start]);

  return containerRef;
}

// Hook for page entrance animations (no scroll trigger)
export function usePageEntrance<T extends HTMLElement>(
  selector: string,
  options: {
    stagger?: number;
    duration?: number;
    delay?: number;
    ease?: string;
  } = {}
) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll(selector);
    if (!elements.length) return;

    if (prefersReducedMotion()) {
      gsap.set(elements, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(elements, { opacity: 0, y: 20 });

    const tl = gsap.to(elements, {
      opacity: 1,
      y: 0,
      duration: options.duration || durations.normal,
      stagger: options.stagger || staggerSettings.normal,
      delay: options.delay || 0.2,
      ease: options.ease || easings.smooth,
    });

    return () => {
      tl.kill();
    };
  }, [selector, options.stagger, options.duration, options.delay, options.ease]);

  return containerRef;
}

// Hook for manual GSAP timeline control
export function useGSAPTimeline() {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const createTimeline = useCallback((options?: gsap.TimelineVars) => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    timelineRef.current = gsap.timeline(options);
    return timelineRef.current;
  }, []);

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  return { timeline: timelineRef.current, createTimeline };
}

// Hook to clean up all ScrollTriggers on unmount
export function useScrollTriggerCleanup() {
  useEffect(() => {
    return () => {
      killAllScrollTriggers();
    };
  }, []);
}
