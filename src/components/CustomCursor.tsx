'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useSpring(0, { damping: 30, stiffness: 400 });
  const cursorY = useSpring(0, { damping: 30, stiffness: 400 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }
    setMounted(true);

    const moveHandler = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button')
      ) {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };

    const mouseLeaveHandler = () => setIsVisible(false);
    const mouseEnterHandler = () => setIsVisible(true);

    window.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseleave', mouseLeaveHandler);
    document.addEventListener('mouseenter', mouseEnterHandler);

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseleave', mouseLeaveHandler);
      document.removeEventListener('mouseenter', mouseEnterHandler);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!mounted || !isVisible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-50 rounded-full mix-blend-screen"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
        width: isPointer ? 32 : 12,
        height: isPointer ? 32 : 12,
        backgroundColor: isPointer ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.75)',
        border: isPointer ? '1px solid rgba(56, 189, 248, 0.5)' : 'none',
        backdropFilter: isPointer ? 'blur(2px)' : 'none',
        transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s, border 0.2s',
      }}
    />
  );
}
