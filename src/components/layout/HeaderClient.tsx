'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MenuItem } from '@/lib/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { Menu, X, ChevronDown, Search, Shield } from 'lucide-react';

interface HeaderClientProps {
  menus: MenuItem[];
}

export default function HeaderClient({ menus }: HeaderClientProps) {
  const { t } = useLanguage();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);

  // Active menu hover image preview (Anatolia megamenu feature)
  const activeParentMenu = menus.find((m) => m.id === activeMenuId);

  const toggleMobileAccordion = (id: string) => {
    setExpandedMobileMenu((prev) => (prev === id ? null : id));
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-header transition-all duration-300">
      {/* Top Notification Bar */}
      <div className="bg-[#0b0e0c] border-b border-white/5 py-1.5 px-4 text-xs text-stone-400 flex justify-between items-center tracking-wider font-light">
        <div className="flex items-center space-x-3">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c59b27] animate-pulse"></span>
          <span>{t('site_tagline', 'ANATOLIA LUXURY GOURMET & FINE FOODS')}</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/admin"
            className="flex items-center space-x-1.5 text-[#c59b27] hover:text-white transition-colors bg-[#c59b27]/10 border border-[#c59b27]/30 px-2.5 py-0.5 rounded text-[11px] font-medium"
          >
            <Shield size={12} />
            <span>Admin Studio</span>
          </Link>

          {/* 7-Language i18n Selector Component */}
          <LanguageSelector />
        </div>
      </div>

      {/* Main Header Nav Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="flex flex-col">
              <span className="font-serif-luxury text-2xl tracking-[0.25em] font-semibold text-white group-hover:text-[#c59b27] transition-colors">
                ANATOLIA
              </span>
              <span className="text-[9px] tracking-[0.35em] text-[#c59b27] font-medium -mt-1 uppercase">
                GOURMET & FINE FOODS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Depth 1 & Dropdown Megamenu) */}
          <nav className="hidden lg:flex items-center space-x-8" aria-label="Primary Navigation">
            {menus.map((parent) => {
              const hasChildren = parent.children && parent.children.length > 0;
              const isHovered = activeMenuId === parent.id;

              return (
                <div
                  key={parent.id}
                  className="relative group py-6"
                  onMouseEnter={() => setActiveMenuId(parent.id)}
                  onMouseLeave={() => setActiveMenuId(null)}
                >
                  <Link
                    href={parent.url}
                    className="flex items-center text-xs tracking-[0.18em] uppercase font-medium text-stone-300 group-hover:text-[#c59b27] transition-colors py-1"
                  >
                    <span>{parent.title}</span>
                    {hasChildren && (
                      <ChevronDown
                        size={13}
                        className={`ml-1 transition-transform duration-200 ${
                          isHovered ? 'rotate-180 text-[#c59b27]' : 'text-stone-500'
                        }`}
                      />
                    )}
                  </Link>

                  {/* Active Indicator Line */}
                  <span
                    className={`absolute bottom-4 left-0 h-[2px] bg-[#c59b27] transition-all duration-300 ${
                      isHovered ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}
                  />

                  {/* Megamenu Dropdown Container */}
                  {hasChildren && isHovered && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[620px] bg-[#111713] border border-emerald-900/40 shadow-2xl rounded-sm p-6 grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* Left: Depth 2 Link Items */}
                      <div className="col-span-6 space-y-2.5 border-r border-emerald-900/40 pr-4">
                        <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#c59b27] mb-3 pb-1 border-b border-emerald-900/30">
                          {parent.title} Selections
                        </div>
                        {parent.children?.map((child) => (
                          <Link
                            key={child.id}
                            href={child.url}
                            className="block text-xs text-stone-300 hover:text-white hover:translate-x-1 transition-all duration-150 py-1"
                          >
                            <span className="text-[#c59b27]/60 mr-1.5">•</span>
                            {child.title}
                          </Link>
                        ))}
                      </div>

                      {/* Right: Megamenu Featured Image Preview (Anatolia Style) */}
                      <div className="col-span-6 flex flex-col justify-center items-center bg-[#18221b] rounded p-3 border border-emerald-900/30">
                        {activeParentMenu?.image_url ? (
                          <div className="w-full h-full min-h-[140px] relative overflow-hidden rounded group/img">
                            <img
                              src={activeParentMenu.image_url}
                              alt={parent.title}
                              className="w-full h-36 object-cover rounded transform group-hover/img:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                              <span className="text-[11px] font-serif-luxury text-stone-200 tracking-wide">
                                Explore {parent.title}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center p-4 text-stone-500 text-xs font-serif-luxury italic">
                            Crafted for Fine Dining & Gourmet Living
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              aria-label="Search collections"
              className="p-2 text-stone-400 hover:text-[#c59b27] transition-colors"
            >
              <Search size={18} />
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-300 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Hamburger Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[108px] bg-[#0d110e]/98 border-b border-emerald-900/40 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top duration-300 max-h-[calc(100vh-108px)] overflow-y-auto">
          <div className="px-6 py-6 space-y-4">
            {menus.map((parent) => {
              const hasChildren = parent.children && parent.children.length > 0;
              const isExpanded = expandedMobileMenu === parent.id;

              return (
                <div key={parent.id} className="border-b border-emerald-900/30 pb-3">
                  <div className="flex justify-between items-center">
                    <Link
                      href={parent.url}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-medium uppercase tracking-[0.15em] text-stone-200 hover:text-[#c59b27] transition-colors"
                    >
                      {parent.title}
                    </Link>
                    {hasChildren && (
                      <button
                        onClick={() => toggleMobileAccordion(parent.id)}
                        className="p-2 text-stone-400 hover:text-[#c59b27]"
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-[#c59b27]' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Depth 2 Accordion List */}
                  {hasChildren && isExpanded && (
                    <div className="mt-2.5 ml-4 pl-3 border-l border-[#c59b27]/30 space-y-2 py-1">
                      {parent.children?.map((child) => (
                        <Link
                          key={child.id}
                          href={child.url}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-xs tracking-wider text-stone-400 hover:text-white py-1"
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Mobile Admin Link */}
            <div className="pt-4">
              <Link
                href="/admin/navigation"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 px-4 bg-[#c59b27]/15 border border-[#c59b27]/40 rounded text-xs font-semibold tracking-wider text-[#c59b27] hover:bg-[#c59b27] hover:text-black transition-all"
              >
                Go to Admin Navigation Manager
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
