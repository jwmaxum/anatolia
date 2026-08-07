import fs from 'fs';
import path from 'path';
import { HeroSlide } from './types';

const HERO_DATA_PATH = path.join(process.cwd(), 'data', 'hero-slides.json');

const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-1',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=1920&q=80',
    title: 'K-FOOD & K-LIQUOR PREMIUM MARKETPLACE',
    subtitle: '대한민국 대표 프리미엄 K-냉동식품 & 원소주, 생막걸리 전통주 직송 컬렉션',
    cta_label: 'K-냉동식품 구경하기',
    cta_url: '/collections?cat=fresh',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'hero-2',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1920&q=80',
    title: '100% 쌀발효 옹기 숙성 원소주 & 느린마을 막걸리',
    subtitle: '장인의 손길로 빚어낸 명품 전통주와 과일소주를 24시간 프레시 배송으로 만나보세요.',
    cta_label: 'K-주류 & 전통주 보기',
    cta_url: '/collections?cat=dairy',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'hero-3',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1920&q=80',
    title: '에어프라이어 15분! K-수제 떡볶이 & 크리스피 치킨',
    subtitle: '비비고 왕교자 만두부터 눈꽃 떡볶이 밀키트까지, 집에서 간편하게 즐기는 미식 파티.',
    cta_label: '오늘의 특가 구경하기',
    cta_url: '/collections?cat=deals',
    sort_order: 3,
    is_active: true,
  },
];

function ensureHeroDataFile(): HeroSlide[] {
  if (!fs.existsSync(path.dirname(HERO_DATA_PATH))) {
    fs.mkdirSync(path.dirname(HERO_DATA_PATH), { recursive: true });
  }

  if (!fs.existsSync(HERO_DATA_PATH)) {
    saveHeroData(INITIAL_HERO_SLIDES);
    return INITIAL_HERO_SLIDES;
  }

  try {
    const fileData = fs.readFileSync(HERO_DATA_PATH, 'utf-8');
    const parsed = JSON.parse(fileData) as HeroSlide[];
    if (!parsed || parsed.length === 0) {
      saveHeroData(INITIAL_HERO_SLIDES);
      return INITIAL_HERO_SLIDES;
    }
    return parsed;
  } catch (error) {
    console.error('Error reading hero-slides.json:', error);
    saveHeroData(INITIAL_HERO_SLIDES);
    return INITIAL_HERO_SLIDES;
  }
}

function saveHeroData(items: HeroSlide[]) {
  if (!fs.existsSync(path.dirname(HERO_DATA_PATH))) {
    fs.mkdirSync(path.dirname(HERO_DATA_PATH), { recursive: true });
  }
  fs.writeFileSync(HERO_DATA_PATH, JSON.stringify(items, null, 2), 'utf-8');
}

/**
 * Get all hero slides (Admin Mode)
 */
export async function getAllHeroSlides(): Promise<HeroSlide[]> {
  const slides = ensureHeroDataFile();
  return slides.sort((a, b) => a.sort_order - b.sort_order);
}

/**
 * Get active hero slides for home page slider
 */
export async function getActiveHeroSlides(): Promise<HeroSlide[]> {
  const slides = ensureHeroDataFile();
  return slides
    .filter((s) => s.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
}

/**
 * Toggle hero slide active status
 */
export async function toggleHeroSlideActive(id: string, is_active: boolean): Promise<boolean> {
  const slides = ensureHeroDataFile();
  const index = slides.findIndex((s) => s.id === id);
  if (index === -1) return false;

  slides[index].is_active = is_active;
  saveHeroData(slides);
  return true;
}

/**
 * Create or update a hero slide
 */
export async function saveHeroSlide(slide: Partial<HeroSlide> & { id?: string }): Promise<HeroSlide> {
  const slides = ensureHeroDataFile();

  if (slide.id) {
    const idx = slides.findIndex((s) => s.id === slide.id);
    if (idx !== -1) {
      slides[idx] = { ...slides[idx], ...slide };
      saveHeroData(slides);
      return slides[idx];
    }
  }

  const newId = `hero-${Date.now()}`;
  const newSlide: HeroSlide = {
    id: newId,
    media_type: slide.media_type || 'image',
    media_url: slide.media_url || '',
    poster_url: slide.poster_url || '',
    title: slide.title || 'Untitled Slide',
    subtitle: slide.subtitle || '',
    cta_label: slide.cta_label || 'Discover More',
    cta_url: slide.cta_url || '/collections',
    sort_order: slide.sort_order ?? slides.length + 1,
    is_active: slide.is_active ?? true,
  };

  slides.push(newSlide);
  saveHeroData(slides);
  return newSlide;
}

/**
 * Delete a hero slide
 */
export async function deleteHeroSlide(id: string): Promise<boolean> {
  let slides = ensureHeroDataFile();
  const initialLen = slides.length;
  slides = slides.filter((s) => s.id !== id);
  saveHeroData(slides);
  return slides.length < initialLen;
}
