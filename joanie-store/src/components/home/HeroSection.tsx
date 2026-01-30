'use client';

import { useRef, useEffect, type ReactElement } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const SPRING_CONFIG = { damping: 25, stiffness: 150 };
const PARALLAX_INTENSITY = 0.05;

type CornerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

function CornerAccent({ position }: { position: CornerPosition }): ReactElement {
  const positionClasses: Record<CornerPosition, string> = {
    'top-left': 'top-[40px] left-[40px] border-l-2 border-t-2',
    'top-right': 'top-[40px] right-[40px] border-r-2 border-t-2',
    'bottom-left': 'bottom-[40px] left-[40px] border-l-2 border-b-2',
    'bottom-right': 'bottom-[40px] right-[40px] border-r-2 border-b-2',
  };

  return (
    <div
      className={`absolute w-[40px] h-[40px] border-[#333333]/20 ${positionClasses[position]}`}
    />
  );
}

function FeatureLabel({ position, text }: { position: 'top-left' | 'bottom-right'; text: string }): ReactElement {
  const positionClass = position === 'top-left'
    ? 'top-[60px] left-[60px]'
    : 'bottom-[60px] right-[60px]';

  return (
    <div className={`absolute ${positionClass} z-10`}>
      <span className="text-[14px] font-medium tracking-[2px] text-[#333333] uppercase">
        {text}
      </span>
    </div>
  );
}

export default function HeroSection(): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const x = useSpring(mouseX, SPRING_CONFIG);
  const y = useSpring(mouseY, SPRING_CONFIG);

  const rotateX = useTransform(y, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-5, 5]);
  const translateX = useTransform(x, [-0.5, 0.5], [-15, 15]);
  const translateY = useTransform(y, [-0.5, 0.5], [-15, 15]);
  const bgTranslateX = useTransform(x, [-0.5, 0.5], [10, -10]);
  const bgTranslateY = useTransform(y, [-0.5, 0.5], [10, -10]);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent): void {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const normalizedX = (e.clientX - centerX) / rect.width;
      const normalizedY = (e.clientY - centerY) / rect.height;

      mouseX.set(normalizedX * PARALLAX_INTENSITY);
      mouseY.set(normalizedY * PARALLAX_INTENSITY);
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section data-animate="hero" className="w-full flex justify-center py-[40px] bg-page-bg">
      <div
        ref={containerRef}
        className="relative w-[1090px] h-[578px] bg-[#F4F4F4] overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ x: bgTranslateX, y: bgTranslateY }}
        >
          <span
            className="text-[280px] font-bold text-[#E8E8E8] tracking-[20px]"
            style={{ WebkitTextStroke: '1px #DEDEDE' }}
          >
            SHOP
          </span>
        </motion.div>

        <FeatureLabel position="top-left" text="ADJUSTABLE" />
        <FeatureLabel position="bottom-right" text="SOFT PAD" />

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative w-[600px] h-[400px]"
            style={{
              rotateX,
              rotateY,
              translateX,
              translateY,
              transformStyle: 'preserve-3d',
            }}
            animate={{ y: [0, -10, 0] }}
            transition={{
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <Image
              src="/images/hero-shoe.svg"
              alt="Featured Shoe"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>
        </div>

        <CornerAccent position="top-left" />
        <CornerAccent position="top-right" />
        <CornerAccent position="bottom-left" />
        <CornerAccent position="bottom-right" />
      </div>
    </section>
  );
}
