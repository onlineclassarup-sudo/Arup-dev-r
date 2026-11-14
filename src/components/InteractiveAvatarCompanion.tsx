'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { soundFx } from '@/lib/audio';

type AvatarMood = 'idle' | 'grabbed' | 'angry' | 'walking' | 'sitting';

interface AvatarRigProps {
  dragOffset: { x: number; y: number };
  isDragging: boolean;
  mood: AvatarMood;
  onArrivedHome: () => void;
  scrollYProgress: number;
}

// 3D Roblox R6 Rig with True Shoulder & Hip Pivots
function RobloxR6Model({
  dragOffset,
  isDragging,
  mood,
  onArrivedHome,
  scrollYProgress,
}: AvatarRigProps) {
  const avatarRoot = useRef<THREE.Group>(null!);
  const headGroup = useRef<THREE.Group>(null!);
  const torsoGroup = useRef<THREE.Group>(null!);
  const leftShoulder = useRef<THREE.Group>(null!);
  const rightShoulder = useRef<THREE.Group>(null!);
  const leftHip = useRef<THREE.Group>(null!);
  const rightHip = useRef<THREE.Group>(null!);

  // Current visual position & walk animation state
  const currentPos = useRef(new THREE.Vector3(2.5, 0.2, 0));
  const currentOffset = useRef(new THREE.Vector2(0, 0));
  const walkClock = useRef(0);

  // Materials with high-end studio illumination (never pitch black)
  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2d3340',
        roughness: 0.25,
        metalness: 0.45,
      }),
    []
  );

  const darkPlateMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a1d25',
        roughness: 0.35,
        metalness: 0.55,
      }),
    []
  );

  const visorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        emissive: '#0284c7',
        emissiveIntensity: 0.9,
        roughness: 0.2,
      }),
    []
  );

  const stripeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#3f4656',
        roughness: 0.4,
        metalness: 0.3,
      }),
    []
  );

  useFrame((state, delta) => {
    if (!avatarRoot.current) return;

    // Home position on right side, linked to scroll descent
    const homeX = 2.4;
    const homeY = 0.2 - scrollYProgress * 3.0;

    const t = state.clock.elapsedTime;

    // 1. STATE: GRABBED (Following user's mouse drag)
    if (mood === 'grabbed') {
      currentOffset.current.x = THREE.MathUtils.lerp(currentOffset.current.x, dragOffset.x, 0.25);
      currentOffset.current.y = THREE.MathUtils.lerp(currentOffset.current.y, dragOffset.y, 0.25);

      currentPos.current.x = homeX + currentOffset.current.x;
      currentPos.current.y = homeY + currentOffset.current.y;
      avatarRoot.current.position.copy(currentPos.current);

      // Surprised amber visor
      visorMaterial.color.set('#f59e0b');
      visorMaterial.emissive.set('#b45309');

      // Limbs flail in panic
      if (leftShoulder.current) leftShoulder.current.rotation.z = -1.1 + Math.sin(t * 12) * 0.3;
      if (rightShoulder.current) rightShoulder.current.rotation.z = 1.1 - Math.sin(t * 12) * 0.3;
      if (leftHip.current) leftHip.current.rotation.x = Math.sin(t * 10) * 0.6;
      if (rightHip.current) rightHip.current.rotation.x = -Math.sin(t * 10) * 0.6;
      if (headGroup.current) headGroup.current.rotation.y = Math.sin(t * 15) * 0.3;
      return;
    }

    // 2. STATE: ANGRY (Head shakes, visor turns red)
    if (mood === 'angry') {
      // Visor turns angry crimson red
      visorMaterial.color.set('#ff2a4b');
      visorMaterial.emissive.set('#b91c1c');

      // Head shakes in anger
      if (headGroup.current) {
        headGroup.current.rotation.y = Math.sin(t * 26) * 0.4;
      }

      // Arms crossed down
      if (leftShoulder.current) leftShoulder.current.rotation.z = -0.45;
      if (rightShoulder.current) rightShoulder.current.rotation.z = 0.45;
      if (leftHip.current) leftHip.current.rotation.x = 0;
      if (rightHip.current) rightHip.current.rotation.x = 0;
      return;
    }

    // 3. STATE: WALKING (Walks across the screen back to base)
    if (mood === 'walking') {
      walkClock.current += delta;

      // Smoothly move offset back to (0, 0)
      currentOffset.current.x = THREE.MathUtils.lerp(currentOffset.current.x, 0, 0.04);
      currentOffset.current.y = THREE.MathUtils.lerp(currentOffset.current.y, 0, 0.04);

      currentPos.current.x = homeX + currentOffset.current.x;
      currentPos.current.y = homeY + currentOffset.current.y;
      avatarRoot.current.position.copy(currentPos.current);

      // Face the direction of home
      const dx = -currentOffset.current.x;
      const targetFacing = dx > 0.05 ? Math.PI / 2 : dx < -0.05 ? -Math.PI / 2 : 0;
      avatarRoot.current.rotation.y = THREE.MathUtils.lerp(
        avatarRoot.current.rotation.y,
        targetFacing,
        0.12
      );

      // Authentic Roblox R6 Walk Cycle:
      const step = Math.sin(walkClock.current * 10);
      if (leftHip.current) leftHip.current.rotation.x = step * 0.75;
      if (rightHip.current) rightHip.current.rotation.x = -step * 0.75;
      if (leftShoulder.current) leftShoulder.current.rotation.x = -step * 0.65;
      if (rightShoulder.current) rightShoulder.current.rotation.x = step * 0.65;

      // Check arrival
      const dist = Math.hypot(currentOffset.current.x, currentOffset.current.y);
      if (dist < 0.12) {
        onArrivedHome();
      }
      return;
    }

    // 4. STATE: SITTING (Classic Roblox Sit Animation: legs forward 90deg!)
    if (mood === 'sitting') {
      // Visor turns calm sky blue
      visorMaterial.color.set('#38bdf8');
      visorMaterial.emissive.set('#0284c7');

      // Face forward
      avatarRoot.current.rotation.y = THREE.MathUtils.lerp(
        avatarRoot.current.rotation.y,
        -0.2,
        0.08
      );

      // Legs bent 90 degrees forward from hip joints!
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

      currentPos.current.x = homeX;
      currentPos.current.y = homeY - 0.28;
      avatarRoot.current.position.copy(currentPos.current);
      return;
    }

    // 5. STATE: IDLE (Relaxed floating & mouse look)
    currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, homeX, 0.08);
    currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, homeY, 0.08);
    avatarRoot.current.position.copy(currentPos.current);

    // Normal visor
    visorMaterial.color.set('#38bdf8');
    visorMaterial.emissive.set('#0284c7');

    // Reset legs
    if (leftHip.current) leftHip.current.rotation.x = THREE.MathUtils.lerp(leftHip.current.rotation.x, 0, 0.1);
    if (rightHip.current) rightHip.current.rotation.x = THREE.MathUtils.lerp(rightHip.current.rotation.x, 0, 0.1);

    // Mouse tracking look
    const targetRotY = (state.pointer.x * Math.PI) / 8 - 0.2;
    const targetRotX = (-state.pointer.y * Math.PI) / 10 + 0.05;
    avatarRoot.current.rotation.y = THREE.MathUtils.lerp(avatarRoot.current.rotation.y, targetRotY, 0.06);
    avatarRoot.current.rotation.x = THREE.MathUtils.lerp(avatarRoot.current.rotation.x, targetRotX, 0.06);

    // Breathing
    if (leftShoulder.current) {
      leftShoulder.current.rotation.z = -0.25 + Math.sin(t * 1.5) * 0.04;
      leftShoulder.current.rotation.x = 0;
    }
    if (rightShoulder.current) {
      rightShoulder.current.rotation.z = 0.25 - Math.sin(t * 1.5) * 0.04;
      rightShoulder.current.rotation.x = 0;
    }
    if (headGroup.current) headGroup.current.rotation.y = (state.pointer.x * Math.PI) / 12;
  });

  return (
    <group ref={avatarRoot} position={[2.4, 0.2, 0]} scale={0.58}>
      {/* HEAD */}
      <group ref={headGroup} position={[0, 1.95, 0]}>
        <RoundedBox args={[1.0, 1.0, 1.0]} radius={0.06} smoothness={4} material={bodyMaterial} />

        {/* Visor */}
        <mesh position={[0, 0.05, 0.51]} material={visorMaterial}>
          <boxGeometry args={[0.78, 0.22, 0.04]} />
        </mesh>

        {/* Headband Frame */}
        <mesh position={[0, 0.05, 0]} material={darkPlateMaterial}>
          <boxGeometry args={[1.04, 0.26, 1.04]} />
        </mesh>

        {/* Antenna Node */}
        <mesh position={[0, 0.55, 0]} material={stripeMaterial}>
          <cylinderGeometry args={[0.08, 0.08, 0.12, 16]} />
        </mesh>
      </group>

      {/* TORSO */}
      <group ref={torsoGroup} position={[0, 0.65, 0]}>
        <RoundedBox args={[1.65, 1.65, 0.85]} radius={0.05} smoothness={4} material={bodyMaterial} />

        {/* Armor Stripes */}
        {[-0.45, -0.18, 0.1, 0.38].map((yOff, i) => (
          <mesh key={i} position={[0, yOff, 0.44]} material={stripeMaterial}>
            <boxGeometry args={[1.45, 0.1, 0.04]} />
          </mesh>
        ))}

        {/* Chest Core */}
        <mesh position={[0, -0.04, 0.45]} material={visorMaterial}>
          <boxGeometry args={[0.3, 0.04, 0.03]} />
        </mesh>
      </group>

      {/* LEFT SHOULDER PIVOT + ARM */}
      <group ref={leftShoulder} position={[-1.22, 1.35, 0]}>
        <mesh position={[0, -0.7, 0]}>
          <RoundedBox args={[0.75, 1.45, 0.85]} radius={0.05} smoothness={4} material={bodyMaterial} />
        </mesh>
      </group>

      {/* RIGHT SHOULDER PIVOT + ARM */}
      <group ref={rightShoulder} position={[1.22, 1.35, 0]}>
        <mesh position={[0, -0.7, 0]}>
          <RoundedBox args={[0.75, 1.45, 0.85]} radius={0.05} smoothness={4} material={bodyMaterial} />
        </mesh>
      </group>

      {/* LEFT HIP PIVOT + LEG */}
      <group ref={leftHip} position={[-0.42, -0.18, 0]}>
        <mesh position={[0, -0.75, 0]}>
          <RoundedBox args={[0.75, 1.5, 0.85]} radius={0.05} smoothness={4} material={darkPlateMaterial} />
        </mesh>
      </group>

      {/* RIGHT HIP PIVOT + LEG */}
      <group ref={rightHip} position={[0.42, -0.18, 0]}>
        <mesh position={[0, -0.75, 0]}>
          <RoundedBox args={[0.75, 1.5, 0.85]} radius={0.05} smoothness={4} material={darkPlateMaterial} />
        </mesh>
      </group>
    </group>
  );
}

