'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, User, ArrowRight, ShieldCheck, Sparkles, KeyRound } from 'lucide-react';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { login, signup, isLoggedIn, user } = useAuth();

  // Active Tab for mobile or toggle view: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMsg, setLoginMsg] = useState<{ success: boolean; message: string } | null>(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regMsg, setRegMsg] = useState<{ success: boolean; message: string } | null>(null);

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#141815] flex flex-col justify-center items-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#c59b27]/20 border border-[#c59b27] text-[#c59b27] flex items-center justify-center">
          <User size={32} />
        </div>
        <h2 className="font-serif-luxury text-2xl text-white">Already Logged In</h2>
        <p className="text-xs text-stone-400">Welcome back, {user?.name} ({user?.email})</p>
        <Link
          href="/account"
          className="bg-[#c59b27] hover:bg-[#b08820] text-black font-semibold text-xs uppercase px-5 py-2.5 rounded"
        >
          Go to My Account Dashboard
        </Link>
      </div>
    );
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(loginEmail, loginPassword);
    setLoginMsg(res);
    if (res.success) {
      setTimeout(() => router.push('/account'), 600);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = signup(regName, regEmail, regPassword);
    setRegMsg(res);
    if (res.success) {
      setTimeout(() => router.push('/account'), 600);
    }
  };

  const handleFillDemo = () => {
    setLoginEmail('demo@anatolia.com');
    setLoginPassword('password123');
    const res = login('demo@anatolia.com', 'password123');
    setLoginMsg(res);
    if (res.success) {
      setTimeout(() => router.push('/account'), 600);
    }
  };

  return (
    <div className="min-h-screen bg-[#141815] text-stone-100 pb-24">
      {/* Hero Banner Header */}
      <div className="bg-[#0d110e] border-b border-emerald-900/30 py-12 px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-[#c59b27]/10 border border-[#c59b27]/30 text-[#c59b27] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
          <KeyRound size={13} />
          <span>WooCommerce Customer Portal</span>
        </div>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-light text-white">
          My Account
        </h1>
        <p className="text-xs text-stone-400 font-light max-w-md mx-auto">
          Access your order history, manage addresses, track shipments, and view saved items.
        </p>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Quick One-Click Demo Login Bar */}
        <div className="bg-[#18221b] border border-emerald-800/40 rounded-lg p-4 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3 text-xs text-stone-300">
            <Sparkles className="text-[#c59b27] flex-shrink-0" size={18} />
            <div>
              <span className="font-semibold text-white">Quick Demo Access: </span>
              <span className="text-stone-400 font-mono">Test account (demo@anatolia.com)</span>
            </div>
          </div>
          <button
            onClick={handleFillDemo}
            className="bg-[#c59b27] hover:bg-[#b08820] text-black font-semibold text-xs px-4 py-2 rounded uppercase tracking-wider transition-colors whitespace-nowrap"
          >
            Instant Demo Login
          </button>
        </div>

        {/* Mobile Tab Toggle Switch */}
        <div className="flex md:hidden border-b border-emerald-900/30 mb-6">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 uppercase tracking-wider ${
              activeTab === 'login'
                ? 'border-[#c59b27] text-[#c59b27]'
                : 'border-transparent text-stone-400'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 uppercase tracking-wider ${
              activeTab === 'register'
                ? 'border-[#c59b27] text-[#c59b27]'
                : 'border-transparent text-stone-400'
            }`}
          >
            Register
          </button>
        </div>

        {/* 2-Column WooCommerce Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Left Column: Login Form */}
          <div
            className={`bg-[#101411] border border-emerald-900/30 rounded-lg p-6 sm:p-8 space-y-6 shadow-xl ${
              activeTab === 'register' ? 'hidden md:block' : 'block'
            }`}
          >
            <div className="border-b border-emerald-900/30 pb-3">
              <h2 className="font-serif-luxury text-xl text-white font-medium">Login</h2>
              <p className="text-xs text-stone-400 mt-1">If you have an account with us, please log in.</p>
            </div>

            {loginMsg && (
              <div
                className={`text-xs p-3 rounded border ${
                  loginMsg.success
                    ? 'bg-emerald-950/80 border-emerald-700/50 text-emerald-400'
                    : 'bg-red-950/80 border-red-800/50 text-red-400'
                }`}
              >
                {loginMsg.message}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-stone-300 font-medium">Username or email address *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="demo@anatolia.com"
                    className="w-full bg-stone-900 border border-emerald-900/40 rounded pl-8 pr-3 py-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-300 font-medium">Password *</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-stone-900 border border-emerald-900/40 rounded pl-8 pr-3 py-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-stone-400 cursor-pointer">
                  <input type="checkbox" className="accent-[#c59b27] rounded" defaultChecked />
                  <span>Remember me</span>
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to email.'); }} className="text-[#c59b27] hover:underline">
                  Lost your password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-[#c59b27] hover:bg-[#b08820] text-black font-semibold py-3 px-4 rounded uppercase tracking-widest transition-all shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Log In</span>
                <ArrowRight size={15} />
              </button>
            </form>

            {/* Social Logins */}
            <div className="pt-4 border-t border-emerald-900/30 text-center space-y-3">
              <span className="text-[11px] text-stone-500 uppercase tracking-wider block">Or sign in with</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="bg-stone-900 hover:bg-stone-800 border border-emerald-900/40 py-2 rounded text-xs text-stone-300 transition-colors"
                >
                  Google Account
                </button>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800/40 py-2 rounded text-xs text-amber-300 transition-colors"
                >
                  Kakao Sign In
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Register Form */}
          <div
            className={`bg-[#101411] border border-emerald-900/30 rounded-lg p-6 sm:p-8 space-y-6 shadow-xl ${
              activeTab === 'login' ? 'hidden md:block' : 'block'
            }`}
          >
            <div className="border-b border-emerald-900/30 pb-3">
              <h2 className="font-serif-luxury text-xl text-white font-medium">Register</h2>
              <p className="text-xs text-stone-400 mt-1">Create a new customer account to enjoy seamless checkout.</p>
            </div>

            {regMsg && (
              <div
                className={`text-xs p-3 rounded border ${
                  regMsg.success
                    ? 'bg-emerald-950/80 border-emerald-700/50 text-emerald-400'
                    : 'bg-red-950/80 border-red-800/50 text-red-400'
                }`}
              >
                {regMsg.message}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-stone-300 font-medium">Full Name *</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Lorenzo Medici"
                    className="w-full bg-stone-900 border border-emerald-900/40 rounded pl-8 pr-3 py-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-300 font-medium">Email address *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="user@domain.com"
                    className="w-full bg-stone-900 border border-emerald-900/40 rounded pl-8 pr-3 py-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-300 font-medium">Password *</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-stone-900 border border-emerald-900/40 rounded pl-8 pr-3 py-2.5 text-stone-200 focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
              </div>

              <p className="text-[11px] text-stone-400 font-light leading-relaxed">
                Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our privacy policy.
              </p>

              <button
                type="submit"
                className="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold py-3 px-4 rounded uppercase tracking-widest transition-all border border-stone-700 flex items-center justify-center space-x-2"
              >
                <span>Register Account</span>
                <ArrowRight size={15} />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
