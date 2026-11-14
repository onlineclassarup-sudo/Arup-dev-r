'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { soundFx } from '@/lib/audio';

type AvatarBehavior = 'idle' | 'angry_walking' | 'sitting' | 'lying_down';

interface AvatarProps {
  scrollOffset: number;
  compact?: boolean;
  onBehaviorChange: (b: AvatarBehavior, text: string) => void;
}

// ----------------------------------------------------------------------
// High-End, Authentic Roblox Developer Avatar (R6 Proportions, Hoodie,
// Backward Cap, Studio Headset, Expressive Face, High-Tops & Shadow)
// ----------------------------------------------------------------------
function RobloxDeveloperAvatar({
  scrollOffset,
  compact = false,
  onBehaviorChange,
}: AvatarProps) {
  const rootRef = useRef<THREE.Group>(null!);
  const headGroup = useRef<THREE.Group>(null!);
  const torsoGroup = useRef<THREE.Group>(null!);
  const leftShoulder = useRef<THREE.Group>(null!);
  const rightShoulder = useRef<THREE.Group>(null!);
  const leftHip = useRef<THREE.Group>(null!);
  const rightHip = useRef<THREE.Group>(null!);

  const [behavior, setBehavior] = useState<AvatarBehavior>('idle');
  const behaviorRef = useRef<AvatarBehavior>('idle');
  behaviorRef.current = behavior;

  // Walk and position kinetics
  const walkClock = useRef(0);
  const posX = useRef(0);
  const targetPosX = useRef(0);
  const walkDir = useRef(1);

  // --------------------------------------------------------------------
  // Materials - Carefully Tuned for Contrast against dark grid
  // --------------------------------------------------------------------
  const skinMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffdfba',
        roughness: 0.45,
        metalness: 0.05,
      }),
    []
  );

  const hoodieMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1e2433',
        roughness: 0.35,
        metalness: 0.15,
      }),
    []
  );

  const whiteAccent = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.2,
        metalness: 0.1,
      }),
    []
  );

  const capMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#11131a',
        roughness: 0.3,
        metalness: 0.4,
      }),
    []
  );

  const pantsMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#282d3c',
        roughness: 0.45,
        metalness: 0.1,
      }),
    []
  );

  const glowMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        emissive: '#0284c7',
        emissiveIntensity: 1.2,
        roughness: 0.15,
      }),
    []
  );

  const eyeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0f172a',
        roughness: 0.2,
      }),
    []
  );

  const shadowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#000000',
        transparent: true,
        opacity: 0.45,
      }),
    []
  );

  // --------------------------------------------------------------------
  // Interactions: Mouse / Tap Enter -> Angry Walk | Leave -> Instant Normal
  // --------------------------------------------------------------------
  const handlePointerEnter = (e: any) => {
    e.stopPropagation();
    soundFx.playHover();
    setBehavior('angry_walking');
    onBehaviorChange('angry_walking', compact ? '😡 Hey!' : '😡 Hey! Don’t touch me!');

    walkDir.current = posX.current >= 0 ? -1 : 1;
    targetPosX.current = walkDir.current * (compact ? 0.7 : 1.5);
  };

  const handlePointerLeave = (e: any) => {
    e.stopPropagation();
    soundFx.playClick();
    setBehavior('idle');
    onBehaviorChange('idle', compact ? '👋 Tap me!' : 'Hover over me if you dare!');
    targetPosX.current = 0;
  };

  // --------------------------------------------------------------------
  // Animation Frame Loop
  // --------------------------------------------------------------------
  useFrame((state, delta) => {
    if (!rootRef.current) return;
    const t = state.clock.elapsedTime;

    // SCROLL REACTION: Sit or lie down when scrolling down
    if (scrollOffset > 40) {
      if (behaviorRef.current === 'idle') {
        const isLying = scrollOffset > 150;
        setBehavior(isLying ? 'lying_down' : 'sitting');
        onBehaviorChange(
          isLying ? 'lying_down' : 'sitting',
          compact
            ? isLying
              ? '💤 Sleep'
              : '🪑 Sit'
            : isLying
            ? '💤 Sleeping... (Lying down)'
            : '🪑 Sitting down...'
        );
      }
    } else if (
      behaviorRef.current === 'lying_down' ||
      behaviorRef.current === 'sitting'
    ) {
      setBehavior('idle');
      onBehaviorChange('idle', compact ? '👋 Tap me!' : 'Hover over me if you dare!');
    }

    // 1. ANGRY WALKING
    if (behaviorRef.current === 'angry_walking') {
      walkClock.current += delta;

      glowMaterial.color.set('#ff2247');
      glowMaterial.emissive.set('#dc2626');
      glowMaterial.emissiveIntensity = 1.8;

      if (headGroup.current) {
        headGroup.current.rotation.y = Math.sin(t * 24) * 0.28;
        headGroup.current.rotation.z = Math.cos(t * 18) * 0.08;
      }

      const targetFacing = walkDir.current > 0 ? Math.PI / 2 : -Math.PI / 2;
      rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, targetFacing, 0.18);
      rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, 0.1, 0.1);

      posX.current = THREE.MathUtils.lerp(posX.current, targetPosX.current, 0.05);
      rootRef.current.position.x = posX.current;
      rootRef.current.position.y = Math.abs(Math.sin(walkClock.current * 10)) * 0.08;

      const step = Math.sin(walkClock.current * 10);
      if (leftHip.current) leftHip.current.rotation.x = step * 0.85;
      if (rightHip.current) rightHip.current.rotation.x = -step * 0.85;
      if (leftShoulder.current) leftShoulder.current.rotation.x = -step * 0.75;
      if (rightShoulder.current) rightShoulder.current.rotation.x = step * 0.75;
      return;
    }

    // 2. LYING DOWN
    if (behaviorRef.current === 'lying_down') {
      glowMaterial.color.set('#0ea5e9');
      glowMaterial.emissive.set('#0369a1');
      glowMaterial.emissiveIntensity = 0.8;

      rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, -Math.PI / 2, 0.1);
      rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, 0, 0.1);
      rootRef.current.position.y = THREE.MathUtils.lerp(rootRef.current.position.y, -0.65, 0.1);

      if (leftHip.current) leftHip.current.rotation.x = 0;
      if (rightHip.current) rightHip.current.rotation.x = 0;
      if (leftShoulder.current) leftShoulder.current.rotation.x = 0;
      if (rightShoulder.current) rightShoulder.current.rotation.x = 0;
      return;
    }

    // 3. SITTING
    if (behaviorRef.current === 'sitting') {
      glowMaterial.color.set('#38bdf8');
      glowMaterial.emissive.set('#0284c7');
      glowMaterial.emissiveIntensity = 1.0;

      rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, 0, 0.1);
      rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, -0.25, 0.1);
      rootRef.current.position.y = THREE.MathUtils.lerp(rootRef.current.position.y, -0.4, 0.1);

      if (leftHip.current) leftHip.current.rotation.x = -Math.PI / 2;
      if (rightHip.current) rightHip.current.rotation.x = -Math.PI / 2;
      if (leftShoulder.current) {
        leftShoulder.current.rotation.x = -0.3;
        leftShoulder.current.rotation.z = -0.15;
      }
      if (rightShoulder.current) {
        rightShoulder.current.rotation.x = -0.3;
        rightShoulder.current.rotation.z = 0.15;
      }
      return;
    }

    // 4. NORMAL IDLE
    glowMaterial.color.set('#38bdf8');
    glowMaterial.emissive.set('#0284c7');
    glowMaterial.emissiveIntensity = 1.2;

    posX.current = THREE.MathUtils.lerp(posX.current, 0, 0.1);
    rootRef.current.position.x = posX.current;
    rootRef.current.position.y = THREE.MathUtils.lerp(rootRef.current.position.y, 0, 0.1);
    rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, 0, 0.1);

    if (leftHip.current) leftHip.current.rotation.x = THREE.MathUtils.lerp(leftHip.current.rotation.x, 0, 0.15);
    if (rightHip.current) rightHip.current.rotation.x = THREE.MathUtils.lerp(rightHip.current.rotation.x, 0, 0.15);

    const targetRotY = (state.pointer.x * Math.PI) / 6 - 0.15;
    rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, targetRotY, 0.08);

    if (leftShoulder.current) {
      leftShoulder.current.rotation.z = -0.22 + Math.sin(t * 1.8) * 0.03;
      leftShoulder.current.rotation.x = THREE.MathUtils.lerp(leftShoulder.current.rotation.x, 0, 0.15);
    }
    if (rightShoulder.current) {
      rightShoulder.current.rotation.z = 0.22 - Math.sin(t * 1.8) * 0.03;
      rightShoulder.current.rotation.x = THREE.MathUtils.lerp(rightShoulder.current.rotation.x, 0, 0.15);
    }
    if (headGroup.current) {
      headGroup.current.rotation.y = (state.pointer.x * Math.PI) / 10;
      headGroup.current.rotation.x = -(state.pointer.y * Math.PI) / 12;
      headGroup.current.rotation.z = 0;
    }
  });

  return (
    <group
      ref={rootRef}
      position={[0, compact ? -0.1 : -0.15, 0]}
      scale={compact ? 0.92 : 0.78}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerEnter}
      onPointerUp={handlePointerLeave}
    >
      <mesh position={[0, 0.7, 0]} visible={false}>
        <boxGeometry args={[2.8, 3.4, 2.0]} />
      </mesh>

      {/* 1. HEAD & FEATURES */}
      <group ref={headGroup} position={[0, 1.85, 0]}>
        <RoundedBox args={[1.05, 1.05, 1.05]} radius={0.08} smoothness={4} material={skinMaterial} />

        <mesh position={[0, -0.56, 0]} material={skinMaterial}>
          <cylinderGeometry args={[0.3, 0.3, 0.15, 16]} />
        </mesh>

        <mesh position={[0, 0.22, -0.04]} material={capMaterial}>
          <boxGeometry args={[1.08, 0.68, 1.12]} />
        </mesh>
        <mesh position={[0, -0.08, -0.74]} rotation={[-0.1, 0, 0]} material={capMaterial}>
          <boxGeometry args={[0.88, 0.07, 0.45]} />
        </mesh>

        {/* Left Earcup */}
        <group position={[-0.58, 0.05, 0]}>
          <mesh material={capMaterial}>
            <cylinderGeometry args={[0.26, 0.26, 0.14, 16]} />
          </mesh>
          <mesh position={[-0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={glowMaterial}>
            <torusGeometry args={[0.18, 0.03, 8, 20]} />
          </mesh>
        </group>

        {/* Right Earcup */}
        <group position={[0.58, 0.05, 0]}>
          <mesh material={capMaterial}>
            <cylinderGeometry args={[0.26, 0.26, 0.14, 16]} />
          </mesh>
          <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={glowMaterial}>
            <torusGeometry args={[0.18, 0.03, 8, 20]} />
          </mesh>
        </group>

        <mesh position={[0, 0.62, 0]} material={capMaterial}>
          <boxGeometry args={[1.22, 0.08, 0.24]} />
        </mesh>

        {/* Face */}
        <mesh position={[-0.22, 0.08, 0.53]} material={eyeMaterial}>
          <boxGeometry args={[0.14, 0.2, 0.02]} />
        </mesh>
        <mesh position={[-0.2, 0.13, 0.54]} material={whiteAccent}>
          <boxGeometry args={[0.05, 0.05, 0.02]} />
        </mesh>

        <mesh position={[0.22, 0.08, 0.53]} material={eyeMaterial}>
          <boxGeometry args={[0.14, 0.2, 0.02]} />
        </mesh>
        <mesh position={[0.24, 0.13, 0.54]} material={whiteAccent}>
          <boxGeometry args={[0.05, 0.05, 0.02]} />
        </mesh>

        <mesh
          position={[-0.22, 0.24, 0.53]}
          rotation={[0, 0, behavior === 'angry_walking' ? -0.35 : 0.05]}
          material={behavior === 'angry_walking' ? glowMaterial : capMaterial}
        >
          <boxGeometry args={[0.18, 0.04, 0.02]} />
        </mesh>
        <mesh
          position={[0.22, 0.24, 0.53]}
          rotation={[0, 0, behavior === 'angry_walking' ? 0.35 : -0.05]}
          material={behavior === 'angry_walking' ? glowMaterial : capMaterial}
        >
          <boxGeometry args={[0.18, 0.04, 0.02]} />
        </mesh>

        <mesh position={[0, -0.16, 0.53]} material={eyeMaterial}>
          <boxGeometry args={[0.22, 0.05, 0.02]} />
        </mesh>

        <mesh position={[0, 0.08, 0.55]} material={glowMaterial}>
          <boxGeometry args={[0.88, 0.18, 0.04]} />
        </mesh>
        <mesh position={[0, 0.08, 0.54]} material={capMaterial}>
          <boxGeometry args={[0.94, 0.22, 0.06]} />
        </mesh>
      </group>

      {/* 2. TORSO */}
      <group ref={torsoGroup} position={[0, 0.65, 0]}>
        <RoundedBox args={[1.65, 1.65, 0.88]} radius={0.06} smoothness={4} material={hoodieMaterial} />

        <mesh position={[0, 0.8, 0]} material={whiteAccent}>
          <boxGeometry args={[1.2, 0.1, 0.7]} />
        </mesh>

        {/* Emblem */}
        <group position={[0, 0.22, 0.46]}>
          <mesh rotation={[0, 0, Math.PI / 4]} material={glowMaterial}>
            <boxGeometry args={[0.34, 0.34, 0.03]} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 4]} position={[0, 0, 0.02]} material={hoodieMaterial}>
            <boxGeometry args={[0.16, 0.16, 0.03]} />
          </mesh>
        </group>

        {/* Drawstrings */}
        <mesh position={[-0.22, 0.18, 0.47]} material={whiteAccent}>
          <boxGeometry args={[0.035, 0.45, 0.02]} />
        </mesh>
        <mesh position={[-0.22, -0.05, 0.48]} material={glowMaterial}>
          <cylinderGeometry args={[0.025, 0.025, 0.08, 8]} />
        </mesh>

        <mesh position={[0.22, 0.18, 0.47]} material={whiteAccent}>
          <boxGeometry args={[0.035, 0.45, 0.02]} />
        </mesh>
        <mesh position={[0.22, -0.05, 0.48]} material={glowMaterial}>
          <cylinderGeometry args={[0.025, 0.025, 0.08, 8]} />
        </mesh>

        <mesh position={[0, -0.32, 0.46]} material={pantsMaterial}>
          <boxGeometry args={[1.1, 0.42, 0.04]} />
        </mesh>

        <mesh position={[0, -0.76, 0]} material={whiteAccent}>
          <boxGeometry args={[1.68, 0.14, 0.9]} />
        </mesh>
      </group>

      {/* 3. LEFT ARM */}
      <group ref={leftShoulder} position={[-1.24, 1.35, 0]}>
        <mesh position={[0, -0.5, 0]}>
          <RoundedBox args={[0.74, 1.05, 0.86]} radius={0.06} smoothness={4} material={hoodieMaterial} />
        </mesh>
        <mesh position={[0, -0.22, 0]} material={whiteAccent}>
          <boxGeometry args={[0.76, 0.08, 0.88]} />
        </mesh>
        <mesh position={[0, -0.36, 0]} material={whiteAccent}>
          <boxGeometry args={[0.76, 0.08, 0.88]} />
        </mesh>
        <mesh position={[0, -1.02, 0]} material={whiteAccent}>
          <boxGeometry args={[0.76, 0.12, 0.88]} />
        </mesh>
        <mesh position={[0, -1.28, 0]}>
          <RoundedBox args={[0.68, 0.44, 0.78]} radius={0.05} smoothness={4} material={skinMaterial} />
        </mesh>
        <mesh position={[-0.35, -1.2, 0]} material={glowMaterial}>
          <boxGeometry args={[0.04, 0.14, 0.22]} />
        </mesh>
      </group>

      {/* 4. RIGHT ARM */}
      <group ref={rightShoulder} position={[1.24, 1.35, 0]}>
        <mesh position={[0, -0.5, 0]}>
          <RoundedBox args={[0.74, 1.05, 0.86]} radius={0.06} smoothness={4} material={hoodieMaterial} />
        </mesh>
        <mesh position={[0, -0.22, 0]} material={whiteAccent}>
          <boxGeometry args={[0.76, 0.08, 0.88]} />
        </mesh>
        <mesh position={[0, -0.36, 0]} material={whiteAccent}>
          <boxGeometry args={[0.76, 0.08, 0.88]} />
        </mesh>
        <mesh position={[0, -1.02, 0]} material={whiteAccent}>
          <boxGeometry args={[0.76, 0.12, 0.88]} />
        </mesh>
        <mesh position={[0, -1.28, 0]}>
          <RoundedBox args={[0.68, 0.44, 0.78]} radius={0.05} smoothness={4} material={skinMaterial} />
        </mesh>
      </group>

      {/* 5. LEFT LEG */}
      <group ref={leftHip} position={[-0.43, -0.18, 0]}>
        <mesh position={[0, -0.65, 0]}>
          <RoundedBox args={[0.74, 1.3, 0.86]} radius={0.06} smoothness={4} material={pantsMaterial} />
        </mesh>
        <mesh position={[-0.38, -0.55, 0]} material={hoodieMaterial}>
          <boxGeometry args={[0.06, 0.45, 0.5]} />
        </mesh>
        <mesh position={[0, -1.35, 0.06]} material={capMaterial}>
          <boxGeometry args={[0.76, 0.28, 0.98]} />
        </mesh>
        <mesh position={[0, -1.35, 0.56]} material={glowMaterial}>
          <boxGeometry args={[0.5, 0.06, 0.02]} />
        </mesh>
        <mesh position={[0, -1.52, 0.08]} material={whiteAccent}>
          <boxGeometry args={[0.78, 0.12, 1.04]} />
        </mesh>
      </group>

      {/* 6. RIGHT LEG */}
      <group ref={rightHip} position={[0.43, -0.18, 0]}>
        <mesh position={[0, -0.65, 0]}>
          <RoundedBox args={[0.74, 1.3, 0.86]} radius={0.06} smoothness={4} material={pantsMaterial} />
        </mesh>
        <mesh position={[0.38, -0.55, 0]} material={hoodieMaterial}>
          <boxGeometry args={[0.06, 0.45, 0.5]} />
        </mesh>
        <mesh position={[0, -1.35, 0.06]} material={capMaterial}>
          <boxGeometry args={[0.76, 0.28, 0.98]} />
        </mesh>
        <mesh position={[0, -1.35, 0.56]} material={glowMaterial}>
          <boxGeometry args={[0.5, 0.06, 0.02]} />
        </mesh>
        <mesh position={[0, -1.52, 0.08]} material={whiteAccent}>
          <boxGeometry args={[0.78, 0.12, 1.04]} />
        </mesh>
      </group>

      {/* 7. GROUND SHADOW */}
      <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]} material={shadowMaterial}>
        <circleGeometry args={[1.1, 32]} />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------------------------