export default function InteractiveAvatarCompanion() {
  const [scrollYProgress, setScrollYProgress] = useState(0);
  const [mood, setMood] = useState<AvatarMood>('idle');
  const [statusText, setStatusText] = useState('Hold & Drag me anywhere!');
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const isDraggingRef = useRef(false);
  const startMouseRef = useRef({ x: 0, y: 0 });
  const startOffsetRef = useRef({ x: 0, y: 0 });

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollYProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Drag interaction handler (Works 100% across the whole screen!)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startMouseRef.current = { x: e.clientX, y: e.clientY };
    startOffsetRef.current = { ...dragOffset };

    setMood('grabbed');
    setStatusText('Hey! Where are you taking me?');
    soundFx.playHover();

    const onPointerMove = (moveEvt: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = (moveEvt.clientX - startMouseRef.current.x) * 0.012;
      const dy = -(moveEvt.clientY - startMouseRef.current.y) * 0.012;

      setDragOffset({
        x: startOffsetRef.current.x + dx,
        y: startOffsetRef.current.y + dy,
      });
    };

    const onPointerUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      // Trigger Angry State!
      setMood('angry');
      setStatusText('Grrr! Walking back to my spot!');
      soundFx.playClick();

      // After 1.2s of anger, begin walking back
      setTimeout(() => {
        setMood('walking');
        setStatusText('Stomping back to base...');
      }, 1200);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handleArrivedHome = () => {
    setDragOffset({ x: 0, y: 0 });
    setMood('sitting');
    setStatusText('Tired! Sitting down to rest.');
    soundFx.playChime();

    // After 4s of sitting, return to idle
    setTimeout(() => {
      setMood('idle');
      setStatusText('Hold & Drag me anywhere!');
    }, 4000);
  };

  // Convert scroll to pixel offset for the drag handle
  const handleTopY = Math.min(Math.max(120 + scrollYProgress * 500, 100), 700);

  return (
    <>
      {/* 1. Full Screen Three.js Canvas (Zero Clipping, Renders Across Entire Page) */}
      <div className="fixed inset-0 w-screen h-screen pointer-events-none z-20">
        <Canvas
          camera={{ position: [0, 0, 7.0], fov: 46 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={1.6} color="#f1f5f9" />
          <directionalLight position={[6, 9, 6]} intensity={2.8} color="#ffffff" />
          <directionalLight position={[-6, 4, 4]} intensity={1.9} color="#bae6fd" />
          <directionalLight position={[0, 6, -5]} intensity={3.8} color="#38bdf8" />
          <directionalLight position={[-4, -2, -3]} intensity={1.5} color="#ffffff" />

          <RobloxR6Model
            dragOffset={dragOffset}
            isDragging={isDraggingRef.current}
            mood={mood}
            onArrivedHome={handleArrivedHome}
            scrollYProgress={scrollYProgress}
          />
        </Canvas>
      </div>

      {/* 2. Interactive Drag Hitbox & Speech Badge (Positioned directly over Avatar) */}
      <div
        style={{ top: `${handleTopY}px` }}
        className="fixed right-6 sm:right-14 lg:right-20 xl:right-32 w-52 sm:w-60 h-80 z-30 pointer-events-none hidden md:block"
      >
        {/* Floating Speech Badge */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div
            className={`px-3 py-1 rounded-full text-[11px] font-mono font-medium backdrop-blur-md border shadow-lg transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              mood === 'grabbed'
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-300 scale-105'
                : mood === 'angry'
                ? 'bg-red-500/20 border-red-400/50 text-red-300 animate-bounce'
                : mood === 'walking'
                ? 'bg-sky-500/20 border-sky-400/50 text-sky-300'
                : mood === 'sitting'
                ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                : 'bg-black/70 border-white/[0.12] text-gray-300 hover:text-white hover:border-white/[0.25]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                mood === 'angry'
                  ? 'bg-red-400'
                  : mood === 'grabbed'
                  ? 'bg-amber-400'
                  : mood === 'sitting'
                  ? 'bg-emerald-400'
                  : 'bg-sky-400'
              }`}
            />
            <span>{statusText}</span>
          </div>
        </div>

        {/* Dedicated Grab Hitbox directly over the Avatar */}
        <div
          onPointerDown={handlePointerDown}
          className="w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing rounded-3xl"
          title="Click and drag to move avatar!"
        />
      </div>
    </>
  );
}

