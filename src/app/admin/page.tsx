import React from 'react';
import Link from 'next/link';
import { getRawMenus } from '@/lib/menus-db';
import { getAllHeroSlides } from '@/lib/cms-db';
import { getAllContentBlocks } from '@/lib/content-blocks-db';
import { getMediaItems } from '@/lib/media-db';
import {
  Layers,
  Film,
  FileText,
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const metadata = {
  title: 'Admin Dashboard Hub | Anatolia',
  description: 'Integrated Content Management System dashboard for Anatolia Web App.',
};

export default async function AdminDashboardPage() {
  const menus = await getRawMenus();
  const heroSlides = await getAllHeroSlides();
  const blocks = await getAllContentBlocks();
  const mediaItems = await getMediaItems();

  const activeMenusCount = menus.filter((m) => m.is_active).length;
  const activeHeroCount = heroSlides.filter((s) => s.is_active).length;

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-800 pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#c5a880] text-xs font-mono uppercase tracking-widest mb-1">
            <ShieldCheck size={16} />
            <span>Anatolia Admin Management Hub</span>
          </div>
          <h1 className="font-serif-luxury text-3xl font-semibold text-white tracking-wide">
            Content & Engine Control Panel
          </h1>
          <p className="text-stone-400 text-xs mt-1">
            Manage navigation menus, hero media sliders, section content blocks, and media library assets in real-time.
          </p>
        </div>

        <Link
          href="/"
          className="px-4 py-2 bg-[#c5a880] text-black font-semibold text-xs tracking-wider uppercase rounded hover:bg-[#dbbc93] transition-colors"
        >
          View Live Website
        </Link>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat 1: Navigation Engine */}
        <div className="bg-[#121218] border border-stone-800 rounded-lg p-5 space-y-3 hover:border-[#c5a880]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono text-stone-400">Menu Engine</span>
            <Layers className="text-[#c5a880]" size={20} />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif-luxury text-3xl text-white font-semibold">{menus.length}</span>
            <span className="text-xs text-emerald-400 font-mono">({activeMenusCount} Active)</span>
          </div>
          <Link
            href="/admin/navigation"
            className="text-xs text-[#c5a880] hover:underline inline-flex items-center space-x-1 pt-1"
          >
            <span>Manage Navigation</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Stat 2: Hero Slider CMS */}
        <div className="bg-[#121218] border border-stone-800 rounded-lg p-5 space-y-3 hover:border-[#c5a880]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono text-stone-400">Hero Slider</span>
            <Film className="text-sky-400" size={20} />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif-luxury text-3xl text-white font-semibold">{heroSlides.length}</span>
            <span className="text-xs text-emerald-400 font-mono">({activeHeroCount} Active)</span>
          </div>
          <Link
            href="/admin/hero"
            className="text-xs text-[#c5a880] hover:underline inline-flex items-center space-x-1 pt-1"
          >
            <span>Manage Hero Slides</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Stat 3: Content Block Editor */}
        <div className="bg-[#121218] border border-stone-800 rounded-lg p-5 space-y-3 hover:border-[#c5a880]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono text-stone-400">Section Blocks</span>
            <FileText className="text-amber-400" size={20} />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif-luxury text-3xl text-white font-semibold">{blocks.length}</span>
            <span className="text-xs text-stone-500 font-mono">Sections</span>
          </div>
          <Link
            href="/admin/content-blocks"
            className="text-xs text-[#c5a880] hover:underline inline-flex items-center space-x-1 pt-1"
          >
            <span>Edit Page Blocks</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Stat 4: Media Library */}
        <div className="bg-[#121218] border border-stone-800 rounded-lg p-5 space-y-3 hover:border-[#c5a880]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono text-stone-400">Media Assets</span>
            <ImageIcon className="text-emerald-400" size={20} />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif-luxury text-3xl text-white font-semibold">{mediaItems.length}</span>
            <span className="text-xs text-stone-500 font-mono">Files</span>
          </div>
          <Link
            href="/admin/media"
            className="text-xs text-[#c5a880] hover:underline inline-flex items-center space-x-1 pt-1"
          >
            <span>Upload & Manage</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Feature Modules Quick Action Cards */}
      <div className="space-y-4 pt-4">
        <h2 className="text-sm uppercase tracking-[0.2em] font-mono text-[#c5a880]">
          Admin Control Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/navigation"
            className="group bg-[#121218] border border-stone-800 hover:border-[#c5a880] p-6 rounded-lg transition-all duration-300 flex items-start space-x-4"
          >
            <div className="p-3 bg-[#181822] rounded border border-stone-700 text-[#c5a880]">
              <Layers size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif-luxury text-lg text-white group-hover:text-[#c5a880] transition-colors">
                Menu Control Panel
              </h3>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Tabbed Header / Footer menu engine with drag-and-drop sort reordering and live is_active visibility switches.
              </p>
            </div>
          </Link>

          <Link
            href="/admin/hero"
            className="group bg-[#121218] border border-stone-800 hover:border-[#c5a880] p-6 rounded-lg transition-all duration-300 flex items-start space-x-4"
          >
            <div className="p-3 bg-[#181822] rounded border border-stone-700 text-sky-400">
              <Film size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif-luxury text-lg text-white group-hover:text-[#c5a880] transition-colors">
                Hero Banner & Media Slider
              </h3>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Form for adding and editing MP4 video backgrounds and high-definition image hero slides for the main landing page.
              </p>
            </div>
          </Link>

          <Link
            href="/admin/content-blocks"
            className="group bg-[#121218] border border-stone-800 hover:border-[#c5a880] p-6 rounded-lg transition-all duration-300 flex items-start space-x-4"
          >
            <div className="p-3 bg-[#181822] rounded border border-stone-700 text-amber-400">
              <FileText size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif-luxury text-lg text-white group-hover:text-[#c5a880] transition-colors">
                Section Content Block Editor
              </h3>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Edit text headlines, descriptions, badges, and media image/video links across main and sub-page sections.
              </p>
            </div>
          </Link>

          <Link
            href="/admin/media"
            className="group bg-[#121218] border border-stone-800 hover:border-[#c5a880] p-6 rounded-lg transition-all duration-300 flex items-start space-x-4"
          >
            <div className="p-3 bg-[#181822] rounded border border-stone-700 text-emerald-400">
              <ImageIcon size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif-luxury text-lg text-white group-hover:text-[#c5a880] transition-colors">
                Media Library & File Upload
              </h3>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Upload image and video files directly to local storage or register CDN URLs with one-click copy URL functionality.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
