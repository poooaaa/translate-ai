import React, { useState } from 'react';
import { Search, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LANGUAGES } from '../types';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceLang: string;
  setSourceLang: (lang: string) => void;
  targetLang: string;
  setTargetLang: (lang: string) => void;
}

export default function LanguageModal({
  isOpen,
  onClose,
  sourceLang,
  setSourceLang,
  targetLang,
  setTargetLang,
}: LanguageModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLanguages = Object.entries(LANGUAGES).filter(([, name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="flex w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white/80 backdrop-blur-3xl shadow-2xl dark:bg-zinc-950/90 dark:border dark:border-white/5"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '85vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200/50 p-5 dark:border-white/10">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Pilih Bahasa
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors dark:hover:bg-white/10 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search */}
            <div className="border-b border-slate-200/50 p-4 dark:border-white/10 relative flex items-center">
              <Search className="pointer-events-none absolute left-7 z-10 text-slate-400 dark:text-slate-500 h-5 w-5" />
              <input
                type="text"
                placeholder="Cari bahasa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200/50 bg-white/50 backdrop-blur-sm py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:focus:border-slate-500"
              />
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden p-2 relative">
              {/* Divider */}
              <div className="absolute top-4 bottom-4 left-1/2 w-px bg-slate-200/50 dark:bg-white/10" />
              
              <div className="flex w-1/2 flex-col">
                <h3 className="p-3 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                  Dari Bahasa
                </h3>
                <div className="flex-1 overflow-y-auto px-2 space-y-1">
                  {filteredLanguages.map(([code, name]) => (
                    <button
                      key={`source-${code}`}
                      onClick={() => setSourceLang(code)}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                        sourceLang === code
                          ? 'bg-slate-200/50 text-slate-900 font-medium dark:bg-white/10 dark:text-white'
                          : 'text-slate-700 hover:bg-slate-100/50 dark:text-slate-300 dark:hover:bg-white/5'
                      }`}
                    >
                      {name}
                      {sourceLang === code && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex w-1/2 flex-col">
                <h3 className="p-3 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                  Ke Bahasa
                </h3>
                <div className="flex-1 overflow-y-auto px-2 space-y-1">
                  {filteredLanguages.map(([code, name]) => (
                    <button
                      key={`target-${code}`}
                      onClick={() => setTargetLang(code)}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                        targetLang === code
                          ? 'bg-slate-200/50 text-slate-900 font-medium dark:bg-white/10 dark:text-white'
                          : 'text-slate-700 hover:bg-slate-100/50 dark:text-slate-300 dark:hover:bg-white/5'
                      }`}
                    >
                      {name}
                      {targetLang === code && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
