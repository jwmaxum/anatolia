'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductItem } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  Plus,
  Minus,
  Check,
  Award,
} from 'lucide-react';

interface ProductDetailClientProps {
  product: ProductItem;
  relatedProducts: ProductItem[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [addedToast, setAddedToast] = useState(false);

  const inWish = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#141815] text-stone-100 pb-20">
      {/* Toast Alert */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#c59b27] text-black font-semibold px-4 py-3 rounded shadow-2xl flex items-center space-x-2 animate-in slide-in-from-bottom duration-300">
          <Check size={18} />
          <span className="text-xs font-mono">Added {quantity} x "{product.name}" to cart!</span>
        </div>
      )}

      {/* Breadcrumb Header */}
      <div className="bg-[#0d110e] border-b border-emerald-900/30 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 text-xs text-stone-400 font-mono">
          <Link href="/" className="hover:text-stone-200">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-stone-200">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-[#c59b27] line-clamp-1">{product.name}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-16">
        
        {/* Main Product Showcase Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-emerald-900/40 bg-stone-950 shadow-2xl">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {product.is_featured && (
                  <span className="bg-[#c59b27] text-black font-semibold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded shadow">
                    Master Reserve
                  </span>
                )}
                {product.origin && (
                  <span className="bg-stone-900/90 text-stone-200 text-[10px] font-mono px-2.5 py-0.5 rounded border border-stone-700">
                    📍 {product.origin}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Mock list */}
            <div className="grid grid-cols-4 gap-3">
              {[product.image_url, product.image_url, product.image_url, product.image_url].map((img, idx) => (
                <div
                  key={idx}
                  className={`aspect-square rounded overflow-hidden border cursor-pointer ${
                    idx === 0 ? 'border-[#c59b27]' : 'border-emerald-900/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Specifications & Order Box */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="text-xs uppercase font-mono tracking-widest text-[#c59b27]">
                {product.collection}
              </div>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-light text-white leading-tight">
                {product.name}
              </h1>

              {/* Rating & Stock Status */}
              <div className="flex items-center space-x-4 pt-1 text-xs">
                <div className="flex items-center space-x-1 text-amber-400">
                  <Star size={14} fill="currentColor" />
                  <span className="font-mono font-semibold">{product.rating || 4.9}</span>
                  <span className="text-stone-400">({product.reviews_count || 24} customer reviews)</span>
                </div>
                <span className="text-stone-600">•</span>
                <span className="text-emerald-400 font-mono flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>In Stock ({product.stock || 42} units available)</span>
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-[#101411] border border-emerald-900/40 p-4 rounded-md flex items-baseline space-x-3">
              <span className="font-mono text-3xl font-bold text-[#c59b27]">
                ${(product.price || 50).toFixed(2)}
              </span>
              {product.original_price && (
                <span className="font-mono text-base text-stone-500 line-through">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
              <span className="text-xs text-stone-400 font-mono ml-auto">
                SKU: {product.sku || 'AN-PROD-001'}
              </span>
            </div>

            <p className="text-sm text-stone-300 font-light leading-relaxed">
              {product.description}
            </p>

            {/* Key Attributes Highlights */}
            <div className="grid grid-cols-2 gap-3 py-2 text-xs">
              <div className="bg-[#18221b] border border-emerald-900/30 p-2.5 rounded flex items-center space-x-2">
                <Award size={16} className="text-[#c59b27]" />
                <div>
                  <div className="text-stone-400 text-[10px]">Format / Packaging</div>
                  <div className="font-semibold text-stone-200">{product.format}</div>
                </div>
              </div>
              <div className="bg-[#18221b] border border-emerald-900/30 p-2.5 rounded flex items-center space-x-2">
                <ShieldCheck size={16} className="text-[#c59b27]" />
                <div>
                  <div className="text-stone-400 text-[10px]">Finish & Processing</div>
                  <div className="font-semibold text-stone-200">{product.finish}</div>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Purchase Buttons */}
            <div className="space-y-4 pt-4 border-t border-emerald-900/30">
              <div className="flex items-center space-x-4">
                <span className="text-xs uppercase font-medium text-stone-400">Quantity:</span>
                <div className="flex items-center border border-emerald-800/40 rounded bg-stone-900">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-stone-400 hover:text-white transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 font-mono text-sm font-semibold text-stone-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-stone-400 hover:text-white transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2.5 rounded border border-emerald-900/40 transition-colors ${
                    inWish ? 'text-red-500 bg-red-950/40 border-red-800' : 'text-stone-400 hover:text-white'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart size={18} fill={inWish ? 'currentColor' : 'none'} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="bg-[#c59b27] hover:bg-[#b08820] text-black font-semibold py-3 px-4 rounded text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg"
                >
                  <ShoppingBag size={16} />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-100 font-semibold py-3 px-4 rounded text-xs uppercase tracking-wider transition-all border border-stone-700 text-center"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Shipping & Security Guarantees */}
            <div className="space-y-2 pt-4 text-xs text-stone-400 border-t border-emerald-900/30 font-light">
              <div className="flex items-center space-x-2">
                <Truck size={14} className="text-[#c59b27]" />
                <span>Express Cold-Chain Shipping available worldwide.</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck size={14} className="text-[#c59b27]" />
                <span>100% Authentic DOP & IGP Certified Guarantee.</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw size={14} className="text-[#c59b27]" />
                <span>Hassle-free 14-day return policy for sealed items.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs */}
        <div className="bg-[#101411] border border-emerald-900/30 rounded-lg p-6 sm:p-8">
          <div className="flex border-b border-emerald-900/30 space-x-8">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-4 text-sm font-medium uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'desc'
                  ? 'border-[#c59b27] text-[#c59b27]'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              Description & Origin
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-4 text-sm font-medium uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'specs'
                  ? 'border-[#c59b27] text-[#c59b27]'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-sm font-medium uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-[#c59b27] text-[#c59b27]'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              Customer Reviews ({product.reviews_count || 24})
            </button>
          </div>

          <div className="pt-6">
            {activeTab === 'desc' && (
              <div className="space-y-4 text-sm text-stone-300 leading-relaxed font-light">
                <p>{product.description}</p>
                <p>
                  Handcrafted according to age-old tradition in {product.origin || 'Europe'}, this product represents the zenith of gourmet dining. Perfect for fine culinary pairing, artisanal gifting, and daily luxury indulgence.
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 bg-stone-900 rounded border border-emerald-900/30 flex justify-between">
                  <span className="text-stone-500">Collection</span>
                  <span className="text-stone-200">{product.collection}</span>
                </div>
                <div className="p-3 bg-stone-900 rounded border border-emerald-900/30 flex justify-between">
                  <span className="text-stone-500">Format</span>
                  <span className="text-stone-200">{product.format}</span>
                </div>
                <div className="p-3 bg-stone-900 rounded border border-emerald-900/30 flex justify-between">
                  <span className="text-stone-500">Finish</span>
                  <span className="text-stone-200">{product.finish}</span>
                </div>
                <div className="p-3 bg-stone-900 rounded border border-emerald-900/30 flex justify-between">
                  <span className="text-stone-500">Color Notes</span>
                  <span className="text-stone-200">{product.color}</span>
                </div>
                <div className="p-3 bg-stone-900 rounded border border-emerald-900/30 flex justify-between">
                  <span className="text-stone-500">Look & Grade</span>
                  <span className="text-stone-200">{product.look}</span>
                </div>
                <div className="p-3 bg-stone-900 rounded border border-emerald-900/30 flex justify-between">
                  <span className="text-stone-500">Country of Origin</span>
                  <span className="text-stone-200">{product.origin || 'Italy'}</span>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-stone-900 rounded border border-emerald-900/30">
                  <div className="text-center pr-6 border-r border-stone-800">
                    <div className="font-mono text-3xl font-bold text-[#c59b27]">
                      {product.rating || 4.9}
                    </div>
                    <div className="flex text-amber-400 mt-1 justify-center">
                      <Star size={13} fill="currentColor" />
                      <Star size={13} fill="currentColor" />
                      <Star size={13} fill="currentColor" />
                      <Star size={13} fill="currentColor" />
                      <Star size={13} fill="currentColor" />
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1">out of 5 stars</div>
                  </div>
                  <div className="text-xs text-stone-400 space-y-1">
                    <p className="font-medium text-stone-200">Verified Michelin-Grade Feedback</p>
                    <p>98% of customers recommended this product for its unparalleled flavor complexity and freshness.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-6">
            <h2 className="font-serif-luxury text-2xl text-white font-light">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rp) => (
                <div key={rp.id} className="bg-[#111713] border border-emerald-900/30 rounded overflow-hidden group">
                  <img
                    src={rp.image_url}
                    alt={rp.name}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-4 space-y-2">
                    <div className="text-[10px] text-[#c59b27] font-mono">{rp.collection}</div>
                    <Link
                      href={`/products/${rp.id}`}
                      className="font-serif-luxury text-sm font-medium text-stone-200 hover:text-[#c59b27] block line-clamp-1"
                    >
                      {rp.name}
                    </Link>
                    <div className="font-mono text-xs font-bold text-[#c59b27]">
                      ${(rp.price || 50).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
