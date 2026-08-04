'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Film,
  FileText,
  Image as ImageIcon,
  ArrowLeft,
  Shield,
  Lock,
  LogOut,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Simple Admin Authentication Check (PIN Guard for CMS Studio)
  useEffect(() => {
    const authStatus = sessionStorage.getItem('anatolia_admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default Admin Passcode check (Default: admin2026 or custom)
    if (pinInput === 'admin2026' || pinInput === 'anatolia1234') {
      sessionStorage.setItem('anatolia_admin_authenticated', 'true');
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid Security Key / PIN. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('anatolia_admin_authenticated');
    setIsAuthenticated(false);
  };

  const navLinks = [
    { href: '/admin', label: 'Dashboard Hub', icon: LayoutDashboard },
    { href: '/admin/navigation', label: 'Menu Engine', icon: Layers },
    { href: '/admin/hero', label: 'Hero Slider CMS', icon: Film },
    { href: '/admin/products', label: 'Product CRUD', icon: Shield },
    { href: '/admin/content-blocks', label: 'Content Block Editor', icon: FileText },
    { href: '/admin/journal', label: 'Journal Editor', icon: FileText },
    { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
  ];

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-stone-200 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#111118] border border-stone-800 rounded-xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#c5a880] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-serif-luxury font-bold text-white tracking-wide">
              Anatolia CMS Access
            </h1>
            <p className="text-xs text-stone-400">
              Restricted area. Please enter your administrator key to continue.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">
                Admin Passcode / Key
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter Passcode..."
                className="w-full px-4 py-3 bg-[#0a0a0c] border border-stone-800 focus:border-[#c5a880] rounded text-sm text-white focus:outline-none transition-colors"
                autoFocus
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 bg-red-950/40 border border-red-800/50 p-2.5 rounded text-center">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#c5a880] hover:bg-[#b59870] text-black font-semibold rounded text-sm tracking-wider transition-colors shadow-lg"
            >
              Authorize & Access CMS
            </button>
          </form>

          <div className="pt-4 border-t border-stone-800/60 text-center">
            <Link href="/" className="text-xs text-stone-500 hover:text-stone-300 transition-colors">
              &larr; Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-[#0a0a0c]" />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-stone-200 flex flex-col md:flex-row font-sans">
      {/* Integrated Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#0d0d12] border-r border-stone-800 flex flex-col justify-between p-4 shrink-0">
        <div>
          {/* Admin Header Logo */}
          <div className="pb-6 border-b border-stone-800/80 mb-6 flex justify-between items-center">
            <Link href="/admin" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded bg-[#c5a880] flex items-center justify-center text-black font-bold font-serif-luxury text-lg">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-serif-luxury text-sm font-semibold tracking-wider text-white">
                  ANATOLIA
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#c5a880]">
                  CMS Studio
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5" aria-label="Admin navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded text-xs font-medium tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#c5a880] text-black font-semibold shadow-lg'
                      : 'text-stone-400 hover:text-white hover:bg-[#161620]'
                  }`}
                >
                  <Icon size={16} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Back to Live Website & Logout */}
        <div className="pt-6 border-t border-stone-800/80 mt-6 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-red-950/30 border border-red-900/50 hover:bg-red-900/40 rounded text-xs text-red-300 transition-colors"
          >
            <LogOut size={14} />
            <span>Lock & Logout</span>
          </button>

          <Link
            href="/"
            className="flex items-center justify-center space-x-2 py-2.5 px-3 bg-stone-900 border border-stone-800 hover:border-stone-700 rounded text-xs text-stone-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Live Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin View Content */}
      <main className="flex-grow min-w-0 overflow-y-auto">{children}</main>
    </div>
  );
}

