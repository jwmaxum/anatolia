import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export interface KpiData {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalProducts: number;
  publishedArticles: number;
  totalUsers: number;
  totalMediaItems: number;
  activeMenus: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseCountResult = PromiseSettledResult<{ count?: number | null; data?: any[] | null; error?: unknown }>;

function getCount(result: SupabaseCountResult): number {
  if (result.status === 'fulfilled' && !result.value.error) {
    return result.value.count ?? 0;
  }
  return 0;
}

function getRevenue(result: SupabaseCountResult): number {
  if (result.status === 'fulfilled' && !result.value.error && result.value.data) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result.value.data as any[]).reduce((sum: number, row: any) => sum + (Number(row.total) || 0), 0);
  }
  return 0;
}

export async function GET() {
  // Supabase 미설정 시 샘플 데이터 반환
  if (!isSupabaseConfigured()) {
    const sample: KpiData = {
      totalOrders: 0,
      pendingOrders: 0,
      totalRevenue: 0,
      totalProducts: 0,
      publishedArticles: 0,
      totalUsers: 0,
      totalMediaItems: 0,
      activeMenus: 0,
    };
    return NextResponse.json({ success: true, data: sample, configured: false });
  }

  try {
    // 병렬 집계 쿼리
    const [
      ordersResult,
      pendingOrdersResult,
      revenueResult,
      productsResult,
      articlesResult,
      usersResult,
      mediaResult,
      menusResult,
    ] = await Promise.allSettled([
      supabaseAdmin.from('orders').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'Pending'),
      supabaseAdmin.from('orders').select('total'),
      supabaseAdmin.from('products').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('journal_articles').select('id', { count: 'exact', head: true }).eq('is_published', true),
      supabaseAdmin.from('user_profiles').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('media_library').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('menus').select('id', { count: 'exact', head: true }).eq('is_active', true),
    ]);

    const kpi: KpiData = {
      totalOrders:      getCount(ordersResult as SupabaseCountResult),
      pendingOrders:    getCount(pendingOrdersResult as SupabaseCountResult),
      totalRevenue:     getRevenue(revenueResult as SupabaseCountResult),
      totalProducts:    getCount(productsResult as SupabaseCountResult),
      publishedArticles: getCount(articlesResult as SupabaseCountResult),
      totalUsers:       getCount(usersResult as SupabaseCountResult),
      totalMediaItems:  getCount(mediaResult as SupabaseCountResult),
      activeMenus:      getCount(menusResult as SupabaseCountResult),
    };

    return NextResponse.json({ success: true, data: kpi, configured: true });
  } catch (error) {
    console.error('[KPI API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'KPI data fetch failed' },
      { status: 500 }
    );
  }
}
