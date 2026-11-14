'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { soundFx } from '@/lib/audio';
import {
  createFaceTexture,
  createShirtFrontTexture,
  createBackpackPusheenTexture,
  createCashNotesTexture,
  createPantsTexture,
} from './robloxAvatarTextures';

type AvatarMood = 'idle' | 'grabbed' | 'angry' | 'walking' | 'sitting';

interface AvatarRigProps {
  dragOffset: { x: number; y: number };
  isDragging: boolean;
  mood: AvatarMood;
  onArrivedHome: () => void;
  scrollYProgress: number;
}

// 3D Roblox R6 Rig with Authentic Textures & Features
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

  const currentPos = useRef(new THREE.Vector3(2.4, 0.2, 0));
  const currentOffset = useRef(new THREE.Vector2(0, 0));
  const walkClock = useRef(0);

  // Dynamic Textures
  const faceTexture = useMemo(() => createFaceTexture(), []);
  const shirtFrontTexture = useMemo(() => createShirtFrontTexture(), []);
  const backpackTexture = useMemo(() => createBackpackPusheenTexture(), []);
  const cashTexture = useMemo(() => createCashNotesTexture(), []);
  const pantsTexture = useMemo(() => createPantsTexture(), []);

  // Materials
  const skinMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fae0cb',
        roughness: 0.5,
        metalness: 0.04,
      }),
    []
  );

  const hairMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#442817',
        roughness: 0.42,
        metalness: 0.08,
      }),
    []
  );

  const hairHighlightMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#5a3821',
        roughness: 0.38,
        metalness: 0.1,
      }),
    []
  );

  const whiteShirtMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.35,
        metalness: 0.05,
      }),
    []
  );

  const whitePantsMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f3f4f6',
        roughness: 0.45,
        metalness: 0.05,
      }),
    []
  );

  const tanBagMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#cfbfad',
        roughness: 0.45,
        metalness: 0.08,
      }),
    []
  );

  const strapMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#b5a18d',
        roughness: 0.4,
        metalness: 0.1,
      }),
    []
  );

  const paperTalismanMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.25,
        metalness: 0.02,
      }),
    []
  );

  useFrame((state, delta) => {
    if (!avatarRoot.current) return;

    const homeX = 2.4;
    const homeY = 0.2 - scrollYProgress * 3.0;
    const t = state.clock.elapsedTime;

    if (mood === 'grabbed') {
      currentOffset.current.x = THREE.MathUtils.lerp(currentOffset.current.x, dragOffset.x, 0.25);
      currentOffset.current.y = THREE.MathUtils.lerp(currentOffset.current.y, dragOffset.y, 0.25);

      currentPos.current.x = homeX + currentOffset.current.x;
      currentPos.current.y = homeY + currentOffset.current.y;
      avatarRoot.current.position.copy(currentPos.current);

      if (leftShoulder.current) leftShoulder.current.rotation.z = -1.1 + Math.sin(t * 12) * 0.3;
      if (rightShoulder.current) rightShoulder.current.rotation.z = 1.1 - Math.sin(t * 12) * 0.3;
      if (leftHip.current) leftHip.current.rotation.x = Math.sin(t * 10) * 0.6;
      if (rightHip.current) rightHip.current.rotation.x = -Math.sin(t * 10) * 0.6;
      if (headGroup.current) headGroup.current.rotation.y = Math.sin(t * 15) * 0.3;
      return;
    }

    if (mood === 'angry') {
      if (headGroup.current) {
        headGroup.current.rotation.y = Math.sin(t * 26) * 0.4;
      }
      if (leftShoulder.current) leftShoulder.current.rotation.z = -0.45;
      if (rightShoulder.current) rightShoulder.current.rotation.z = 0.45;
      if (leftHip.current) leftHip.current.rotation.x = 0;
      if (rightHip.current) rightHip.current.rotation.x = 0;
      return;
    }

    if (mood === 'walking') {
      walkClock.current += delta;

      currentOffset.current.x = THREE.MathUtils.lerp(currentOffset.current.x, 0, 0.04);
      currentOffset.current.y = THREE.MathUtils.lerp(currentOffset.current.y, 0, 0.04);

      currentPos.current.x = homeX + currentOffset.current.x;
      currentPos.current.y = homeY + currentOffset.current.y;
      avatarRoot.current.position.copy(currentPos.current);

      const dx = -currentOffset.current.x;
      const targetFacing = dx > 0.05 ? Math.PI / 2 : dx < -0.05 ? -Math.PI / 2 : 0;
      avatarRoot.current.rotation.y = THREE.MathUtils.lerp(avatarRoot.current.rotation.y, targetFacing, 0.12);

      const step = Math.sin(walkClock.current * 10);
      if (leftHip.current) leftHip.current.rotation.x = step * 0.75;
      if (rightHip.current) rightHip.current.rotation.x = -step * 0.75;
      if (leftShoulder.current) leftShoulder.current.rotation.x = -step * 0.65;
      if (rightShoulder.current) rightShoulder.current.rotation.x = step * 0.65;

      const dist = Math.hypot(currentOffset.current.x, currentOffset.current.y);
      if (dist < 0.12) {
        onArrivedHome();
      }
      return;
    }

    if (mood === 'sitting') {
      avatarRoot.current.rotation.x = 0;
      avatarRoot.current.rotation.y = -0.3;

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

    // IDLE
    currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, homeX, 0.08);
    currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, homeY, 0.08);
    avatarRoot.current.position.copy(currentPos.current);

    if (leftHip.current) leftHip.current.rotation.x = THREE.MathUtils.lerp(leftHip.current.rotation.x, 0, 0.1);
    if (rightHip.current) rightHip.current.rotation.x = THREE.MathUtils.lerp(rightHip.current.rotation.x, 0, 0.1);

    const targetRotY = (state.pointer.x * Math.PI) / 8 - 0.2;
    const targetRotX = (-state.pointer.y * Math.PI) / 10 + 0.05;
    avatarRoot.current.rotation.y = THREE.MathUtils.lerp(avatarRoot.current.rotation.y, targetRotY, 0.06);
    avatarRoot.current.rotation.x = THREE.MathUtils.lerp(avatarRoot.current.rotation.x, targetRotX, 0.06);

    if (leftShoulder.current) {
      leftShoulder.current.rotation.z = -0.18 + Math.sin(t * 1.5) * 0.03;
      leftShoulder.current.rotation.x = 0;
    }
    if (rightShoulder.current) {
      rightShoulder.current.rotation.z = 0.18 - Math.sin(t * 1.5) * 0.03;
      rightShoulder.current.rotation.x = 0;
    }
    if (headGroup.current) headGroup.current.rotation.y = (state.pointer.x * Math.PI) / 12;
  });

  return (
    <group ref={avatarRoot} position={[2.4, 0.2, 0]} scale={0.58}>
      {/* 1. HEAD */}
      <group ref={headGroup} position={[0, 1.85, 0]}>
        <RoundedBox args={[1.08, 1.0, 1.04]} radius={0.28} smoothness={12} material={skinMaterial} />

        <mesh position={[0, -0.56, 0]} material={skinMaterial}>
          <cylinderGeometry args={[0.3, 0.3, 0.15, 16]} />
        </mesh>

        {faceTexture && (
          <mesh position={[0, 0, 0.525]}>
            <planeGeometry args={[0.98, 0.95]} />
            <meshStandardMaterial
              map={faceTexture}
              transparent
              roughness={0.3}
              alphaTest={0.01}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Brown anime hair */}
        <mesh position={[0, 0.34, -0.04]}>
          <RoundedBox args={[1.14, 0.65, 1.14]} radius={0.18} smoothness={8} material={hairMaterial} />
        </mesh>
        <mesh position={[0, 0.55, -0.02]}>
          <RoundedBox args={[0.96, 0.26, 0.96]} radius={0.12} smoothness={8} material={hairHighlightMaterial} />
        </mesh>
        <mesh position={[0, -0.14, -0.56]}>
          <RoundedBox args={[1.12, 0.82, 0.22]} radius={0.1} smoothness={6} material={hairMaterial} />
        </mesh>
        <mesh position={[-0.58, 0.02, 0.05]}>
          <RoundedBox args={[0.16, 0.95, 1.05]} radius={0.08} smoothness={6} material={hairMaterial} />
        </mesh>
        <mesh position={[0.58, 0.02, 0.05]}>
          <RoundedBox args={[0.16, 0.95, 1.05]} radius={0.08} smoothness={6} material={hairMaterial} />
        </mesh>
        {/* Forehead fringe */}
        <mesh position={[-0.32, 0.44, 0.51]} rotation={[0, 0, -0.16]}>
          <RoundedBox args={[0.34, 0.22, 0.08]} radius={0.04} smoothness={4} material={hairMaterial} />
        </mesh>
        <mesh position={[0.32, 0.44, 0.51]} rotation={[0, 0, 0.16]}>
          <RoundedBox args={[0.34, 0.22, 0.08]} radius={0.04} smoothness={4} material={hairMaterial} />
        </mesh>
      </group>

      {/* 2. TORSO */}
      <group ref={torsoGroup} position={[0, 0.65, 0]}>
        <RoundedBox args={[1.65, 1.65, 0.88]} radius={0.06} smoothness={4} material={whiteShirtMaterial} />

        {shirtFrontTexture && (
          <mesh position={[0, 0, 0.445]}>
            <planeGeometry args={[1.64, 1.64]} />
            <meshStandardMaterial map={shirtFrontTexture} transparent roughness={0.35} />
          </mesh>
        )}

        {/* Crossbody strap */}
        <mesh position={[0.08, 0.06, 0.455]} rotation={[0, 0, -0.68]} material={strapMaterial}>
          <boxGeometry args={[2.05, 0.16, 0.025]} />
        </mesh>

        {/* Backpack */}
        <group position={[-0.05, 0.12, -0.68]} rotation={[0.04, -0.06, 0.05]}>
          <RoundedBox args={[1.18, 0.95, 0.54]} radius={0.12} smoothness={4} material={tanBagMaterial} />
          {backpackTexture && (
            <mesh position={[0, 0, -0.275]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[1.16, 0.93]} />
              <meshStandardMaterial map={backpackTexture} roughness={0.45} />
            </mesh>
          )}
          {/* Banknotes */}
          <group position={[0, 0.48, 0]}>
            <mesh position={[-0.2, 0.14, 0]} rotation={[-0.15, 0.1, 0.2]}>
              <planeGeometry args={[0.26, 0.4]} />
              <meshStandardMaterial map={cashTexture ?? undefined} color="#a7f3d0" side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0.15, 0.16, 0]} rotation={[-0.1, -0.1, -0.15]}>
              <planeGeometry args={[0.26, 0.4]} />
              <meshStandardMaterial map={cashTexture ?? undefined} color="#a7f3d0" side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>
      </group>

      {/* 3. LEFT ARM */}
      <group ref={leftShoulder} position={[-1.24, 1.35, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <RoundedBox args={[0.74, 0.46, 0.86]} radius={0.05} smoothness={4} material={whiteShirtMaterial} />
        </mesh>
        <mesh position={[0, -0.92, 0]}>
          <RoundedBox args={[0.72, 0.86, 0.84]} radius={0.05} smoothness={4} material={skinMaterial} />
        </mesh>
      </group>

      {/* 4. RIGHT ARM */}
      <group ref={rightShoulder} position={[1.24, 1.35, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <RoundedBox args={[0.74, 0.46, 0.86]} radius={0.05} smoothness={4} material={whiteShirtMaterial} />
        </mesh>
        <mesh position={[0, -0.92, 0]}>
          <RoundedBox args={[0.72, 0.86, 0.84]} radius={0.05} smoothness={4} material={skinMaterial} />
        </mesh>
      </group>

      {/* 5. LEFT LEG */}
      <group ref={leftHip} position={[-0.43, -0.18, 0]}>
        <mesh position={[0, -0.65, 0]}>
          <RoundedBox args={[0.74, 1.3, 0.86]} radius={0.06} smoothness={4} material={whitePantsMaterial} />
        </mesh>
        <mesh position={[-0.39, -0.5, 0]} material={whitePantsMaterial}>
          <boxGeometry args={[0.07, 0.48, 0.46]} />
        </mesh>
        {pantsTexture && (
          <mesh position={[0, -0.65, 0.435]}>
            <planeGeometry args={[0.72, 1.28]} />
            <meshStandardMaterial map={pantsTexture} transparent roughness={0.45} />
          </mesh>
        )}
      </group>

      {/* 6. RIGHT LEG */}
      <group ref={rightHip} position={[0.43, -0.18, 0]}>
        <mesh position={[0, -0.65, 0]}>
          <RoundedBox args={[0.74, 1.3, 0.86]} radius={0.06} smoothness={4} material={whitePantsMaterial} />
        </mesh>
        <mesh position={[0.39, -0.5, 0]} material={whitePantsMaterial}>
          <boxGeometry args={[0.07, 0.48, 0.46]} />
        </mesh>
        {pantsTexture && (
          <mesh position={[0, -0.65, 0.435]}>
            <planeGeometry args={[0.72, 1.28]} />
            <meshStandardMaterial map={pantsTexture} transparent roughness={0.45} />
          </mesh>
        )}
      </group>
    </group>
  );
}

export default function InteractiveAvatarCompanion() {
  const [scrollYProgress, setScrollYProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mood, setMood] = useState<AvatarMood>('idle');
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      setScrollYProgress(progress);

      if (progress > 0.45 && mood === 'idle') {
        setMood('sitting');
        setSpeechBubble('Taking a rest here...');
        setTimeout(() => setSpeechBubble(null), 3000);
      } else if (progress <= 0.45 && mood === 'sitting') {
        setMood('idle');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mood]);

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setMood('grabbed');
    setSpeechBubble('Aah! Put me down!');
    soundFx.playGrab();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = (e.clientX - dragStart.x) * 0.015;
    const dy = -(e.clientY - dragStart.y) * 0.015;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    setIsDragging(false);

    const dist = Math.hypot(dragOffset.x, dragOffset.y);
    if (dist > 1.2) {
      setMood('angry');
      setSpeechBubble('Seriously?! >:(');
      soundFx.playAngry();

      setTimeout(() => {
        setMood('walking');
        setSpeechBubble('Walking back...');
      }, 1200);
    } else {
      setMood('walking');
      setSpeechBubble('Heading back.');
    }
  };

  const handleArrivedHome = () => {
    setMood('idle');
    setSpeechBubble(null);
    setDragOffset({ x: 0, y: 0 });
    soundFx.playDrop();
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 select-none overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing relative"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {speechBubble && (
          <div
            className="absolute top-1/3 right-12 z-50 pointer-events-none bg-black/90 text-white font-mono text-xs px-3.5 py-2 rounded-xl border border-white/20 shadow-2xl backdrop-blur-md animate-bounce"
            style={{ transform: `translate(${dragOffset.x * 25}px, ${-dragOffset.y * 25}px)` }}
          >
            {speechBubble}
          </div>
        )}

        <Canvas
          camera={{ position: [0, 0, 7.5], fov: 42 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={1.8} />
          <directionalLight position={[5, 5, 5]} intensity={2.6} />
          <directionalLight position={[-5, 3, -3]} intensity={1.5} color="#e0f2fe" />

          <RobloxR6Model
            dragOffset={dragOffset}
            isDragging={isDragging}
            mood={mood}
            onArrivedHome={handleArrivedHome}
            scrollYProgress={scrollYProgress}
          />
        </Canvas>
      </div>
    </div>
  );
}
