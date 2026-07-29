import React from 'react';
import Link from 'next/link';
import { getActiveHeroSlides } from '@/lib/cms-db';
import { getContentBlockByKey } from '@/lib/content-blocks-db';
import HeroSlider from '@/components/home/HeroSlider';
import { ArrowRight, Film, Layers, ShieldCheck, Compass, FileText } from 'lucide-react';

export default async function Home() {
  // RSC: Fetch active hero slides from CMS DB
  const heroSlides = await getActiveHeroSlides();

  // RSC: Fetch dynamic content blocks from CMS DB
  const catBlock = await getContentBlockByKey('featured_categories');
  const storyBlock = await getContentBlockByKey('brand_story');

  return (
    <div className="w-full bg-[#0a0a0c] text-stone-100 overflow-hidden font-sans">
      
      {/* 1. Dynamic Hero Section */}
      <HeroSlider initialSlides={heroSlides} />

      {/* 2. Admin Quick Access Controls Banner */}
      <section className="bg-gradient-to-r from-[#121218] via-[#1a1a24] to-[#121218] border-y border-[#c5a880]/20 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs gap-3">
          <div className="flex items-center space-x-3 text-stone-300">
            <ShieldCheck size={18} className="text-[#c5a880]" />
            <span>
              <strong className="text-white font-semibold">CMS Control Panel:</strong> Live Dynamic Layout & Menu Engine, Hero Slider CMS, Content Block Editor.
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/navigation"
              className="inline-flex items-center text-[#c5a880] hover:text-white font-semibold tracking-widest uppercase text-[11px] group"
            >
              <Layers size={13} className="mr-1" />
              <span>Menu Engine</span>
            </Link>
            <span className="text-stone-700">|</span>
            <Link
              href="/admin/content-blocks"
              className="inline-flex items-center text-[#c5a880] hover:text-white font-semibold tracking-widest uppercase text-[11px] group"
            >
              <FileText size={13} className="mr-1" />
              <span>Content Editor</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories Showcase (Dynamic Content Block) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-stone-800 pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#c5a880] font-semibold">
              {catBlock?.subtitle || 'Product Categories'}
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-white font-light mt-1">
              {catBlock?.title || 'Engineered Collections'}
            </h2>
          </div>
          <p className="text-stone-400 text-xs max-w-md mt-4 md:mt-0 font-light leading-relaxed">
            {catBlock?.description ||
              'From porcelain floorings to large sintered stone slabs, each collection evokes a sense of calm and tactile sophistication.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Ceramic + Porcelain */}
          <div className="group relative bg-[#121216] border border-stone-800 overflow-hidden rounded-sm hover:border-[#c5a880]/60 transition-all duration-500">
            <div className="h-72 overflow-hidden relative">
              <img
                src="https://optimise2.assets-servd.host/powerful-koala/production/images/menu/Ceramic-Porcelain_Featured_Majesto_menu_image.jpg?w=600&h=400&auto=compress%2Cformat&fit=crop"
                alt="Ceramic + Porcelain"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent opacity-80" />
            </div>
            <div className="p-6 space-y-3">
              <span className="text-[10px] tracking-[0.2em] text-[#c5a880] uppercase">Collection 01</span>
              <h3 className="font-serif-luxury text-xl text-white group-hover:text-[#c5a880] transition-colors">
                Ceramic + Porcelain
              </h3>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Sophisticated floor and wall porcelain series including wood, stone, and contemporary linear inspirations.
              </p>
              <div className="pt-2">
                <Link
                  href="/collections?collection=Ceramic+%2B+Porcelain"
                  className="inline-flex items-center text-xs tracking-widest text-stone-300 group-hover:text-white uppercase font-medium"
                >
                  <span>Explore Series</span>
                  <ArrowRight size={14} className="ml-1.5 text-[#c5a880]" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Natural Stone */}
          <div className="group relative bg-[#121216] border border-stone-800 overflow-hidden rounded-sm hover:border-[#c5a880]/60 transition-all duration-500">
            <div className="h-72 overflow-hidden relative">
              <img
                src="https://optimise2.assets-servd.host/powerful-koala/production/images/menu/Marble_Menu_Image_2022-09-28-140959_sgdq.jpg?w=600&h=400&auto=compress%2Cformat&fit=crop"
                alt="Natural Stone"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent opacity-80" />
            </div>
            <div className="p-6 space-y-3">
              <span className="text-[10px] tracking-[0.2em] text-[#c5a880] uppercase">Collection 02</span>
              <h3 className="font-serif-luxury text-xl text-white group-hover:text-[#c5a880] transition-colors">
                Natural Stone
              </h3>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Hand-curated Dolomite, Marble, Limestone, and Travertine tiles created for distinctive luxury projects.
              </p>
              <div className="pt-2">
                <Link
                  href="/collections?collection=Natural+Stone"
                  className="inline-flex items-center text-xs tracking-widest text-stone-300 group-hover:text-white uppercase font-medium"
                >
                  <span>Explore Stone</span>
                  <ArrowRight size={14} className="ml-1.5 text-[#c5a880]" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Sintered Slab */}
          <div className="group relative bg-[#121216] border border-stone-800 overflow-hidden rounded-sm hover:border-[#c5a880]/60 transition-all duration-500">
            <div className="h-72 overflow-hidden relative">
              <img
                src="https://optimise2.assets-servd.host/powerful-koala/production/images/menu/Onyx_menu_image.jpg?w=600&h=400&auto=compress%2Cformat&fit=crop"
                alt="Sintered Slab"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent opacity-80" />
            </div>
            <div className="p-6 space-y-3">
              <span className="text-[10px] tracking-[0.2em] text-[#c5a880] uppercase">Collection 03</span>
              <h3 className="font-serif-luxury text-xl text-white group-hover:text-[#c5a880] transition-colors">
                Sintered Slabs
              </h3>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Extraordinary large format 6mm and 12mm sintered slabs with Onyx, Quartzite, and Monochromatic veins.
              </p>
              <div className="pt-2">
                <Link
                  href="/collections?collection=Sintered+Slab"
                  className="inline-flex items-center text-xs tracking-widest text-stone-300 group-hover:text-white uppercase font-medium"
                >
                  <span>Explore Slabs</span>
                  <ArrowRight size={14} className="ml-1.5 text-[#c5a880]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Brand Story & Innovation (Dynamic Content Block) */}
      <section className="bg-[#0e0e12] py-24 border-t border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 text-[#c5a880] text-xs uppercase tracking-[0.25em]">
              <Compass size={16} />
              <span>{storyBlock?.subtitle || 'Leadership & Excellence'}</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl text-white font-light leading-tight">
              {storyBlock?.title || 'Pioneering Patented Surface Innovations.'}
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-light">
              {storyBlock?.description ||
                'Anatolia stands at the forefront of global tile and slab manufacturing. Driven by sustainable practices and state-of-the-art technological advancements, we craft surfaces that redefine interior and exterior architecture.'}
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-stone-800">
              <div>
                <span className="font-serif-luxury text-3xl text-[#c5a880]">25+</span>
                <p className="text-[11px] text-stone-400 uppercase tracking-wider mt-1">Global Markets</p>
              </div>
              <div>
                <span className="font-serif-luxury text-3xl text-[#c5a880]">100%</span>
                <p className="text-[11px] text-stone-400 uppercase tracking-wider mt-1">Patented Precision</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="border border-stone-800 p-3 bg-[#16161d] rounded-sm">
              <img
                src={
                  storyBlock?.media_url ||
                  'https://optimise2.assets-servd.host/powerful-koala/production/images/menu/Contemporary_SEARCH_RESULT_IMAGE.jpg?w=800&h=600&auto=compress%2Cformat&fit=crop'
                }
                alt="Anatolia Craftsmanship"
                className="w-full h-auto object-cover rounded-sm filter brightness-95"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
