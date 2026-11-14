'use client';

import React, { useEffect, useState } from 'react';
import { INITIAL_GAMES } from '@/lib/constants';
import { formatCompactNumber } from '@/lib/utils';

interface Aggregates {
  totalVisits: number;
  totalPlaying: number;
  totalFavorites: number;
  gamesCount: number;
}

export default function GlobalStatsTicker() {
  const [aggregates, setAggregates] = useState<Aggregates>(() => {
    const visits = INITIAL_GAMES.reduce((acc, g) => acc + g.stats.visits, 0);
    const playing = INITIAL_GAMES.reduce((acc, g) => acc + g.stats.playing, 0);
    const favs = INITIAL_GAMES.reduce((acc, g) => acc + g.stats.favoritedCount, 0);
    return {
      totalVisits: visits,
      totalPlaying: playing,
      totalFavorites: favs,
      gamesCount: INITIAL_GAMES.length,
    };
  });

  useEffect(() => {
    async function fetchLiveStats() {
      try {
        const res = await fetch('/api/roblox-stats');
        if (res.ok) {
          const data = await res.json();
          if (data?.aggregates) {
            setAggregates(data.aggregates);
          }
        }
      } catch (err) {
        console.warn('Telemetry poll error:', err);
      }
    }
    fetchLiveStats();
  }, []);

  return (
    <section id="about" className="py-10 sm:py-12 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Description Text */}
          <div className="lg:col-span-6 space-y-2">
            <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed max-w-lg">
              Most of what I build lives in Luau, from one-off gameplay systems to reusable modules I carry between projects. Still learning, still shipping.
            </p>
          </div>

          {/* Right Metrics Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Metric 1 */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#121318] border border-white/[0.06]">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-display mb-1">
                {aggregates.gamesCount}+
              </div>
              <div className="text-[11px] sm:text-xs text-gray-400 leading-snug">
                Roblox games built or worked on
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#121318] border border-white/[0.06]">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-display mb-1">
                {formatCompactNumber(aggregates.totalVisits)}+
              </div>
              <div className="text-[11px] sm:text-xs text-gray-400 leading-snug">
                Visits across games I&apos;ve built & worked on
              </div>
            </div>

            {/* Metric 3 */}
            <div className="col-span-2 sm:col-span-1 p-3.5 sm:p-4 rounded-2xl bg-[#121318] border border-white/[0.06] flex sm:flex-col justify-between items-center sm:items-start gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-400 font-display">
                  {aggregates.totalPlaying}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 live-dot shrink-0" />
              </div>
              <div className="text-[11px] sm:text-xs text-gray-400 leading-snug text-right sm:text-left">
                Live players currently active
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
