'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { JournalArticle } from '@/lib/types';
import {
  FileCode,
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  CheckCircle2,
  Upload,
  Eye,
  EyeOff,
  Newspaper,
} from 'lucide-react';

export default function JournalManager() {
  const [articles, setArticles] = useState<JournalArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<JournalArticle | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'News' | 'Event' | 'Architecture' | 'Design'>('News');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/journal?mode=admin');
      const data = await res.json();
      if (data.success) {
        setArticles(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTogglePublish = async (id: string, currentPublished: boolean) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_published: currentPublished } : a))
    );

    try {
      const res = await fetch('/api/journal', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_published: currentPublished }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Article publish status updated!');
      } else {
        fetchArticles();
      }
    } catch (err) {
      console.error(err);
      fetchArticles();
    }
  };

  const openCreateModal = () => {
    setEditingArticle(null);
    setTitle('');
    setCategory('News');
    setExcerpt('');
    setContent('');
    setCoverImage('');
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (art: JournalArticle) => {
    setEditingArticle(art);
    setTitle(art.title);
    setCategory(art.category);
    setExcerpt(art.excerpt);
    setContent(art.content);
    setCoverImage(art.cover_image);
    setIsPublished(art.is_published);
    setIsModalOpen(true);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setCoverImage(data.data.url);
        showToast('Cover image uploaded!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const payload = {
      ...(editingArticle ? { id: editingArticle.id } : {}),
      title,
      category,
      excerpt,
      content,
      cover_image: coverImage,
      is_published: isPublished,
    };

    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast(editingArticle ? 'Article updated!' : 'New Article Published!');
        setIsModalOpen(false);
        fetchArticles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/journal?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Article deleted!');
        fetchArticles();
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
            href="/admin"
            className="inline-flex items-center text-xs text-[#c5a880] hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft size={14} className="mr-1" /> Back to Dashboard
          </Link>
          <div className="flex items-center space-x-3">
            <Newspaper className="text-[#c5a880]" size={28} />
            <h1 className="font-serif-luxury text-2xl md:text-3xl font-semibold tracking-wide text-white">
              News / Event / Journal Editor
            </h1>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            WYSIWYG & Markdown article editor for Anatolia brand news, events, and architectural case studies.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/journal"
            target="_blank"
            className="px-3.5 py-2 bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 rounded text-xs transition-colors"
          >
            View Public Journal Page
          </Link>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 bg-[#c5a880] hover:bg-[#dbbc93] text-black font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded transition-all shadow-lg"
          >
            <Plus size={16} />
            <span>Create Article</span>
          </button>
        </div>
      </div>

      {/* Articles List */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="py-20 text-center text-stone-500 text-sm">Loading Articles...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <div
                key={art.id}
                className="bg-[#121218] border border-stone-800 rounded overflow-hidden flex flex-col justify-between hover:border-[#c5a880]/50 transition-all duration-300 shadow-lg"
              >
                {/* Cover Image */}
                <div className="relative h-44 bg-black overflow-hidden">
                  <img
                    src={art.cover_image || 'https://via.placeholder.com/600x400'}
                    alt={art.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-black/70 border border-white/10 text-[10px] uppercase font-mono text-[#c5a880]">
                    {art.category}
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        art.is_published ? 'bg-emerald-400 animate-pulse' : 'bg-stone-600'
                      }`}
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-2 flex-grow">
                  <span className="text-[10px] text-stone-500 font-mono">
                    {art.published_date}
                  </span>
                  <h3 className="font-serif-luxury text-base text-white font-medium line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-stone-400 font-light line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="p-4 bg-[#181822] border-t border-stone-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleTogglePublish(art.id, !art.is_published)}
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                        art.is_published ? 'bg-emerald-600' : 'bg-stone-800 border border-stone-700'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                          art.is_published ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span className="text-xs text-stone-400">
                      {art.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditModal(art)}
                      className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded transition-colors"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(art.id)}
                      className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Article Editor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121218] border border-stone-800 rounded-lg max-w-2xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-serif-luxury text-white font-semibold mb-4">
              {editingArticle ? 'Edit Journal Article' : 'Write New Journal Article'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-stone-400 mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anatolia Unveils Sintered Slab Innovation Center"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                  >
                    <option value="News">News & Announcements</option>
                    <option value="Event">Exhibition / Event</option>
                    <option value="Architecture">Architecture Showcase</option>
                    <option value="Design">Design & Surface Trends</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Cover Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://..."
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                    />
                    <label className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded cursor-pointer shrink-0 flex items-center space-x-1">
                      <Upload size={14} />
                      <span>{uploading ? '...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Excerpt Summary</label>
                <textarea
                  rows={2}
                  placeholder="Short tagline preview..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Article Content (Markdown / Text Editor)</label>
                <textarea
                  rows={7}
                  required
                  placeholder="Write full article body text in Markdown or HTML..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded font-mono focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="pub"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                />
                <label htmlFor="pub" className="text-stone-300">
                  Publish article immediately on public Journal page
                </label>
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
                  {editingArticle ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
