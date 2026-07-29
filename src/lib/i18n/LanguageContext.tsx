'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, LANGUAGES, LanguageInfo, DICTIONARIES } from './dictionaries';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  currentLangInfo: LanguageInfo;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ko');

  useEffect(() => {
    const savedLang = localStorage.getItem('anatolia_lang') as Language;
    if (savedLang && LANGUAGES.some((l) => l.code === savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('anatolia_lang', lang);
    const info = LANGUAGES.find((l) => l.code === lang);
    const dir = info?.dir || 'ltr';
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
    }
  };

  const currentLangInfo = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const dir = currentLangInfo.dir || 'ltr';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = dir;
    }
  }, [language, dir]);

  const t = (key: string, fallback?: string): string => {
    const dict = DICTIONARIES[language] || DICTIONARIES.ko;
    return dict[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLangInfo, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
