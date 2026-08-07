'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeroSlide } from '@/lib/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  Film,
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  Eye,
  EyeOff,
  Upload,
  CheckCircle2,
  Video,
  Image as ImageIcon,
} from 'lucide-react';

const FALLBACK_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-1',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=1920&q=80',
    title: 'K-FOOD & K-LIQUOR PREMIUM MARKETPLACE',
    subtitle: '대한민국 대표 프리미엄 K-냉동식품 & 원소주, 생막걸리 전통주 직송 컬렉션',
    cta_label: 'K-냉동식품 구경하기',
    cta_url: '/collections?cat=fresh',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'hero-2',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1920&q=80',
    title: '100% 쌀발효 옹기 숙성 원소주 & 느린마을 막걸리',
    subtitle: '장인의 손길로 빚어낸 명품 전통주와 과일소주를 24시간 프레시 배송으로 만나보세요.',
    cta_label: 'K-주류 & 전통주 보기',
    cta_url: '/collections?cat=dairy',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'hero-3',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1920&q=80',
    title: '에어프라이어 15분! K-수제 떡볶이 & 크리스피 치킨',
    subtitle: '비비고 왕교자 만두부터 눈꽃 떡볶이 밀키트까지, 집에서 간편하게 즐기는 미식 파티.',
    cta_label: '오늘의 특가 구경하기',
    cta_url: '/collections?cat=deals',
    sort_order: 3,
    is_active: true,
  },
];

