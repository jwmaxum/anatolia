import React from 'react';
import Link from 'next/link';
import { getJournalArticles } from '@/lib/journal-db';
import { Sparkles, Calendar, Tag, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Journal & Press News | Anatolia',
  description: 'Discover the latest news, architectural events, and surface design innovations from Anatolia.',
};

export default async function JournalPage() {
  // RSC: Fetch published journal articles
  const articles = await getJournalArticles(true);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-stone-100 font-sans pb-24">
      {/* Top Banner */}
      <div className="relative py-20 bg-gradient-to-b from-[#121218] via-[#0e0e12] to-[#0a0a0c] border-b border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 text-[#c5a880] text-xs uppercase tracking-[0.3em]">
            <Sparkles size={14} />
            <span>Anatolia Editorial & Press</span>
          </div>
          <h1 className="font-serif-luxury text-4xl sm:text-6xl font-light text-white tracking-tight">
            News, Events & Architectural Stories
          </h1>
          <p className="text-stone-400 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            Stay informed on our latest sintered slab manufacturing breakthroughs, global design exhibitions, and surface craftsmanship.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((art) => (
            <div
              key={art.id}
              className="group bg-[#121217] border border-stone-800 rounded overflow-hidden flex flex-col justify-between hover:border-[#c5a880]/60 transition-all duration-500 shadow-xl"
            >
              {/* Image */}
              <div className="relative h-60 overflow-hidden bg-stone-900">
                <img
                  src={art.cover_image}
                  alt={art.title}
                  className="w-full h-full object-cover img-zoom-hover"
                />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 bg-black/70 border border-white/10 backdrop-blur-md rounded text-[10px] uppercase font-mono text-[#c5a880]">
                  {art.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-[10px] text-stone-500 font-mono">
                    <Calendar size={12} className="text-[#c5a880]" />
                    <span>{art.published_date}</span>
                  </div>
                  <h2 className="font-serif-luxury text-xl text-white font-medium group-hover:text-[#c5a880] transition-colors leading-snug">
                    {art.title}
                  </h2>
                  <p className="text-xs text-stone-400 font-light leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-800/60">
                  <Link
                    href={`/journal/${art.slug}`}
                    className="inline-flex items-center text-xs tracking-widest text-[#c5a880] group-hover:text-white uppercase font-medium"
                  >
                    <span>Read Article</span>
                    <ArrowRight size={14} className="ml-1.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
