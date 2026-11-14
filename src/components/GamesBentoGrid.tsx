'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { RobloxGame } from '@/types';
import { INITIAL_GAMES } from '@/lib/constants';
import { formatCompactNumber } from '@/lib/utils';
import { soundFx } from '@/lib/audio';
import GameModal from './GameModal';

function ProjectCard({
  game,
  indexNumber,
  statusLabel,
  statusColor = 'emerald',
  onInspect,
}: {
  game: RobloxGame;
  indexNumber: string;
  statusLabel: string;
  statusColor?: 'emerald' | 'amber' | 'sky';
  onInspect: (g: RobloxGame) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="group rounded-2xl bg-[#121318] border border-white/[0.07] hover:border-white/[0.18] transition-all p-3 sm:p-3.5 flex flex-col justify-between"
    >
      <div>
        {/* Top 16:9 Thumbnail */}
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 mb-3 sm:mb-3.5">
          <Image
            src={game.thumbnail || game.fallbackThumbnail}
            alt={game.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Top-Right Status Badge */}
          <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-medium backdrop-blur-md bg-black/75 border border-white/[0.1] ${
                statusColor === 'emerald'
                  ? 'text-emerald-400'
                  : statusColor === 'amber'
                  ? 'text-amber-400'
                  : 'text-sky-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  statusColor === 'emerald'
                    ? 'bg-emerald-400 live-dot'
                    : statusColor === 'amber'
                    ? 'bg-amber-400'
                    : 'bg-sky-400'
                }`}
              />
              <span>{statusLabel}</span>
            </span>
          </div>

          {/* Small Creator Badge on Thumbnail bottom-left */}
          <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5">
            <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-gray-300 border border-white/[0.1]">
              {game.role === 'Lead Developer' ? 'Creator · Lead Dev' : 'Developer'}
            </span>
          </div>
        </div>

        {/* Card Header Info */}
        <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-gray-500 mb-1 px-1">
          <span>{game.role === 'Lead Developer' ? 'Creator · Developer' : 'Developer'}</span>
          <span>{indexNumber}</span>
        </div>

        {/* Game Title */}
        <h3 className="font-bold text-base sm:text-lg text-white mb-1 px-1 group-hover:text-sky-300 transition-colors">
          {game.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-400 font-sans leading-relaxed line-clamp-2 px-1 mb-3 sm:mb-4">
          {game.description}
        </p>
      </div>

      {/* Footer Metrics & Play Link */}
      <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-2.5 font-mono text-gray-400 text-[11px] sm:text-xs">
          <span className="flex items-center gap-1">
            <span className="text-gray-500">▶</span>
            <strong className="text-gray-300">{formatCompactNumber(game.stats.visits)}</strong> visits
          </span>
          <span className="flex items-center gap-1">
            <span className="text-amber-400">★</span>
            <strong className="text-gray-300">{game.stats.favoritedCount}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <button
            onClick={() => {
              soundFx.playClick();
              onInspect(game);
            }}
            className="text-[11px] sm:text-xs text-gray-400 hover:text-white transition-colors py-1 px-1.5"
          >
            Inspect
          </button>
          <a
            href={game.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => soundFx.playHover()}
            onClick={() => soundFx.playClick()}
            className="inline-flex items-center gap-1 font-semibold text-white hover:text-sky-400 transition-colors py-1 text-[11px] sm:text-xs"
          >
            <span>Play on Roblox</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function GamesBentoGrid() {
  const [games, setGames] = useState<RobloxGame[]>(INITIAL_GAMES);
  const [selectedGame, setSelectedGame] = useState<RobloxGame | null>(null);

  useEffect(() => {
    async function loadFreshTelemetry() {
      try {
        const res = await fetch('/api/roblox-stats');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.games) && data.games.length > 0) {
            setGames(data.games);
          }
        }
      } catch (e) {
        console.warn('Live games telemetry load warning:', e);
      }
    }
    loadFreshTelemetry();
  }, []);

  const myOwnGames = games.filter((g) => g.role === 'Lead Developer');
  const workedOnGames = games.filter((g) => g.role === 'Developer');

  return (
    <section id="work" className="py-12 sm:py-20 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">
              03 · WORK
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Things I build.
            </h2>
          </div>

          <div className="text-xs sm:text-sm text-gray-400 font-sans">
            Recent Roblox projects: games I made myself, and games I&apos;ve worked on as a developer.
          </div>
        </div>

        {/* Group 1: My own games */}
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-white" />
            <h3 className="text-sm font-semibold text-white tracking-wide">
              My own games
            </h3>
            <span className="px-1.5 py-0.2 rounded-full bg-white/[0.06] text-xs font-mono text-gray-400">
              {myOwnGames.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {myOwnGames.map((game, i) => (
              <ProjectCard
                key={game.placeId}
                game={game}
                indexNumber={`0${i + 1}`}
                statusLabel={i === 0 ? 'OUT NOW' : 'JUST UPDATED'}
                statusColor={i === 0 ? 'emerald' : 'sky'}
                onInspect={setSelectedGame}
              />
            ))}
          </div>
        </div>

        {/* Group 2: Worked on as a developer */}
        <div>
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Worked on as a developer
            </h3>
            <span className="px-1.5 py-0.2 rounded-full bg-white/[0.06] text-xs font-mono text-gray-400">
              {workedOnGames.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {workedOnGames.map((game, i) => (
              <ProjectCard
                key={game.placeId}
                game={game}
                indexNumber={`0${i + myOwnGames.length + 1}`}
                statusLabel="VERIFIED"
                statusColor="sky"
                onInspect={setSelectedGame}
              />
            ))}
          </div>
        </div>
      </div>

      <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
    </section>
  );
}
