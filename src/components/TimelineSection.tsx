'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function TimelineSection() {
  const milestones = [
    {
      year: 'THE START',
      title: 'Started building in Roblox Studio',
      description: 'Learned to script and design mechanics from the ground up: the starting point for everything after.',
      active: false,
    },
    {
      year: 'LIVE EXP',
      title: 'Developer on Sylhety Vibes, LAXUIRES PARK, Lumina Hangout & Last Fade',
      description: 'Joined active games as a lead developer & systems architect, engineering custom physics and server architecture.',
      active: false,
    },
    {
      year: 'SYSTEMS',
      title: 'Engineered ready-to-deploy modular frameworks',
      description: 'Built scalable Luau modules, minigame templates, and overhead title systems used across community servers.',
      active: false,
    },
    {
      year: 'NOW',
      title: 'Building, and open to work',
      description: 'Shipping ready made systems, working as a perm dev for studios, and building next-gen Roblox experiences.',
      active: true,
    },
  ];

  return (
    <section id="journey" className="py-12 sm:py-20 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">
              06 · JOURNEY
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              How it&apos;s going.
            </h2>
          </div>

          <div className="text-xs sm:text-sm text-gray-400 font-sans">
            A short timeline, growing as things happen.
          </div>
        </div>

        {/* Timeline Items List */}
        <div className="space-y-3.5 sm:space-y-4 max-w-4xl">
          {milestones.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="p-4 sm:p-5 rounded-2xl bg-[#121318] border border-white/[0.07] flex items-start gap-3 sm:gap-4"
            >
              <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-[9px] sm:text-[10px] font-mono text-gray-300 font-bold shrink-0 mt-0.5">
                {item.year}
              </div>

              <div>
                <h4 className="text-xs sm:text-base font-bold text-white mb-1 flex items-center gap-2">
                  <span>{item.title}</span>
                  {item.active && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 live-dot shrink-0" />
                  )}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
