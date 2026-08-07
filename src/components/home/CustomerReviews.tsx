'use client';

import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

interface ReviewItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  productName: string;
  productImg: string;
  review: string;
  date: string;
}

const REVIEWS: ReviewItem[] = [
  {
    id: '1',
    name: 'Chef Marco Rossi',
    role: 'Executive Chef, Milano',
    rating: 5,
    productName: 'Tuscan Artisanal Organic EVOO',
    productImg: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=200&q=80',
    review: 'The peppery aroma and emerald color of this cold-pressed EVOO are incredible. The polyphenol richness elevates every dish in our kitchen.',
    date: '3 days ago',
  },
  {
    id: '2',
    name: 'Elena Rostova',
    role: 'Verified Gourmet Buyer',
    rating: 5,
    productName: '36-Month Aged DOP Parmigiano',
    productImg: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=200&q=80',
    review: 'The crystalline crunch and deep nutty umami flavor of this 36-month Parmigiano block are unparalleled. Delivery was fast and chilled.',
    date: '1 week ago',
  },
  {
    id: '3',
    name: 'David K. Tanaka',
    role: 'Fine Dining Enthusiast',
    rating: 5,
    productName: 'Jamón Ibérico 100% Pata Negra',
    productImg: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=200&q=80',
    review: 'Melts in your mouth instantly. The acorn-fed fat marbling gives it an unbelievable nutty richness. Worth every penny!',
    date: '2 weeks ago',
  },
];

export default function CustomerReviews() {
  return (
    <section className="py-20 bg-[#FAFAF8] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1 text-amber-500 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} fill="currentColor" />
            ))}
            <span className="font-extrabold text-stone-900 text-sm ml-2">5.0 / 5.0 Rating</span>
          </div>
          <h2 className="font-jakarta text-3xl font-extrabold text-stone-900 tracking-tight">
            Loved by Chefs &amp; Connoisseurs
          </h2>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Real feedback from certified buyers and culinary professionals around the world.
          </p>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative"
            >
              <Quote className="absolute top-6 right-6 text-emerald-100" size={32} />

              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>

                {/* Review Content */}
                <p className="text-xs text-stone-700 font-normal leading-relaxed italic">
                  &ldquo;{rev.review}&rdquo;
                </p>
              </div>

              {/* Product & User Info Footer */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={rev.productImg}
                    alt={rev.productName}
                    className="w-10 h-10 object-cover rounded-lg border border-stone-200"
                  />
                  <div>
                    <div className="flex items-center space-x-1">
                      <h3 className="font-jakarta text-xs font-bold text-stone-900">{rev.name}</h3>
                      <CheckCircle size={12} className="text-[#14532D]" />
                    </div>
                    <p className="text-[10px] text-stone-400 font-medium">{rev.role}</p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
