'use client';

import React from 'react';
import { ArrowUp } from 'lucide-react';
import { DEVELOPER_INFO } from '@/lib/constants';
import { soundFx } from '@/lib/audio';

export default function Footer() {
  const scrollToTop = () => {
    soundFx.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-8 sm:py-12 bg-[#0b0c10] border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
            <span className="text-white font-semibold">Created By Arup</span>
            <span>•</span>
            <span>Aspiring Developer</span>
            <span>•</span>
            <span className="text-gray-400">Discord: {DEVELOPER_INFO.discord}</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              onMouseEnter={() => soundFx.playHover()}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/[0.04] text-[10px] sm:text-[11px] text-gray-600 text-center sm:text-left">
          Roblox is a registered trademark of Roblox Corporation. This site is an independent portfolio showcase.
        </div>
      </div>
    </footer>
  );
}
