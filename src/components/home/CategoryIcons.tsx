'use client';

import React from 'react';
import Link from 'next/link';

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  url: string;
  colorBg: string;
  count: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: '1', name: 'Olive Oils', icon: '🫒', url: '/collections?cat=fresh#oil', colorBg: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200', count: '14 Items' },
  { id: '2', name: 'DOP Cheeses', icon: '🧀', url: '/collections?cat=dairy#cheese', colorBg: 'bg-amber-50 hover:bg-amber-100 border-amber-200', count: '18 Items' },
  { id: '3', name: 'Rare Truffles', icon: '🍄', url: '/collections?cat=fresh#truffle', colorBg: 'bg-[#FAFAF8] hover:bg-stone-100 border-stone-200', count: '8 Items' },
  { id: '4', name: 'Charcuterie', icon: '🥩', url: '/collections?cat=dairy#ham', colorBg: 'bg-rose-50 hover:bg-rose-100 border-rose-200', count: '12 Items' },
  { id: '5', name: 'Aged Balsamic', icon: '🍷', url: '/collections?cat=pantry#balsamic', colorBg: 'bg-purple-50 hover:bg-purple-100 border-purple-200', count: '9 Items' },
  { id: '6', name: 'Wild Honey', icon: '🍯', url: '/collections?cat=pantry#honey', colorBg: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200', count: '11 Items' },
];

export default function CategoryIcons() {
  return (
    <section className="py-14 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#14532D] uppercase tracking-[0.2em]">Quick Explore</span>
          <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
            Explore Gourmet Categories
          </h2>
        </div>

        {/* Circular Category Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.url}
              className="group flex flex-col items-center text-center p-4 rounded-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div
                className={`w-20 h-20 rounded-full border ${cat.colorBg} flex items-center justify-center text-3xl shadow-sm group-hover:shadow-md transition-all mb-3 relative`}
              >
                <span>{cat.icon}</span>
                <span className="absolute -bottom-1 bg-[#14532D] text-white text-[9px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  GO
                </span>
              </div>
              <h3 className="font-jakarta text-sm font-bold text-stone-800 group-hover:text-[#14532D] transition-colors">
                {cat.name}
              </h3>
              <span className="text-[11px] font-medium text-stone-400 mt-0.5">{cat.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
