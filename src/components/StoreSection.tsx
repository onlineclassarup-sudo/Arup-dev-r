'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Users, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { STORE_ASSETS, DEVELOPER_INFO } from '@/lib/constants';
import { StoreAsset } from '@/types';
import { soundFx } from '@/lib/audio';
import { useToast } from './Toast';
import PurchaseModal from './PurchaseModal';

export default function StoreSection() {
  const { showToast } = useToast();
  const [activeAsset, setActiveAsset] = useState<StoreAsset | null>(null);

  // Order Section Tab & Form State
  const [activeTab, setActiveTab] = useState<'order' | 'reviews'>('order');
  const [selectedItem, setSelectedItem] = useState(STORE_ASSETS[0].title);
  const [paymentMethod, setPaymentMethod] = useState<'robux' | 'bkash' | 'usdt'>('bkash');
  const [orderEmail, setOrderEmail] = useState('');
  const [orderDiscord, setOrderDiscord] = useState('');
  const [orderNote, setOrderNote] = useState('');

  const handleOpenPurchase = (asset: StoreAsset) => {
    soundFx.playClick();
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#ffffff', '#38bdf8', '#34d399', '#f59e0b'],
    });
    setActiveAsset(asset);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playSuccess();
    showToast('Order Submitted!', 'Directing to Discord to complete delivery', 'success');

    const assetObj = STORE_ASSETS.find((a) => a.title === selectedItem) || STORE_ASSETS[0];
    setTimeout(() => {
      setActiveAsset(assetObj);
    }, 400);
  };

  // Systems styling configuration
  const systemsData = [
    {
      id: 'butterfly-hunt',
      assetRef: STORE_ASSETS[1],
      tag: 'ROBLOX MINIGAME',
      status: 'New',
      title: 'BUTTERFLY HUNT SYSTEM',
      gradient: 'from-emerald-950 via-[#0d2818] to-[#121318]',
      accentColor: 'text-emerald-400',
      buttonBg: 'bg-emerald-400 text-black hover:bg-emerald-300',
      description: 'A multiplayer butterfly catching minigame you can drop into any game. Players equip nets, search for procedural spawns, and climb the live leaderboards.',
      bulletsCol1: [
        { label: 'RNG Spawner', desc: 'Weighted tier algorithms with Common, Rare, and Mythic rarity colors.' },
        { label: 'Net Raycasting', desc: 'Client-predicted swing mechanics with zero network hitching.' },
      ],
      bulletsCol2: [
        { label: 'Collection Inventory', desc: 'Backpack storage counter with auto save via ProfileService.' },
        { label: 'Global Leaderboards', desc: 'Persistent top players display for most caught & rarest finds.' },
      ],
      priceRobux: '2,500 Robux',
      priceAlt: 'or 2,500 BDT with bKash · about $15 USD',
      tags: ['Minigame', 'Simulator', 'Economy', 'Leaderboards'],
    },
    {
      id: 'overhead-tag',
      assetRef: STORE_ASSETS[2],
      tag: 'ROBLOX SYSTEM',
      status: 'Available now',
      title: 'CUSTOMIZABLE OVERHEAD TAG SYSTEM',
      gradient: 'from-purple-950 via-[#1f1035] to-[#121318]',
      accentColor: 'text-purple-400',
      buttonBg: 'bg-purple-400 text-black hover:bg-purple-300',
      description: 'Dynamic overhead billboard GUI showing custom titles, VIP rank badges, animated gradient colors, and automated Roblox group rank integration.',
      bulletsCol1: [
        { label: 'Billboard LOD', desc: 'Smooth distance scaling and client toggle visibility for zero lag.' },
        { label: 'Group Automation', desc: 'Automatically displays Roblox Group Name & Rank Number.' },
      ],
      bulletsCol2: [
        { label: 'Animated Gradients', desc: 'Rainbow, gold shine, and cyber pulsing gradient title effects.' },
        { label: 'Gamepass Hooks', desc: 'Pre-configured VIP, Premium, Owner, and Staff title ownership.' },
      ],
      priceRobux: '2,500 Robux',
      priceAlt: 'or 2,500 BDT with bKash · about $20 USD',
      tags: ['Hangout', 'UI Script', 'Group Ranks', 'Custom Titles'],
    },
    {
      id: 'pet-system',
      assetRef: STORE_ASSETS[0],
      tag: 'ROBLOX 3D ASSETS',
      status: 'New',
      title: 'PET RIGGING & FOLLOW SYSTEM',
      gradient: 'from-cyan-950 via-[#0a2533] to-[#121318]',
      accentColor: 'text-cyan-400',
      buttonBg: 'bg-cyan-400 text-black hover:bg-cyan-300',
      description: 'Optimized low-poly/stylized pet models with smooth follow spring logic, idle bobbing animations, and customizable floating physics.',
      bulletsCol1: [
        { label: 'Spring Physics', desc: 'Zero client-server jitter with dynamic body orientation.' },
        { label: 'Multi-Equip Logic', desc: 'Automatic orbital positioning around player character.' },
      ],
      bulletsCol2: [
        { label: 'Idle Animations', desc: 'Gentle bobbing and responsive jump reactions.' },
        { label: 'R6 & R15 Rigging', desc: 'Plug and play setup with clean configuration ModuleScript.' },
      ],
      priceRobux: '2,000 Robux',
      priceAlt: 'or 2,000 BDT with bKash · about $15 USD',
      tags: ['3D Models', 'Rigging', 'Physics', 'Pets'],
    },
    {
      id: 'phone-model',
      assetRef: STORE_ASSETS[3],
      tag: 'ROBLOX 3D MODEL & SYSTEM',
      status: 'New',
      title: 'PHONE MODEL SYSTEM',
      gradient: 'from-blue-950 via-[#0e1c38] to-[#121318]',
      accentColor: 'text-blue-400',
      buttonBg: 'bg-blue-400 text-black hover:bg-blue-300',
      description: 'High-detail 3D smartphone model with interactive on-screen UI, smooth equip animations, camera tool, and custom apps built for roleplay and hangout games.',
      bulletsCol1: [
        { label: '3D Mesh & Rigging', desc: 'Optimized modern smartphone with hand-holding animations for R6/R15.' },
        { label: 'Interactive UI', desc: 'Touchscreen OS with camera, music, settings, and messaging apps.' },
      ],
      bulletsCol2: [
        { label: 'Sound FX & Haptics', desc: 'Custom tap clicks, camera shutter, and ringtone audio replication.' },
        { label: 'Custom Wallpapers', desc: 'Player personalization with persistent wallpaper save via DataStore.' },
      ],
      priceRobux: '4,000 Robux',
      priceAlt: 'or 4,000 BDT with bKash · about $30 USD',
      tags: ['3D Models', 'Phone UI', 'Roleplay', 'Interactive'],
    },
  ];

  const clientReviews = [
    {
      client: 'Kaiser_Dev',
      role: 'Hangout Studio Owner',
      system: 'Overhead Tag System',
      rating: 5,
      comment: 'Super clean Luau code. Integrated into our 80-player server with zero FPS drops. Arup delivered the .rbxm within 10 minutes on Discord.',
      date: '2 days ago',
    },
    {
      client: 'Rashed_Roblox',
      role: 'Game Creator',
      system: 'Butterfly Hunt Minigame',
      rating: 5,
      comment: 'Paid with bKash, received the place file instantly. Spawning algorithms and net swing animations work flawlessly. Recommended 100%!',
      date: '1 week ago',
    },
    {
      client: 'Vortex_Studio',
      role: 'Lead Architect',
      system: 'Pet Follow Framework',
      rating: 5,
      comment: 'Very professional developer. Spring physics are super smooth on mobile touch devices too. Will definitely hire for perm dev in future projects.',
      date: '2 weeks ago',
    },
  ];

  return (
    <section id="services" className="py-12 sm:py-20 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section 04 Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">
              04 · SERVICES
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Systems, ready-made & perm dev.
            </h2>
          </div>

          <div className="text-xs sm:text-sm text-gray-400 font-sans max-w-sm">
            Ready made systems you can drop into your game, or me on your team as a permanent developer.
          </div>
        </div>

        {/* Top 2 Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-10 sm:mb-14">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#121318] border border-white/[0.07] flex items-start gap-3.5 sm:gap-4">
            <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.04] text-white shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white mb-1">
                Ready made systems
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Polished, tested systems with clean UI. Pay with Robux, bKash or USDT and get it directly via Discord DM.
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#121318] border border-white/[0.07] flex items-start gap-3.5 sm:gap-4">
            <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.04] text-white shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white mb-1">
                Perm dev
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Join your game as a permanent developer: scripting, systems, UI and ongoing updates, like I&apos;ve done for BANGLA PLAZA, Sylhety Vibes and LAXUIRES PARK.
              </p>
            </div>
          </div>
        </div>

        {/* Available Systems Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white" />
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Available systems & tools
            </h3>
            <span className="px-1.5 py-0.2 rounded-full bg-white/[0.06] text-xs font-mono text-gray-400">
              {systemsData.length}
            </span>
          </div>

          <span className="text-[11px] sm:text-xs font-mono text-gray-400">
            All systems verified for R6 & R15
          </span>
        </div>

        {/* Big Featured Header Banner */}
        <div className="p-5 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-[#181a24] to-[#121318] border border-white/[0.08] mb-6 sm:mb-8 relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-2">
            <Package className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="truncate">ROBLOX PACKAGE · 4 SYSTEMS</span>
            <span className="px-2 py-0.5 rounded-full bg-white/[0.08] text-[10px] text-white shrink-0">New</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            GAME ESSENTIALS PACK
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl leading-relaxed">
            Drop in systems every hangout and social game needs, in one pack. Each one is mobile friendly, installs by drag and drop, and comes with verified support.
          </p>
        </div>

        {/* Available Systems Cards List */}
        <div className="space-y-5 sm:space-y-6 mb-12 sm:mb-16">
          {systemsData.map((sys) => (
            <div
              key={sys.id}
              className="rounded-2xl bg-[#121318] border border-white/[0.08] hover:border-white/[0.18] transition-all overflow-hidden"
            >
              {/* Colored Top Header Banner with Title */}
              <div className={`p-5 sm:p-7 bg-gradient-to-r ${sys.gradient} border-b border-white/[0.06]`}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-2">
                    <Package className="w-3.5 h-3.5" />
                    <span>{sys.tag}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/50 text-[10px] font-mono text-white border border-white/[0.1]">
                    ● {sys.status}
                  </span>
                </div>

                <h4 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                  {sys.title}
                </h4>

                <p className="text-xs sm:text-sm text-gray-300 max-w-3xl leading-relaxed">
                  {sys.description}
                </p>
              </div>

              {/* Body: 2 Columns of Specs */}
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
                  <div className="space-y-2">
                    {sys.bulletsCol1.map((b, i) => (
                      <div key={i} className="text-xs text-gray-300 flex items-start gap-2">
                        <span className="text-gray-500 font-mono">•</span>
                        <span>
                          <strong className="text-white font-medium">{b.label}:</strong> {b.desc}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {sys.bulletsCol2.map((b, i) => (
                      <div key={i} className="text-xs text-gray-300 flex items-start gap-2">
                        <span className="text-gray-500 font-mono">•</span>
                        <span>
                          <strong className="text-white font-medium">{b.label}:</strong> {b.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer: Price, Tags & Order Button */}
                <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <div className="flex flex-wrap items-baseline gap-2 font-mono">
                      <span className="text-base sm:text-lg font-bold text-white">{sys.priceRobux}</span>
                      <span className="text-[11px] sm:text-xs text-gray-400">{sys.priceAlt}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {sys.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto mt-1 sm:mt-0">
                    <button
                      onClick={() => handleOpenPurchase(sys.assetRef)}
                      className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-semibold font-sans transition-all active:scale-95 shadow-sm text-center ${sys.buttonBg}`}
                    >
                      Order now
                    </button>
                    <button
                      onClick={() => handleOpenPurchase(sys.assetRef)}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-medium bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 transition-colors text-center"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION 05: Order, then review */}
        <div id="order-section" className="pt-4 sm:pt-6">
          <div className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">
            05 · ORDER & REVIEWS
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-5 sm:mb-6">
            Order, then review.
          </h2>

          {/* Tabs: Order / Reviews */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab('order')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'order'
                  ? 'bg-white text-black'
                  : 'bg-white/[0.04] text-gray-400 hover:text-white'
              }`}
            >
              Order
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'reviews'
                  ? 'bg-white text-black'
                  : 'bg-white/[0.04] text-gray-400 hover:text-white'
              }`}
            >
              Reviews (5.0★)
            </button>
          </div>

          {/* Tab 1: Order Form Box */}
          {activeTab === 'order' && (
            <div className="p-5 sm:p-8 rounded-2xl bg-[#121318] border border-white/[0.08]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* Left side steps */}
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    Order a system or template
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4 sm:mb-6">
                    Pay first, then place your order. Your verified item is sent directly to your Discord or email.
                  </p>

                  <div className="space-y-3.5 text-xs font-sans">
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-white/[0.08] text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <div>
                        <div className="font-semibold text-white">Pay for your item</div>
                        <div className="text-gray-400 text-[11px] mt-0.5">
                          Pick an item, then a payment method. Details appear upon selection.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-white/[0.08] text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <div>
                        <div className="font-semibold text-white">Place your order</div>
                        <div className="text-gray-400 text-[11px] mt-0.5">
                          Add your Discord or email so Arup can confirm and deliver.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-white/[0.08] text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <div>
                        <div className="font-semibold text-white">Get it, then review it</div>
                        <div className="text-gray-400 text-[11px] mt-0.5">
                          Once confirmed, I deliver your source file (.rbxm) via Discord.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side form */}
                <div className="lg:col-span-7">
                  <form onSubmit={handlePlaceOrder} className="space-y-4">
                    {/* Item Select */}
                    <div>
                      <label className="block text-xs font-mono text-gray-400 mb-1.5">
                        ITEM
                      </label>
                      <select
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-white text-base sm:text-xs font-mono focus:border-white focus:outline-none"
                      >
                        {STORE_ASSETS.map((asset) => (
                          <option key={asset.id} value={asset.title} className="bg-[#121318]">
                            {asset.title} ({asset.prices.robux} / {asset.prices.bdt} / {asset.prices.usdt})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Payment Method Pills */}
                    <div>
                      <label className="block text-xs font-mono text-gray-400 mb-1.5">
                        PAYMENT METHOD
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('robux')}
                          className={`flex-1 py-2 px-1.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-mono text-center transition-colors ${
                            paymentMethod === 'robux'
                              ? 'bg-white text-black font-semibold'
                              : 'bg-black/40 border border-white/[0.08] text-gray-300 hover:text-white'
                          }`}
                        >
                          Robux (R$)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('bkash')}
                          className={`flex-1 py-2 px-1.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-mono text-center transition-colors ${
                            paymentMethod === 'bkash'
                              ? 'bg-pink-500 text-white font-semibold'
                              : 'bg-black/40 border border-white/[0.08] text-gray-300 hover:text-white'
                          }`}
                        >
                          bKash (BDT)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('usdt')}
                          className={`flex-1 py-2 px-1.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-mono text-center transition-colors ${
                            paymentMethod === 'usdt'
                              ? 'bg-emerald-500 text-black font-semibold'
                              : 'bg-black/40 border border-white/[0.08] text-gray-300 hover:text-white'
                          }`}
                        >
                          USDT (Crypto)
                        </button>
                      </div>

                      {/* Payment Notice */}
                      <div className="p-3 rounded-xl bg-black/40 border border-white/[0.05] text-[11px] font-mono text-gray-300 mt-2">
                        {paymentMethod === 'bkash' && (
                          <span>Payment via bKash personal/merchant send money or cash-in. Delivery directly via Discord.</span>
                        )}
                        {paymentMethod === 'robux' && (
                          <span>Payment via Roblox Gamepass or Group Funds payout (covers 30% tax if gamepass).</span>
                        )}
                        {paymentMethod === 'usdt' && (
                          <span>Payment via USDT TRC20 / BEP20 network. Zero delay file transfer.</span>
                        )}
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono text-gray-400 mb-1">
                          YOUR EMAIL
                        </label>
                        <input
                          type="email"
                          required
                          value={orderEmail}
                          onChange={(e) => setOrderEmail(e.target.value)}
                          placeholder="Your email address"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-white text-base sm:text-xs font-mono focus:border-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-400 mb-1">
                          DISCORD OR ROBLOX USERNAME
                        </label>
                        <input
                          type="text"
                          required
                          value={orderDiscord}
                          onChange={(e) => setOrderDiscord(e.target.value)}
                          placeholder="Your Discord username"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-white text-base sm:text-xs font-mono focus:border-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-gray-400 mb-1">
                        NOTE (OPTIONAL)
                      </label>
                      <textarea
                        rows={2}
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                        placeholder="Anything I should know?"
                        className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-white text-base sm:text-xs font-mono focus:border-white focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      onMouseEnter={() => soundFx.playHover()}
                      className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-black bg-white hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-98"
                    >
                      <span>Place order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Reviews */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
              {clientReviews.map((rev, i) => (
                <div key={i} className="p-4 sm:p-5 rounded-2xl bg-[#121318] border border-white/[0.07] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white font-mono">{rev.client}</span>
                      <div className="text-amber-400 text-xs">★★★★★</div>
                    </div>
                    <span className="text-[11px] font-mono text-gray-500 block mb-3">
                      Purchased: {rev.system}
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed font-sans">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-gray-500 pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-white/[0.04]">
                    Verified Buyer • {rev.date}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <PurchaseModal asset={activeAsset} onClose={() => setActiveAsset(null)} />
    </section>
  );
}
