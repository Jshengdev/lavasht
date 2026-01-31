'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { LOGO_PATHS } from '@/components/ui/Logo';

const GHOST_COUNT = 8;

export default function PageTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const topChevronRef = useRef<SVGPathElement>(null);
  const bottomChevronRef = useRef<SVGPathElement>(null);
  const topGhostsRef = useRef<(SVGPathElement | null)[]>([]);
  const bottomGhostsRef = useRef<(SVGPathElement | null)[]>([]);
  const blurTopRef = useRef<SVGFEGaussianBlurElement>(null);
  const blurBottomRef = useRef<SVGFEGaussianBlurElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const container = containerRef.current;
    const topChevron = topChevronRef.current;
    const bottomChevron = bottomChevronRef.current;
    const topGhosts = topGhostsRef.current.filter(Boolean) as SVGPathElement[];
    const bottomGhosts = bottomGhostsRef.current.filter(Boolean) as SVGPathElement[];
    const blurTop = blurTopRef.current;
    const blurBottom = blurBottomRef.current;

    if (!container || !topChevron || !bottomChevron) return;

    // Initial state - main chevrons hidden, will be revealed when ghosts settle
    gsap.set(container, { display: 'flex', opacity: 1 });
    gsap.set([topChevron, bottomChevron], { opacity: 0, scale: 0.9 });
    if (blurTop) gsap.set(blurTop, { attr: { stdDeviation: '0,0' } });
    if (blurBottom) gsap.set(blurBottom, { attr: { stdDeviation: '0,0' } });

    // Ghosts start scattered along spiral - will converge to center
    topGhosts.forEach((ghost, i) => {
      const progress = (i + 1) / GHOST_COUNT;
      const angle = progress * Math.PI * 2; // Full spiral
      const distance = 80 + (progress * 150);
      const x = Math.cos(angle - Math.PI / 3) * distance;
      const y = Math.sin(angle - Math.PI / 3) * distance - (progress * 40);
      const blur = 6 + (progress * 18);

      gsap.set(ghost, {
        x,
        y,
        rotation: progress * 25,
        opacity: 0,
        scale: 0.7 + (progress * 0.2),
        attr: { filter: `url(#ghost-blur-${Math.round(blur)})` }
      });
    });

    bottomGhosts.forEach((ghost, i) => {
      const progress = (i + 1) / GHOST_COUNT;
      const angle = progress * Math.PI * 2;
      const distance = 80 + (progress * 150);
      const x = -Math.cos(angle - Math.PI / 3) * distance;
      const y = -Math.sin(angle - Math.PI / 3) * distance + (progress * 40);
      const blur = 6 + (progress * 18);

      gsap.set(ghost, {
        x,
        y,
        rotation: -progress * 25,
        opacity: 0,
        scale: 0.7 + (progress * 0.2),
        attr: { filter: `url(#ghost-blur-${Math.round(blur)})` }
      });
    });

    const tl = gsap.timeline({
      delay: 0.1,
      onComplete: () => { gsap.set(container, { display: 'none' }); },
    });

    // ═══════════════════════════════════════════════════════════
    // PHASE 1: GHOSTS APPEAR AND SPIRAL INWARD (~0.5s)
    // Outer ghosts appear first, cascade inward
    // ═══════════════════════════════════════════════════════════

    // Fade in ghosts from outer to inner
    [...topGhosts].reverse().forEach((ghost, i) => {
      tl.to(ghost, {
        opacity: 0.7 - (i / GHOST_COUNT) * 0.4,
        duration: 0.08,
        ease: 'power2.out',
      }, i * 0.02);
    });

    [...bottomGhosts].reverse().forEach((ghost, i) => {
      tl.to(ghost, {
        opacity: 0.7 - (i / GHOST_COUNT) * 0.4,
        duration: 0.08,
        ease: 'power2.out',
      }, 0.015 + i * 0.02);
    });

    // Spiral inward - all ghosts converge to center
    topGhosts.forEach((ghost, i) => {
      const progress = (i + 1) / GHOST_COUNT;
      // Intermediate position - tighter spiral
      const midProgress = progress * 0.4;
      const midAngle = midProgress * Math.PI * 1.5;
      const midDistance = 30 + (midProgress * 40);
      const midX = Math.cos(midAngle - Math.PI / 4) * midDistance;
      const midY = Math.sin(midAngle - Math.PI / 4) * midDistance - 10;

      tl.to(ghost, {
        x: midX,
        y: midY,
        rotation: progress * 8,
        scale: 0.95,
        duration: 0.25,
        ease: 'power2.inOut',
      }, 0.1 + (GHOST_COUNT - i - 1) * 0.015);
    });

    bottomGhosts.forEach((ghost, i) => {
      const progress = (i + 1) / GHOST_COUNT;
      const midProgress = progress * 0.4;
      const midAngle = midProgress * Math.PI * 1.5;
      const midDistance = 30 + (midProgress * 40);
      const midX = -Math.cos(midAngle - Math.PI / 4) * midDistance;
      const midY = -Math.sin(midAngle - Math.PI / 4) * midDistance + 10;

      tl.to(ghost, {
        x: midX,
        y: midY,
        rotation: -progress * 8,
        scale: 0.95,
        duration: 0.25,
        ease: 'power2.inOut',
      }, 0.115 + (GHOST_COUNT - i - 1) * 0.015);
    });

    // ═══════════════════════════════════════════════════════════
    // PHASE 2: GHOSTS SETTLE INTO MAIN SHAPE (~0.3s)
    // All converge to exact center position
    // ═══════════════════════════════════════════════════════════

    // Ghosts collapse to center with decreasing blur
    topGhosts.forEach((ghost, i) => {
      tl.to(ghost, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        attr: { filter: 'url(#ghost-blur-2)' },
        duration: 0.2,
        ease: 'power3.out',
      }, 0.35 + i * 0.01);
    });

    bottomGhosts.forEach((ghost, i) => {
      tl.to(ghost, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        attr: { filter: 'url(#ghost-blur-2)' },
        duration: 0.2,
        ease: 'power3.out',
      }, 0.36 + i * 0.01);
    });

    // ═══════════════════════════════════════════════════════════
    // PHASE 3: MAIN CHEVRONS SOLIDIFY (~0.15s)
    // Ghosts fade as main shape appears crisp
    // ═══════════════════════════════════════════════════════════

    // Main chevrons fade in and scale to full
    tl.to(topChevron, {
      opacity: 1,
      scale: 1,
      duration: 0.15,
      ease: 'power2.out',
    }, 0.5);

    tl.to(bottomChevron, {
      opacity: 1,
      scale: 1,
      duration: 0.15,
      ease: 'power2.out',
    }, 0.52);

    // Ghosts fade out as main appears
    tl.to([...topGhosts, ...bottomGhosts], {
      opacity: 0,
      duration: 0.12,
      ease: 'power2.in',
    }, 0.55);

    // ═══════════════════════════════════════════════════════════
    // PHASE 4: BRIEF HOLD THEN DEPART (~0.5s)
    // Clean exit with motion blur
    // ═══════════════════════════════════════════════════════════

    // Small pause at assembled state
    tl.to({}, { duration: 0.1 }, 0.65);

    // Depart
    tl.to(topChevron, {
      x: 150,
      y: -170,
      rotation: 10,
      opacity: 0,
      duration: 0.45,
      ease: 'power2.in',
    }, 0.75);

    tl.to(bottomChevron, {
      x: -150,
      y: 170,
      rotation: -10,
      opacity: 0,
      duration: 0.45,
      ease: 'power2.in',
    }, 0.78);

    // Blur ramps with velocity
    if (blurTop) {
      tl.to(blurTop, { attr: { stdDeviation: '4,0.5' }, duration: 0.1, ease: 'power2.in' }, 0.75)
        .to(blurTop, { attr: { stdDeviation: '12,2' }, duration: 0.15, ease: 'power2.in' }, 0.85)
        .to(blurTop, { attr: { stdDeviation: '20,3' }, duration: 0.15, ease: 'power3.in' }, 1.0);
    }

    if (blurBottom) {
      tl.to(blurBottom, { attr: { stdDeviation: '4,0.5' }, duration: 0.1, ease: 'power2.in' }, 0.78)
        .to(blurBottom, { attr: { stdDeviation: '12,2' }, duration: 0.15, ease: 'power2.in' }, 0.88)
        .to(blurBottom, { attr: { stdDeviation: '20,3' }, duration: 0.15, ease: 'power3.in' }, 1.03);
    }

    // Container fade
    tl.to(container, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.inOut',
    }, 1.05);

  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ display: 'none', background: 'linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 100%)' }}
      aria-hidden="true"
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <svg
        width="120"
        height="120"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Main chevron blur */}
          <filter id="blur-top-main" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur ref={blurTopRef} in="SourceGraphic" stdDeviation="0,0" />
          </filter>
          <filter id="blur-bottom-main" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur ref={blurBottomRef} in="SourceGraphic" stdDeviation="0,0" />
          </filter>

          {/* Ghost blur levels */}
          {[2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24].map(blur => (
            <filter key={blur} id={`ghost-blur-${blur}`} x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={`${blur},${blur * 0.25}`} />
            </filter>
          ))}
        </defs>

        {/* Ghost trails - Top (render behind main) */}
        {Array.from({ length: GHOST_COUNT }).map((_, i) => (
          <path
            key={`top-ghost-${i}`}
            ref={el => { topGhostsRef.current[i] = el; }}
            d={LOGO_PATHS.top}
            fill="white"
            opacity={0}
            style={{ transformOrigin: '50px 22px' }}
          />
        ))}

        {/* Ghost trails - Bottom */}
        {Array.from({ length: GHOST_COUNT }).map((_, i) => (
          <path
            key={`bottom-ghost-${i}`}
            ref={el => { bottomGhostsRef.current[i] = el; }}
            d={LOGO_PATHS.bottom}
            fill="white"
            opacity={0}
            style={{ transformOrigin: '50px 77px' }}
          />
        ))}

        {/* Main chevrons (render on top) */}
        <path
          ref={topChevronRef}
          d={LOGO_PATHS.top}
          fill="white"
          filter="url(#blur-top-main)"
          style={{ transformOrigin: '50px 22px' }}
        />
        <path
          ref={bottomChevronRef}
          d={LOGO_PATHS.bottom}
          fill="white"
          filter="url(#blur-bottom-main)"
          style={{ transformOrigin: '50px 77px' }}
        />
      </svg>
    </div>
  );
}