export default function HeroManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const [mediaUrl, setMediaUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaLabel, setCtaLabel] = useState('Explore Gourmet Pantry');
  const [ctaUrl, setCtaUrl] = useState('/collections');
  const [isActive, setIsActive] = useState(true);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hero?mode=admin');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setSlides(data.data);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Fallback
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('hero_slides').select('*').order('sort_order');
        if (!error && data && data.length > 0) {
          setSlides(data as HeroSlide[]);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    setSlides(FALLBACK_HERO_SLIDES);
    setLoading(false);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const nextStatus = !currentActive;
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, is_active: nextStatus } : s)));

    try {
      await fetch('/api/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: nextStatus }),
      });
    } catch {
      // Static mode
    }

    if (isSupabaseConfigured()) {
      await supabase.from('hero_slides').update({ is_active: nextStatus }).eq('id', id);
    }

    showToast('Hero slide active status updated');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero slide?')) return;
    setSlides((prev) => prev.filter((s) => s.id !== id));

    try {
      await fetch(`/api/hero?id=${id}`, { method: 'DELETE' });
    } catch {
      // Ignore
    }

    if (isSupabaseConfigured()) {
      await supabase.from('hero_slides').delete().eq('id', id);
    }

    showToast('Slide deleted successfully');
  };

  const openCreateModal = () => {
    setEditingSlide(null);
    setMediaType('video');
    setMediaUrl('');
    setPosterUrl('');
    setTitle('');
    setSubtitle('');
    setCtaLabel('Explore Gourmet Pantry');
    setCtaUrl('/collections');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setMediaType(slide.media_type);
    setMediaUrl(slide.media_url);
    setPosterUrl(slide.poster_url || '');
    setTitle(slide.title);
    setSubtitle(slide.subtitle || '');
    setCtaLabel(slide.cta_label || 'Discover More');
    setCtaUrl(slide.cta_url || '/collections');
    setIsActive(slide.is_active ?? true);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setMediaUrl(data.url);
        showToast('Media uploaded!');
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch {
      const localUrl = URL.createObjectURL(file);
      setMediaUrl(localUrl);
      showToast('Media attached locally!');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !mediaUrl.trim()) return alert('Title and Media URL are required');

    const newOrUpdated: HeroSlide = {
      id: editingSlide ? editingSlide.id : `hero-${Date.now()}`,
      media_type: mediaType,
      media_url: mediaUrl,
      poster_url: posterUrl,
      title,
      subtitle,
      cta_label: ctaLabel,
      cta_url: ctaUrl,
      sort_order: editingSlide ? editingSlide.sort_order : slides.length + 1,
      is_active: isActive,
    };

    if (editingSlide) {
      setSlides((prev) => prev.map((s) => (s.id === editingSlide.id ? newOrUpdated : s)));
    } else {
      setSlides((prev) => [...prev, newOrUpdated]);
    }

    try {
      await fetch('/api/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrUpdated),
      });
    } catch {
      // Ignore
    }

    if (isSupabaseConfigured()) {
      await supabase.from('hero_slides').upsert(newOrUpdated);
    }

    setIsModalOpen(false);
    showToast(editingSlide ? 'Slide updated' : 'New hero slide created');
  };

  return (
    <div className="p-6 md:p-10 space-y-8 bg-[#0a0a0c] text-stone-200 min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#c5a880] text-black px-5 py-3 rounded-lg shadow-xl font-medium flex items-center space-x-2 text-xs animate-bounce">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-800">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center space-x-2 text-xs text-stone-400 hover:text-[#c5a880] mb-2 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white flex items-center space-x-3">
            <Film className="text-[#c5a880]" size={28} />
            <span>Hero Slider CMS</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage main visual video MP4 and HD background slides on Anatolia homepage.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 px-5 py-2.5 bg-[#c5a880] hover:bg-[#b59870] text-black font-semibold rounded text-xs transition-colors shadow-lg"
        >
          <Plus size={16} />
          <span>ADD HERO SLIDE</span>
        </button>
      </div>

      {/* Slides Grid */}
      {loading ? (
        <div className="py-20 text-center text-stone-500 text-sm animate-pulse">
          Loading Hero Slide Data...
        </div>
      ) : slides.length === 0 ? (
        <div className="py-20 text-center bg-[#111118] border border-stone-800 rounded-xl space-y-3">
          <Film className="mx-auto text-stone-600" size={40} />
          <p className="text-stone-400 text-sm">No hero slides found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="bg-[#111118] border border-stone-800 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-[#c5a880]/50 transition-all duration-300"
            >
              <div>
                {/* Media Preview Header */}
                <div className="h-48 relative bg-black overflow-hidden flex items-center justify-center">
                  {slide.media_type === 'video' ? (
                    <video
                      src={slide.media_url}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={slide.media_url}
                      alt={slide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <span className="bg-[#0a0a0c]/80 backdrop-blur border border-stone-700 text-[#c5a880] text-[10px] uppercase font-mono px-2.5 py-1 rounded flex items-center space-x-1">
                      {slide.media_type === 'video' ? <Video size={12} /> : <ImageIcon size={12} />}
                      <span>{slide.media_type}</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleActive(slide.id, slide.is_active)}
                    className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur transition-all ${
                      slide.is_active
                        ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-400'
                        : 'bg-stone-900/80 border border-stone-700 text-stone-400'
                    }`}
                  >
                    {slide.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>

                {/* Info Content */}
                <div className="p-5 space-y-2">
                  <h3 className="font-serif-luxury text-base font-semibold text-white line-clamp-1 group-hover:text-[#c5a880] transition-colors">
                    {slide.title}
                  </h3>
                  <p className="text-xs text-stone-400 font-light line-clamp-2 leading-relaxed">
                    {slide.subtitle}
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-5 py-3 bg-[#0a0a0c]/60 border-t border-stone-800/80 flex items-center justify-between">
                <span className="text-[11px] text-[#c5a880] font-mono">
                  CTA: {slide.cta_label}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(slide)}
                    className="p-1.5 text-stone-400 hover:text-white bg-stone-900 hover:bg-stone-800 rounded border border-stone-800 transition-colors"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-900/50 rounded border border-red-900/50 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111118] border border-stone-800 rounded-xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative my-8">
            <h2 className="font-serif-luxury text-xl font-bold text-white flex items-center space-x-2">
              <Film className="text-[#c5a880]" size={20} />
              <span>{editingSlide ? 'Edit Hero Slide' : 'Create New Hero Slide'}</span>
            </h2>

            <form onSubmit={handleSaveSlide} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1 font-mono">
                    Media Type
                  </label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#0a0a0c] border border-stone-800 focus:border-[#c5a880] rounded text-sm text-white focus:outline-none"
                  >
                    <option value="video">MP4 Video</option>
                    <option value="image">HD Image</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1 font-mono">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={ctaLabel}
                    onChange={(e) => setCtaLabel(e.target.value)}
                    placeholder="Explore Gourmet Pantry"
                    className="w-full px-3.5 py-2.5 bg-[#0a0a0c] border border-stone-800 focus:border-[#c5a880] rounded text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1 font-mono">
                  Media Source URL (Video or Image)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    required
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://cdn.coverr.co/...mp4 or image url"
                    className="flex-grow px-3.5 py-2.5 bg-[#0a0a0c] border border-stone-800 focus:border-[#c5a880] rounded text-sm text-white focus:outline-none"
                  />
                  <label className="px-4 py-2.5 bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 text-xs font-medium rounded cursor-pointer flex items-center space-x-1.5 shrink-0">
                    <Upload size={14} />
                    <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1 font-mono">
                  Hero Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Headline overlay..."
                  className="w-full px-3.5 py-2.5 bg-[#0a0a0c] border border-stone-800 focus:border-[#c5a880] rounded text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1 font-mono">
                  Subtitle Description
                </label>
                <textarea
                  rows={2}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Supporting text..."
                  className="w-full px-3.5 py-2.5 bg-[#0a0a0c] border border-stone-800 focus:border-[#c5a880] rounded text-sm text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="heroActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-800 text-[#c5a880] focus:ring-0 bg-[#0a0a0c]"
                />
                <label htmlFor="heroActive" className="text-xs text-stone-300 cursor-pointer">
                  Activate slide on main homepage slider
                </label>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#c5a880] hover:bg-[#b59870] text-black font-semibold rounded text-xs transition-colors shadow-lg"
                >
                  Save Hero Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
