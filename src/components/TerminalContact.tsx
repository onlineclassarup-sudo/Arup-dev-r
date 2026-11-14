'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Copy, Check, Send, CheckCircle } from 'lucide-react';
import { DEVELOPER_INFO } from '@/lib/constants';
import { copyToClipboard } from '@/lib/utils';
import { soundFx } from '@/lib/audio';
import { useToast } from './Toast';

export default function TerminalContact() {
  const { showToast } = useToast();
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const [senderName, setSenderName] = useState('');
  const [contactHandle, setContactHandle] = useState('');
  const [inquiryType, setInquiryType] = useState('Buying a system');
  const [messageBody, setMessageBody] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCopyDiscord = async () => {
    soundFx.playClick();
    const ok = await copyToClipboard(DEVELOPER_INFO.discord);
    if (ok) {
      setCopiedDiscord(true);
      showToast('Copied Discord Tag', `"${DEVELOPER_INFO.discord}" copied`, 'copy');
      setTimeout(() => setCopiedDiscord(false), 2400);
    }
  };

  const handleCopyEmail = async () => {
    soundFx.playClick();
    const ok = await copyToClipboard(DEVELOPER_INFO.email);
    if (ok) {
      setCopiedEmail(true);
      showToast('Copied Email', `"${DEVELOPER_INFO.email}" copied`, 'copy');
      setTimeout(() => setCopiedEmail(false), 2400);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playSuccess();
    setSubmitted(true);
    showToast('Message Ready', 'Opening your email client to send message', 'success');

    const subject = encodeURIComponent(`[Roblox Portfolio] ${inquiryType} - ${senderName}`);
    const body = encodeURIComponent(
      `Name: ${senderName}\nContact Handle: ${contactHandle}\nTopic: ${inquiryType}\n\nMessage:\n${messageBody}\n\nSent via Arup's Developer Portfolio.`
    );

    setTimeout(() => {
      window.location.href = `mailto:${DEVELOPER_INFO.email}?subject=${subject}&body=${body}`;
    }, 600);
  };

  return (
    <section id="contact" className="py-12 sm:py-20 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block with Top-Right Copy Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-end mb-8 sm:mb-10">
          <div className="lg:col-span-7">
            <div className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">
              07 · CONTACT
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Let&apos;s build something.
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-sans max-w-lg leading-relaxed">
              Want one of my systems, a custom build, or a perm dev for your game? Send a message below, DM me on Discord, or email me.
            </p>
          </div>

          {/* Right side contact badges */}
          <div className="lg:col-span-5 space-y-2.5">
            {/* Email pill box */}
            <div className="p-3 rounded-xl bg-[#121318] border border-white/[0.07] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-white/[0.04] text-gray-300 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-gray-500 uppercase">Email</div>
                  <div className="text-xs font-mono font-semibold text-white truncate">
                    {DEVELOPER_INFO.email}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCopyEmail}
                onMouseEnter={() => soundFx.playHover()}
                className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-gray-300 hover:text-white transition-colors flex items-center gap-1 shrink-0"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Discord pill box */}
            <div className="p-3 rounded-xl bg-[#121318] border border-white/[0.07] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-white/[0.04] text-gray-300 shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-gray-500 uppercase">Discord</div>
                  <div className="text-xs font-mono font-semibold text-white truncate">
                    {DEVELOPER_INFO.discord}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCopyDiscord}
                onMouseEnter={() => soundFx.playHover()}
                className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-gray-300 hover:text-white transition-colors flex items-center gap-1 shrink-0"
              >
                {copiedDiscord ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDiscord ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Send me a message full-width card */}
        <div className="p-5 sm:p-8 rounded-2xl bg-[#121318] border border-white/[0.07]">
          <div className="mb-5 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-white mb-1">
              Send me a message
            </h3>
            <p className="text-xs text-gray-400">
              Write it here and it comes straight to me. Leave your Discord or email so I can reply.
            </p>
          </div>

          {submitted ? (
            <div className="py-8 sm:py-10 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">
                Message Dispatched
              </h4>
              <p className="text-xs text-gray-400">
                You can also DM directly on Discord: <span className="text-white font-mono">{DEVELOPER_INFO.discord}</span>
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-mono text-gray-400 hover:text-white pt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-1">
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Roblox or real name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-white text-base sm:text-xs font-mono focus:border-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-1">
                    DISCORD OR EMAIL
                  </label>
                  <input
                    type="text"
                    required
                    value={contactHandle}
                    onChange={(e) => setContactHandle(e.target.value)}
                    placeholder="So I can reply to you"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-white text-base sm:text-xs font-mono focus:border-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 mb-1">
                  WHAT IS IT ABOUT?
                </label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-white text-base sm:text-xs font-mono focus:border-white focus:outline-none transition-colors"
                >
                  <option value="Buying a system" className="bg-[#121318]">Buying a system</option>
                  <option value="Hiring as a perm dev" className="bg-[#121318]">Hiring as a perm dev</option>
                  <option value="Custom script/commission" className="bg-[#121318]">Custom script/commission</option>
                  <option value="General inquiry" className="bg-[#121318]">General inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 mb-1">
                  MESSAGE
                </label>
                <textarea
                  required
                  rows={4}
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  placeholder="Tell me what you need..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-white text-base sm:text-xs font-sans focus:border-white focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  onMouseEnter={() => soundFx.playHover()}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold text-black bg-white hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-98"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send message</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
