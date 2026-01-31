'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { LOGO_PATHS } from '@/components/ui/Logo';

// Animation timing constants
const ANIMATION = {
  BLUR_DURATION: 0.42,
  PANEL_DURATION: 0.4,
  STAGGER_DELAY: 0.04,
  LOGO_HOLD_MS: 100,
  NAVIGATION_DELAY_MS: 50,
  EASE: 'expo.inOut',
} as const;

interface TransitionContextType {
  isTransitioning: boolean;
  transitionTo: (href: string) => void;
}

interface TransitionProviderProps {
  children: React.ReactNode;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function TransitionProvider({ children }: TransitionProviderProps): React.ReactElement {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const leftBlurRef = useRef<HTMLDivElement>(null);
  const rightBlurRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  const transitionTo = useCallback(async (href: string) => {
    if (isTransitioning) return;

    const leftBlur = leftBlurRef.current;
    const rightBlur = rightBlurRef.current;
    const leftPanel = leftPanelRef.current;
    const rightPanel = rightPanelRef.current;

    if (!leftPanel || !rightPanel || !leftBlur || !rightBlur) {
      router.push(href);
      return;
    }

    setIsTransitioning(true);

    // Initialize panel positions
    gsap.set(leftBlur, { xPercent: -100, display: 'block' });
    gsap.set(rightBlur, { xPercent: 100, display: 'block' });
    gsap.set(leftPanel, { xPercent: -100, display: 'flex' });
    gsap.set(rightPanel, { xPercent: 100, display: 'flex' });

    // Close animation: blur leads, panels follow
    const closeTl = gsap.timeline();
    closeTl
      .to([leftBlur, rightBlur], {
        xPercent: 0,
        duration: ANIMATION.BLUR_DURATION,
        ease: ANIMATION.EASE,
      }, 0)
      .to([leftPanel, rightPanel], {
        xPercent: 0,
        duration: ANIMATION.PANEL_DURATION,
        ease: ANIMATION.EASE,
      }, ANIMATION.STAGGER_DELAY);

    await closeTl;
    await delay(ANIMATION.LOGO_HOLD_MS);

    router.push(href);
    await delay(ANIMATION.NAVIGATION_DELAY_MS);

    // Open animation: panels lead, blur trails
    const openTl = gsap.timeline();
    openTl
      .to(leftPanel, {
        xPercent: -100,
        duration: ANIMATION.PANEL_DURATION,
        ease: ANIMATION.EASE,
      }, 0)
      .to(rightPanel, {
        xPercent: 100,
        duration: ANIMATION.PANEL_DURATION,
        ease: ANIMATION.EASE,
      }, 0)
      .to(leftBlur, {
        xPercent: -100,
        duration: ANIMATION.BLUR_DURATION,
        ease: ANIMATION.EASE,
      }, ANIMATION.STAGGER_DELAY)
      .to(rightBlur, {
        xPercent: 100,
        duration: ANIMATION.BLUR_DURATION,
        ease: ANIMATION.EASE,
      }, ANIMATION.STAGGER_DELAY);

    await openTl;

    gsap.set([leftPanel, rightPanel, leftBlur, rightBlur], { display: 'none' });
    setIsTransitioning(false);
  }, [isTransitioning, router]);

  const blurStyle = {
    display: 'none' as const,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  };

  const leftBlurStyle = {
    ...blurStyle,
    background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.2) 70%, rgba(255,255,255,0.35) 100%)',
  };

  const rightBlurStyle = {
    ...blurStyle,
    background: 'linear-gradient(to left, transparent 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.2) 70%, rgba(255,255,255,0.35) 100%)',
  };

  const leftPanelStyle = {
    display: 'none' as const,
    background: 'linear-gradient(to right, white 70%, rgba(255,255,255,0.95) 85%, rgba(255,255,255,0.7) 100%)',
  };

  const rightPanelStyle = {
    display: 'none' as const,
    background: 'linear-gradient(to left, white 70%, rgba(255,255,255,0.95) 85%, rgba(255,255,255,0.7) 100%)',
  };

  return (
    <TransitionContext.Provider value={{ isTransitioning, transitionTo }}>
      {children}

      <div
        ref={leftBlurRef}
        className="fixed inset-y-0 left-0 w-[55%] z-[9998]"
        style={leftBlurStyle}
        aria-hidden="true"
      />

      <div
        ref={rightBlurRef}
        className="fixed inset-y-0 right-0 w-[55%] z-[9998]"
        style={rightBlurStyle}
        aria-hidden="true"
      />

      <div
        ref={leftPanelRef}
        className="fixed inset-y-0 left-0 w-1/2 z-[9999] flex items-center justify-end"
        style={leftPanelStyle}
        aria-hidden="true"
      >
        <svg
          width="28"
          height="16"
          viewBox="15 60 70 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginRight: '-1px', marginTop: '16px' }}
        >
          <path d={LOGO_PATHS.bottom} fill="#333333" />
        </svg>
      </div>

      <div
        ref={rightPanelRef}
        className="fixed inset-y-0 right-0 w-1/2 z-[9999] flex items-center justify-start"
        style={rightPanelStyle}
        aria-hidden="true"
      >
        <svg
          width="28"
          height="16"
          viewBox="15 5 70 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginLeft: '-1px', marginTop: '-16px' }}
        >
          <path d={LOGO_PATHS.top} fill="#333333" />
        </svg>
      </div>
    </TransitionContext.Provider>
  );
}

export function useTransition(): TransitionContextType {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
}
