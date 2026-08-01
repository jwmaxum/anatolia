'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  User,
  Heart,
  LogOut,
  ChevronRight,
  Package,
  Plus,
  Trash2,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

function MyAccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'dashboard';

  const { user, orders, logout, isLoggedIn, updateProfile } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Profile Edit State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileCompany, setProfileCompany] = useState(user?.company || '');
  const [profileMsg, setProfileMsg] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) setActiveTab(tabParam);
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfilePhone(user.phone || '');
      setProfileCompany(user.company || '');
    }
  }, [user]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#141815] flex flex-col justify-center items-center p-6 text-center space-y-4">
        <h2 className="font-serif-luxury text-2xl text-white">Access Restricted</h2>
        <p className="text-xs text-stone-400">Please log in to access your WooCommerce account dashboard.</p>
        <Link
          href="/account/login"
          className="bg-[#c59b27] hover:bg-[#b08820] text-black font-semibold text-xs uppercase px-5 py-2.5 rounded"
        >
          Go to Customer Login
        </Link>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/account/login');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      phone: profilePhone,
      company: profileCompany,
    });
    setProfileMsg(true);
    setTimeout(() => setProfileMsg(false), 3000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-[#101411] border border-emerald-900/30 rounded-lg p-4 space-y-1 h-fit">
          <div className="p-3 mb-2 border-b border-emerald-900/30">
            <div className="text-xs text-stone-400 font-light">Signed in as</div>
            <div className="font-serif-luxury text-base font-semibold text-white truncate">{user?.name}</div>
            <div className="text-[11px] text-[#c59b27] font-mono truncate">{user?.email}</div>
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-[#c59b27] text-black font-semibold shadow'
                : 'text-stone-300 hover:bg-stone-900 hover:text-white'
            }`}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium transition-all ${
              activeTab === 'orders'
                ? 'bg-[#c59b27] text-black font-semibold shadow'
                : 'text-stone-300 hover:bg-stone-900 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <ShoppingBag size={16} />
              <span>Orders</span>
            </div>
            <span className="font-mono text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-medium transition-all ${
              activeTab === 'addresses'
                ? 'bg-[#c59b27] text-black font-semibold shadow'
                : 'text-stone-300 hover:bg-stone-900 hover:text-white'
            }`}
          >
            <MapPin size={16} />
            <span>Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-medium transition-all ${
              activeTab === 'profile'
                ? 'bg-[#c59b27] text-black font-semibold shadow'
                : 'text-stone-300 hover:bg-stone-900 hover:text-white'
            }`}
          >
            <User size={16} />
            <span>Account Details</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium transition-all ${
              activeTab === 'wishlist'
                ? 'bg-[#c59b27] text-black font-semibold shadow'
                : 'text-stone-300 hover:bg-stone-900 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Heart size={16} />
              <span>Wishlist</span>
            </div>
            <span className="font-mono text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full">
              {wishlist.length}
            </span>
          </button>

          <div className="pt-4 border-t border-emerald-900/30">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-all font-medium"
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Right Tab Content View */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Tab 1: Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-[#101411] border border-emerald-900/30 rounded-lg p-6 sm:p-8 space-y-4">
                <h2 className="font-serif-luxury text-2xl text-white font-light">
                  Hello <span className="text-[#c59b27] font-semibold">{user?.name}</span>!
                </h2>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  From your WooCommerce account dashboard you can view your{' '}
                  <button onClick={() => setActiveTab('orders')} className="text-[#c59b27] underline">
                    recent orders
                  </button>
                  , manage your{' '}
                  <button onClick={() => setActiveTab('addresses')} className="text-[#c59b27] underline">
                    shipping and billing addresses
                  </button>
                  , and edit your{' '}
                  <button onClick={() => setActiveTab('profile')} className="text-[#c59b27] underline">
                    password and account details
                  </button>
                  .
                </p>
              </div>

              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#101411] border border-emerald-900/30 p-5 rounded-lg space-y-1">
                  <div className="text-stone-400 text-xs uppercase font-mono">Total Orders</div>
                  <div className="font-mono text-3xl font-bold text-[#c59b27]">{orders.length}</div>
                  <div className="text-[11px] text-stone-500">Lifetime purchases</div>
                </div>
                <div className="bg-[#101411] border border-emerald-900/30 p-5 rounded-lg space-y-1">
                  <div className="text-stone-400 text-xs uppercase font-mono">Wishlist Items</div>
                  <div className="font-mono text-3xl font-bold text-[#c59b27]">{wishlist.length}</div>
                  <div className="text-[11px] text-stone-500">Saved products</div>
                </div>
                <div className="bg-[#101411] border border-emerald-900/30 p-5 rounded-lg space-y-1">
                  <div className="text-stone-400 text-xs uppercase font-mono">Membership Tier</div>
                  <div className="font-serif-luxury text-xl font-bold text-amber-400 flex items-center space-x-1">
                    <ShieldCheck size={18} />
                    <span>VIP Heritage</span>
                  </div>
                  <div className="text-[11px] text-stone-500">Free Express Shipping active</div>
                </div>
              </div>

              {/* Recent Order Preview */}
              {orders.length > 0 && (
                <div className="bg-[#101411] border border-emerald-900/30 rounded-lg p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-emerald-900/30 pb-3">
                    <h3 className="font-serif-luxury text-lg text-white font-medium">Recent Order</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-[#c59b27] hover:underline font-mono"
                    >
                      View All Orders →
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <div>
                      <span className="text-stone-500">Order ID: </span>
                      <span className="text-stone-200 font-bold">{orders[0].id}</span>
                    </div>
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[11px]">
                      {orders[0].status}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Orders List */}
          {activeTab === 'orders' && (
            <div className="bg-[#101411] border border-emerald-900/30 rounded-lg p-6 space-y-6">
              <h2 className="font-serif-luxury text-xl text-white font-medium border-b border-emerald-900/30 pb-3">
                Order History ({orders.length})
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Package size={36} className="mx-auto text-stone-600" />
                  <p className="text-xs text-stone-400">No order has been made yet.</p>
                  <Link
                    href="/shop"
                    className="inline-block bg-[#c59b27] text-black font-semibold text-xs px-4 py-2 rounded uppercase"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="border border-emerald-900/40 rounded-lg p-5 bg-[#141815] space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-emerald-900/30 pb-3 font-mono text-xs">
                        <div>
                          <span className="text-stone-400">Order ID: </span>
                          <span className="text-[#c59b27] font-bold">{ord.id}</span>
                          <span className="text-stone-500 ml-3">({ord.createdAt})</span>
                        </div>
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded text-[11px]">
                          Status: {ord.status}
                        </span>
                      </div>

                      <div className="divide-y divide-emerald-900/20">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="py-2.5 flex items-center space-x-3 text-xs">
                            <img
                              src={it.image_url}
                              alt={it.name}
                              className="w-12 h-12 object-cover rounded border border-emerald-900/30"
                            />
                            <div className="flex-1">
                              <div className="font-serif-luxury font-medium text-stone-200">{it.name}</div>
                              <div className="text-[10px] text-stone-500 font-mono">Qty: {it.quantity}</div>
                            </div>
                            <span className="font-mono font-semibold text-[#c59b27]">
                              ${(it.price * it.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-emerald-900/30 pt-3 flex justify-between items-center text-xs">
                        <span className="text-stone-400">Total: <strong className="text-white font-mono">${ord.total.toFixed(2)}</strong></span>
                        <Link
                          href={`/checkout/success?orderId=${ord.id}`}
                          className="text-[#c59b27] hover:underline flex items-center space-x-1 font-mono text-[11px]"
                        >
                          <span>Order Receipt</span>
                          <ExternalLink size={12} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Addresses */}
          {activeTab === 'addresses' && (
            <div className="bg-[#101411] border border-emerald-900/30 rounded-lg p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-emerald-900/30 pb-3">
                <h2 className="font-serif-luxury text-xl text-white font-medium">
                  Address Book
                </h2>
                <button
                  onClick={() => alert('New address added.')}
                  className="bg-[#c59b27]/15 border border-[#c59b27]/40 text-[#c59b27] text-xs px-3 py-1.5 rounded flex items-center space-x-1 hover:bg-[#c59b27] hover:text-black transition-all"
                >
                  <Plus size={14} />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user?.addresses?.map((addr) => (
                  <div
                    key={addr.id}
                    className="border border-emerald-900/40 bg-[#141815] rounded-lg p-5 space-y-2 text-xs font-light"
                  >
                    <div className="flex justify-between items-center border-b border-emerald-900/30 pb-2">
                      <span className="font-semibold text-[#c59b27]">{addr.title}</span>
                      {addr.isDefault && (
                        <span className="bg-emerald-950 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-stone-200 font-medium">{addr.fullName}</div>
                    <div className="text-stone-400">{addr.addressLine1} {addr.addressLine2}</div>
                    <div className="text-stone-400">{addr.city}, {addr.postalCode}</div>
                    <div className="text-stone-400">{addr.country}</div>
                    <div className="text-stone-500 font-mono pt-1">Tel: {addr.phone}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Profile & Account Details */}
          {activeTab === 'profile' && (
            <div className="bg-[#101411] border border-emerald-900/30 rounded-lg p-6 space-y-6">
              <h2 className="font-serif-luxury text-xl text-white font-medium border-b border-emerald-900/30 pb-3">
                Account Details
              </h2>

              {profileMsg && (
                <div className="bg-emerald-950 border border-emerald-700 text-emerald-400 text-xs p-3 rounded flex items-center space-x-2">
                  <CheckCircle size={16} />
                  <span>Account details updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-stone-300 font-medium">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-stone-900 border border-emerald-900/40 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-300 font-medium">Email Address (Read only)</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full bg-stone-950 border border-emerald-900/20 rounded px-3 py-2 text-stone-500 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-stone-300 font-medium">Phone Number</label>
                    <input
                      type="text"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full bg-stone-900 border border-emerald-900/40 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-stone-300 font-medium">Company Name</label>
                    <input
                      type="text"
                      value={profileCompany}
                      onChange={(e) => setProfileCompany(e.target.value)}
                      className="w-full bg-stone-900 border border-emerald-900/40 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-[#c59b27] hover:bg-[#b08820] text-black font-semibold py-2.5 px-6 rounded text-xs uppercase tracking-wider transition-all"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Tab 5: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="bg-[#101411] border border-emerald-900/30 rounded-lg p-6 space-y-6">
              <h2 className="font-serif-luxury text-xl text-white font-medium border-b border-emerald-900/30 pb-3">
                Saved Wishlist ({wishlist.length})
              </h2>

              {wishlist.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Heart size={36} className="mx-auto text-stone-600" />
                  <p className="text-xs text-stone-400">Your wishlist is currently empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="border border-emerald-900/40 bg-[#141815] rounded-lg p-4 flex space-x-4 items-center"
                    >
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded border border-emerald-900/30"
                      />
                      <div className="flex-1 space-y-1">
                        <Link
                          href={`/products/${item.id}`}
                          className="font-serif-luxury text-xs font-medium text-stone-200 hover:text-[#c59b27] block line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <div className="font-mono text-xs font-bold text-[#c59b27]">
                          ${(item.price || 50).toFixed(2)}
                        </div>
                        <div className="flex items-center space-x-2 pt-1">
                          <button
                            onClick={() => addToCart(item, 1)}
                            className="bg-[#c59b27] text-black font-semibold text-[10px] uppercase px-2.5 py-1 rounded"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="text-stone-500 hover:text-red-400 p-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </main>
  );
}

export default function MyAccountPage() {
  return (
    <div className="min-h-screen bg-[#141815] text-stone-100 pb-24">
      {/* Header Banner */}
      <div className="bg-[#0d110e] border-b border-emerald-900/30 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="flex items-center space-x-2 text-xs text-stone-500 font-mono">
            <Link href="/" className="hover:text-stone-300">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#c59b27]">My Account</span>
          </div>
          <h1 className="font-serif-luxury text-3xl font-light text-white">
            Customer Dashboard
          </h1>
        </div>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-xs text-stone-400">Loading Account Dashboard...</div>}>
        <MyAccountContent />
      </Suspense>
    </div>
  );
}
