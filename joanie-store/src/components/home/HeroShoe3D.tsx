'use client';

import { useRef, useState, useEffect, Suspense, type ReactElement } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const VERTEX_SHADER = `
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

const FRAGMENT_SHADER = `
  varying vec2 vUv;
  uniform sampler2D uTexture;

  void main() {
    vec4 color = texture2D(uTexture, vUv);
    gl_FragColor = color;
  }
`;

const PLANE_WIDTH = 4;
const DEFAULT_ASPECT = 1.6;
const DISPLACEMENT_SCALE = 0.3;

function ShoeImage(): ReactElement {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  const [shoeTexture, depthTexture] = useTexture([
    '/images/hero-shoe.svg',
    '/images/hero-shoe-depth.svg',
  ]);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent): void {
      setMouse({
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      });
    }
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

  const image = shoeTexture.image as HTMLImageElement | undefined;
  const aspect = image?.width && image?.height ? image.width / image.height : DEFAULT_ASPECT;
  const planeHeight = PLANE_WIDTH / aspect;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[PLANE_WIDTH, planeHeight, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={{
          uTexture: { value: shoeTexture },
          uDepthMap: { value: depthTexture },
          uDisplacementScale: { value: DISPLACEMENT_SCALE },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        }}
        transparent
      />
    </mesh>
  );
}

function FallbackImage(): ReactElement {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero-shoe.svg"
        alt="Hero Shoe"
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
}

export default function HeroShoe3D(): ReactElement {
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
    return <FallbackImage />;
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
