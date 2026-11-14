'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, AlertCircle } from 'lucide-react';
import { soundFx } from '@/lib/audio';

interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'copy';
}

interface ToastContextValue {
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'copy') => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((title: string, message?: string, type: 'success' | 'info' | 'copy' = 'success') => {
    soundFx.playSuccess();
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.12] bg-[#0d121f]/95 shadow-2xl backdrop-blur-xl"
            >
              <div className="w-6 h-6 rounded-md bg-white/[0.08] text-white flex items-center justify-center shrink-0">
                {toast.type === 'copy' ? (
                  <Copy className="w-3.5 h-3.5" />
                ) : toast.type === 'info' ? (
                  <AlertCircle className="w-3.5 h-3.5" />
                ) : (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white">
                  {toast.title}
                </div>
                {toast.message && (
                  <div className="text-[11px] text-gray-400 font-mono truncate">
                    {toast.message}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: () => {},
    };
  }
  return context;
}
