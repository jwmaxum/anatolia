'use client';

import React from 'react';
import Link from 'next/link';
import { MenuItem } from '@/lib/types';
import { ArrowUpRight, Share2, Globe } from 'lucide-react';

interface FooterClientProps {
  menus: MenuItem[];
}

export default function FooterClient({ menus }: FooterClientProps) {
  return (
    <footer className="bg-[#060608] text-stone-400 border-t border-stone-800/80 pt-16 pb-12 font-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-stone-800/50">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif-luxury text-2xl tracking-[0.25em] font-semibold text-white">
                ANATOLIA
              </span>
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Global leader in premium porcelain tiles, natural stones, and sintered stone slabs crafted with patented manufacturing excellence and timeless elegance.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-[#c5a880] hover:border-[#c5a880] transition-colors text-xs font-semibold"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-[#c5a880] hover:border-[#c5a880] transition-colors text-xs font-semibold"
                aria-label="Facebook"
              >
                FB
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-[#c5a880] hover:border-[#c5a880] transition-colors text-xs font-semibold"
                aria-label="LinkedIn"
              >
                IN
              </a>
            </div>
          </div>

          {/* Dynamic Active Footer Navigation Links from DB */}
          <div className="md:col-span-5 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-semibold tracking-[0.2em] text-[#c5a880] uppercase mb-4">
                Collections & Pages
              </h3>
              <ul className="space-y-2.5 text-xs">
                {menus.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.url}
                      className="hover:text-white transition-colors tracking-wider"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-[0.2em] text-[#c5a880] uppercase mb-4">
                Administration
              </h3>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link
                    href="/admin/navigation"
                    className="inline-flex items-center text-[#c5a880] hover:text-white transition-colors"
                  >
                    <span>Navigation Manager</span>
                    <ArrowUpRight size={13} className="ml-1" />
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold tracking-[0.2em] text-white uppercase">
              Stay Inspired
            </h3>
            <p className="text-xs text-stone-400">
              Subscribe to receive exclusive insights into architectural surface innovations.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2 pt-1">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full bg-[#101014] border border-stone-800 text-xs px-3.5 py-2.5 text-white placeholder-stone-600 focus:outline-none focus:border-[#c5a880]"
              />
              <button
                type="submit"
                className="w-full bg-[#c5a880] hover:bg-[#dbbc93] text-black font-medium text-xs tracking-widest uppercase py-2.5 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} Anatolia Tile & Stone Inc. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 tracking-wider">Dynamic Layout & Menu Engine v1.0</p>
        </div>
      </div>
    </footer>
  );
}
