import React from 'react';
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | Anatolia Gourmet',
  description: 'Terms of Service for Anatolia Gourmet Fine Foods Inc.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#070908] text-stone-300 font-sans py-24 px-6">
      <div className="max-w-4xl mx-auto space-y-8 bg-[#0b0e0c] border border-emerald-950 p-8 sm:p-12 rounded">
        <div className="flex items-center space-x-3 text-[#c59b27]">
          <FileText size={24} />
          <h1 className="font-serif-luxury text-3xl text-white font-bold">Terms of Service</h1>
        </div>
        
        <p className="text-xs text-stone-400 font-mono">Effective Date: August 2026</p>

        <div className="space-y-6 text-xs sm:text-sm font-light leading-relaxed text-stone-300">
          <section className="space-y-2">
            <h2 className="text-base text-white font-serif-luxury font-semibold">1. Artisanal Product Variations</h2>
            <p>
              Due to the 100% natural, unpasteurized, and small-batch nature of our DOP cheeses, cold-pressed olive oils, and cured meats, slight natural variations in color, aroma, and texture are hallmarks of authentic organic terroir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base text-white font-serif-luxury font-semibold">2. Temperature Assurance Guarantee</h2>
            <p>
              If your perishable shipment fails to arrive within specified temperature thresholds due to courier delays, Anatolia will immediately dispatch a fresh replacement free of charge.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
