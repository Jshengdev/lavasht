# 🎮 AGENT 4: EXPERIMENTAL (Hero Section)

## Project Context
You are building: **S'26 Dev Challenge - E-Commerce Store**
Tech Stack: Next.js 14 + TypeScript + Framer Motion

## Your Role
You are the EXPERIMENTAL specialist. You own the hero section with the 3D parallax shoe effect.

## Your Domain (ONLY modify these files)
```
/src/components/home/HeroSection.tsx
/src/components/home/HeroShoe3D.tsx
/public/images/hero-shoe.png (placeholder)
```

---

## IMPORTANT: Project Already Initialized

The Orchestrator has already created the Next.js project. You are working inside an existing project directory.

---

## FIGMA SPECS (PIXEL-PERFECT)

From `components.json -> hero`:
- **Container:** w-1090px, h-578px, bg #F4F4F4
- **Background text:** "SHOP" - large faded text behind shoe
- **Labels:**
  - "ADJUSTABLE" - top-left, fontSize 14px, fontWeight 500, letterSpacing 2px, color #333333
  - "SOFT PAD" - bottom-right, fontSize 14px, fontWeight 500, letterSpacing 2px, color #333333
- **Shoe image:** centered with 3D parallax effect

From `interactions.json -> heroShoeEffect`:
- **Float:** y: [0, -10, 0], duration 3s, repeat infinity, ease-in-out
- **Parallax:** intensity 0.05, damping 25, stiffness 150

---

## TASK 1: Create HeroSection (PIXEL-PERFECT)

Create `/src/components/home/HeroSection.tsx`:

```typescript
'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Figma specs:
// Container: w-1090px, h-578px, bg #F4F4F4
// Background text: "SHOP" - large faded
// Labels: ADJUSTABLE (top-left), SOFT PAD (bottom-right)
// Label style: fontSize 14px, fontWeight 500, letterSpacing 2px, color #333333
// Shoe: centered with parallax effect
// Float animation: y [0, -10, 0], duration 3s, infinite, ease-in-out
// Parallax: intensity 0.05, damping 25, stiffness 150

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth movement
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Transform mouse position to rotation/translation
  const rotateX = useTransform(y, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-5, 5]);
  const translateX = useTransform(x, [-0.5, 0.5], [-15, 15]);
  const translateY = useTransform(y, [-0.5, 0.5], [-15, 15]);

  // Background text parallax (moves opposite, slower)
  const bgTranslateX = useTransform(x, [-0.5, 0.5], [10, -10]);
  const bgTranslateY = useTransform(y, [-0.5, 0.5], [10, -10]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalize to -0.5 to 0.5
      const normalizedX = (e.clientX - centerX) / rect.width;
      const normalizedY = (e.clientY - centerY) / rect.height;

      mouseX.set(normalizedX * 0.05); // intensity 0.05
      mouseY.set(normalizedY * 0.05);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section data-animate="hero" className="w-full flex justify-center py-[40px] bg-page-bg">
      <div
        ref={containerRef}
        className="relative w-[1090px] h-[578px] bg-[#F4F4F4] overflow-hidden"
      >
        {/* Background "SHOP" Text */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            x: bgTranslateX,
            y: bgTranslateY,
          }}
        >
          <span
            className="text-[280px] font-bold text-[#E8E8E8] tracking-[20px]"
            style={{
              WebkitTextStroke: '1px #DEDEDE',
            }}
          >
            SHOP
          </span>
        </motion.div>

        {/* ADJUSTABLE Label - Top Left */}
        <div className="absolute top-[60px] left-[60px] z-10">
          <span className="text-[14px] font-medium tracking-[2px] text-[#333333] uppercase">
            ADJUSTABLE
          </span>
        </div>

        {/* SOFT PAD Label - Bottom Right */}
        <div className="absolute bottom-[60px] right-[60px] z-10">
          <span className="text-[14px] font-medium tracking-[2px] text-[#333333] uppercase">
            SOFT PAD
          </span>
        </div>

        {/* Hero Shoe with Parallax + Float */}
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
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              y: {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
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

        {/* Decorative corner accents (optional - if in Figma) */}
        <div className="absolute top-[40px] left-[40px] w-[40px] h-[40px] border-l-2 border-t-2 border-[#333333]/20" />
        <div className="absolute top-[40px] right-[40px] w-[40px] h-[40px] border-r-2 border-t-2 border-[#333333]/20" />
        <div className="absolute bottom-[40px] left-[40px] w-[40px] h-[40px] border-l-2 border-b-2 border-[#333333]/20" />
        <div className="absolute bottom-[40px] right-[40px] w-[40px] h-[40px] border-r-2 border-b-2 border-[#333333]/20" />
      </div>
    </section>
  );
}
```

