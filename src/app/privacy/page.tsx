import React from 'react';
import { Shield } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Anatolia Gourmet',
  description: 'Privacy Policy and data protection guidelines for Anatolia Gourmet Fine Foods.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#070908] text-stone-300 font-sans py-24 px-6">
      <div className="max-w-4xl mx-auto space-y-8 bg-[#0b0e0c] border border-emerald-950 p-8 sm:p-12 rounded">
        <div className="flex items-center space-x-3 text-[#c59b27]">
          <Shield size={24} />
          <h1 className="font-serif-luxury text-3xl text-white font-bold">Privacy Policy</h1>
        </div>
        
        <p className="text-xs text-stone-400 font-mono">Last Updated: August 2026</p>

        <div className="space-y-6 text-xs sm:text-sm font-light leading-relaxed text-stone-300">
          <section className="space-y-2">
            <h2 className="text-base text-white font-serif-luxury font-semibold">1. Data Collection &amp; Commitment</h2>
            <p>
              Anatolia Gourmet Fine Foods Inc. respects your privacy. We collect personal information solely to process cold-chain deliveries, manage account preferences, and provide bespoke gourmet recommendations.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base text-white font-serif-luxury font-semibold">2. Cold-Chain Logistical Data Sharing</h2>
            <p>
              Address and contact details are securely transmitted to certified temperature-controlled express courier partners for guaranteed fresh delivery. We never sell or transfer your data to third-party advertisers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base text-white font-serif-luxury font-semibold">3. Encryption &amp; Security</h2>
            <p>
              All payment transactions are encrypted using SSL 256-bit protocols with PCI-DSS Level 1 compliance.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
