'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for mouse movement
  const x = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const y = useSpring(mouseY, { damping: 25, stiffness: 150 });

  // Transform mouse position to rotation/translation values
  const rotateX = useTransform(y, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-5, 5]);
  const translateX = useTransform(x, [-0.5, 0.5], [-15, 15]);
  const translateY = useTransform(y, [-0.5, 0.5], [-15, 15]);
  const bgTranslateX = useTransform(x, [-0.5, 0.5], [10, -10]);
  const bgTranslateY = useTransform(y, [-0.5, 0.5], [10, -10]);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const normalizedX = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const normalizedY = (e.clientY - rect.top - rect.height / 2) / rect.height;
      mouseX.set(normalizedX * 0.05);
      mouseY.set(normalizedY * 0.05);
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section data-animate="hero" className="w-full flex justify-center bg-white">
      <div ref={containerRef} className="relative w-[1090px] h-[578px] bg-white overflow-hidden">
        {/* Background Text */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ x: bgTranslateX, y: bgTranslateY }}
        >
          <span
            className="text-[300px] font-bold text-[#E8E8E8] leading-none"
            style={{ fontFamily: 'var(--font-teko), sans-serif' }}
          >
            SHOP ALL
          </span>
        </motion.div>

        {/* Labels */}
        <div className="absolute top-[37px] left-[209px]">
          <span className="text-2xl text-[#333333] uppercase tracking-[0.15em]" style={{ fontFamily: 'Teko, sans-serif' }}>
            ADJUSTABLE
          </span>
        </div>
        <div className="absolute top-[469px] left-[876px]">
          <span className="text-2xl text-[#333333] uppercase tracking-[0.15em]" style={{ fontFamily: 'Teko, sans-serif' }}>
            SOFT PAD
          </span>
        </div>

        {/* Hero Shoe */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative w-[700px] h-[500px]"
            style={{ rotateX, rotateY, translateX, translateY, transformStyle: 'preserve-3d' }}
            animate={{ y: [0, -10, 0] }}
            transition={{ y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <Image
              src="/images/hero-shoe.png"
              alt="Featured Shoe"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
