'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code, Gamepad2, Wrench } from 'lucide-react';
import { soundFx } from '@/lib/audio';

export default function TechStackMatrix() {
  const skillCategories = [
    {
      title: 'Scripting',
      icon: Code,
      tags: [
        'Luau / Lua',
        'Strict Typing',
        'Client/server logic',
        'ModuleScripts',
        'OOP Architecture',
        'Knit Framework',
      ],
    },
    {
      title: 'Game dev',
      icon: Gamepad2,
      tags: [
        'Roblox Studio',
        'Game mechanics design',
        'UI / UX for tools',
        'Custom physics',
        'Future lighting (FIB)',
        'Collision tuning',
      ],
    },
    {
      title: 'Workflow',
      icon: Wrench,
      tags: [
        'Version control (Git)',
        'Rojo sync',
        'ProfileService',
        'DataStore2',
        'Anti-exploit checks',
        'Performance profiling',
      ],
    },
  ];

  return (
    <section id="skills" className="py-12 sm:py-20 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">
              02 · SKILLS
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              What I work with.
            </h2>
          </div>

          <div className="text-xs sm:text-sm text-gray-400 font-sans">
            The toolkit behind the builds.
          </div>
        </div>

        {/* 3 Skill Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {skillCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="p-5 sm:p-6 rounded-2xl bg-[#121318] border border-white/[0.06] hover:border-white/[0.15] transition-colors"
              >
                {/* Card Title with Icon */}
                <div className="flex items-center gap-2.5 mb-4 sm:mb-5 text-white font-semibold text-sm sm:text-base">
                  <Icon className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>{cat.title}</span>
                </div>

                {/* Pill Tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {cat.tags.map((tag) => (
                    <span
                      key={tag}
                      onMouseEnter={() => soundFx.playHover()}
                      className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] sm:text-xs text-gray-300 hover:text-white hover:bg-white/[0.08] transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
