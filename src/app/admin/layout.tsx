'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Film,
  FileText,
  Image as ImageIcon,
  ArrowLeft,
  Shield,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin', label: 'Dashboard Hub', icon: LayoutDashboard },
    { href: '/admin/navigation', label: 'Menu Engine', icon: Layers },
    { href: '/admin/hero', label: 'Hero Slider CMS', icon: Film },
    { href: '/admin/products', label: 'Product CRUD', icon: Shield },
    { href: '/admin/content-blocks', label: 'Content Block Editor', icon: FileText },
    { href: '/admin/journal', label: 'Journal Editor', icon: FileText },
    { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-stone-200 flex flex-col md:flex-row font-sans">
      {/* Integrated Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#0d0d12] border-r border-stone-800 flex flex-col justify-between p-4 shrink-0">
        <div>
          {/* Admin Header Logo */}
          <div className="pb-6 border-b border-stone-800/80 mb-6 flex justify-between items-center">
            <Link href="/admin" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded bg-[#c5a880] flex items-center justify-center text-black font-bold font-serif-luxury text-lg">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-serif-luxury text-sm font-semibold tracking-wider text-white">
                  ANATOLIA
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#c5a880]">
                  CMS Studio
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5" aria-label="Admin navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded text-xs font-medium tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#c5a880] text-black font-semibold shadow-lg'
                      : 'text-stone-400 hover:text-white hover:bg-[#161620]'
                  }`}
                >
                  <Icon size={16} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Back to Live Website */}
        <div className="pt-6 border-t border-stone-800/80 mt-6">
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 py-2.5 px-3 bg-stone-900 border border-stone-800 hover:border-stone-700 rounded text-xs text-stone-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Live Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin View Content */}
      <main className="flex-grow min-w-0 overflow-y-auto">{children}</main>
    </div>
  );
}
