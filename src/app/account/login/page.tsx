'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, User, ArrowRight, ShieldCheck, Sparkles, KeyRound } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { login, signup, isLoggedIn, user } = useAuth();
  const { t } = useLanguage();

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
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-center items-center p-6 text-center space-y-4 font-sans">
        <div className="w-16 h-16 rounded-full bg-emerald-100 border border-[#14532D] text-[#14532D] flex items-center justify-center">
          <User size={32} />
        </div>
        <h2 className="font-jakarta text-2xl font-bold text-stone-900">이미 로그인되어 있습니다</h2>
        <p className="text-xs text-stone-500">환영합니다, {user?.name}님 ({user?.email})</p>
        <Link
          href="/account"
          className="bg-[#14532D] hover:bg-[#1b6a3b] text-white font-semibold text-xs uppercase px-6 py-3 rounded-md transition-colors"
        >
          마이페이지 대시보드로 이동
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
    setLoginEmail('demo@songyoungminfood.com');
    setLoginPassword('password123');
    const res = login('demo@songyoungminfood.com', 'password123');
    setLoginMsg(res);
    if (res.success) {
      setTimeout(() => router.push('/account'), 600);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-stone-800 pb-24 font-sans">
      {/* Hero Banner Header */}
      <div className="bg-white border-b border-stone-200 py-12 px-4 sm:px-6 lg:px-8 text-center space-y-3 shadow-sm">
        <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-[#14532D] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          <KeyRound size={13} />
          <span>송영민푸드 고객 서비스 포털</span>
        </div>
        <h1 className="font-jakarta text-3xl sm:text-4xl font-extrabold text-stone-900">
          고객 마이페이지 로그인
        </h1>
        <p className="text-xs text-stone-500 font-medium max-w-md mx-auto">
          주문 내역 조회, 배송지 관리, 배송 상태 추적 및 위시리스트 관리를 위한 포털입니다.
        </p>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Quick One-Click Demo Login Bar */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
          <div className="flex items-center space-x-3 text-xs text-stone-700">
            <Sparkles className="text-[#EAB308] flex-shrink-0" size={18} />
            <div>
              <span className="font-bold text-stone-900">1-Click 체험용 테스트 계정: </span>
              <span className="text-[#14532D] font-mono font-bold">(demo@songyoungminfood.com)</span>
            </div>
          </div>
          <button
            onClick={handleFillDemo}
            className="bg-[#14532D] hover:bg-[#1b6a3b] text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
          >
            체험용 계정 즉시 로그인
          </button>
        </div>

        {/* Mobile Tab Toggle Switch */}
        <div className="flex md:hidden border-b border-stone-200 mb-6">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 tracking-wider ${
              activeTab === 'login'
                ? 'border-[#14532D] text-[#14532D]'
                : 'border-transparent text-stone-400'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 tracking-wider ${
              activeTab === 'register'
                ? 'border-[#14532D] text-[#14532D]'
                : 'border-transparent text-stone-400'
            }`}
          >
            회원가입
          </button>
        </div>

        {/* 2-Column Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Left Column: Login Form */}
          <div
            className={`bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm ${
              activeTab === 'register' ? 'hidden md:block' : 'block'
            }`}
          >
            <div className="border-b border-stone-100 pb-3">
              <h2 className="font-jakarta text-xl text-stone-900 font-bold">고객 로그인</h2>
              <p className="text-xs text-stone-500 mt-1">송영민푸드 계정이 있으신 경우 로그인해 주세요.</p>
            </div>

            {loginMsg && (
              <div
                className={`text-xs p-3 rounded-lg border font-bold ${
                  loginMsg.success
                    ? 'bg-emerald-50 border-emerald-300 text-[#14532D]'
                    : 'bg-red-50 border-red-300 text-red-600'
                }`}
              >
                {loginMsg.message}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-stone-700 font-bold">이메일 주소 *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="demo@songyoungminfood.com"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-8 pr-3 py-2.5 text-stone-900 focus:outline-none focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/20"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-700 font-bold">비밀번호 *</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-8 pr-3 py-2.5 text-stone-900 focus:outline-none focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-stone-600 cursor-pointer">
                  <input type="checkbox" className="accent-[#14532D] rounded" defaultChecked />
                  <span>로그인 상태 유지</span>
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('비밀번호 재설정 이메일이 발송되었습니다.'); }} className="text-[#14532D] font-bold hover:underline">
                  비밀번호를 잊으셨나요?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-[#14532D] hover:bg-[#1b6a3b] text-white font-bold py-3 px-4 rounded-lg transition-all shadow flex items-center justify-center space-x-2"
              >
                <span>로그인하기</span>
                <ArrowRight size={15} />
              </button>
            </form>

            {/* Social Logins */}
            <div className="pt-4 border-t border-stone-100 text-center space-y-3">
              <span className="text-[11px] text-stone-400 font-bold uppercase tracking-wider block">간편 간편 로그인</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="bg-stone-100 hover:bg-stone-200 border border-stone-300 py-2 rounded-lg text-xs font-bold text-stone-800 transition-colors"
                >
                  Google 계정
                </button>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="bg-[#FEE500] hover:bg-[#FADA00] border border-[#E5CE00] py-2 rounded-lg text-xs font-bold text-[#3C1E1E] transition-colors"
                >
                  카카오 간편로그인
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Register Form */}
          <div
            className={`bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm ${
              activeTab === 'login' ? 'hidden md:block' : 'block'
            }`}
          >
            <div className="border-b border-stone-100 pb-3">
              <h2 className="font-jakarta text-xl text-stone-900 font-bold">신규 회원가입</h2>
              <p className="text-xs text-stone-500 mt-1">송영민푸드 회원으로 가입하시고 프레시 혜택을 누리세요.</p>
            </div>

            {regMsg && (
              <div
                className={`text-xs p-3 rounded-lg border font-bold ${
                  regMsg.success
                    ? 'bg-emerald-50 border-emerald-300 text-[#14532D]'
                    : 'bg-red-50 border-red-300 text-red-600'
                }`}
              >
                {regMsg.message}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-stone-700 font-bold">이름 (성함) *</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-8 pr-3 py-2.5 text-stone-900 focus:outline-none focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/20"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-700 font-bold">이메일 주소 *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="user@domain.com"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-8 pr-3 py-2.5 text-stone-900 focus:outline-none focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/20"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-700 font-bold">비밀번호 *</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="비밀번호 6자리 이상 입력..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-8 pr-3 py-2.5 text-stone-900 focus:outline-none focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/20"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] leading-relaxed font-medium">
                <ShieldCheck size={14} className="inline mr-1 text-[#14532D]" />
                신규 가입 시 24시간 프레시 냉장배송 무료 쿠폰 및 15% 할인 쿠폰이 즉시 발급됩니다.
              </div>

              <button
                type="submit"
                className="w-full bg-[#14532D] hover:bg-[#1b6a3b] text-white font-bold py-3 px-4 rounded-lg transition-all shadow flex items-center justify-center space-x-2"
              >
                <span>회원가입 신청</span>
                <ArrowRight size={15} />
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
