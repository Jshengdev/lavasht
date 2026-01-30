# 🎮 AGENT 4: EXPERIMENTAL (Three.js)

## Project Context
You are building: **S'26 Dev Challenge - E-Commerce Store**
Tech Stack: Next.js 14 + TypeScript + Three.js + React Three Fiber

## Your Role
You are the EXPERIMENTAL specialist. You own the 3D depth effect for the hero shoe.

## Your Domain (ONLY modify these files)
```
/src/components/home/HeroShoe3D.tsx
/public/images/hero-shoe.png
/public/images/hero-shoe-depth.png
```

---

## 🎨 FIGMA DESIGN REFERENCE (CRITICAL)

**Read these files for hero section specifications:**

```
/design-system/components.json       # Hero section specs
/design-system/interactions.json     # Animation specs (if available)
```

### Hero Shoe Specifications
From `components.json -> hero`:
- `hero.shoeImage.width` - Exact width of shoe display area
- `hero.shoeImage.height` - Exact height
- `hero.decorativeFrame` - Border/frame styling around shoe
- `hero.backgroundText` - The large "SHOP" text specs
- `hero.labels` - Position and style of "ADJUSTABLE", "SOFT PAD" labels
- `hero.brandBadge` - The "sania" badge (or whatever text is shown)

### Asset Source
The hero shoe image has been exported by Agent 0:
- **Primary image:** `/public/images/hero-shoe.png` (already exported)
- **Depth map:** You may need to generate `/public/images/hero-shoe-depth.png`

### 3D Effect Guidelines
1. **Match the Figma composition** - The 3D effect should enhance, not change the layout
2. **Use exact positioning** - Read frame insets, label positions from Figma
3. **Fallback must match static design** - When WebGL fails, show the static Figma layout
4. **Subtle is better** - The parallax/depth effect should be elegant, not distracting

### Animation Specs (if in Figma prototypes)
Read from `interactions.json`:
- Floating animation speed/amplitude
- Parallax intensity
- Entrance animation timing

---

## TASK 0: Install Three.js Dependencies

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

## TASK 1: Create Depth Map

You'll need two images:
1. **hero-shoe.png** - The actual shoe image (get from Figma or use placeholder)
2. **hero-shoe-depth.png** - A grayscale depth map where:
   - White = closest to viewer
   - Black = farthest from viewer

For now, create a placeholder or use AI to generate a depth map from the shoe image.

## TASK 2: Create HeroShoe3D Component

Create `/src/components/home/HeroShoe3D.tsx`:

```typescript
'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Displacement shader material
const vertexShader = `
  varying vec2 vUv;
  uniform sampler2D uDepthMap;
  uniform float uDisplacementScale;
  uniform vec2 uMouse;

  void main() {
    vUv = uv;

    vec4 depthColor = texture2D(uDepthMap, uv);
    float displacement = depthColor.r * uDisplacementScale;

    // Add mouse influence
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
  const { size } = useThree();

  // Load textures
  const [shoeTexture, depthTexture] = useTexture([
    '/images/hero-shoe.png',
    '/images/hero-shoe-depth.png',
  ]);

  // Mouse tracking
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

  // Floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uMouse.value.set(mouse.x, mouse.y);
    }
  });

  // Calculate aspect ratio
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

// Fallback for non-WebGL
function Fallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <img
        src="/images/hero-shoe.png"
        alt="Hero Shoe"
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
}

// Loading state
function LoadingShoe() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 animate-pulse">
      <div className="text-gray-400">Loading...</div>
    </div>
  );
}

export default function HeroShoe3D() {
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebGLSupported(!!gl);
    } catch {
      setWebGLSupported(false);
    }
  }, []);

  if (!webGLSupported) {
    return <Fallback />;
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <ShoeImage />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

## TASK 3: Create Simpler Alternative (If Shaders Too Complex)

If the shader approach is too complex, here's a simpler CSS-based parallax:

Create `/src/components/home/HeroShoe3DSimple.tsx`:

```typescript
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function HeroShoe3DSimple() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);
  const translateX = useTransform(x, [-0.5, 0.5], [-20, 20]);
  const translateY = useTransform(y, [-0.5, 0.5], [-20, 20]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      mouseX.set((e.clientX - centerX) / rect.width);
      mouseY.set((e.clientY - centerY) / rect.height);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center perspective-1000"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          translateX,
          translateY,
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
        className="relative w-[80%] h-[80%]"
      >
        <Image
          src="/images/hero-shoe.png"
          alt="Hero Shoe"
          fill
          className="object-contain drop-shadow-2xl"
          priority
        />
      </motion.div>
    </div>
  );
}
```

## TASK 4: Add Placeholder Image

Create a placeholder shoe image or download one. Save to `/public/images/hero-shoe.png`.

For the depth map, you can:
1. Use an AI tool to generate a depth map from the image
2. Create a simple grayscale version in an image editor
3. Use a solid gray placeholder initially

---

## Validation Checklist

```bash
# TypeScript compiles
npx tsc --noEmit

# Test in browser - WebGL renders
npm run dev
# Check browser console for WebGL errors
```

---

## Output

When complete:
```bash
git checkout -b feature/experimental
git add .
git commit -m "experimental: Create HeroShoe3D with depth map parallax effect"
touch .done-experimental
git add .done-experimental
git commit -m "experimental: Signal completion"
git push origin feature/experimental
```
