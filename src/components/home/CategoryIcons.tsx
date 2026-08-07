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
  { id: '1', name: '비비고 만두', icon: '🥟', url: '/collections?cat=fresh#mandu', colorBg: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200', count: '14 품목' },
  { id: '2', name: '원소주 & 증류주', icon: '🍾', url: '/collections?cat=dairy#soju', colorBg: 'bg-amber-50 hover:bg-amber-100 border-amber-200', count: '18 품목' },
  { id: '3', name: '떡볶이 밀키트', icon: '🥘', url: '/collections?cat=fresh#tteok', colorBg: 'bg-rose-50 hover:bg-rose-100 border-rose-200', count: '8 품목' },
  { id: '4', name: '크리스피 치킨', icon: '🍗', url: '/collections?cat=fresh#chicken', colorBg: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200', count: '12 품목' },
  { id: '5', name: '생막걸리 & 탁주', icon: '🍶', url: '/collections?cat=dairy#makgeolli', colorBg: 'bg-purple-50 hover:bg-purple-100 border-purple-200', count: '9 품목' },
  { id: '6', name: 'K-간식 & 디저트', icon: '🍿', url: '/collections?cat=pantry#snack', colorBg: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200', count: '11 품목' },
];

export default function CategoryIcons() {
  return (
    <section className="py-14 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#14532D] uppercase tracking-[0.2em]">Quick Explore</span>
          <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
            K-푸드 &amp; K-주류 카테고리
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
