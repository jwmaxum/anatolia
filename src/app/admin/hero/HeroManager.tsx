'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeroSlide } from '@/lib/types';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Film,
  Sparkles,
} from 'lucide-react';

export default function HeroManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form & Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaLabel, setCtaLabel] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [sortOrder, setSortOrder] = useState(1);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hero?mode=admin');
      const data = await res.json();
      if (data.success) {
        setSlides(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: currentActive } : s))
    );

    try {
      const res = await fetch('/api/hero', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: currentActive }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Slide status updated!');
      } else {
        fetchSlides();
      }
    } catch (err) {
      console.error(err);
      fetchSlides();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero slide?')) return;
    try {
      const res = await fetch(`/api/hero?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Hero slide deleted!');
        fetchSlides();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setEditingSlide(null);
    setMediaType('image');
    setMediaUrl('');
    setPosterUrl('');
    setTitle('');
    setSubtitle('');
    setCtaLabel('Explore Collections');
    setCtaUrl('/collections');
    setSortOrder(slides.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setMediaType(slide.media_type);
    setMediaUrl(slide.media_url);
    setPosterUrl(slide.poster_url || '');
    setTitle(slide.title);
    setSubtitle(slide.subtitle);
    setCtaLabel(slide.cta_label);
    setCtaUrl(slide.cta_url);
    setSortOrder(slide.sort_order);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl || !title) return;

    const payload = {
      ...(editingSlide ? { id: editingSlide.id } : {}),
      media_type: mediaType,
      media_url: mediaUrl,
      poster_url: posterUrl,
      title,
      subtitle,
      cta_label: ctaLabel,
      cta_url: ctaUrl,
      sort_order: sortOrder,
      is_active: editingSlide ? editingSlide.is_active : true,
    };

    try {
      const res = await fetch('/api/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast(editingSlide ? 'Slide updated!' : 'New Slide Created!');
        setIsModalOpen(false);
        fetchSlides();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-stone-200 p-6 md:p-12 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-3 rounded shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-800 pb-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-xs text-[#c5a880] hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft size={14} className="mr-1" /> Back to Main Site
          </Link>
          <div className="flex items-center space-x-3">
            <Film className="text-[#c5a880]" size={28} />
            <h1 className="font-serif-luxury text-2xl md:text-3xl font-semibold tracking-wide text-white">
              Hero Banner & Media Slider CMS
            </h1>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Manage main page hero slides with MP4 Video or HD Image backgrounds, custom titles, subtitles, and CTA buttons.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-[#c5a880] hover:bg-[#dbbc93] text-black font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded transition-all shadow-lg"
        >
          <Plus size={16} />
          <span>Add Hero Slide</span>
        </button>
      </div>

      {/* Grid of Hero Slides */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="py-20 text-center text-stone-500 text-sm">Loading Hero Slides...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="bg-[#13131a] border border-stone-800 rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#c5a880]/50 transition-all duration-300 shadow-xl"
              >
                {/* Media Thumbnail */}
                <div className="relative h-48 bg-black overflow-hidden group">
                  {slide.media_type === 'video' ? (
                    <video
                      src={slide.media_url}
                      poster={slide.poster_url}
                      muted
                      loop
                      autoPlay
                      className="w-full h-full object-cover opacity-80"
                    />
                  ) : (
                    <img
                      src={slide.media_url}
                      alt={slide.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  {/* Media Type Badge */}
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5 px-2.5 py-1 rounded bg-black/70 border border-white/10 backdrop-blur-md text-[10px] uppercase font-mono tracking-wider text-stone-200">
                    {slide.media_type === 'video' ? (
                      <>
                        <Video size={12} className="text-amber-400" />
                        <span>Video (MP4)</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon size={12} className="text-sky-400" />
                        <span>Image</span>
                      </>
                    )}
                  </div>

                  {/* Active Indicator */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        slide.is_active ? 'bg-emerald-400 animate-pulse' : 'bg-stone-600'
                      }`}
                      title={slide.is_active ? 'Active' : 'Hidden'}
                    />
                  </div>
                </div>

                {/* Info Details */}
                <div className="p-5 flex-grow space-y-2">
                  <div className="text-[10px] font-mono text-[#c5a880] uppercase tracking-wider">
                    Order #{slide.sort_order}
                  </div>
                  <h3 className="font-serif-luxury text-lg text-white font-medium line-clamp-1">
                    {slide.title}
                  </h3>
                  <p className="text-xs text-stone-400 font-light line-clamp-2 leading-relaxed">
                    {slide.subtitle}
                  </p>

                  <div className="pt-2 flex items-center text-[11px] text-stone-500 font-mono">
                    <span className="text-stone-300 font-semibold mr-1">CTA:</span>
                    <span>{slide.cta_label}</span>
                    <span className="mx-1.5">•</span>
                    <span className="truncate">{slide.cta_url}</span>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="p-4 bg-[#181822] border-t border-stone-800/80 flex items-center justify-between">
                  {/* Toggle Active Button */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleActive(slide.id, !slide.is_active)}
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                        slide.is_active ? 'bg-emerald-600' : 'bg-stone-800 border border-stone-700'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                          slide.is_active ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span className="text-xs text-stone-400">
                      {slide.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditModal(slide)}
                      className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded transition-colors"
                      title="Edit Slide"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded transition-colors"
                      title="Delete Slide"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Create/Edit Hero Slide */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121218] border border-stone-800 rounded-lg max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-lg font-serif-luxury text-white font-semibold mb-4 flex items-center space-x-2">
              <Sparkles size={18} className="text-[#c5a880]" />
              <span>{editingSlide ? 'Edit Hero Slide' : 'Create New Hero Slide'}</span>
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              {/* Media Type Select */}
              <div>
                <label className="block text-stone-400 mb-1">Media Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMediaType('image')}
                    className={`py-2 px-3 rounded flex items-center justify-center space-x-2 border transition-all ${
                      mediaType === 'image'
                        ? 'bg-[#c5a880]/15 border-[#c5a880] text-[#c5a880]'
                        : 'bg-[#181822] border-stone-800 text-stone-400'
                    }`}
                  >
                    <ImageIcon size={14} />
                    <span>Image (JPG/WebP)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType('video')}
                    className={`py-2 px-3 rounded flex items-center justify-center space-x-2 border transition-all ${
                      mediaType === 'video'
                        ? 'bg-[#c5a880]/15 border-[#c5a880] text-[#c5a880]'
                        : 'bg-[#181822] border-stone-800 text-stone-400'
                    }`}
                  >
                    <Video size={14} />
                    <span>Video (MP4)</span>
                  </button>
                </div>
              </div>

              {/* Media URL */}
              <div>
                <label className="block text-stone-400 mb-1">
                  {mediaType === 'video' ? 'Video MP4 File URL' : 'High-Res Image URL'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://..."
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              {/* Poster URL for Video */}
              {mediaType === 'video' && (
                <div>
                  <label className="block text-stone-400 mb-1">Video Poster Frame Image URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={posterUrl}
                    onChange={(e) => setPosterUrl(e.target.value)}
                    className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              )}

              {/* Title & Subtitle */}
              <div>
                <label className="block text-stone-400 mb-1">Headline Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Architectural Surface Innovations"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Subtitle / Description</label>
                <textarea
                  rows={2}
                  placeholder="Enter supporting luxury tagline..."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              {/* CTA Label & URL */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    placeholder="Explore Collections"
                    value={ctaLabel}
                    onChange={(e) => setCtaLabel(e.target.value)}
                    className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">CTA Target URL</label>
                  <input
                    type="text"
                    placeholder="/collections"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-stone-400 mb-1">Sort Order</label>
                <input
                  type="number"
                  min={1}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 hover:text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#c5a880] text-black font-semibold rounded hover:bg-[#dbbc93]"
                >
                  {editingSlide ? 'Update Slide' : 'Save Hero Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
