'use client';

import React from 'react';

interface BrandItem {
  id: string;
  name: string;
  location: string;
  specialty: string;
  badge: string;
}

const BRANDS: BrandItem[] = [
  { id: '1', name: 'Tuscan Heritage Estate', location: 'Florence, Italy', specialty: 'Organic Cold-Pressed EVOO', badge: '100% Organic' },
  { id: '2', name: 'Parma DOP Consortium', location: 'Parma, Italy', specialty: '36-Month Aged Parmigiano', badge: 'DOP Certified' },
  { id: '3', name: 'Modena Battery Casks', location: 'Modena, Italy', specialty: '25-Year Balsamico Tradizionale', badge: 'Artisanal' },
  { id: '4', name: 'Jabugo Pata Negra Bodega', location: 'Huelva, Spain', specialty: '100% Acorn-Fed Ibérico Ham', badge: 'Black Label' },
];

export default function PartnerBrands() {
  return (
    <section className="py-16 bg-[#FAFAF8] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#14532D] uppercase tracking-[0.2em]">Heritage Producers</span>
          <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
            Our Certified Artisan Partners
          </h2>
          <p className="text-xs text-stone-500 mt-2 font-medium">
            We partner directly with family-owned heritage estates across Europe to guarantee 100% authentic provenance.
          </p>
        </div>

        {/* Brand Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BRANDS.map((brand) => (
            <div
              key={brand.id}
              className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#14532D] flex flex-col justify-between"
            >
              <div>
                <span className="inline-block text-[10px] font-extrabold uppercase bg-emerald-50 text-[#14532D] px-2.5 py-1 rounded-md mb-3">
                  {brand.badge}
                </span>
                <h3 className="font-jakarta text-base font-bold text-stone-900">
                  {brand.name}
                </h3>
                <p className="text-xs text-stone-500 font-medium mt-1">{brand.location}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400 font-medium">Specialty:</span>
                <span className="font-bold text-[#14532D]">{brand.specialty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