## TASK 2: Create Placeholder Hero Image

Since we don't have the actual shoe image exported, create a placeholder or use a stock image.

Save to `/public/images/hero-shoe.png`

You can use any high-quality shoe PNG with transparent background. The image should:
- Be a side-profile view of a sneaker
- Have transparent background
- Be high resolution (at least 800px wide)

For now, you can create a simple placeholder:

```bash
# Create placeholder directory if not exists
mkdir -p public/images
```

Then either:
1. Download a stock shoe image
2. Use a placeholder service
3. Create a simple colored rectangle as placeholder

## TASK 3: Update Home Page to Include Hero

Update `/src/app/(store)/page.tsx` to include the HeroSection:

```typescript
import HeroSection from '@/components/home/HeroSection';
import ValueProps from '@/components/home/ValueProps';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section with 3D Shoe */}
      <HeroSection />

      {/* Product Section will be added by integration */}
      <section className="py-[60px]">
        <div className="mx-auto max-w-content px-[20px]">
          <p className="text-center text-text-secondary">
            Product grid will be added here
          </p>
        </div>
      </section>

      {/* Value Props */}
      <ValueProps />
    </div>
  );
}
```

## TASK 4: Alternative - Advanced 3D with Three.js (OPTIONAL)

If you want a more advanced depth-map based 3D effect, install Three.js:

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

Create `/src/components/home/HeroShoe3D.tsx`:

```typescript
'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  uniform sampler2D uDepthMap;
  uniform float uDisplacementScale;
  uniform vec2 uMouse;

  void main() {
    vUv = uv;
    vec4 depthColor = texture2D(uDepthMap, uv);
    float displacement = depthColor.r * uDisplacementScale;
    vec2 mouseInfluence = (uMouse - 0.5) * 0.1;
    vec3 newPosition = position;
    newPosition.z += displacement;
    newPosition.x += mouseInfluence.x * displacement;
    newPosition.y += mouseInfluence.y * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;

  void main() {
    vec4 color = texture2D(uTexture, vUv);
    gl_FragColor = color;
  }
`;

function ShoeImage() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  const [shoeTexture, depthTexture] = useTexture([
    '/images/hero-shoe.png',
    '/images/hero-shoe-depth.png',
  ]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uMouse.value.set(mouse.x, mouse.y);
    }
  });

  const aspect = shoeTexture.image ? shoeTexture.image.width / shoeTexture.image.height : 1;
  const planeWidth = 4;
  const planeHeight = planeWidth / aspect;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[planeWidth, planeHeight, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTexture: { value: shoeTexture },
          uDepthMap: { value: depthTexture },
          uDisplacementScale: { value: 0.3 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        }}
        transparent
      />
    </mesh>
  );
}

export default function HeroShoe3D() {
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebGLSupported(!!gl);
    } catch {
      setWebGLSupported(false);
    }
  }, []);

  if (!webGLSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <img src="/images/hero-shoe.png" alt="Hero Shoe" className="max-w-full max-h-full object-contain" />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <ShoeImage />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

**Note:** The Three.js version requires a depth map image (`hero-shoe-depth.png`). The Framer Motion version (TASK 1) works without it.

---

## Validation Checklist

```bash
# TypeScript compiles
npx tsc --noEmit

# Dev server runs
npm run dev

# Check hero section displays:
# - Large faded "SHOP" background text
# - Shoe image centered with parallax on mouse move
# - Floating animation (subtle up/down)
# - "ADJUSTABLE" label top-left
# - "SOFT PAD" label bottom-right
```

---

## Files Created

When complete, you should have created:
- `/src/components/home/HeroSection.tsx`
- `/src/components/home/HeroShoe3D.tsx` (optional Three.js version)
- `/public/images/hero-shoe.png` (placeholder)
