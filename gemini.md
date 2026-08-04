# Anatolia Web Project Guide & Specification (gemini.md)

## 프로젝트 개요
- **사이트 참조**: https://www.anatolia.com/
- **목적**: Anatolia 브랜드의 동일한 레이아웃 및 럭셔리 디자인 구현, Dynamic Layout & Menu Engine, Page Section CMS, Integrated Admin Dashboard, Product CRUD, Journal Editor, Supabase DB Integration 및 7개 국어 다국어 지원 (i18n).
- **기술 스택**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, @dnd-kit, Supabase

---

## 핵심 UI/UX 스타일 가이드라인 (Anatolia Style)
- **Colors**: Light Gray `#F8F8F9`, Pure White `#FFFFFF`, Dark Charcoal `#1A1A1A`, Accent Gold `#c5a880` / Muted Earth `#9e7f55`.
- **Typography**: Sans-serif (Inter, Montserrat) + Serif (Playfair Display) Headings.
- **Layout & Animations**:
  - Full-bleed 메인 비주얼
  - 여유로운 여백 (Padding/Margin)
  - 마우스 호버 시 약간의 줌인 (`scale-105`) 및 페이드인 Animation 효과

---

## 다국어 지원 (7개 국어 i18n & RTL)
- **기본 언어**: 한국어 (`ko`)
- **지원 언어**:
  1. 한국어 (`ko` - 기본)
  2. 영어 (`en` - English)
  3. 중국어 (`zh` - 中文)
  4. 일본어 (`ja` - 日本語)
  5. 아랍어 (`ar` - العربية, **RTL 오른쪽->왼쪽 레이아웃 방향 지원**)
  6. 스페인어 (`es` - Español)
  7. 인도네시아어 (`id` - Bahasa Indonesia)

---

## 관리자 기능 체크리스트 (Admin Checklist)
- [x] **Header GNB 메뉴 관리**: 추가 / 수정 / 순서 변경 / On-Off 토글 (`/admin/navigation`)
- [x] **Footer 링크 그룹 관리**: 회사 소개, 고객 지원, SNS 등 온오프 토글 (`/admin/navigation`)
- [x] **메인 히어로 뱅크 비디오 및 메인 카피 실시간 변경**: 비디오 MP4 & HD 이미지 CMS (`/admin/hero`, `/admin/content-blocks`)
- [x] **컬렉션/제품 카테고리 CRUD & 이미지 업로드**: 제품 추가/수정/삭제 & 4대 특성 (`/admin/products`)
- [x] **뉴스/이벤트/블로그 게시글 Editor**: WYSIWYG / Markdown 게시글 편집기 (`/admin/journal` & `/journal`)

2.3 관리자 백오피스 CMS (Admin CMS)
1. **접속 방식 및 라우팅**:
   - 퍼블릭 UI에서는 숨김 처리되어 있으며, 주소창에 `도메인/admin` (또는 `/admin`) 입력으로 직통 접속 지원.
   - 미인증 시 `/admin/login` 자동 이동, 인증 완료 시 `/admin/dashboard` 연결.
2. **럭셔리 다크 테마 디자인 시스템**:
   - `#111111` Sidebar + Velvet Pink (`#D81B60`) Active Indicator + Black Glass Topbar + `#141414` Dark KPI Cards.
3. **핵심 관리 모듈 (100% 보존 및 연동)**:
   - **대시보드**: 매출액, 주문 건수, 물류 현황, 1:1 문의 등 실시간 KPI 요약.
   - **제품 관리 (`ProductManagement.tsx`)**: 제품 등록/수정/삭제, 베스트셀러 및 재고 상태 관리.
   - **주문 및 물류 관리 (`OrderManagement.tsx`)**: 택배사 Tracking 연동 및 송장번호 등록.
   - **콘텐츠 및 미디어 관리 (`ContentManagement.tsx`, `MediaCenter.tsx`)**: 공지/뉴스/ESG 자료실 연동.
   - **고객 관리 (`CustomerManagement.tsx`)**: 회원 정보 및 저장 배송지 맵핑 조회.
   - **권한 관리 (`UserManagement.tsx`)**: siteadmin 전용 직원 계정 및 메뉴별 권한(Dashboard, Site, Content 등) 부여.
