'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LANGUAGES, Language } from '@/lib/i18n/dictionaries';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage, currentLangInfo } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-stone-900 border border-stone-800 hover:border-[#c5a880] text-xs text-stone-300 hover:text-white transition-colors"
        aria-label="Select Language"
      >
        <Globe size={13} className="text-[#c5a880]" />
        <span className="font-medium tracking-wide">{currentLangInfo.flag} {currentLangInfo.nativeName}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#c5a880]' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#121218] border border-stone-800 rounded shadow-2xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[10px] uppercase font-mono tracking-widest text-[#c5a880] border-b border-stone-800/80 mb-1">
            Select Language
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                  isSelected ? 'bg-[#c5a880]/15 text-[#c5a880] font-semibold' : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                  <span className="text-[10px] text-stone-500">({lang.name})</span>
                </div>
                {isSelected && <Check size={13} className="text-[#c5a880]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
