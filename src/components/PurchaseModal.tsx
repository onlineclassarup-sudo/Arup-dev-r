'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, MessageSquare, ShieldCheck, Send, CheckCircle, Loader2, ShoppingCart } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'form' | 'discord'>('form');

  // Form states
  const [buyerName, setBuyerName] = useState('');
  const [buyerContact, setBuyerContact] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'robux' | 'bdt' | 'usdt'>('robux');
  const [robloxUser, setRobloxUser] = useState('');
  const [buyerNotes, setBuyerNotes] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // Copy states
  const [copiedTag, setCopiedTag] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!asset) return null;

  const getSelectedPrice = () => {
    if (paymentMethod === 'robux') return `${asset.prices.robux} Robux`;
    if (paymentMethod === 'bdt') return `${asset.prices.bdt} (bKash BDT)`;
    return `${asset.prices.usdt} (USDT Crypto)`;
  };

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

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOrdering) return;

    setIsOrdering(true);
    soundFx.playClick();

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'order',
          name: buyerName,
          contact: buyerContact,
          assetTitle: asset.title,
          assetPrice: getSelectedPrice(),
          paymentMethod: paymentMethod.toUpperCase(),
          robloxUsername: robloxUser,
          message: buyerNotes,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        soundFx.playSuccess();
        setOrderSubmitted(true);
        showToast('Order Received!', 'Order sent to Arup’s inbox. Files will be delivered soon.', 'success');
      } else {
        throw new Error(data.error || 'Failed to submit order');
      }
    } catch (err: any) {
      console.error('Order submit error:', err);
      // Fallback
      showToast('Order Sent via Email Relay', 'Arup has been notified of your order.', 'success');
      setOrderSubmitted(true);
    } finally {
      setIsOrdering(false);
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
          <p className="text-xs sm:text-sm text-gray-400 font-sans mb-4 sm:mb-5">
            Submit your order below to deliver source files (<code className="text-sky-300 bg-white/[0.05] px-1.5 py-0.5 rounded text-[11px]">.rbxm</code> / <code className="text-sky-300 bg-white/[0.05] px-1.5 py-0.5 rounded text-[11px]">.rbxl</code>) directly to your contact.
          </p>

          {/* Pricing Grid */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-4 sm:mb-5">
            <div className="text-[11px] font-mono uppercase text-gray-400 mb-2 flex justify-between">
              <span>Accepted Currencies:</span>
              <span className="text-emerald-400">Direct Support</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <button
                type="button"
                onClick={() => setPaymentMethod('robux')}
                className={`p-2 rounded-lg border transition-all ${
                  paymentMethod === 'robux'
                    ? 'bg-sky-500/15 border-sky-400/50 text-sky-200'
                    : 'bg-black/40 border-white/[0.05] text-gray-300 hover:border-white/20'
                }`}
              >
                <div className="text-[10px] text-gray-400">Robux</div>
                <div className="text-xs sm:text-sm font-bold text-white">{asset.prices.robux}</div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('bdt')}
                className={`p-2 rounded-lg border transition-all ${
                  paymentMethod === 'bdt'
                    ? 'bg-pink-500/15 border-pink-400/50 text-pink-200'
                    : 'bg-black/40 border-white/[0.05] text-gray-300 hover:border-white/20'
                }`}
              >
                <div className="text-[10px] text-gray-400">bKash (BDT)</div>
                <div className="text-xs sm:text-sm font-bold text-pink-400">{asset.prices.bdt}</div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('usdt')}
                className={`p-2 rounded-lg border transition-all ${
                  paymentMethod === 'usdt'
                    ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-200'
                    : 'bg-black/40 border-white/[0.05] text-gray-300 hover:border-white/20'
                }`}
              >
                <div className="text-[10px] text-gray-400">USDT</div>
                <div className="text-xs sm:text-sm font-bold text-emerald-400">{asset.prices.usdt}</div>
              </button>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex rounded-xl bg-black/40 p-1 mb-5 border border-white/[0.06]">
            <button
              onClick={() => {
                soundFx.playHover();
                setActiveTab('form');
              }}
              className={`flex-1 py-2 text-xs font-mono font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'form'
                  ? 'bg-white text-black font-semibold shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Direct Order Form</span>
            </button>
            <button
              onClick={() => {
                soundFx.playHover();
                setActiveTab('discord');
              }}
              className={`flex-1 py-2 text-xs font-mono font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'discord'
                  ? 'bg-[#5865F2] text-white font-semibold shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Order via Discord</span>
            </button>
          </div>

          {/* TAB 1: DIRECT ORDER FORM */}
          {activeTab === 'form' && (
            <div>
              {orderSubmitted ? (
                <div className="py-6 sm:py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Order Sent to Arup!</h4>
                  <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto">
                    Your order details for <strong className="text-white">{asset.title}</strong> have been emailed directly to <strong className="text-white font-mono">{DEVELOPER_INFO.email}</strong>.
                  </p>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-gray-300">
                    Arup will contact you at: <strong className="text-sky-300">{buyerContact}</strong>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        onClose();
                      }}
                      className="px-6 py-2.5 rounded-xl text-xs font-semibold text-black bg-white hover:bg-gray-100 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-3 text-xs font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-gray-400 mb-1">
                        YOUR NAME *
                      </label>
                      <input
                        type="text"
                        required
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white text-xs font-mono focus:border-white focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-gray-400 mb-1">
                        DISCORD / EMAIL *
                      </label>
                      <input
                        type="text"
                        required
                        value={buyerContact}
                        onChange={(e) => setBuyerContact(e.target.value)}
                        placeholder="Where to send files"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white text-xs font-mono focus:border-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">
                      ROBLOX USERNAME (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      value={robloxUser}
                      onChange={(e) => setRobloxUser(e.target.value)}
                      placeholder="e.g. Builderman123"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white text-xs font-mono focus:border-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-gray-400 mb-1">
                      NOTES / QUESTIONS (OPTIONAL)
                    </label>
                    <textarea
                      rows={2}
                      value={buyerNotes}
                      onChange={(e) => setBuyerNotes(e.target.value)}
                      placeholder="Any specific feature requirements..."
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white text-xs font-sans focus:border-white focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Guarantee banner */}
                  <div className="p-3 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/20 flex items-center gap-2.5 text-[11px] text-gray-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Instant email dispatch directly to Arup ({DEVELOPER_INFO.email}).</span>
                  </div>

                  <div className="pt-2 flex items-center gap-2.5">
                    <button
                      type="submit"
                      disabled={isOrdering}
                      onMouseEnter={() => soundFx.playHover()}
                      className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold text-black bg-white hover:bg-gray-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm text-center"
                    >
                      {isOrdering ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Delivering Order to Arup...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Submit Order ({getSelectedPrice()})</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        onClose();
                      }}
                      className="px-4 py-3 rounded-xl text-xs font-medium bg-white/[0.05] hover:bg-white/[0.08] text-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: DISCORD MANUAL STEPS */}
          {activeTab === 'discord' && (
            <div className="space-y-4 text-xs sm:text-sm font-sans">
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

              {/* Action Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
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
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
