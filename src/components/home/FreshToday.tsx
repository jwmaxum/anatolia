'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Leaf, ShieldCheck, Truck } from 'lucide-react';

export default function FreshToday() {
  return (
    <section className="py-20 bg-white border-b border-stone-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#14532D] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          
          {/* Decorative Background Accents */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-emerald-800/30 blur-3xl pointer-events-none" />
          <div className="absolute right-10 top-10 text-9xl opacity-10 select-none pointer-events-none font-serif">
            🌿
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-[#EAB308] text-stone-900 font-extrabold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                <Leaf size={14} />
                <span>Daily Harvest Spotlight</span>
              </div>

              <h2 className="font-jakarta text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
                Fresh Today from Heritage Organic Farms
              </h2>

              <p className="text-emerald-100 text-sm sm:text-base font-medium leading-relaxed max-w-xl">
                Harvested at dawn in Tuscan groves and alpine cellars, then cold-transported directly to your doorstep. Experience peak freshness and uncompromised artisanal flavor.
              </p>

              {/* Value Badges */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur p-3 rounded-xl border border-white/15">
                  <Truck className="text-[#EAB308]" size={22} />
                  <div>
                    <h3 className="font-bold text-xs">24-Hour Express Air Cold Shipping</h3>
                    <p className="text-[10px] text-emerald-200">Guaranteed Freshness</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur p-3 rounded-xl border border-white/15">
                  <ShieldCheck className="text-[#EAB308]" size={22} />
                  <div>
                    <h3 className="font-bold text-xs">100% DOP &amp; Organic Certified</h3>
                    <p className="text-[10px] text-emerald-200">Origin Guaranteed</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/collections?cat=fresh"
                  className="inline-flex items-center space-x-2 bg-[#EAB308] hover:bg-yellow-500 text-stone-900 font-extrabold text-sm px-7 py-3.5 rounded-xl shadow-lg transition-all transform hover:scale-105"
                >
                  <span>Shop Daily Fresh Harvest</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Right Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <img
                  src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80"
                  alt="Fresh Organic Vegetables & Olive Oil"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl shadow-2xl border-4 border-white/20 transform -rotate-1 hover:rotate-0 transition-transform duration-500"
                />
                <div className="absolute -bottom-4 -left-4 bg-white text-stone-900 p-4 rounded-xl shadow-xl border border-stone-200 hidden sm:flex items-center space-x-3">
                  <span className="text-3xl">🫒</span>
                  <div>
                    <p className="font-bold text-xs text-[#14532D]">First Cold-Pressed</p>
                    <p className="text-[10px] text-stone-500">Tuscan Harvest 2026</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
