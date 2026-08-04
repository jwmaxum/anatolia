import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js Middleware — Admin Route Protection
 *
 * /admin 경로에 대한 1차 방어선.
 * sessionStorage는 서버에서 읽을 수 없으므로 쿠키 기반 검증 레이어를 추가합니다.
 * 클라이언트 측 PIN 검증(layout.tsx) 후 쿠키를 설정하면 middleware가 이를 확인합니다.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin 경로 보호 (단, /admin/login 페이지는 제외)
  if (pathname.startsWith('/admin')) {
    const adminCookie = request.cookies.get('anatolia_admin_session');

    // 쿠키 없으면 응답 헤더에 캐시 방지 + 보안 헤더 추가
    const response = NextResponse.next();

    // 보안 헤더 추가
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=()'
    );
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');

    // admin 세션 쿠키가 없어도 UI에서 sessionStorage로 처리하므로 리디렉션은 하지 않음.
    // 단, API 라우트(/api/*)는 별도로 보호됨 (supabaseAdmin 사용).
    // 향후 Supabase Auth 도입 시 여기서 토큰 검증으로 교체.
    if (adminCookie) {
      // 쿠키 유효성 확인 (간단한 값 검증)
      const cookieValue = adminCookie.value;
      if (cookieValue !== 'authenticated') {
        const loginUrl = new URL('/', request.url);
        return NextResponse.redirect(loginUrl);
      }
    }

    return response;
  }

  // 모든 페이지에 보안 헤더 적용
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
