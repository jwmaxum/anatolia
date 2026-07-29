'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MediaItem } from '@/lib/types';
import {
  Image as ImageIcon,
  Video,
  Upload,
  Copy,
  Trash2,
  Check,
  Plus,
  ArrowLeft,
  RefreshCw,
  Film,
  CheckCircle2,
  Globe,
} from 'lucide-react';

export default function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // CDN Modal State
  const [isCdnModalOpen, setIsCdnModalOpen] = useState(false);
  const [cdnName, setCdnName] = useState('');
  const [cdnUrl, setCdnUrl] = useState('');
  const [cdnType, setCdnType] = useState<'image' | 'video'>('image');

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (url: string, id: string) => {
    const fullUrl = url.startsWith('/') ? `${window.location.origin}${url}` : url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    showToast('Media URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Direct File Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        showToast('File uploaded successfully!');
        fetchMedia();
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // CDN Registration handler
  const handleCdnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cdnName || !cdnUrl) return;

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cdnName,
          url: cdnUrl,
          type: cdnType,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('CDN Media asset registered!');
        setIsCdnModalOpen(false);
        setCdnName('');
        setCdnUrl('');
        fetchMedia();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media asset?')) return;

    try {
      const res = await fetch(`/api/media?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Media asset deleted');
        fetchMedia();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

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
            href="/admin"
            className="inline-flex items-center text-xs text-[#c5a880] hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft size={14} className="mr-1" /> Back to Dashboard
          </Link>
          <div className="flex items-center space-x-3">
            <ImageIcon className="text-[#c5a880]" size={28} />
            <h1 className="font-serif-luxury text-2xl md:text-3xl font-semibold tracking-wide text-white">
              Media Library & File Upload
            </h1>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Upload local images/videos or register CDN media assets. Copy URLs for Hero CMS and Content Blocks with one click.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* File Upload Button */}
          <label className="flex items-center space-x-2 bg-[#c5a880] hover:bg-[#dbbc93] text-black font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded transition-all cursor-pointer shadow-lg">
            <Upload size={16} />
            <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>

          {/* Add CDN URL Button */}
          <button
            onClick={() => setIsCdnModalOpen(true)}
            className="flex items-center space-x-2 bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-200 px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <Globe size={15} className="text-[#c5a880]" />
            <span>Add CDN URL</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between border-b border-stone-800 pb-3">
        <div className="flex space-x-2">
          {(['all', 'image', 'video'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-1.5 text-xs uppercase font-medium tracking-wider rounded transition-all ${
                filterType === t
                  ? 'bg-[#c5a880] text-black font-semibold shadow-md'
                  : 'bg-[#14141a] text-stone-400 border border-stone-800 hover:text-white'
              }`}
            >
              {t === 'all' ? 'All Assets' : t === 'image' ? 'Images' : 'Videos'}
            </button>
          ))}
        </div>

        <span className="text-xs text-stone-500 font-mono">
          Total {filteredItems.length} assets
        </span>
      </div>

      {/* Media Grid */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="py-20 text-center text-stone-500 text-sm">Loading Media Assets...</div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center text-stone-500 text-sm border border-stone-800 rounded bg-[#121218]">
            No media assets found in library.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-[#121218] border border-stone-800 rounded overflow-hidden flex flex-col justify-between hover:border-[#c5a880]/50 transition-all duration-300 shadow-lg"
              >
                {/* Media Preview Box */}
                <div className="relative h-44 bg-black overflow-hidden">
                  {item.type === 'video' ? (
                    <video
                      src={item.url}
                      muted
                      loop
                      autoPlay
                      className="w-full h-full object-cover opacity-80"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 border border-white/10 backdrop-blur-md text-[10px] uppercase font-mono text-stone-300">
                    {item.type}
                  </div>
                </div>

                {/* Info & Copy Bar */}
                <div className="p-3.5 space-y-2 flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xs font-semibold text-white truncate max-w-[170px]" title={item.name}>
                      {item.name}
                    </h3>
                    <span className="text-[10px] text-stone-500 font-mono">{item.size || 'CDN'}</span>
                  </div>

                  <p className="text-[10px] text-stone-500 font-mono truncate">{item.url}</p>
                </div>

                {/* Bottom Actions */}
                <div className="p-3 bg-[#181822] border-t border-stone-800/80 flex items-center justify-between">
                  <button
                    onClick={() => copyToClipboard(item.url, item.id)}
                    className="flex items-center space-x-1.5 text-xs text-[#c5a880] hover:text-white transition-colors"
                  >
                    {copiedId === item.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copiedId === item.id ? 'Copied!' : 'Copy URL'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-stone-500 hover:text-red-400 transition-colors"
                    title="Delete Media"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CDN Modal */}
      {isCdnModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121218] border border-stone-800 rounded-lg max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-lg font-serif-luxury text-white font-semibold mb-4">
              Register External CDN Media
            </h2>
            <form onSubmit={handleCdnSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sintered Onyx Texture HD"
                  value={cdnName}
                  onChange={(e) => setCdnName(e.target.value)}
                  className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Media CDN URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://..."
                  value={cdnUrl}
                  onChange={(e) => setCdnUrl(e.target.value)}
                  className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Media Type</label>
                <select
                  value={cdnType}
                  onChange={(e) => setCdnType(e.target.value as any)}
                  className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                >
                  <option value="image">Image (WebP / JPG)</option>
                  <option value="video">Video (MP4)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCdnModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 hover:text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#c5a880] text-black font-semibold rounded hover:bg-[#dbbc93]"
                >
                  Register Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
