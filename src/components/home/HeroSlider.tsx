'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeroSlide } from '@/lib/types';
import { Sparkles, ChevronLeft, ChevronRight, Layers, Film } from 'lucide-react';

interface HeroSliderProps {
  initialSlides: HeroSlide[];
}

export default function HeroSlider({ initialSlides }: HeroSliderProps) {
  const [slides] = useState<HeroSlide[]>(initialSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    if (!isAutoplay || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isAutoplay, slides.length]);

  if (!slides || slides.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#0a0a0c] flex items-center justify-center text-stone-500">
        No active hero slides available.
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  const nextSlide = () => {
    setIsAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIsAutoplay(false);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 border-b border-stone-800/60 overflow-hidden">
      {/* Background Media (Video or Image) */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {slide.media_type === 'video' ? (
            <video
              src={slide.media_url}
              poster={slide.poster_url}
              muted
              loop
              autoPlay
              playsInline
              className="w-full h-full object-cover object-center filter brightness-[0.75]"
            />
          ) : (
            <img
              src={slide.media_url}
              alt={slide.title}
              className="w-full h-full object-cover object-center filter brightness-[0.75] transform scale-105 transition-transform duration-[12000ms]"
            />
          )}

          {/* Dark Luxury Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/50 to-black/40" />
        </div>
      ))}

      {/* Hero Text Overlay Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 pt-12">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md">
          <Sparkles size={14} className="text-[#c5a880]" />
          <span className="text-xs uppercase tracking-[0.3em] text-stone-200 font-light">
            Architectural Surface Innovations
          </span>
        </div>

        <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white leading-tight transition-all duration-700">
          {currentSlide.title}
        </h1>

        <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
          {currentSlide.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href={currentSlide.cta_url || '/collections'}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#c5a880] hover:bg-[#dbbc93] text-black font-semibold text-xs uppercase tracking-[0.25em] transition-all duration-300 shadow-xl"
          >
            {currentSlide.cta_label || 'Explore Collections'}
          </Link>
          <Link
            href="/admin/hero"
            className="w-full sm:w-auto px-8 py-3.5 bg-black/60 hover:bg-white/10 text-stone-200 border border-[#c5a880]/50 hover:border-[#c5a880] font-medium text-xs uppercase tracking-[0.25em] transition-all backdrop-blur-md flex items-center justify-center space-x-2"
          >
            <Film size={14} className="text-[#c5a880]" />
            <span>Hero Slider CMS</span>
          </Link>
        </div>
      </div>

      {/* Slider Controls (Prev / Next Buttons) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-[#c5a880] border border-white/10 hover:border-[#c5a880] text-white hover:text-black flex items-center justify-center transition-all duration-200 backdrop-blur-md"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-[#c5a880] border border-white/10 hover:border-[#c5a880] text-white hover:text-black flex items-center justify-center transition-all duration-200 backdrop-blur-md"
          >
            <ChevronRight size={20} />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsAutoplay(false);
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-[#c5a880]' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
