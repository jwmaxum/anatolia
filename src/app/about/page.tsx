import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Award, Leaf, Globe, Sparkles, ArrowRight } from 'lucide-react';
import { getContentBlockByKey } from '@/lib/content-blocks-db';

export const metadata = {
  title: 'About Anatolia Gourmet | Heritage Gastronomy & Organic Excellence',
  description: 'Learn about Anatolia Gourmet heritage artisanal sourcing, 100% organic Italian & Spanish estates, and fine dining traditions.',
};

export default async function AboutPage() {
  const brandStoryBlock = await getContentBlockByKey('brand_story');

  const stats = [
    { label: 'Partner Heritage Farms', value: '120+', desc: 'Directly sourced from Italy, Spain & France' },
    { label: 'Certified Organic Harvest', value: '100%', desc: 'No chemical pesticides or synthetic additives' },
    { label: 'Artisan Aging Masters', value: '300 yrs', desc: 'Centuries of traditional family craftsmanship' },
    { label: 'Global Fine Dining Partners', value: '45+', desc: 'Supplying Michelin-starred kitchens worldwide' },
  ];

  const coreValues = [
    {
      title: 'Uncompromised Terroir',
      desc: 'Each extra virgin olive oil and DOP aged cheese carries the distinct soil, microclimate, and soul of its origin estate.',
      icon: Leaf,
    },
    {
      title: 'Heritage Craftsmanship',
      desc: 'Hand-picked dawn harvests and traditional cold-extraction methods passed down through generations of master artisans.',
      icon: Award,
    },
    {
      title: 'Sustainable Stewardship',
      desc: '100% eco-conscious farming, zero plastic temperature-controlled packaging, and carbon-neutral refrigerated logistics.',
      icon: Globe,
    },
  ];

  return (
    <div className="min-h-screen bg-[#070908] text-stone-200 font-sans selection:bg-[#c59b27] selection:text-black">

      {/* Hero Banner Section */}
      <section className="relative py-28 md:py-40 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1920&q=80"
            alt="Anatolia Estate"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070908] via-[#070908]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 text-[#c59b27] text-xs font-mono uppercase tracking-[0.3em] bg-[#c59b27]/10 border border-[#c59b27]/30 px-4 py-1.5 rounded-full">
            <Sparkles size={14} />
            <span>Heritage &amp; Gastronomy</span>
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-6xl text-white font-bold tracking-tight leading-tight">
            {brandStoryBlock?.title || 'Pioneering Heritage Gastronomy.'}
          </h1>

          <p className="max-w-2xl mx-auto text-stone-300 text-sm sm:text-base leading-relaxed font-light">
            {brandStoryBlock?.description ||
              'Anatolia Gourmet stands at the pinnacle of global fine food sourcing. Guided by 100% sustainable organic farming and direct partnerships with heritage producers across Italy, Spain, and Japan.'}
          </p>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="border-b border-white/5 bg-[#0b0e0c]/60 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center space-y-1">
              <div className="font-serif-luxury text-3xl sm:text-4xl text-[#c59b27] font-semibold">
                {stat.value}
              </div>
              <div className="text-xs text-white font-medium tracking-wider uppercase font-mono">
                {stat.label}
              </div>
              <div className="text-[11px] text-stone-500 font-light">{stat.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story & Philosophy Feature Section */}
      <section className="py-24 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="text-xs uppercase tracking-[0.25em] font-mono text-[#c59b27]">
            Our Philosophy
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-white font-bold leading-snug">
            From Ancient Mediterranean Estates to Your Dining Table.
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed font-light">
            Founded with a vision to preserve centuries-old culinary traditions, Anatolia connects discerning gourmets with master producers who refuse to compromise quality for mass production.
          </p>
          <p className="text-stone-400 text-sm leading-relaxed font-light">
            Every bottle of Extra Virgin Olive Oil is pressed within hours of harvest at dawn; every wheel of DOP Parmigiano is aged naturally in granite cellars until peak crystalline complexity is reached.
          </p>
          <div className="pt-4">
            <Link
              href="/collections"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#c59b27] hover:bg-[#d5aa37] text-black font-medium text-xs tracking-widest uppercase rounded-sm transition-all shadow-lg"
            >
              <span>Explore Curated Pantry</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="relative h-64 sm:h-80 rounded overflow-hidden border border-white/10">
            <Image
              src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80"
              alt="Olive Grove"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="relative h-64 sm:h-80 rounded overflow-hidden border border-white/10 mt-6 sm:mt-10">
            <Image
              src="https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=80"
              alt="Cheese Cellar"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-[#0a0d0b] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="font-serif-luxury text-3xl text-white font-semibold">
              The Anatolia Difference
            </h2>
            <p className="text-stone-400 text-xs tracking-wider uppercase font-mono">
              Pillars of Pure Artisanal Excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="bg-[#111613] border border-emerald-950 p-8 rounded space-y-4 hover:border-[#c59b27]/40 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded bg-[#c59b27]/10 border border-[#c59b27]/30 flex items-center justify-center text-[#c59b27]">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-serif-luxury text-lg text-white font-medium">
                    {val.title}
                  </h3>
                  <p className="text-stone-400 text-xs leading-relaxed font-light">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Admin Sync Notice */}
      <div className="py-6 bg-[#060807] border-t border-white/5 text-center text-xs text-stone-600 font-mono">
        <ShieldCheck size={14} className="inline mr-1 text-[#c59b27]" />
        This page text and media are integrated with Anatolia CMS Content Blocks (`brand_story`).
      </div>
    </div>
  );
}
