'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import type { Locale } from '../i18n/translations';

const languages: { code: Locale; flag: string; name: string }[] = [
  { code: 'en', flag: '\uD83C\uDDEC\uD83C\uDDE7', name: 'English' },
  { code: 'bg', flag: '\uD83C\uDDE7\uD83C\uDDEC', name: '\u0411\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438' },
  { code: 'ru', flag: '\uD83C\uDDF7\uD83C\uDDFA', name: '\u0420\u0443\u0441\u0441\u043A\u0438\u0439' },
  { code: 'es', flag: '\uD83C\uDDEA\uD83C\uDDF8', name: 'Espa\u00F1ol' },
  { code: 'zh', flag: '\uD83C\uDDE8\uD83C\uDDF3', name: '\u4E2D\u6587' },
  { code: 'ja', flag: '\uD83C\uDDEF\uD83C\uDDF5', name: '\u65E5\u672C\u8A9E' },
  { code: 'tr', flag: '\uD83C\uDDF9\uD83C\uDDF7', name: 'T\u00FCrk\u00E7e' },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === locale) || languages[0];

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12px] tracking-wider text-gray-400 hover:text-white hover:border-white/[0.15] hover:bg-white/[0.08] transition-all duration-300"
        aria-label="Select language"
      >
        <span className="text-sm leading-none">{current.flag}</span>
        <span className="uppercase">{current.code}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute right-0 top-full mt-2 z-[60] min-w-[160px] rounded-xl border border-white/[0.08] bg-[#0d0d14]/90 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLocale(lang.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] transition-colors duration-200 ${
                  locale === lang.code
                    ? 'bg-[#2d8a8a]/15 text-[#2d8a8a]'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className="text-base leading-none">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
