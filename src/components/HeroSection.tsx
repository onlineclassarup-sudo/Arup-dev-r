'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { soundFx } from '@/lib/audio';

const Hero3DCanvas = dynamic(() => import('./Hero3DCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] animate-pulse" />
    </div>
  ),
});

export default function HeroSection() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  return (
    <section className="relative pt-20 sm:pt-32 pb-8 sm:pb-12 min-h-0 sm:min-h-[85vh] flex flex-col justify-start sm:justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Hero Details */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.09] mb-4 sm:mb-6 max-w-full"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 live-dot shrink-0" />
              <span className="text-[11px] sm:text-xs text-gray-300 font-sans truncate">
                Systems available now · Open for perm dev & contracts
              </span>
            </motion.div>

            {/* Title + Mobile Avatar Row */}
            <div className="flex items-center justify-between gap-2 w-full mb-3 sm:mb-4">
              <div className="flex flex-col min-w-0">
                {/* Sub-label above big name */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 }}
                  className="text-xs sm:text-sm text-gray-400 font-sans font-medium mb-1"
                >
                  Developer, raised on Roblox Studio
                </motion.div>

                {/* Huge Name Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white select-none leading-none mb-2"
                >
                  Arup
                </motion.h1>

                {/* Typewriter Subtitle */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 }}
                  className="flex items-center gap-1.5 text-sm sm:text-base lg:text-lg font-mono text-gray-300"
                >
                  <span>Roblox developer</span>
                  <span className="inline-block w-2 sm:w-2.5 h-4 sm:h-5 bg-gray-300 animate-pulse ml-0.5" />
                </motion.div>
              </div>

              {/* On Mobile: Avatar is larger & prominent right beside the title block */}
              {isMounted && isMobile && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  className="w-[160px] h-[200px] sm:w-[190px] sm:h-[230px] relative shrink-0 -my-4"
                >
                  <Hero3DCanvas compact />
                </motion.div>
              )}
            </div>

            {/* Concise Bio */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="text-xs sm:text-base text-gray-400 font-sans leading-relaxed max-w-lg mb-6 sm:mb-8 mt-2"
            >
              I build things, on the baseplate and off it. Gameplay systems, UI and tools, from Roblox Studio scripts to everything built around them.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.25 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto"
            >
              <a
                href="#work"
                onMouseEnter={() => soundFx.playHover()}
                onClick={() => soundFx.playClick()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-black bg-white hover:bg-gray-100 transition-all shadow-md active:scale-95 text-center"
              >
                <span>See the work</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#services"
                onMouseEnter={() => soundFx.playHover()}
                onClick={() => soundFx.playClick()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-gray-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.2] transition-all active:scale-95 text-center"
              >
                <span>Systems & services</span>
              </a>
            </motion.div>
          </div>

          {/* Desktop Right Hero Space: 3D Roblox Avatar (Visible only on lg+) */}
          {isMounted && !isMobile && (
            <div className="lg:col-span-5 relative w-full h-[460px] flex items-center justify-center">
              <Hero3DCanvas />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
