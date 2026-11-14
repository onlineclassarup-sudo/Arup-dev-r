'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, ExternalLink, Users, Eye, CheckCircle2 } from 'lucide-react';
import { RobloxGame } from '@/types';
import { formatCompactNumber, formatFullNumber } from '@/lib/utils';
import { soundFx } from '@/lib/audio';

interface GameModalProps {
  game: RobloxGame | null;
  onClose: () => void;
}

export default function GameModal({ game, onClose }: GameModalProps) {
  if (!game) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl rounded-2xl bg-[#0d121f] border border-white/[0.1] shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header Banner Image */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-slate-900 overflow-hidden shrink-0">
            <Image
              src={game.thumbnail || game.fallbackThumbnail}
              alt={game.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 800px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d121f] via-[#0d121f]/50 to-transparent" />

            {/* Close Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-gray-300 hover:text-white transition-colors backdrop-blur-md z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badge on Banner */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-mono font-medium backdrop-blur-md border ${
                  game.role === 'Lead Developer'
                    ? 'bg-sky-500/15 border-sky-400/40 text-sky-300'
                    : 'bg-white/[0.08] border-white/[0.15] text-gray-300'
                }`}
              >
                ★ {game.role}
              </span>
            </div>

            {/* Title & Live Status on Banner */}
            <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-display text-lg sm:text-3xl font-bold text-white">
                  {game.title}
                </h3>
                <p className="text-[11px] sm:text-xs font-mono text-gray-300 mt-0.5">
                  {game.category} • {game.genre}
                </p>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto px-2.5 py-1 rounded-full bg-black/60 border border-white/[0.1] text-emerald-400 text-[11px] sm:text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 live-dot shrink-0" />
                <span>{game.stats.playing} Playing</span>
              </div>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="flex flex-col items-center justify-center p-2 text-center">
                <div className="flex items-center gap-1 text-[11px] font-mono text-gray-400 mb-0.5">
                  <Eye className="w-3.5 h-3.5 text-sky-400" />
                  <span>Visits</span>
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-white">
                  {formatCompactNumber(game.stats.visits)}
                </div>
                <div className="text-[10px] font-mono text-gray-400">
                  ({formatFullNumber(game.stats.visits)})
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-2 text-center">
                <div className="flex items-center gap-1 text-[11px] font-mono text-gray-400 mb-0.5">
                  <span className="text-amber-400">★</span>
                  <span>Favorites</span>
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-white">
                  {formatCompactNumber(game.stats.favoritedCount)}
                </div>
                <div className="text-[10px] font-mono text-gray-400">Community</div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-2 text-center">
                <div className="flex items-center gap-1 text-[11px] font-mono text-gray-400 mb-0.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CCU Live</span>
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-emerald-400">
                  {game.stats.playing} Active
                </div>
                <div className="text-[10px] font-mono text-gray-400">Real-time</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                Overview & Architecture
              </h4>
              <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                {game.description}
              </p>
            </div>

            {/* Key Contributions & Systems */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                Engineering Highlights
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {game.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-start gap-2.5 text-xs text-gray-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Place Telemetry Specs */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] text-[11px] font-mono text-gray-400 space-y-1">
              <div className="flex justify-between items-center py-0.5">
                <span>Universe ID:</span>
                <span className="text-white select-all">{game.universeId}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span>Place ID:</span>
                <span className="text-white select-all">{game.placeId}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span>Engineering Lead:</span>
                <span className="text-sky-300 font-semibold">{game.role}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={game.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => soundFx.playHover()}
                onClick={() => soundFx.playClick()}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-semibold text-black bg-white hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-98"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Play Live on Roblox</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-600" />
              </a>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-medium bg-white/[0.05] hover:bg-white/[0.08] text-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
