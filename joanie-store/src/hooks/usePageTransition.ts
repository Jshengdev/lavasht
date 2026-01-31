'use client';

import { useTransition } from '@/components/animations/TransitionContext';

export function usePageTransition() {
  const { transitionTo, isTransitioning } = useTransition();

  return {
    transitionTo,
    isTransitioning,
  };
}
