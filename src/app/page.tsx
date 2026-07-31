import React from 'react';
import Link from 'next/link';
import { getActiveHeroSlides } from '@/lib/cms-db';
import { getContentBlockByKey } from '@/lib/content-blocks-db';
import HeroSlider from '@/components/home/HeroSlider';
import { ArrowRight, Layers, ShieldCheck, FileText, Compass, Utensils } from 'lucide-react';

export default async function Home() {
  // RSC: Fetch active hero slides from CMS DB
  const heroSlides = await getActiveHeroSlides();

  // RSC: Fetch dynamic content blocks from CMS DB
  const catBlock = await getContentBlockByKey('featured_categories');
  const storyBlock = await getContentBlockByKey('brand_story');

  return (
    <div className="w-full bg-[#0d110e] text-stone-100 overflow-hidden font-sans">
      
      {/* 1. Dynamic Hero Section */}
      <HeroSlider initialSlides={heroSlides} />

      {/* 2. Admin Quick Access Controls Banner */}
      <section className="bg-gradient-to-r from-[#111713] via-[#1b241e] to-[#111713] border-y border-[#c59b27]/20 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs gap-3">
          <div className="flex items-center space-x-3 text-stone-300">
            <ShieldCheck size={18} className="text-[#c59b27]" />
            <span>
              <strong className="text-white font-semibold">CMS Control Panel:</strong> Live Dynamic Layout & Menu Engine, Hero Slider CMS, Content Block Editor.
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/navigation"
              className="inline-flex items-center text-[#c59b27] hover:text-white font-semibold tracking-widest uppercase text-[11px] group transition-colors"
            >
              <Layers size={13} className="mr-1" />
              <span>Menu Engine</span>
            </Link>
            <span className="text-emerald-900">|</span>
            <Link
              href="/admin/content-blocks"
              className="inline-flex items-center text-[#c59b27] hover:text-white font-semibold tracking-widest uppercase text-[11px] group transition-colors"
            >
              <FileText size={13} className="mr-1" />
              <span>Content Editor</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories Showcase (Dynamic Content Block) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-emerald-900/40 pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#c59b27] font-semibold">
              {catBlock?.subtitle || 'Gourmet Selections'}
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-white font-light mt-1">
              {catBlock?.title || 'Curated Fine Food Categories'}
            </h2>
          </div>
          <p className="text-stone-400 text-xs max-w-md mt-4 md:mt-0 font-light leading-relaxed">
            {catBlock?.description ||
              'From organic produce to aged artisanal cheeses and rare pantry essentials, each item brings authentic culinary excellence.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Fresh & Gourmet */}
          <div className="group relative bg-[#141b16] border border-emerald-900/30 overflow-hidden rounded-sm hover:border-[#c59b27]/60 transition-all duration-500">
            <div className="h-72 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&h=400&auto=compress%2Cformat&fit=crop"
                alt="Fresh & Gourmet"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141b16] via-transparent to-transparent opacity-90" />
            </div>
            <div className="p-6 space-y-3">
              <span className="text-[10px] tracking-[0.2em] text-[#c59b27] uppercase">Category 01</span>
              <h3 className="font-serif-luxury text-xl text-white group-hover:text-[#c59b27] transition-colors">
                Fresh & Gourmet
              </h3>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Organic produce, rare wild mushrooms, Prime Miyazaki Wagyu, and farm-fresh heirloom vegetables.
              </p>
              <div className="pt-2">
                <Link
                  href="/collections?collection=Fresh+%26+Gourmet"
                  className="inline-flex items-center text-xs tracking-widest text-stone-300 group-hover:text-white uppercase font-medium"
                >
                  <span>Explore Fresh Produce</span>
                  <ArrowRight size={14} className="ml-1.5 text-[#c59b27]" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Artisanal Pantry */}
          <div className="group relative bg-[#141b16] border border-emerald-900/30 overflow-hidden rounded-sm hover:border-[#c59b27]/60 transition-all duration-500">
            <div className="h-72 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=400&auto=compress%2Cformat&fit=crop"
                alt="Artisanal Pantry"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141b16] via-transparent to-transparent opacity-90" />
            </div>
            <div className="p-6 space-y-3">
              <span className="text-[10px] tracking-[0.2em] text-[#c59b27] uppercase">Category 02</span>
              <h3 className="font-serif-luxury text-xl text-white group-hover:text-[#c59b27] transition-colors">
                Artisanal Pantry
              </h3>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Single-estate Tuscan EVOO, 25-year aged balsamic vinegar, black winter truffle, and IGP bronze-drawn pasta.
              </p>
              <div className="pt-2">
                <Link
                  href="/collections?collection=Artisanal+Pantry"
                  className="inline-flex items-center text-xs tracking-widest text-stone-300 group-hover:text-white uppercase font-medium"
                >
                  <span>Explore Pantry</span>
                  <ArrowRight size={14} className="ml-1.5 text-[#c59b27]" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Dairy & Charcuterie */}
          <div className="group relative bg-[#141b16] border border-emerald-900/30 overflow-hidden rounded-sm hover:border-[#c59b27]/60 transition-all duration-500">
            <div className="h-72 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&h=400&auto=compress%2Cformat&fit=crop"
                alt="Dairy & Charcuterie"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141b16] via-transparent to-transparent opacity-90" />
            </div>
            <div className="p-6 space-y-3">
              <span className="text-[10px] tracking-[0.2em] text-[#c59b27] uppercase">Category 03</span>
              <h3 className="font-serif-luxury text-xl text-white group-hover:text-[#c59b27] transition-colors">
                Dairy & Charcuterie
              </h3>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                36-month Parmigiano Reggiano DOP, acorn-fed Jamón Ibérico 100% Pata Negra, and alpine artisan cheeses.
              </p>
              <div className="pt-2">
                <Link
                  href="/collections?collection=Dairy+%26+Charcuterie"
                  className="inline-flex items-center text-xs tracking-widest text-stone-300 group-hover:text-white uppercase font-medium"
                >
                  <span>Explore Charcuterie</span>
                  <ArrowRight size={14} className="ml-1.5 text-[#c59b27]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Brand Story & Innovation (Dynamic Content Block) */}
      <section className="bg-[#0a0e0b] py-24 border-t border-emerald-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 text-[#c59b27] text-xs uppercase tracking-[0.25em]">
              <Compass size={16} />
              <span>{storyBlock?.subtitle || 'Heritage & Quality'}</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl text-white font-light leading-tight">
              {storyBlock?.title || 'Farm to Table Excellence & Organic Craftsmanship.'}
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-light">
              {storyBlock?.description ||
                'Anatolia Gourmet stands at the pinnacle of global artisanal food sourcing. Guided by sustainable organic farming and direct partnerships with heritage producers across Italy, Spain, and Japan, we curate pure ingredients that redefine fine dining.'}
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-emerald-900/40">
              <div>
                <span className="font-serif-luxury text-3xl text-[#c59b27]">50+</span>
                <p className="text-[11px] text-stone-400 uppercase tracking-wider mt-1">Partner Farms</p>
              </div>
              <div>
                <span className="font-serif-luxury text-3xl text-[#c59b27]">100%</span>
                <p className="text-[11px] text-stone-400 uppercase tracking-wider mt-1">Organic Certified</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="border border-emerald-900/40 p-3 bg-[#111713] rounded-sm">
              <img
                src={
                  storyBlock?.media_url ||
                  'https://images.unsplash.com/photo-1509358271058-acd02cc93898?w=800&h=600&auto=compress%2Cformat&fit=crop'
                }
                alt="Anatolia Gourmet Craftsmanship"
                className="w-full h-auto object-cover rounded-sm filter brightness-95"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
