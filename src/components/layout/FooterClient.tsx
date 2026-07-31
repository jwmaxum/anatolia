'use client';

import React from 'react';
import Link from 'next/link';
import { MenuItem } from '@/lib/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { ArrowUpRight } from 'lucide-react';

interface FooterClientProps {
  menus: MenuItem[];
}

export default function FooterClient({ menus }: FooterClientProps) {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#050806] text-stone-400 border-t border-emerald-900/40 pt-16 pb-12 font-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-emerald-900/30">
          
          {/* Brand Info & Language Selector */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <div className="flex flex-col">
                <span className="font-serif-luxury text-2xl tracking-[0.25em] font-semibold text-white">
                  ANATOLIA
                </span>
                <span className="text-[9px] tracking-[0.35em] text-[#c59b27] font-medium uppercase -mt-1">
                  GOURMET & FINE FOODS
                </span>
              </div>
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              {t('hero_subtitle', 'Global leader in artisanal extra virgin olive oils, aged DOP cheeses, and organic gourmet ingredients.')}
            </p>
            <div className="pt-2">
              <LanguageSelector />
            </div>
            <div className="flex space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#0d140f] border border-emerald-900/50 flex items-center justify-center text-stone-400 hover:text-[#c59b27] hover:border-[#c59b27] transition-colors text-xs font-semibold"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#0d140f] border border-emerald-900/50 flex items-center justify-center text-stone-400 hover:text-[#c59b27] hover:border-[#c59b27] transition-colors text-xs font-semibold"
                aria-label="LinkedIn"
              >
                IN
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#0d140f] border border-emerald-900/50 flex items-center justify-center text-stone-400 hover:text-[#c59b27] hover:border-[#c59b27] transition-colors text-xs font-semibold"
                aria-label="Pinterest"
              >
                PT
              </a>
            </div>
          </div>

          {/* Dynamic Footer Links (Fetched from Active DB Menus) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {menus.map((group) => (
              <div key={group.id} className="space-y-3">
                <h4 className="text-xs uppercase font-mono tracking-widest text-[#c59b27] font-semibold">
                  {group.title}
                </h4>
                {group.children && group.children.length > 0 && (
                  <ul className="space-y-2 text-xs">
                    {group.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={child.url}
                          className="hover:text-white transition-colors duration-200 inline-flex items-center group"
                        >
                          <span>{child.title}</span>
                          <ArrowUpRight
                            size={12}
                            className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-[#c59b27]"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 gap-4 font-light">
          <p>© {new Date().getFullYear()} {t('copyright', 'Anatolia Gourmet Fine Foods Inc. All rights reserved.')}</p>
          <div className="flex space-x-6 text-[11px]">
            <Link href="#" className="hover:text-stone-300 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-stone-300 transition-colors">Terms of Use</Link>
            <Link href="#" className="hover:text-stone-300 transition-colors">Cookie Settings</Link>
            <Link href="/admin" className="text-[#c59b27] hover:underline font-medium">Admin Studio</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
