'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, HelpCircle, Globe } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Gourmet Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: 'Gourmet Inquiry', message: '' });
    }, 4000);
  };

  const offices = [
    { city: 'Florence Headquarters', address: 'Via dei Georgofili 12, 50122 Firenze, Italy', phone: '+39 055 234 8901' },
    { city: 'Paris Atelier', address: '18 Rue du Faubourg Saint-Honoré, 75008 Paris, France', phone: '+33 1 42 68 55 00' },
    { city: 'New York Concierge', address: '450 West 14th Street, New York, NY 10014, USA', phone: '+1 212 989 3320' },
    { city: 'Seoul Flagship Studio', address: '642 Dosan-daero, Gangnam-gu, Seoul, Korea', phone: '+82 2 540 1890' },
  ];

  const faqs = [
    {
      q: 'How is cold-chain refrigerated shipping handled?',
      a: 'All delicate cheeses, fresh truffles, and unpasteurized organic items are packaged in insulated eco-foam crates with sealed gel cold packs and shipped via Express 24-48h air delivery.',
    },
    {
      q: 'Do you supply Michelin-starred restaurants or commercial kitchens?',
      a: 'Yes, our B2B Concierge Team manages dedicated direct import allocations for executive chefs, hotels, and gourmet boutiques worldwide.',
    },
    {
      q: 'Are all olive oils certified organic and single-estate?',
      a: '100% of Anatolia Extra Virgin Olive Oils are certified organic by EU Euro-Leaf standards and harvested exclusively from single family-owned estates.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070908] text-stone-200 font-sans selection:bg-[#c59b27] selection:text-black py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* Top Title Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-[0.3em] font-mono text-[#c59b27]">
            Concierge &amp; Customer Care
          </div>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl text-white font-bold tracking-tight">
            Contact Anatolia Gourmet
          </h1>
          <p className="text-stone-400 text-sm font-light leading-relaxed">
            Have questions regarding estate allocations, private tastings, or commercial B2B supply? Our concierge team is at your service.
          </p>
        </div>

        {/* Form & Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 bg-[#0f1410] border border-emerald-950 p-8 sm:p-10 rounded shadow-2xl space-y-6">
            <h2 className="font-serif-luxury text-2xl text-white font-semibold">
              Send a Direct Message
            </h2>

            {submitted ? (
              <div className="p-6 bg-emerald-950/40 border border-emerald-800/60 rounded text-center space-y-3">
                <CheckCircle size={36} className="text-emerald-400 mx-auto" />
                <h3 className="text-lg font-serif-luxury text-white">Thank You for Reaching Out</h3>
                <p className="text-xs text-stone-400 font-light">
                  Your message has been received by our Gourmet Concierge team. We will respond within 12 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1.5 font-mono">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Lord / Lady Concierge"
                      className="w-full px-4 py-3 bg-[#070908] border border-stone-800 focus:border-[#c59b27] rounded text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1.5 font-mono">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="gourmet@domain.com"
                      className="w-full px-4 py-3 bg-[#070908] border border-stone-800 focus:border-[#c59b27] rounded text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1.5 font-mono">
                    Inquiry Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-[#070908] border border-stone-800 focus:border-[#c59b27] rounded text-sm text-white focus:outline-none transition-colors"
                  >
                    <option value="Gourmet Inquiry">General Gourmet Inquiry</option>
                    <option value="B2B Wholesale">B2B &amp; Chef Wholesale Allocation</option>
                    <option value="Order Support">Order Tracking &amp; Delivery</option>
                    <option value="Estate Visit">Private Estate Tasting Visit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1.5 font-mono">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your request or gourmet question..."
                    className="w-full px-4 py-3 bg-[#070908] border border-stone-800 focus:border-[#c59b27] rounded text-sm text-white focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#c59b27] hover:bg-[#d5aa37] text-black font-semibold text-xs tracking-widest uppercase rounded-sm transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  <Send size={14} />
                  <span>Transmit Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Global Offices & Concierge Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#0b0e0c] border border-emerald-950 p-8 rounded space-y-6">
              <h2 className="font-serif-luxury text-xl text-white font-semibold flex items-center space-x-2">
                <Globe size={18} className="text-[#c59b27]" />
                <span>Global Concierge Offices</span>
              </h2>

              <div className="space-y-5 divide-y divide-emerald-950/60">
                {offices.map((office) => (
                  <div key={office.city} className="pt-4 first:pt-0 space-y-1">
                    <h3 className="text-sm font-semibold text-white font-serif-luxury">
                      {office.city}
                    </h3>
                    <p className="text-xs text-stone-400 font-light flex items-start space-x-2 pt-1">
                      <MapPin size={13} className="text-[#c59b27] shrink-0 mt-0.5" />
                      <span>{office.address}</span>
                    </p>
                    <p className="text-xs text-stone-400 font-mono flex items-center space-x-2">
                      <Phone size={13} className="text-[#c59b27] shrink-0" />
                      <span>{office.phone}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0b0e0c] border border-emerald-950 p-6 rounded space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono uppercase text-[#c59b27]">
                <Mail size={14} />
                <span>Direct Digital Mailbox</span>
              </div>
              <p className="text-xs text-stone-300 font-mono">
                concierge@anatoliagourmet.com
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="bg-[#0b0e0c] border border-emerald-950 p-8 rounded-lg space-y-6">
          <div className="flex items-center space-x-2 text-[#c59b27]">
            <HelpCircle size={20} />
            <h2 className="font-serif-luxury text-xl text-white font-semibold">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-[#101612] p-5 rounded border border-emerald-950/80 space-y-2">
                <h3 className="text-xs font-semibold text-white tracking-wide">
                  {faq.q}
                </h3>
                <p className="text-[11px] text-stone-400 font-light leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
