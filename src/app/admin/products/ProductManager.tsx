'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductItem } from '@/lib/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  Shield,
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  Search,
  Upload,
  CheckCircle2,
  Star,
  Package,
} from 'lucide-react';

const FALLBACK_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'Tuscan Artisanal Organic EVOO Extra Virgin Olive Oil',
    collection: 'Artisanal Pantry',
    category: 'Oil & Vinegar',
    price: 48,
    original_price: 55,
    stock: 120,
    rating: 4.9,
    reviews_count: 34,
    sku: 'ANA-EVOO-500',
    format: '500ml Bottle',
    finish: 'First Cold-Pressed',
    color: 'Emerald Gold',
    look: 'Tuscan Heritage Estate',
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    description: 'First cold-pressed extra virgin olive oil harvested from 200-year-old organic Tuscan olive groves.',
    thickness: '500ml',
    origin: 'Tuscany, Italy',
    is_featured: true,
  },
  {
    id: 'prod-2',
    name: '36-Month Aged DOP Parmigiano Reggiano Wheel Chunk',
    collection: 'Dairy & Charcuterie',
    category: 'Artisanal Cheese',
    price: 65,
    original_price: 75,
    stock: 45,
    rating: 5.0,
    reviews_count: 52,
    sku: 'ANA-PARM-36M',
    format: '1kg Block',
    finish: '36-Month Natural Aging',
    color: 'Deep Amber Grain',
    look: 'DOP Parma Certification',
    image_url: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=80',
    description: 'Intense crystalline crunch and complex nutty umami aromas aged in stone cellars in Emilia-Romagna.',
    thickness: '1 kg',
    origin: 'Parma, Italy',
    is_featured: true,
  },
  {
    id: 'prod-3',
    name: 'Piedmont Black Winter Truffle Infused Condiment Oil',
    collection: 'Artisanal Pantry',
    category: 'Rare Oils',
    price: 82,
    original_price: 95,
    stock: 30,
    rating: 4.8,
    reviews_count: 19,
    sku: 'ANA-TRUF-250',
    format: '250ml Glass Dropper',
    finish: 'Infused & Filtered',
    color: 'Rich Amber',
    look: 'Piedmont Artisan',
    image_url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    description: 'Infused with real wild Tuber melanosporum truffles harvested from Alba oak forests.',
    thickness: '250ml',
    origin: 'Alba, Italy',
    is_featured: true,
  },
  {
    id: 'prod-4',
    name: 'Aceto Balsamico Tradizionale di Modena DOP (25-Year Extravecchio)',
    collection: 'Artisanal Pantry',
    category: 'Balsamic Vinegar',
    price: 140,
    original_price: 160,
    stock: 15,
    rating: 5.0,
    reviews_count: 28,
    sku: 'ANA-BAL-25Y',
    format: '100ml Consortium Bottle',
    finish: '25-Year Barrel Aged',
    color: 'Velvet Dark Mahogany',
    look: 'DOP Consortium Sealed',
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    description: 'Aged in oak, chestnut, mulberry, and juniper battery casks according to 300-year-old family traditions.',
    thickness: '100ml',
    origin: 'Modena, Italy',
    is_featured: false,
  },
  {
    id: 'prod-5',
    name: 'Jamón Ibérico de Bellota 100% Pata Negra (Hand-Sliced)',
    collection: 'Dairy & Charcuterie',
    category: 'Charcuterie',
    price: 95,
    original_price: 110,
    stock: 50,
    rating: 4.9,
    reviews_count: 41,
    sku: 'ANA-PAT-100G',
    format: '100g Vacuum Pack',
    finish: '48-Month Acorn Cured',
    color: 'Ruby Red & Marbled Fat',
    look: 'Jabugo DOP Black Label',
    image_url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    description: '100% free-range acorn-fed pure Iberian pigs aged for 4 years in natural mountain bodegas.',
    thickness: '100g',
    origin: 'Jabugo, Spain',
    is_featured: true,
  },
  {
    id: 'prod-6',
    name: 'Sicilian Organic Wildflower Blossom Honey & Sea Salt Flakes',
    collection: 'Fresh & Gourmet',
    category: 'Gourmet Condiment',
    price: 32,
    original_price: null,
    stock: 80,
    rating: 4.7,
    reviews_count: 15,
    sku: 'ANA-HON-350',
    format: '350g Jar',
    finish: 'Unfiltered Cold-Extracted',
    color: 'Golden Topaz',
    look: 'Sicilian Artisan Estate',
    image_url: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=80',
    description: 'Raw unheated nectar gathered from Mount Etna slopes paired with sun-evaporated Trapani salt crystals.',
    thickness: '350g',
    origin: 'Sicily, Italy',
    is_featured: false,
  },
];

