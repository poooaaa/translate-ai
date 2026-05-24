/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import {
  Languages,
  Book,
  ArrowRightLeft,
  X,
  Copy,
  Check,
  Loader2,
  Clock,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { callGoogleTranslateAPI } from './api';
import LanguageModal from './components/LanguageModal';
import { HistoryItem, LANGUAGES } from './types';

export default function App() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceLang, setSourceLang] = useState('id');
  const [targetLang, setTargetLang] = useState('en');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const [copiedSource, setCopiedSource] = useState(false);
  const [copiedTarget, setCopiedTarget] = useState(false);

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('translation_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      return [];
    }
    return [];
  });

  // Apply dark mode class to HTML element based on state
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('translation_history', JSON.stringify(history));
  }, [history]);

  const handleTranslate = async () => {
    if (!sourceText.trim() || isTranslating) return;
    
    setIsTranslating(true);
    setTranslatedText('');
    
    const [result] = await Promise.all([
      callGoogleTranslateAPI(
        sourceText,
        sourceLang,
        targetLang
      ),
      new Promise((resolve) => setTimeout(resolve, 2000))
    ]);
    
    setTranslatedText(result);
    setIsTranslating(false);

    if (result && sourceText) {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        sourceText,
        translatedText: result,
        sourceLang,
        targetLang,
        timestamp: Date.now()
      };
      setHistory((prev) => [newItem, ...prev].slice(0, 15));
    }
  };

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
  };

  const handleCopy = async (text: string, isSource: boolean) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (isSource) {
        setCopiedSource(true);
        setTimeout(() => setCopiedSource(false), 2000);
      } else {
        setCopiedTarget(true);
        setTimeout(() => setCopiedTarget(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-5 font-sans text-slate-900 transition-colors duration-500 ease-in-out dark:bg-black dark:text-slate-100">
      
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex justify-center items-center opacity-30 dark:opacity-10">
         <div className="absolute top-1/4 left-1/4 h-[30vw] w-[30vw] rounded-full bg-slate-300 blur-[100px] dark:bg-slate-600" />
         <div className="absolute bottom-1/4 right-1/4 h-[30vw] w-[30vw] rounded-full bg-slate-200 blur-[100px] dark:bg-white" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 mx-auto flex w-full max-w-[400px] flex-col gap-6 rounded-[32px] bg-white/80 p-6 backdrop-blur-3xl shadow-[0_15px_40px_rgba(0,0,0,0.05)] dark:bg-zinc-950/80 dark:border dark:border-white/5 dark:shadow-[0_15px_40px_rgba(0,0,0,0.6)] transition-all duration-300"
      >
        <header className="flex items-center justify-center">
          <h1 className="text-xl font-semibold tracking-wide text-slate-800 dark:text-slate-100">
            Translate AI
          </h1>
        </header>

        {/* Controls Panel */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleTranslate}
            disabled={isTranslating}
            className="group relative flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-white/50 backdrop-blur-md border border-slate-200/50 text-slate-700 shadow-sm transition-all hover:-translate-y-1 hover:bg-white/80 hover:shadow-md active:scale-95 disabled:hover:translate-y-0 disabled:active:scale-100 disabled:opacity-100 dark:bg-white/5 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
            title="Terjemahkan"
          >
            {isTranslating ? (
              <img src="https://static.vecteezy.com/system/resources/thumbnails/055/687/065/small_2x/gemini-google-icon-symbol-logo-free-png.png" alt="Loading" className="h-6 w-6 animate-spin opacity-100" />
            ) : (
              <Languages className="h-6 w-6" />
            )}
          </button>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-white/50 backdrop-blur-md border border-slate-200/50 text-slate-700 shadow-sm transition-all hover:-translate-y-1 hover:bg-white/80 hover:shadow-md active:scale-95 dark:bg-white/5 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
            title="Pilih Bahasa"
          >
            <Book className="h-6 w-6" />
          </button>
          
          <button
            onClick={handleSwap}
            className="group relative flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-white/50 backdrop-blur-md border border-slate-200/50 text-slate-700 shadow-sm transition-all hover:-translate-y-1 hover:bg-white/80 hover:shadow-md active:scale-95 dark:bg-white/5 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
            title="Balikkan Bahasa"
          >
            <ArrowRightLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={handleClear}
            className="group relative flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-white/50 backdrop-blur-md border border-slate-200/50 text-slate-700 shadow-sm transition-all hover:-translate-y-1 hover:bg-white/80 hover:shadow-md active:scale-95 dark:bg-white/5 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
            title="Hapus Semua"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Source Text Container */}
        <div className="relative w-full">
          <input
            type="text"
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTranslate()}
            placeholder="Teks Terjemahan"
            className="w-full rounded-2xl border border-slate-200/50 bg-white/50 backdrop-blur-sm py-4 pl-5 pr-14 text-base outline-none transition-all placeholder:text-slate-400 focus:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:text-slate-200"
          />
          <button
            onClick={() => handleCopy(sourceText, true)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 transition-colors hover:text-slate-700 active:scale-90 dark:hover:text-slate-200"
          >
            {copiedSource ? (
              <Check className="h-5 w-5 text-green-500 dark:text-green-400" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Translated Text Container */}
        <div className="relative w-full">
          <input
            type="text"
            value={translatedText}
            readOnly
            placeholder="Hasil Terjemahan"
            className="w-full rounded-2xl border border-slate-200/50 bg-white/50 backdrop-blur-sm py-4 pl-5 pr-14 text-base outline-none transition-all placeholder:text-slate-400 focus:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:text-slate-200"
          />
          <button
            onClick={() => handleCopy(translatedText, false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 transition-colors hover:text-slate-700 active:scale-90 dark:hover:text-slate-200"
          >
            {copiedTarget ? (
              <Check className="h-5 w-5 text-green-500 dark:text-green-400" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Image Container */}
        <div className="overflow-hidden rounded-[20px] transition-all duration-300 shadow-sm dark:shadow-[0_5px_15px_rgba(0,0,0,0.6)]">
          <img
            src="https://i.pinimg.com/736x/48/91/68/48916852d6ac9f06484875c267dac58b.jpg"
            alt="Translate AI Concept"
            className="block w-full rounded-2xl"
          />
        </div>
        
        {/* History Section */}
        <AnimatePresence>
          {history.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-white/10 px-1 pb-2">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">History</span>
                </div>
                <button 
                  onClick={() => setHistory([])}
                  className="text-xs font-medium text-slate-400 hover:text-red-500 transition-colors"
                  title="Hapus History"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex max-h-[180px] flex-col gap-2 overflow-y-auto pr-1">
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    className="group flex flex-col rounded-[16px] bg-white/40 p-3 shadow-sm backdrop-blur-md border border-slate-200/50 transition-all hover:bg-white/60 dark:bg-white/5 dark:border-white/5 dark:hover:bg-white/10 cursor-pointer"
                    onClick={() => {
                      setSourceText(item.sourceText);
                      setTranslatedText(item.translatedText);
                      setSourceLang(item.sourceLang);
                      setTargetLang(item.targetLang);
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="rounded-full bg-slate-200/50 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">
                        {LANGUAGES[item.sourceLang]} → {LANGUAGES[item.targetLang]}
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-800 line-clamp-1 dark:text-slate-200">
                      {item.sourceText}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500 line-clamp-1 dark:text-slate-400">
                      {item.translatedText}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      <LanguageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sourceLang={sourceLang}
        setSourceLang={setSourceLang}
        targetLang={targetLang}
        setTargetLang={setTargetLang}
      />
    </div>
  );
}

