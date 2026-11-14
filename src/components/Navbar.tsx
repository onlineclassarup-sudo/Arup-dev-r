'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Copy, Check, Menu, X, ArrowRight } from 'lucide-react';
import { DEVELOPER_INFO } from '@/lib/constants';
import { soundFx } from '@/lib/audio';
import { useToast } from './Toast';
import { copyToClipboard } from '@/lib/utils';

export default function Navbar() {
  const { showToast } = useToast();
  const [isMuted, setIsMuted] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsMuted(soundFx.getMuted());

    const handleMuteChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ isMuted: boolean }>;
      setIsMuted(customEvent.detail.isMuted);
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('sound-mute-change', handleMuteChange);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('sound-mute-change', handleMuteChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSoundToggle = () => {
    const nextState = soundFx.toggleMute();
    setIsMuted(nextState);
  };

  const handleCopyDiscord = async () => {
    soundFx.playClick();
    const success = await copyToClipboard(DEVELOPER_INFO.discord);
    if (success) {
      setCopiedDiscord(true);
      showToast('Copied Discord Tag!', `Added "${DEVELOPER_INFO.discord}" to clipboard`, 'copy');
      setTimeout(() => setCopiedDiscord(false), 2400);
    }
  };

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Work', href: '#work' },
    { name: 'Services & Store', href: '#services' },
    { name: 'Journey', href: '#journey' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0b0c10]/95 backdrop-blur-md border-b border-white/[0.08] py-3'
          : 'bg-[#0b0c10]/40 backdrop-blur-sm sm:bg-transparent py-3.5 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          {/* Logo - "Created By Arup" with pill */}
          <Link
            href="/"
            onMouseEnter={() => soundFx.playHover()}
            onClick={() => soundFx.playClick()}
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
          >
            <span className="font-bold text-white text-sm sm:text-base tracking-tight">
              Created By Arup
            </span>
            <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-white/[0.08] text-[10px] sm:text-[11px] font-mono text-gray-400 border border-white/[0.1]">
              © 2026
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm text-gray-300">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onMouseEnter={() => soundFx.playHover()}
                onClick={() => soundFx.playClick()}
                className="hover:text-white transition-colors py-1"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Right Action Cluster */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Discord Copy Pill */}
            <button
              onClick={handleCopyDiscord}
              onMouseEnter={() => soundFx.playHover()}
              title="Copy Discord handle"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-gray-300 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>{DEVELOPER_INFO.discord}</span>
              {copiedDiscord ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleSoundToggle}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-gray-400 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-sky-400" />}
            </button>

            {/* Solid White Contact Button */}
            <a
              href="#contact"
              onMouseEnter={() => soundFx.playHover()}
              onClick={() => soundFx.playClick()}
              className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl text-xs font-semibold text-black bg-white hover:bg-gray-100 transition-all shadow-sm active:scale-95"
            >
              Contact
            </a>
          </div>

          {/* Mobile Actions: Audio toggle + Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={handleSoundToggle}
              className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-gray-300"
              title="Toggle Audio"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-gray-200 active:scale-95"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 p-4 rounded-2xl bg-[#121318] border border-white/[0.1] shadow-2xl flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-gray-300 hover:text-white py-2 px-2.5 rounded-lg hover:bg-white/[0.05] transition-colors"
              >
                {link.name}
              </a>
            ))}

            <div className="pt-3 mt-1 border-t border-white/[0.08] flex flex-col gap-2.5">
              <button
                onClick={handleCopyDiscord}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-gray-300"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span>Discord: {DEVELOPER_INFO.discord}</span>
                </div>
                {copiedDiscord ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Copied
                  </span>
                ) : (
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>

              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold text-black bg-white hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Get in touch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
