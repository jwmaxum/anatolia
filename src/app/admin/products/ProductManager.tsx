'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductItem } from '@/lib/types';
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  CheckCircle2,
  Upload,
  Sparkles,
  RefreshCw,
  Search,
  Grid,
} from 'lucide-react';

const FORMAT_OPTIONS = ['60x120 cm', '120x280 cm Slab', '30x60 cm', 'Mosaics'];
const FINISH_OPTIONS = ['Polished', 'Matte', 'Honed', 'Textured'];
const COLOR_OPTIONS = ['Bianco', 'Nero', 'Calacatta Gold', 'Travertine', 'Beige', 'Gray'];
const LOOK_OPTIONS = ['Marble Look', 'Stone Look', 'Sintered Slab', 'Wood Look', 'Onyx Look'];
const COLLECTION_OPTIONS = ['Ceramic + Porcelain', 'Natural Stone', 'Sintered Slab'];

export default function ProductManager() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  const [name, setName] = useState('');
  const [collection, setCollection] = useState('Ceramic + Porcelain');
  const [format, setFormat] = useState('60x120 cm');
  const [finish, setFinish] = useState('Polished');
  const [color, setColor] = useState('Bianco');
  const [look, setLook] = useState('Marble Look');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [thickness, setThickness] = useState('9.5 mm');
  const [origin, setOrigin] = useState('Italy');
  const [isFeatured, setIsFeatured] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setCollection('Ceramic + Porcelain');
    setFormat('60x120 cm');
    setFinish('Polished');
    setColor('Bianco');
    setLook('Marble Look');
    setImageUrl('');
    setDescription('');
    setThickness('9.5 mm');
    setOrigin('Italy');
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (p: ProductItem) => {
    setEditingProduct(p);
    setName(p.name);
    setCollection(p.collection);
    setFormat(p.format);
    setFinish(p.finish);
    setColor(p.color);
    setLook(p.look);
    setImageUrl(p.image_url);
    setDescription(p.description);
    setThickness(p.thickness || '9.5 mm');
    setOrigin(p.origin || 'Italy');
    setIsFeatured(p.is_featured || false);
    setIsModalOpen(true);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setImageUrl(data.data.url);
        showToast('Thumbnail image uploaded!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imageUrl) return;

    const payload = {
      ...(editingProduct ? { id: editingProduct.id } : {}),
      name,
      collection,
      format,
      finish,
      color,
      look,
      image_url: imageUrl,
      description,
      thickness,
      origin,
      is_featured: isFeatured,
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast(editingProduct ? 'Product updated!' : 'New Product Created!');
        setIsModalOpen(false);
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Product item deleted!');
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.collection.toLowerCase().includes(q) ||
      p.look.toLowerCase().includes(q)
    );
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
            <Package className="text-[#c5a880]" size={28} />
            <h1 className="font-serif-luxury text-2xl md:text-3xl font-semibold tracking-wide text-white">
              Product & Collection Category CRUD
            </h1>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Create, edit, and delete Anatolia tile & slab products with 4-attribute metadata (Format, Finish, Color, Look) and thumbnail image uploads.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-[#c5a880] hover:bg-[#dbbc93] text-black font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded transition-all shadow-lg"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto mb-6 flex justify-between items-center">
        <div className="relative max-w-md w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Search products by name or collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121218] border border-stone-800 rounded px-9 py-2 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#c5a880]"
          />
        </div>

        <span className="text-xs text-stone-500 font-mono">
          Total {filteredProducts.length} items
        </span>
      </div>

      {/* Product List Grid */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="py-20 text-center text-stone-500 text-sm">Loading Products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-[#121218] border border-stone-800 rounded overflow-hidden flex flex-col justify-between hover:border-[#c5a880]/50 transition-all duration-300 shadow-lg group"
              >
                {/* Thumbnail */}
                <div className="relative h-44 bg-black overflow-hidden">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 border border-white/10 text-[10px] uppercase font-mono text-[#c5a880]">
                    {p.collection}
                  </div>
                  {p.is_featured && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#c5a880] text-black font-semibold rounded text-[9px] uppercase tracking-wider">
                      Featured
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 space-y-2 flex-grow">
                  <span className="text-[10px] text-stone-500 font-mono uppercase tracking-wider block">
                    {p.look} • {p.format}
                  </span>
                  <h3 className="font-serif-luxury text-base text-white font-medium line-clamp-1">
                    {p.name}
                  </h3>
                  <div className="flex flex-wrap gap-1 text-[9px] text-stone-400 font-mono pt-1">
                    <span className="px-1.5 py-0.2 bg-[#181822] rounded border border-stone-800">
                      {p.finish}
                    </span>
                    <span className="px-1.5 py-0.2 bg-[#181822] rounded border border-stone-800">
                      {p.color}
                    </span>
                    <span className="px-1.5 py-0.2 bg-[#181822] rounded border border-stone-800">
                      {p.thickness}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-3 bg-[#181822] border-t border-stone-800/80 flex items-center justify-between">
                  <button
                    onClick={() => openEditModal(p)}
                    className="flex items-center space-x-1 text-xs text-[#c5a880] hover:text-white transition-colors"
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1 text-stone-500 hover:text-red-400 transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Create/Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121218] border border-stone-800 rounded-lg max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-serif-luxury text-white font-semibold mb-4">
              {editingProduct ? 'Edit Product Item' : 'Create New Collection Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-stone-400 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lamarca Travertino"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Collection</label>
                  <select
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                    className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                  >
                    {COLLECTION_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Format / Size</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                  >
                    {FORMAT_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Surface Finish</label>
                  <select
                    value={finish}
                    onChange={(e) => setFinish(e.target.value)}
                    className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                  >
                    {FINISH_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Color Tone</label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                  >
                    {COLOR_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1">Aesthetic Look</label>
                  <select
                    value={look}
                    onChange={(e) => setLook(e.target.value)}
                    className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                  >
                    {LOOK_OPTIONS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Upload / URL Input */}
              <div>
                <label className="block text-stone-400 mb-1">Thumbnail Image</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    required
                    placeholder="https://... or upload below"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                  />
                  <label className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded cursor-pointer shrink-0 flex items-center space-x-1">
                    <Upload size={14} />
                    <span>{uploading ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageFileUpload}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Material specs and architectural design details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Thickness</label>
                  <input
                    type="text"
                    placeholder="9.5 mm"
                    value={thickness}
                    onChange={(e) => setThickness(e.target.value)}
                    className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Origin</label>
                  <input
                    type="text"
                    placeholder="Italy"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-[#181822] border border-stone-700 text-white px-3 py-2 rounded focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="feat"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                <label htmlFor="feat" className="text-stone-300">
                  Highlight as Featured Collection item
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
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
