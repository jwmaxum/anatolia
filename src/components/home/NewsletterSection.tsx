'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, Send } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#14532D] rounded-3xl p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-xl">
          
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto border border-white/20">
              <Mail size={26} className="text-[#EAB308]" />
            </div>

            <h2 className="font-jakarta text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Join the Anatolia Gourmet Club
            </h2>

            <p className="text-emerald-100 text-xs sm:text-sm font-medium leading-relaxed">
              Subscribe to receive private harvest releases, seasonal recipes by Michelin chefs, and exclusive 15% off your first order.
            </p>

            {subscribed ? (
              <div className="bg-white/15 border border-white/30 rounded-2xl p-4 flex items-center justify-center space-x-2 text-white font-bold text-sm animate-in fade-in duration-300">
                <CheckCircle2 size={20} className="text-[#EAB308]" />
                <span>Thank you for subscribing! Welcome to the Anatolia Club.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 px-5 py-3.5 rounded-xl bg-white text-stone-800 placeholder:text-stone-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#EAB308] shadow-inner"
                />
                <button
                  type="submit"
                  className="flex items-center justify-center space-x-2 bg-[#EAB308] hover:bg-yellow-500 text-stone-900 font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all"
                >
                  <span>Subscribe</span>
                  <Send size={14} />
                </button>
              </form>
            )}

            <p className="text-[11px] text-emerald-200 font-medium">
              🔒 We respect your privacy. Unsubscribe anytime with one click.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
