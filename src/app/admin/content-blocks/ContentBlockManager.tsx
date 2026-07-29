'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ContentBlock } from '@/lib/types';
import {
  FileText,
  Save,
  CheckCircle2,
  Image as ImageIcon,
  Video,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Layers,
} from 'lucide-react';

export default function ContentBlockManager() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchBlocks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content-blocks');
      const data = await res.json();
      if (data.success) {
        setBlocks(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFieldChange = (key: string, field: keyof ContentBlock, value: any) => {
    setBlocks((prev) =>
      prev.map((b) => (b.section_key === key ? { ...b, [field]: value } : b))
    );
  };

  const handleSaveBlock = async (block: ContentBlock) => {
    setSavingKey(block.section_key);
    try {
      const res = await fetch('/api/content-blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(block),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Section "${block.section_key}" updated!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingKey(null);
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
      <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-800 pb-6">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center text-xs text-[#c5a880] hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft size={14} className="mr-1" /> Back to Dashboard
          </Link>
          <div className="flex items-center space-x-3">
            <FileText className="text-[#c5a880]" size={28} />
            <h1 className="font-serif-luxury text-2xl md:text-3xl font-semibold tracking-wide text-white">
              Section Content Block Editor
            </h1>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Edit main and sub-page section text headlines, descriptions, badges, and media assets in real-time.
          </p>
        </div>

        <button
          onClick={fetchBlocks}
          className="p-2.5 bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 rounded transition-colors"
          title="Refresh Data"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Main Form Blocks */}
      <div className="max-w-5xl mx-auto space-y-8">
        {loading ? (
          <div className="py-20 text-center text-stone-500 text-sm">Loading Content Blocks...</div>
        ) : (
          blocks.map((block) => (
            <div
              key={block.id}
              className="bg-[#121218] border border-stone-800 rounded-lg p-6 space-y-5 hover:border-[#c5a880]/40 transition-all duration-300 shadow-xl"
            >
              {/* Block Header */}
              <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 bg-[#c5a880]/15 border border-[#c5a880]/30 rounded text-[10px] uppercase font-mono tracking-wider text-[#c5a880]">
                    {block.page} / {block.section_key}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">
                    Last updated: {block.updated_at ? new Date(block.updated_at).toLocaleTimeString() : 'Recently'}
                  </span>
                </div>

                <button
                  onClick={() => handleSaveBlock(block)}
                  disabled={savingKey === block.section_key}
                  className="flex items-center space-x-2 bg-[#c5a880] hover:bg-[#dbbc93] text-black font-semibold text-xs tracking-wider uppercase px-4 py-2 rounded transition-all shadow-md"
                >
                  <Save size={14} />
                  <span>{savingKey === block.section_key ? 'Saving...' : 'Save Section'}</span>
                </button>
              </div>

              {/* Form Input Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-stone-400 mb-1">Headline Title</label>
                  <input
                    type="text"
                    value={block.title}
                    onChange={(e) => handleFieldChange(block.section_key, 'title', e.target.value)}
                    className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Subtitle / Category Tagline</label>
                  <input
                    type="text"
                    value={block.subtitle}
                    onChange={(e) => handleFieldChange(block.section_key, 'subtitle', e.target.value)}
                    className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-stone-400 mb-1">Detailed Section Description</label>
                  <textarea
                    rows={3}
                    value={block.description}
                    onChange={(e) => handleFieldChange(block.section_key, 'description', e.target.value)}
                    className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Media URL (Image or Video)</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={block.media_url || ''}
                    onChange={(e) => handleFieldChange(block.section_key, 'media_url', e.target.value)}
                    className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="Craftsmanship"
                    value={block.badge || ''}
                    onChange={(e) => handleFieldChange(block.section_key, 'badge', e.target.value)}
                    className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              {/* Media Preview Box */}
              {block.media_url && (
                <div className="pt-2">
                  <span className="block text-[11px] text-stone-500 font-mono mb-2">Media Preview</span>
                  <div className="w-full h-40 bg-black rounded overflow-hidden relative border border-stone-800">
                    <img
                      src={block.media_url}
                      alt={block.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