export default function ProductManager() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  const [name, setName] = useState('');
  const [collection, setCollection] = useState('Artisanal Pantry');
  const [price, setPrice] = useState('48');
  const [format, setFormat] = useState('500ml Bottle');
  const [finish, setFinish] = useState('First Cold-Pressed');
  const [color, setColor] = useState('Emerald Gold');
  const [look, setLook] = useState('Tuscan Heritage Estate');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [origin, setOrigin] = useState('Tuscany, Italy');
  const [isFeatured, setIsFeatured] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?mode=admin');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setProducts(data.data);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Fallback
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) {
          setProducts(data as ProductItem[]);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    setProducts(FALLBACK_PRODUCTS);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.collection.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    } catch {
      // Ignore
    }

    if (isSupabaseConfigured()) {
      await supabase.from('products').delete().eq('id', id);
    }

    showToast('Product deleted successfully');
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setCollection('Artisanal Pantry');
    setPrice('48');
    setFormat('500ml Bottle');
    setFinish('First Cold-Pressed');
    setColor('Emerald Gold');
    setLook('Tuscan Heritage Estate');
    setImageUrl('');
    setDescription('');
    setOrigin('Tuscany, Italy');
    setIsFeatured(true);
    setIsModalOpen(true);
  };

  const openEditModal = (p: ProductItem) => {
    setEditingProduct(p);
    setName(p.name);
    setCollection(p.collection);
    setPrice(String(p.price || 48));
    setFormat(p.format);
    setFinish(p.finish);
    setColor(p.color);
    setLook(p.look);
    setImageUrl(p.image_url || '');
    setDescription(p.description || '');
    setOrigin(p.origin || 'Tuscany, Italy');
    setIsFeatured(p.is_featured ?? true);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.url);
        showToast('Image uploaded!');
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch {
      const localUrl = URL.createObjectURL(file);
      setImageUrl(localUrl);
      showToast('Image attached locally!');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Product Name is required');

    const newOrUpdated: ProductItem = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name,
      collection,
      price: Number(price) || 0,
      format,
      finish,
      color,
      look,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
      description,
      origin,
      is_featured: isFeatured,
      rating: editingProduct?.rating || 4.9,
      reviews_count: editingProduct?.reviews_count || 12,
      sku: editingProduct?.sku || `ANA-${Date.now().toString().slice(-4)}`,
    };

    if (editingProduct) {
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? newOrUpdated : p)));
    } else {
      setProducts((prev) => [newOrUpdated, ...prev]);
    }

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrUpdated),
      });
    } catch {
      // Ignore
    }

    if (isSupabaseConfigured()) {
      await supabase.from('products').upsert(newOrUpdated);
    }

    setIsModalOpen(false);
    showToast(editingProduct ? 'Product updated' : 'New product created');
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
            <Shield className="text-[#c5a880]" size={28} />
            <span>Product Catalog CRUD</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage Anatolia fine foods catalog &amp; 4 core attributes (Format, Finish, Color, Look).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 px-5 py-2.5 bg-[#c5a880] hover:bg-[#b59870] text-black font-semibold rounded text-xs transition-colors shadow-lg"
        >
          <Plus size={16} />
          <span>CREATE PRODUCT</span>
        </button>
      </div>

      {/* Search Input Filter */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-3 text-stone-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search catalog by product name, collection..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#111118] border border-stone-800 focus:border-[#c5a880] rounded text-xs text-white focus:outline-none"
        />
      </div>

      {/* Product List Grid */}
      {loading ? (
        <div className="py-20 text-center text-stone-500 text-sm animate-pulse">
          Loading Catalog Data...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-[#111118] border border-stone-800 rounded-xl space-y-3">
          <Package className="mx-auto text-stone-600" size={40} />
          <p className="text-stone-400 text-sm">No products found matching criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-[#111118] border border-stone-800 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-[#c5a880]/50 transition-all duration-300"
            >
              <div>
                {/* Product Image Header */}
                <div className="h-44 relative bg-stone-900 overflow-hidden">
                  <img
                    src={p.image_url || 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80'}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#0a0a0c]/80 backdrop-blur border border-stone-700 text-[#c5a880] text-[10px] uppercase font-mono px-2.5 py-1 rounded">
                      {p.collection}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur px-2.5 py-1 rounded text-xs font-bold text-white">
                    ${p.price}
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center space-x-1 text-[#c5a880] text-xs">
                    <Star size={13} className="fill-[#c5a880]" />
                    <span className="font-semibold">{p.rating || 4.9}</span>
                    <span className="text-stone-500 font-mono text-[10px]">({p.reviews_count || 12})</span>
                  </div>

                  <h3 className="font-serif-luxury text-base font-semibold text-white line-clamp-1 group-hover:text-[#c5a880] transition-colors">
                    {p.name}
                  </h3>

                  {/* Attributes Badges */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono text-stone-400">
                    <div className="truncate">Format: <span className="text-stone-200">{p.format}</span></div>
                    <div className="truncate">Finish: <span className="text-stone-200">{p.finish}</span></div>
                    <div className="truncate">Color: <span className="text-stone-200">{p.color}</span></div>
                    <div className="truncate">Origin: <span className="text-stone-200">{p.origin}</span></div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-3 bg-[#0a0a0c]/60 border-t border-stone-800/80 flex items-center justify-between">
                <span className="text-[10px] text-stone-500 font-mono">
                  SKU: {p.sku}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-1.5 text-stone-400 hover:text-white bg-stone-900 hover:bg-stone-800 rounded border border-stone-800 transition-colors"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111118] border border-stone-800 rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative my-8">
            <h2 className="font-serif-luxury text-xl font-bold text-white flex items-center space-x-2">
              <Shield className="text-[#c5a880]" size={20} />
              <span>{editingProduct ? 'Edit Product' : 'Create New Product'}</span>
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1 font-mono">Product Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Cold-Pressed EVOO"
                    className="w-full px-3.5 py-2 bg-[#0a0a0c] border border-stone-800 focus:border-[#c5a880] rounded text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1 font-mono">Collection</label>
                  <select
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#0a0a0c] border border-stone-800 focus:border-[#c5a880] rounded text-sm text-white focus:outline-none"
                  >
                    <option value="Fresh & Gourmet">Fresh &amp; Gourmet</option>
                    <option value="Artisanal Pantry">Artisanal Pantry</option>
                    <option value="Dairy & Charcuterie">Dairy &amp; Charcuterie</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1 font-mono">Price ($ USD)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="48"
                    className="w-full px-3.5 py-2 bg-[#0a0a0c] border border-stone-800 focus:border-[#c5a880] rounded text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1 font-mono">Origin / Region</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Tuscany, Italy"
                    className="w-full px-3.5 py-2 bg-[#0a0a0c] border border-stone-800 focus:border-[#c5a880] rounded text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1 font-mono">Image URL</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-grow px-3.5 py-2 bg-[#0a0a0c] border border-stone-800 focus:border-[#c5a880] rounded text-sm text-white focus:outline-none"
                  />
                  <label className="px-4 py-2 bg-stone-900 border border-stone-800 text-stone-300 text-xs rounded cursor-pointer flex items-center space-x-1 shrink-0">
                    <Upload size={14} />
                    <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* 4 Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0d0d12] p-3 rounded border border-stone-800">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Format</label>
                  <input
                    type="text"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#0a0a0c] border border-stone-800 rounded text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Finish</label>
                  <input
                    type="text"
                    value={finish}
                    onChange={(e) => setFinish(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#0a0a0c] border border-stone-800 rounded text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Color</label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#0a0a0c] border border-stone-800 rounded text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">Look / Cert</label>
                  <input
                    type="text"
                    value={look}
                    onChange={(e) => setLook(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#0a0a0c] border border-stone-800 rounded text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1 font-mono">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Artisanal ingredient description..."
                  className="w-full px-3.5 py-2 bg-[#0a0a0c] border border-stone-800 focus:border-[#c5a880] rounded text-sm text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex space-x-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 bg-stone-800 text-stone-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#c5a880] text-black font-semibold rounded text-xs shadow-lg"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
