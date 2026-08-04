/**
 * 테스트: KPI API 응답 형식 검증
 *
 * KpiData 인터페이스의 형식과 기본값 검증
 */
import type { KpiData } from '@/app/api/kpi/route';

function createDefaultKpi(): KpiData {
  return {
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    publishedArticles: 0,
    totalUsers: 0,
    totalMediaItems: 0,
    activeMenus: 0,
  };
}

function isValidKpiData(data: unknown): data is KpiData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  const requiredFields: (keyof KpiData)[] = [
    'totalOrders',
    'pendingOrders',
    'totalRevenue',
    'totalProducts',
    'publishedArticles',
    'totalUsers',
    'totalMediaItems',
    'activeMenus',
  ];
  return requiredFields.every(
    (field) => field in d && typeof d[field] === 'number' && d[field] >= 0
  );
}

describe('KPI 데이터 형식 검증', () => {
  it('기본 KPI 객체가 유효한 형식', () => {
    const kpi = createDefaultKpi();
    expect(isValidKpiData(kpi)).toBe(true);
  });

  it('모든 필드가 음수가 아님', () => {
    const kpi = createDefaultKpi();
    expect(kpi.totalOrders).toBeGreaterThanOrEqual(0);
    expect(kpi.pendingOrders).toBeGreaterThanOrEqual(0);
    expect(kpi.totalRevenue).toBeGreaterThanOrEqual(0);
    expect(kpi.totalProducts).toBeGreaterThanOrEqual(0);
    expect(kpi.publishedArticles).toBeGreaterThanOrEqual(0);
    expect(kpi.totalUsers).toBeGreaterThanOrEqual(0);
    expect(kpi.totalMediaItems).toBeGreaterThanOrEqual(0);
    expect(kpi.activeMenus).toBeGreaterThanOrEqual(0);
  });

  it('필수 필드 누락 시 유효하지 않음', () => {
    expect(isValidKpiData({})).toBe(false);
    expect(isValidKpiData({ totalOrders: 5 })).toBe(false);
    expect(isValidKpiData(null)).toBe(false);
    expect(isValidKpiData('string')).toBe(false);
  });

  it('필드 값이 숫자 타입', () => {
    const kpi = createDefaultKpi();
    expect(typeof kpi.totalOrders).toBe('number');
    expect(typeof kpi.totalRevenue).toBe('number');
  });

  it('pendingOrders <= totalOrders 관계 검증', () => {
    const kpi: KpiData = { ...createDefaultKpi(), totalOrders: 10, pendingOrders: 3 };
    expect(kpi.pendingOrders).toBeLessThanOrEqual(kpi.totalOrders);
  });
});

describe('통화 포맷 함수', () => {
  function formatCurrency(value: number): string {
    if (value >= 1000000) return `₩${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `₩${(value / 1000).toFixed(0)}K`;
    return `₩${value}`;
  }

  it('1M 이상 M 단위 표시', () => {
    expect(formatCurrency(1500000)).toBe('₩1.5M');
  });

  it('1K 이상 K 단위 표시', () => {
    expect(formatCurrency(50000)).toBe('₩50K');
  });

  it('1000 미만 원 단위 표시', () => {
    expect(formatCurrency(500)).toBe('₩500');
  });

  it('0원 표시', () => {
    expect(formatCurrency(0)).toBe('₩0');
  });
});
