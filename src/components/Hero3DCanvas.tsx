'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
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

type AvatarBehavior = 'idle' | 'angry_walking' | 'sitting' | 'lying_down';

interface AvatarProps {
  scrollOffset: number;
  compact?: boolean;
  onBehaviorChange: (b: AvatarBehavior, text: string) => void;
}

// ----------------------------------------------------------------------
// Authentic Roblox R6 Avatar:
// - Chocolate brown anime layered hair with bangs & side locks
// - Expressive anime face (> < laughing eyes, cute open mouth, blush)
// - "NOT MY LOVE" white paper talisman on forehead
// - White t-shirt with Pusheen wearing glasses & diagonal crossbody strap
// - Short-sleeve bare arms
// - Tan duffle backpack with Pusheen eating donut & banknotes sticking out
// - Baggy white cargo pants with side flap pockets & rolled cuffs
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
  // Dynamic Textures
  // --------------------------------------------------------------------
  const faceTexture = useMemo(() => createFaceTexture(), []);
  const shirtFrontTexture = useMemo(() => createShirtFrontTexture(), []);
  const backpackTexture = useMemo(() => createBackpackPusheenTexture(), []);
  const cashTexture = useMemo(() => createCashNotesTexture(), []);
  const pantsTexture = useMemo(() => createPantsTexture(), []);

  // --------------------------------------------------------------------
  // Materials
  // --------------------------------------------------------------------
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
        color: '#442817', // Rich chocolate brown
        roughness: 0.42,
        metalness: 0.08,
      }),
    []
  );

  const hairHighlightMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#5a3821', // Slightly lighter brown for depth
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
        color: '#cfbfad', // Warm sandy tan canvas
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

  const badgeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#dc2626',
        emissive: '#b91c1c',
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.5,
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

  const shadowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#000000',
        transparent: true,
        opacity: 0.4,
      }),
    []
  );

  // --------------------------------------------------------------------
  // Interactions: Mouse / Tap Enter -> Angry Walk | Leave -> Normal
  // --------------------------------------------------------------------
  const handlePointerEnter = (e: any) => {
    e.stopPropagation();
    soundFx.playHover();
    setBehavior('angry_walking');
    onBehaviorChange('angry_walking', compact ? '😡 Hey!' : '😡 Hey! Don’t touch me!');

    walkDir.current = posX.current >= 0 ? -1 : 1;
    targetPosX.current = compact ? 0 : walkDir.current * 1.5;
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

    // 1. ANGRY WALKING / MARCHING
    if (behaviorRef.current === 'angry_walking') {
      walkClock.current += delta;

      if (headGroup.current) {
        headGroup.current.rotation.y = Math.sin(t * 24) * 0.28;
        headGroup.current.rotation.z = Math.cos(t * 18) * 0.08;
      }

      const targetFacing = compact
        ? Math.sin(t * 12) * 0.15
        : walkDir.current > 0
        ? Math.PI / 2
        : -Math.PI / 2;
      rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, targetFacing, 0.18);
      rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, 0.08, 0.1);

      posX.current = THREE.MathUtils.lerp(posX.current, targetPosX.current, 0.05);
      rootRef.current.position.x = posX.current;
      rootRef.current.position.y = (compact ? -0.42 : -0.15) + Math.abs(Math.sin(walkClock.current * 10)) * 0.08;

      // Authentic R6 Walk cycle
      const step = Math.sin(walkClock.current * 10);
      if (leftHip.current) leftHip.current.rotation.x = step * 0.8;
      if (rightHip.current) rightHip.current.rotation.x = -step * 0.8;
      if (leftShoulder.current) leftShoulder.current.rotation.x = -step * 0.7;
      if (rightShoulder.current) rightShoulder.current.rotation.x = step * 0.7;
      return;
    }

    // 2. LYING DOWN
    if (behaviorRef.current === 'lying_down') {
      rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, -Math.PI / 2, 0.1);
      rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, 0, 0.1);
      rootRef.current.position.y = THREE.MathUtils.lerp(rootRef.current.position.y, compact ? -0.85 : -0.65, 0.1);

      if (leftHip.current) leftHip.current.rotation.x = 0;
      if (rightHip.current) rightHip.current.rotation.x = 0;
      if (leftShoulder.current) leftShoulder.current.rotation.x = 0;
      if (rightShoulder.current) rightShoulder.current.rotation.x = 0;
      return;
    }

    // 3. SITTING
    if (behaviorRef.current === 'sitting') {
      rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, 0, 0.1);
      rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, -0.25, 0.1);
      rootRef.current.position.y = THREE.MathUtils.lerp(rootRef.current.position.y, compact ? -0.6 : -0.4, 0.1);

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
    posX.current = THREE.MathUtils.lerp(posX.current, 0, 0.1);
    rootRef.current.position.x = posX.current;
    rootRef.current.position.y = THREE.MathUtils.lerp(rootRef.current.position.y, compact ? -0.42 : -0.15, 0.1);
    rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, 0, 0.1);

    if (leftHip.current) leftHip.current.rotation.x = THREE.MathUtils.lerp(leftHip.current.rotation.x, 0, 0.15);
    if (rightHip.current) rightHip.current.rotation.x = THREE.MathUtils.lerp(rightHip.current.rotation.x, 0, 0.15);

    // Subtle pointer tracking
    const targetRotY = (state.pointer.x * Math.PI) / 6 - 0.15;
    rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, targetRotY, 0.08);

    if (leftShoulder.current) {
      leftShoulder.current.rotation.z = -0.18 + Math.sin(t * 1.8) * 0.03;
      leftShoulder.current.rotation.x = THREE.MathUtils.lerp(leftShoulder.current.rotation.x, 0, 0.15);
    }
    if (rightShoulder.current) {
      rightShoulder.current.rotation.z = 0.18 - Math.sin(t * 1.8) * 0.03;
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
      position={[0, compact ? -0.42 : -0.15, 0]}
      scale={compact ? 0.72 : 0.78}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerEnter}
      onPointerUp={handlePointerLeave}
    >
      {/* Invisible bounding hitbox */}
      <mesh position={[0, 0.7, 0]} visible={false}>
        <boxGeometry args={[2.8, 3.4, 2.0]} />
      </mesh>

      {/* ================================================================ */}
      {/* 1. HEAD & FEATURES                                               */}
      {/* ================================================================ */}
      <group ref={headGroup} position={[0, 1.85, 0]}>
        {/* Head Block */}
        <RoundedBox args={[1.05, 1.05, 1.05]} radius={0.08} smoothness={4} material={skinMaterial} />

        {/* Neck */}
        <mesh position={[0, -0.56, 0]} material={skinMaterial}>
          <cylinderGeometry args={[0.3, 0.3, 0.15, 16]} />
        </mesh>

        {/* Front Face Texture (Anime > < laughing eyes & open mouth) */}
        {faceTexture && (
          <mesh position={[0, 0, 0.53]}>
            <planeGeometry args={[1.04, 1.04]} />
            <meshStandardMaterial map={faceTexture} transparent roughness={0.45} />
          </mesh>
        )}

        {/* ------------------------------------------------------------- */}
        {/* Layered Chocolate Brown Anime Hair                             */}
        {/* ------------------------------------------------------------- */}
        {/* Main top & side hair volume cap */}
        <mesh position={[0, 0.28, -0.04]} material={hairMaterial}>
          <boxGeometry args={[1.14, 0.72, 1.16]} />
        </mesh>
        <mesh position={[0, 0.52, -0.02]} material={hairHighlightMaterial}>
          <boxGeometry args={[0.96, 0.28, 0.98]} />
        </mesh>

        {/* Hair Back Layers (reaching down towards nape of neck) */}
        <mesh position={[0, -0.14, -0.56]} material={hairMaterial}>
          <boxGeometry args={[1.12, 0.82, 0.22]} />
        </mesh>
        <mesh position={[0, -0.38, -0.54]} material={hairHighlightMaterial}>
          <boxGeometry args={[1.02, 0.44, 0.18]} />
        </mesh>

        {/* Left Side Hair Locks (framing face) */}
        <mesh position={[-0.57, 0.02, 0.05]} material={hairMaterial}>
          <boxGeometry args={[0.18, 0.95, 1.08]} />
        </mesh>
        <mesh position={[-0.56, -0.32, 0.26]} rotation={[0.1, 0, 0.08]} material={hairHighlightMaterial}>
          <boxGeometry args={[0.14, 0.55, 0.35]} />
        </mesh>

        {/* Right Side Hair Locks (framing face) */}
        <mesh position={[0.57, 0.02, 0.05]} material={hairMaterial}>
          <boxGeometry args={[0.18, 0.95, 1.08]} />
        </mesh>
        <mesh position={[0.56, -0.32, 0.26]} rotation={[0.1, 0, -0.08]} material={hairHighlightMaterial}>
          <boxGeometry args={[0.14, 0.55, 0.35]} />
        </mesh>

        {/* Front Bangs (Anime strands falling over forehead) */}
        {/* Left Bang */}
        <mesh position={[-0.32, 0.26, 0.56]} rotation={[0, 0, -0.15]} material={hairMaterial}>
          <boxGeometry args={[0.38, 0.48, 0.12]} />
        </mesh>
        {/* Center Bangs Left */}
        <mesh position={[-0.1, 0.34, 0.57]} rotation={[0, 0, -0.05]} material={hairHighlightMaterial}>
          <boxGeometry args={[0.26, 0.42, 0.11]} />
        </mesh>
        {/* Center Bangs Right */}
        <mesh position={[0.14, 0.32, 0.57]} rotation={[0, 0, 0.12]} material={hairMaterial}>
          <boxGeometry args={[0.28, 0.44, 0.11]} />
        </mesh>
        {/* Right Bang */}
        <mesh position={[0.36, 0.24, 0.56]} rotation={[0, 0, 0.18]} material={hairHighlightMaterial}>
          <boxGeometry args={[0.36, 0.5, 0.12]} />
        </mesh>

        {/* Additional tapered tips for messy anime aesthetic */}
        <mesh position={[-0.42, 0.02, 0.55]} rotation={[0, 0, -0.22]} material={hairMaterial}>
          <boxGeometry args={[0.16, 0.36, 0.08]} />
        </mesh>
        <mesh position={[0.42, 0.02, 0.55]} rotation={[0, 0, 0.22]} material={hairMaterial}>
          <boxGeometry args={[0.16, 0.36, 0.08]} />
        </mesh>

        {/* ------------------------------------------------------------- */}
        {/* 3D Paper Talisman on Forehead ("NOT MY LOVE")                 */}
        {/* Positioned on front of hair/forehead with realistic 3D depth  */}
        {/* ------------------------------------------------------------- */}
        <group position={[0.02, 0.32, 0.62]} rotation={[-0.08, 0.04, 0.08]}>
          {/* Paper backing */}
          <mesh material={paperTalismanMaterial}>
            <boxGeometry args={[0.32, 0.32, 0.015]} />
          </mesh>
          {/* Black inner border */}
          <mesh position={[0, 0, 0.009]}>
            <planeGeometry args={[0.28, 0.28]} />
            <meshBasicMaterial color="#0f172a" wireframe wireframeLinewidth={2} />
          </mesh>
          {/* Tape on top */}
          <mesh position={[0, 0.16, 0.012]}>
            <boxGeometry args={[0.12, 0.045, 0.005]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
        </group>
      </group>

      {/* ================================================================ */}
      {/* 2. TORSO & T-SHIRT                                               */}
      {/* ================================================================ */}
      <group ref={torsoGroup} position={[0, 0.65, 0]}>
        {/* Main Torso Base (White T-shirt) */}
        <RoundedBox args={[1.65, 1.65, 0.88]} radius={0.06} smoothness={4} material={whiteShirtMaterial} />

        {/* Crew Neckline Ribbing */}
        <mesh position={[0, 0.82, 0]} material={whiteShirtMaterial}>
          <boxGeometry args={[1.15, 0.08, 0.68]} />
        </mesh>

        {/* Front Shirt Face: Pusheen with Glasses & Crossbody Strap */}
        {shirtFrontTexture && (
          <mesh position={[0, 0, 0.445]}>
            <planeGeometry args={[1.64, 1.64]} />
            <meshStandardMaterial map={shirtFrontTexture} transparent roughness={0.35} />
          </mesh>
        )}

        {/* Physical 3D Crossbody Strap overlay across the front */}
        <mesh position={[0.08, 0.06, 0.455]} rotation={[0, 0, -0.68]} material={strapMaterial}>
          <boxGeometry args={[2.05, 0.16, 0.025]} />
        </mesh>

        {/* Strap metallic buckle */}
        <mesh position={[0.42, -0.32, 0.468]} rotation={[0, 0, -0.68]}>
          <boxGeometry args={[0.22, 0.18, 0.03]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Physical 3D Crossbody Strap overlay across the back */}
        <mesh position={[-0.08, 0.06, -0.455]} rotation={[0, 0, 0.68]} material={strapMaterial}>
          <boxGeometry args={[2.05, 0.16, 0.025]} />
        </mesh>

        {/* ------------------------------------------------------------- */}
        {/* BACKPACK: Tan Duffle Messenger Bag with Pusheen & Banknotes   */}
        {/* ------------------------------------------------------------- */}
        <group position={[-0.05, 0.12, -0.68]} rotation={[0.04, -0.06, 0.05]}>
          {/* Main Duffle Body */}
          <RoundedBox args={[1.18, 0.95, 0.54]} radius={0.12} smoothness={4} material={tanBagMaterial} />

          {/* Bag Piping / Edge Straps */}
          <mesh position={[-0.38, 0, 0]} material={strapMaterial}>
            <boxGeometry args={[0.12, 0.96, 0.56]} />
          </mesh>
          <mesh position={[0.38, 0, 0]} material={strapMaterial}>
            <boxGeometry args={[0.12, 0.96, 0.56]} />
          </mesh>

          {/* Top Zipper / Opening Band */}
          <mesh position={[0, 0.46, 0]}>
            <boxGeometry args={[1.12, 0.06, 0.48]} />
            <meshStandardMaterial color="#786655" roughness={0.4} />
          </mesh>

          {/* Top Carry Handles */}
          <group position={[0, 0.56, 0]}>
            <mesh material={strapMaterial}>
              <boxGeometry args={[0.5, 0.14, 0.08]} />
            </mesh>
          </group>

          {/* Rear Face of Bag: Pusheen Eating Strawberry Donut! */}
          {backpackTexture && (
            <mesh position={[0, 0, -0.275]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[1.16, 0.93]} />
              <meshStandardMaterial map={backpackTexture} roughness={0.45} />
            </mesh>
          )}

          {/* Round Pin / Badge on the strap */}
          <mesh position={[-0.38, 0.32, -0.29]} rotation={[0, Math.PI, 0]} material={badgeMaterial}>
            <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
          </mesh>

          {/* ----------------------------------------------------------- */}
          {/* Banknotes / Currency Notes sticking out of top zipper       */}
          {/* ----------------------------------------------------------- */}
          <group position={[0, 0.48, 0]}>
            {/* Note 1 (Left tilted) */}
            <mesh position={[-0.32, 0.12, -0.05]} rotation={[-0.15, 0.1, 0.22]}>
              <planeGeometry args={[0.26, 0.38]} />
              <meshStandardMaterial
                map={cashTexture ?? undefined}
                color={cashTexture ? undefined : '#a7f3d0'}
                roughness={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Note 2 (Center Left) */}
            <mesh position={[-0.12, 0.18, 0.02]} rotation={[-0.12, -0.05, 0.08]}>
              <planeGeometry args={[0.26, 0.42]} />
              <meshStandardMaterial
                map={cashTexture ?? undefined}
                color={cashTexture ? undefined : '#a7f3d0'}
                roughness={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Note 3 (Center Right) */}
            <mesh position={[0.12, 0.22, -0.02]} rotation={[-0.08, 0.08, -0.12]}>
              <planeGeometry args={[0.26, 0.45]} />
              <meshStandardMaterial
                map={cashTexture ?? undefined}
                color={cashTexture ? undefined : '#a7f3d0'}
                roughness={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Note 4 (Right tilted) */}
            <mesh position={[0.32, 0.14, 0.04]} rotation={[-0.14, -0.1, -0.2]}>
              <planeGeometry args={[0.26, 0.38]} />
              <meshStandardMaterial
                map={cashTexture ?? undefined}
                color={cashTexture ? undefined : '#a7f3d0'}
                roughness={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        </group>
      </group>

      {/* ================================================================ */}
      {/* 3. LEFT ARM (Short Sleeve White Shirt + Bare Skin)               */}
      {/* ================================================================ */}
      <group ref={leftShoulder} position={[-1.24, 1.35, 0]}>
        {/* Upper White T-Shirt Sleeve */}
        <mesh position={[0, -0.22, 0]}>
          <RoundedBox args={[0.74, 0.46, 0.86]} radius={0.05} smoothness={4} material={whiteShirtMaterial} />
        </mesh>
        {/* Sleeve Cuff Hem */}
        <mesh position={[0, -0.45, 0]} material={whiteShirtMaterial}>
          <boxGeometry args={[0.76, 0.08, 0.88]} />
        </mesh>

        {/* Lower Arm (Bare Skin) */}
        <mesh position={[0, -0.92, 0]}>
          <RoundedBox args={[0.72, 0.86, 0.84]} radius={0.05} smoothness={4} material={skinMaterial} />
        </mesh>
      </group>

      {/* ================================================================ */}
      {/* 4. RIGHT ARM (Short Sleeve White Shirt + Bare Skin)              */}
      {/* ================================================================ */}
      <group ref={rightShoulder} position={[1.24, 1.35, 0]}>
        {/* Upper White T-Shirt Sleeve */}
        <mesh position={[0, -0.22, 0]}>
          <RoundedBox args={[0.74, 0.46, 0.86]} radius={0.05} smoothness={4} material={whiteShirtMaterial} />
        </mesh>
        {/* Sleeve Cuff Hem */}
        <mesh position={[0, -0.45, 0]} material={whiteShirtMaterial}>
          <boxGeometry args={[0.76, 0.08, 0.88]} />
        </mesh>

        {/* Lower Arm (Bare Skin) */}
        <mesh position={[0, -0.92, 0]}>
          <RoundedBox args={[0.72, 0.86, 0.84]} radius={0.05} smoothness={4} material={skinMaterial} />
        </mesh>
      </group>

      {/* ================================================================ */}
      {/* 5. LEFT LEG (White Baggy Cargo Pants with Pockets & Cuffs)       */}
      {/* ================================================================ */}
      <group ref={leftHip} position={[-0.43, -0.18, 0]}>
        {/* Main Leg Block */}
        <mesh position={[0, -0.65, 0]}>
          <RoundedBox args={[0.74, 1.3, 0.86]} radius={0.06} smoothness={4} material={whitePantsMaterial} />
        </mesh>

        {/* Outer Flap Cargo Pocket (Left Leg) */}
        <mesh position={[-0.39, -0.5, 0]} material={whitePantsMaterial}>
          <boxGeometry args={[0.07, 0.48, 0.46]} />
        </mesh>
        {/* Flap */}
        <mesh position={[-0.4, -0.26, 0]} material={whiteShirtMaterial}>
          <boxGeometry args={[0.08, 0.12, 0.48]} />
        </mesh>

        {/* Front / Back Pants Texture Accent */}
        {pantsTexture && (
          <mesh position={[0, -0.65, 0.435]}>
            <planeGeometry args={[0.72, 1.28]} />
            <meshStandardMaterial map={pantsTexture} transparent roughness={0.45} />
          </mesh>
        )}

        {/* Rolled Bottom Pant Cuff */}
        <mesh position={[0, -1.24, 0]} material={whiteShirtMaterial}>
          <boxGeometry args={[0.78, 0.14, 0.9]} />
        </mesh>

        {/* White Sneaker / Shoe Bottom */}
        <mesh position={[0, -1.36, 0.04]} material={whiteShirtMaterial}>
          <boxGeometry args={[0.76, 0.12, 0.96]} />
        </mesh>
        <mesh position={[0, -1.44, 0.04]}>
          <boxGeometry args={[0.78, 0.04, 0.98]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>
      </group>

      {/* ================================================================ */}
      {/* 6. RIGHT LEG (White Baggy Cargo Pants with Pockets & Cuffs)      */}
      {/* ================================================================ */}
      <group ref={rightHip} position={[0.43, -0.18, 0]}>
        {/* Main Leg Block */}
        <mesh position={[0, -0.65, 0]}>
          <RoundedBox args={[0.74, 1.3, 0.86]} radius={0.06} smoothness={4} material={whitePantsMaterial} />
        </mesh>

        {/* Outer Flap Cargo Pocket (Right Leg) */}
        <mesh position={[0.39, -0.5, 0]} material={whitePantsMaterial}>
          <boxGeometry args={[0.07, 0.48, 0.46]} />
        </mesh>
        {/* Flap */}
        <mesh position={[0.4, -0.26, 0]} material={whiteShirtMaterial}>
          <boxGeometry args={[0.08, 0.12, 0.48]} />
        </mesh>

        {/* Front / Back Pants Texture Accent */}
        {pantsTexture && (
          <mesh position={[0, -0.65, 0.435]}>
            <planeGeometry args={[0.72, 1.28]} />
            <meshStandardMaterial map={pantsTexture} transparent roughness={0.45} />
          </mesh>
        )}

        {/* Rolled Bottom Pant Cuff */}
        <mesh position={[0, -1.24, 0]} material={whiteShirtMaterial}>
          <boxGeometry args={[0.78, 0.14, 0.9]} />
        </mesh>

        {/* White Sneaker / Shoe Bottom */}
        <mesh position={[0, -1.36, 0.04]} material={whiteShirtMaterial}>
          <boxGeometry args={[0.76, 0.12, 0.96]} />
        </mesh>
        <mesh position={[0, -1.44, 0.04]}>
          <boxGeometry args={[0.78, 0.04, 0.98]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>
      </group>

      {/* ================================================================ */}
      {/* 7. GROUND SHADOW                                                 */}
      {/* ================================================================ */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]} material={shadowMaterial}>
        <circleGeometry args={[1.15, 32]} />
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
    <div className="w-full h-full relative select-none touch-pan-y flex items-center justify-center overflow-visible">
      {/* Floating Status Mood Badge - Cleanly positioned ABOVE the head */}
      <div className={`absolute ${compact ? 'top-1' : 'top-1 sm:top-2'} left-1/2 -translate-x-1/2 z-30 pointer-events-none max-w-[95%]`}>
        <div
          className={`rounded-full font-mono font-medium backdrop-blur-md border shadow-xl transition-all duration-300 flex items-center whitespace-nowrap overflow-hidden text-ellipsis ${
            compact ? 'px-2.5 py-0.5 text-[10px] gap-1' : 'px-3 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs gap-1.5 sm:gap-2'
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

      {/* 3D Canvas with authentic studio lighting */}
      <Canvas
        camera={{ position: [0, compact ? 0.05 : 0.1, compact ? 5.6 : 5.4], fov: compact ? 42 : 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ touchAction: 'pan-y' }}
      >
        <ambientLight intensity={1.9} color="#ffffff" />
        <directionalLight position={[5, 6, 5]} intensity={2.6} color="#ffffff" />
        <directionalLight position={[-5, 4, 4]} intensity={1.8} color="#f8fafc" />
        <directionalLight position={[0, 5, -5]} intensity={2.8} color="#e0f2fe" />
        <directionalLight position={[0, -4, 3]} intensity={1.0} color="#ffffff" />

        <RobloxDeveloperAvatar
          scrollOffset={scrollOffset}
          compact={compact}
          onBehaviorChange={handleBehaviorChange}
        />
      </Canvas>
    </div>
  );
}
