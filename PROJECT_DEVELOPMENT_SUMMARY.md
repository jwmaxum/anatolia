# Anatolia 웹 애플리케이션 개발 완료 보고서 (PROJECT_DEVELOPMENT_SUMMARY.md)

- **사이트 참조**: https://www.anatolia.com/
- **GitHub 저장소**: https://github.com/jwmaxum/anatolia.git
- **기술 스택**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, @dnd-kit, Supabase SDK, Cloudflare Pages

---

## 1. 프로젝트 개요 (Overview)

본 프로젝트는 글로벌 최고급 타일 및 소결석 슬라브 제조 브랜드인 **Anatolia**의 럭셔리 웹사이트 레이아웃과 감성을 동일하게 구현한 풀스택 웹 애플리케이션입니다. 

RSC(React Server Components) 기반의 **Dynamic Layout & Menu Engine**, **Page Section CMS**, **Integrated Admin Dashboard**, **Product CRUD**, **Journal Editor**, **Supabase DB Integration**, **7개 국어 다국어 지원(i18n & RTL)** 및 **Cloudflare Pages 자동 배포**가 완벽하게 통합 구축되어 있습니다.

---

## 2. 📋 관리자 기능 체크리스트 (Admin Checklist) 100% 달성

| 체크리스트 기능 | 구현 상태 | 관련 라우터 및 관리자 화면 |
| :--- | :---: | :--- |
| **Header GNB 메뉴 관리** | **[x] 완료** | `/admin/navigation` (Header 탭, `@dnd-kit` 드래그 앤 드롭 순서 변경 & 토글) |
| **Footer 링크 그룹 관리** | **[x] 완료** | `/admin/navigation` (Footer 탭, 회사소개/고객지원 링크그룹 온오프 관리) |
| **메인 히어로 뱅크 비디오 및 카피 실시간 변경** | **[x] 완료** | `/admin/hero` (MP4/HD 슬라이더 CMS) & `/admin/content-blocks` |
| **컬렉션/제품 카테고리 CRUD & 이미지 업로드** | **[x] 완료** | `/admin/products` (제품 추가/수정/삭제 & 4대 자재 특성 관리) |
| **뉴스/이벤트/블로그 게시글 Editor** | **[x] 완료** | `/admin/journal` (WYSIWYG/Markdown 아티클 편집기) & `/journal` |

---

## 3. UI/UX 디자인 시스템 (Anatolia Style)

- **Color Tokens**:
  - Light Gray: `#F8F8F9` (배경 및 보더)
  - Pure White: `#FFFFFF` (카드 및 텍스트 강조)
  - Dark Charcoal: `#1A1A1A` / `#0A0A0C` (럭셔리 다크 테마)
  - Accent Gold: `#c5a880` / Muted Earth: `#9e7f55` (브랜드 골드 포인트)
- **Typography**:
  - Sans-serif: `Inter`, `Montserrat` (모던하고 시각적으로 깔끔한 본문)
  - Luxury Serif: `Playfair Display` (헤드라인 및 시그니처 텍스트)
- **Layout & Animations**:
  - Full-bleed 메인 랜딩 비주얼 슬라이더 및 히어로 비디오
  - 여유로운 여백 (Padding/Margin)으로 시각적 쾌적함 제공
  - 마우스 호버 시 Smooth Zoom-in (`scale-105`, `.img-zoom-hover`) 및 페이드인 애니메이션 효과 적용

---

## 4. 다국어 지원 시스템 (7개 국어 i18n & RTL)

- **기본 언어**: **한국어 (`ko` - Korean)**
- **지원 언어 목록 (7개 국어)**:
  1. `ko` - 🇰🇷 한국어 (기본 설정)
  2. `en` - 🇺🇸 English
  3. `zh` - 🇨🇳 中文 (중국어)
  4. `ja` - 🇯🇵 日本語 (일본어)
  5. `ar` - 🇸🇦 العربية (**RTL 오른쪽->왼쪽 레이아웃 방향 지원**)
  6. `es` - 🇪🇸 Español (스페인어)
  7. `id` - 🇮🇩 Bahasa Indonesia (인도네시아어)
- **i18n 구현 컴포넌트**:
  - `src/lib/i18n/dictionaries.ts`: 7개 국어 동적 번역 맵
  - `src/lib/i18n/LanguageContext.tsx`: React Context Provider & localStorage 상태 저장 및 아랍어(`ar`) 선택 시 `document.dir = 'rtl'` 자동 감지
  - `src/components/layout/LanguageSelector.tsx`: 지구본 아이콘 기반 7개 국어 셀렉터 UI

---

## 5. 단계별 개발 단계 (Phases)

### Phase 1: Dynamic Layout & Menu Engine 구축
- Next.js 서버 컴포넌트(RSC)에서 `is_active = true`인 메뉴 항목만 Fetch하여 Header/Footer 컴포넌트에 주입.
- Depth 1, Depth 2 드롭다운 메뉴 및 모바일 햄버거 메가메뉴 자동 매핑.
- `/admin/navigation`: `@dnd-kit` 기반 드래그 앤 드롭 순서 변경 (`sort_order`) & On/Off 토글 스위치.

