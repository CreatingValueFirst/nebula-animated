'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations, type Locale, type TranslationKeys } from './translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hi-locale', newLocale);
      document.documentElement.lang = newLocale === 'zh' ? 'zh-CN' : newLocale === 'ja' ? 'ja' : newLocale;
    }
  }, []);

  // Hydration-safe: read localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('hi-locale') as Locale | null;
    if (saved && translations[saved]) {
      setLocaleState(saved);
      document.documentElement.lang = saved === 'zh' ? 'zh-CN' : saved === 'ja' ? 'ja' : saved;
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
