'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, MessageSquare, ShieldCheck } from 'lucide-react';
import { StoreAsset } from '@/types';
import { DEVELOPER_INFO } from '@/lib/constants';
import { copyToClipboard } from '@/lib/utils';
import { soundFx } from '@/lib/audio';
import { useToast } from './Toast';

interface PurchaseModalProps {
  asset: StoreAsset | null;
  onClose: () => void;
}

export default function PurchaseModal({ asset, onClose }: PurchaseModalProps) {
  const { showToast } = useToast();
  const [copiedTag, setCopiedTag] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!asset) return null;

  const handleCopyDiscordTag = async () => {
    soundFx.playClick();
    const ok = await copyToClipboard(DEVELOPER_INFO.discord);
    if (ok) {
      setCopiedTag(true);
      showToast('Copied Discord Tag', `Send message to "${DEVELOPER_INFO.discord}"`, 'copy');
      setTimeout(() => setCopiedTag(false), 2400);
    }
  };

  const handleCopyMessage = async () => {
    soundFx.playClick();
    const ok = await copyToClipboard(asset.discordInquiryText);
    if (ok) {
      setCopiedMessage(true);
      showToast('Message Copied', 'Paste this directly in Discord to order', 'copy');
      setTimeout(() => setCopiedMessage(false), 2400);
    }
  };

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
          className="relative w-full max-w-xl rounded-2xl bg-[#0d121f] border border-white/[0.1] shadow-2xl p-5 sm:p-8 z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-medium bg-sky-500/10 text-sky-300 border border-sky-400/20">
              Direct Developer Delivery
            </span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">
            Acquire: {asset.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 font-sans mb-5 sm:mb-6">
            Follow the 3 quick steps below to complete payment and receive your source files (<code className="text-sky-300 bg-white/[0.05] px-1.5 py-0.5 rounded text-[11px]">.rbxm</code> / <code className="text-sky-300 bg-white/[0.05] px-1.5 py-0.5 rounded text-[11px]">.rbxl</code>).
          </p>

          {/* Pricing Grid */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-5 sm:mb-6">
            <div className="text-[11px] sm:text-xs font-mono uppercase text-gray-400 mb-2 flex justify-between">
              <span>Accepted Currencies:</span>
              <span className="text-emerald-400">Direct Support</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2 sm:p-2.5 rounded-lg bg-black/40 border border-white/[0.05]">
                <div className="text-[10px] text-gray-400">Robux</div>
                <div className="text-xs sm:text-sm font-bold text-white">{asset.prices.robux}</div>
              </div>
              <div className="p-2 sm:p-2.5 rounded-lg bg-black/40 border border-white/[0.05]">
                <div className="text-[10px] text-gray-400">bKash (BDT)</div>
                <div className="text-xs sm:text-sm font-bold text-pink-400">{asset.prices.bdt}</div>
              </div>
              <div className="p-2 sm:p-2.5 rounded-lg bg-black/40 border border-white/[0.05]">
                <div className="text-[10px] text-gray-400">USDT (Crypto)</div>
                <div className="text-xs sm:text-sm font-bold text-emerald-400">{asset.prices.usdt}</div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4 mb-6 text-xs sm:text-sm font-sans">
            {/* Step 1: Copy Discord Tag */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-white/[0.08] text-[11px] font-mono flex items-center justify-center">1</span>
                  <span>Connect on Discord</span>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-1 pl-6">
                  Add developer handle: <strong className="text-white font-mono">{DEVELOPER_INFO.discord}</strong>
                </p>
              </div>

              <button
                onClick={handleCopyDiscordTag}
                className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-gray-200 transition-colors flex items-center gap-1.5"
              >
                {copiedTag ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                <span>{copiedTag ? 'Copied' : 'Copy Tag'}</span>
              </button>
            </div>

            {/* Step 2: Copy Pre-formatted Message */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-white/[0.08] text-[11px] font-mono flex items-center justify-center">2</span>
                  <span>Copy Ready-to-Send Inquiry</span>
                </div>
                <button
                  onClick={handleCopyMessage}
                  className="px-3 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-gray-200 transition-colors flex items-center gap-1"
                >
                  {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                  <span>{copiedMessage ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-3 rounded-lg bg-black/50 border border-white/[0.05] text-[11px] font-mono text-gray-300 break-all select-all">
                {asset.discordInquiryText}
              </div>
            </div>

            {/* Step 3: Verified Guarantee */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/20 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-[11px] sm:text-xs text-gray-300 leading-relaxed">
                <strong className="text-white block mb-0.5">Verified Delivery Guarantee</strong>
                Delivery takes &lt; 15 mins during active hours. Includes lifetime bug-fixes and setup assistance in your place file.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <a
              href="https://discord.com/app"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => soundFx.playHover()}
              onClick={() => soundFx.playClick()}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-semibold text-black bg-white hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-sm text-center"
            >
              <MessageSquare className="w-4 h-4 fill-black" />
              <span>Open Discord to Order</span>
            </a>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-medium bg-white/[0.05] hover:bg-white/[0.08] text-gray-300 transition-colors text-center"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