// Hero3DCanvas Container
// ----------------------------------------------------------------------
export default function Hero3DCanvas({ compact = false }: { compact?: boolean }) {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [statusText, setStatusText] = useState(compact ? '👋 Tap me!' : 'Hover over me if you dare!');
  const [behavior, setBehavior] = useState<AvatarBehavior>('idle');

  useEffect(() => {
    const handleScroll = () => {
      setScrollOffset(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBehaviorChange = (b: AvatarBehavior, text: string) => {
    setBehavior(b);
    setStatusText(text);
  };

  return (
    <div className="w-full h-full relative select-none touch-pan-y flex items-center justify-center">
      {/* Floating Status Mood Badge */}
      <div className={`absolute ${compact ? '-top-1' : 'top-1 sm:top-2'} left-1/2 -translate-x-1/2 z-30 pointer-events-none max-w-[95%]`}>
        <div
          className={`rounded-full font-mono font-medium backdrop-blur-md border shadow-xl transition-all duration-300 flex items-center whitespace-nowrap overflow-hidden text-ellipsis ${
            compact ? 'px-2.5 py-0.5 text-[11px] gap-1' : 'px-3 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs gap-1.5 sm:gap-2'
          } ${
            behavior === 'angry_walking'
              ? 'bg-red-500/25 border-red-500/60 text-red-200 animate-bounce'
              : behavior === 'lying_down'
              ? 'bg-sky-500/20 border-sky-400/50 text-sky-200'
              : behavior === 'sitting'
              ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200'
              : 'bg-black/80 border-white/[0.14] text-gray-200'
          }`}
        >
          <span
            className={`rounded-full shrink-0 transition-colors ${
              compact ? 'w-1.5 h-1.5' : 'w-1.5 h-1.5 sm:w-2 sm:h-2'
            } ${
              behavior === 'angry_walking'
                ? 'bg-red-400 animate-ping'
                : behavior === 'sitting'
                ? 'bg-emerald-400'
                : behavior === 'lying_down'
                ? 'bg-sky-400'
                : 'bg-cyan-400'
            }`}
          />
          <span className="font-semibold truncate">{statusText}</span>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, compact ? 0.2 : 0.1, compact ? 4.5 : 5.4], fov: compact ? 44 : 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ touchAction: 'pan-y' }}
      >
        <ambientLight intensity={1.8} color="#e2e8f0" />
        <directionalLight position={[5, 6, 5]} intensity={3.0} color="#ffffff" />
        <directionalLight position={[-5, 4, 4]} intensity={2.2} color="#bae6fd" />
        <directionalLight position={[0, 5, -5]} intensity={4.5} color="#38bdf8" />
        <directionalLight position={[0, -4, 3]} intensity={1.2} color="#ffffff" />

        <RobloxDeveloperAvatar
          scrollOffset={scrollOffset}
          compact={compact}
          onBehaviorChange={handleBehaviorChange}
        />
      </Canvas>
    </div>
  );
}
