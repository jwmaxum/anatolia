import React from 'react';
import Link from 'next/link';
import {
  Layers,
  Film,
  FileText,
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  Clock,
  BookOpen,
} from 'lucide-react';
import type { KpiData } from '@/app/api/kpi/route';

export const metadata = {
  title: 'Admin Dashboard Hub | Anatolia',
  description: 'Integrated Content Management System dashboard for Anatolia Web App.',
};

async function fetchKpi(): Promise<KpiData & { configured: boolean }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/kpi`, {
      next: { revalidate: 60 }, // 1분 캐시
    });
    if (!res.ok) throw new Error('KPI fetch failed');
    const json = await res.json();
    return { ...json.data, configured: json.configured };
  } catch {
    // fallback: 모든 값 0
    return {
      totalOrders: 0,
      pendingOrders: 0,
      totalRevenue: 0,
      totalProducts: 0,
      publishedArticles: 0,
      totalUsers: 0,
      totalMediaItems: 0,
      activeMenus: 0,
      configured: false,
    };
  }
}

function formatCurrency(value: number) {
  if (value >= 1000000) return `₩${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `₩${(value / 1000).toFixed(0)}K`;
  return `₩${value}`;
}

export default async function AdminDashboardPage() {
  const kpi = await fetchKpi();

  const kpiCards = [
    {
      label: '총 주문',
      value: kpi.totalOrders.toString(),
      sub: `미처리 ${kpi.pendingOrders}건`,
      subColor: kpi.pendingOrders > 0 ? 'text-amber-400' : 'text-emerald-400',
      icon: ShoppingCart,
      iconColor: 'text-[#c5a880]',
    },
    {
      label: '총 매출',
      value: formatCurrency(kpi.totalRevenue),
      sub: '누적 주문 합계',
      subColor: 'text-stone-500',
      icon: TrendingUp,
      iconColor: 'text-emerald-400',
    },
    {
      label: '등록 제품',
      value: kpi.totalProducts.toString(),
      sub: 'Products',
      subColor: 'text-stone-500',
      icon: Package,
      iconColor: 'text-sky-400',
    },
    {
      label: '회원 수',
      value: kpi.totalUsers.toString(),
      sub: '가입 사용자',
      subColor: 'text-stone-500',
      icon: Users,
      iconColor: 'text-violet-400',
    },
  ];

  const cmsCards = [
    {
      label: 'Menu Engine',
      value: kpi.activeMenus.toString(),
      sub: 'Active Menus',
      icon: Layers,
      iconColor: 'text-[#c5a880]',
      href: '/admin/navigation',
      linkLabel: 'Manage Navigation',
    },
    {
      label: 'Media Assets',
      value: kpi.totalMediaItems.toString(),
      sub: 'Files',
      icon: ImageIcon,
      iconColor: 'text-emerald-400',
      href: '/admin/media',
      linkLabel: 'Upload & Manage',
    },
    {
      label: 'Journal Articles',
      value: kpi.publishedArticles.toString(),
      sub: 'Published',
      icon: BookOpen,
      iconColor: 'text-amber-400',
      href: '/admin/journal',
      linkLabel: 'Edit Journal',
    },
    {
      label: 'Pending Orders',
      value: kpi.pendingOrders.toString(),
      sub: 'Awaiting action',
      icon: Clock,
      iconColor: kpi.pendingOrders > 0 ? 'text-red-400' : 'text-stone-500',
      href: '/admin/products',
      linkLabel: 'View Products',
    },
  ];

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-10 font-sans">

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-800 pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#c5a880] text-xs font-mono uppercase tracking-widest mb-1">
            <ShieldCheck size={16} />
            <span>Anatolia Admin Management Hub</span>
          </div>
          <h1 className="font-serif-luxury text-3xl font-semibold text-white tracking-wide">
            Content &amp; Engine Control Panel
          </h1>
          <p className="text-stone-400 text-xs mt-1">
            실시간 DB 연동 KPI · 메뉴/히어로/콘텐츠 CMS · 미디어 라이브러리 통합 관리
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!kpi.configured && (
            <span className="px-3 py-1 bg-amber-950/40 border border-amber-800/50 rounded text-amber-400 text-xs font-mono">
              ⚠ Supabase 미연결 (샘플 데이터)
            </span>
          )}
          <Link
            href="/"
            className="px-4 py-2 bg-[#c5a880] text-black font-semibold text-xs tracking-wider uppercase rounded hover:bg-[#dbbc93] transition-colors"
          >
            View Live Website
          </Link>
        </div>
      </div>

      {/* Business KPI Cards */}
      <section>
        <h2 className="text-xs uppercase tracking-[0.2em] font-mono text-stone-500 mb-4">
          Business KPIs — Real-time DB
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-[#121218] border border-stone-800 rounded-lg p-5 space-y-3 hover:border-[#c5a880]/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono text-stone-400">{card.label}</span>
                  <Icon className={card.iconColor} size={20} />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-serif-luxury text-3xl text-white font-semibold">
                    {card.value}
                  </span>
                  <span className={`text-xs font-mono ${card.subColor}`}>{card.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CMS Summary Cards */}
      <section>
        <h2 className="text-xs uppercase tracking-[0.2em] font-mono text-stone-500 mb-4">
          CMS Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cmsCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-[#121218] border border-stone-800 rounded-lg p-5 space-y-3 hover:border-[#c5a880]/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono text-stone-400">{card.label}</span>
                  <Icon className={card.iconColor} size={20} />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-serif-luxury text-3xl text-white font-semibold">
                    {card.value}
                  </span>
                  <span className="text-xs text-stone-500 font-mono">{card.sub}</span>
                </div>
                <Link
                  href={card.href}
                  className="text-xs text-[#c5a880] hover:underline inline-flex items-center space-x-1 pt-1"
                >
                  <span>{card.linkLabel}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Modules Quick Action Cards */}
      <section className="space-y-4">
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
                Header / Footer 메뉴 엔진 — Drag-and-drop 순서 변경 및 is_active 실시간 토글.
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
                Hero Banner &amp; Media Slider
              </h3>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                MP4 영상 배경 및 고해상도 이미지 히어로 슬라이드 추가·수정.
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
                페이지별 섹션 헤드라인, 설명, 뱃지, 미디어 링크 편집.
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
                Media Library &amp; File Upload
              </h3>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                이미지·영상 직접 업로드 또는 CDN URL 등록, URL 복사 기능.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