### Phase 2: Page Section CMS & Lookbook Showcase
- `/admin/hero`: MP4 비디오 배경 및 고해상도 이미지 슬라이더 관리자 폼.
- `/collections`: 자재 특성에 맞춘 4대 카테고리 필터링 (Format, Surface Finish, Color, Look) 및 Lookbook 비주얼 그리드 레이아웃.
- Quick Spec Modal: 제품 클릭 시 모달 팝업으로 상세 규격 및 갤러리 이미지 확인.

### Phase 3: Integrated Admin Dashboard Hub
- `/admin`: 4대 메트릭 카드 및 반응형 사이드바 내비게이션을 포함한 통합 대시보드 허브.
- `/admin/content-blocks`: 메인/서브 페이지 섹션별 텍스트, 미디어, 배지 수정.
- `/admin/media`: 이미지/비디오 파일 업로드 및 `/public/uploads` 직관적 CDN 관리와 1-Click URL 복사 기능.

---

## 6. Supabase 백엔드 데이터베이스연동 (Supabase Integration)

- **`supabase/schema.sql`**:
  - 6개 핵심 테이블 DDL 스키마:
    - `menus`: Header/Footer 내비게이션 엔지니어링
    - `hero_slides`: 히어로 비디오 & 이미지 슬라이더 CMS
    - `products`: 타일/소결석 제품 CRUD
    - `content_blocks`: 섹션 콘텐츠 블록
    - `journal_articles`: 뉴스/이벤트 저널 아티클
    - `media_library`: 미디어 파일 업로드 자산 관리
  - Performance Index, RLS (Row Level Security) 읽기/관리 보안 정책 및 초기 시드 데이터 `INSERT INTO` 문 수록.
- **환경 변수 구상**:
  - `.env.example` 및 `.env.local` 제공.
  - `src/lib/supabase.ts`: `@supabase/supabase-js` 기반 SDK 연동 클라이언트 모듈.

---

## 7. Cloudflare Pages 배포 및 CI/CD 구축

- **Static HTML Export**: `next.config.ts` 에 `output: 'export'` 설정으로 빌드 시 `out` 디렉토리에 정적 웹 사이트 생성.
- **`wrangler.toml`**: Cloudflare Pages 빌드 출력 디렉토리(`pages_build_output_dir = "out"`) 지정.
- **GitHub Actions (`.github/workflows/deploy.yml`)**:
  - `main` 브랜치 푸시 시 Node.js 20 환경에서 `npm run build` 자동 검증 및 CI Pipeline 동작.

---

## 8. 주요 파일 구조 (File Structure)

```text
anatoria/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD Pipeline
├── data/                           # 파일 시스템 JSON 시드 데이터
│   ├── content-blocks.json
│   ├── hero-slides.json
│   ├── journal.json
│   ├── media-library.json
│   ├── menus.json
│   └── products.json
├── public/                         # 정적 자산 및 업로드 폴더
│   └── uploads/
├── src/
│   ├── app/
│   │   ├── admin/                  # 어드민 관리자 라우트 그룹
│   │   │   ├── content-blocks/     # 섹션 콘텐츠 CMS
│   │   │   ├── hero/               # 히어로 비디오/슬라이더 CMS
│   │   │   ├── journal/            # 뉴스/이벤트 저널 에디터
│   │   │   ├── media/              # 미디어 라이브러리 업로드
│   │   │   ├── navigation/         # Header/Footer 메뉴 엔지니어링
│   │   │   ├── products/           # 제품 카테고리 CRUD
│   │   │   └── page.tsx            # 통합 어드민 대시보드 허브
│   │   ├── api/                    # REST API 라우트
│   │   │   ├── content-blocks/
│   │   │   ├── hero/
│   │   │   ├── journal/
│   │   │   ├── media/
│   │   │   ├── menus/
│   │   │   ├── products/
│   │   │   └── upload/
│   │   ├── collections/            # 룩북 쇼케이스 & 4대 필터링
│   │   ├── journal/                # 공개 저널 & 뉴스 아티클
│   │   │   └── [slug]/             # 저널 아티클 상세 페이지
│   │   ├── globals.css             # Anatolia 브랜드 스타일 시스템
│   │   ├── layout.tsx              # Root Layout (LanguageProvider 적용)
│   │   └── page.tsx                # Full-bleed 메인 랜딩 페이지
│   ├── components/
│   │   ├── home/
│   │   │   └── HeroSlider.tsx      # 동적 메인 비주얼 슬라이더
│   │   └── layout/
│   │       ├── Header.tsx / HeaderClient.tsx
│   │       ├── Footer.tsx / FooterClient.tsx
│   │       └── LanguageSelector.tsx # 7개 국어 다국어 셀렉터 UI
│   └── lib/
│       ├── i18n/
│       │   ├── dictionaries.ts     # 7개 국어 번역 맵
│       │   └── LanguageContext.tsx # 다국어 Context Provider & RTL
│       ├── supabase.ts             # Supabase SDK 연동 모듈
│       ├── types.ts                # TypeScript 데이터 인터페이스
│       └── *-db.ts                 # 데이터베이스 헬퍼 모듈
├── supabase/
│   └── schema.sql                  # Supabase 전체 DDL & Seed Data SQL
├── .env.example                    # 환경 변수 예제 파일
├── gemini.md                       # 사양 가이드라인 문서
├── next.config.ts                  # Next.js 설정 (output: 'export')
├── package.json                    # 프로젝트 의존성 명세
└── wrangler.toml                   # Cloudflare Pages 설정 파일
```
