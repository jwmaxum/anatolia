import fs from 'fs';
import path from 'path';
import { HeroSlide } from './types';

const HERO_DATA_PATH = path.join(process.cwd(), 'data', 'hero-slides.json');

const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-1',
    media_type: 'video',
    media_url: 'https://cdn.coverr.co/videos/coverr-pouring-extra-virgin-olive-oil-5421/1080p.mp4',
    poster_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1920&q=80',
    title: 'Curated Fine Foods Inspired by Nature.',
    subtitle: 'Discover hand-selected collections of extra virgin olive oils, aged DOP cheeses, and organic gourmet ingredients.',
    cta_label: 'Explore Gourmet Pantry',
    cta_url: '/collections',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'hero-2',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1920&q=80',
    title: '100% Certified Organic & Sustainable Estates',
    subtitle: 'Directly imported from heritage Italian, Spanish, and Japanese artisan farms with uncompromising quality.',
    cta_label: 'View Organic Estates',
    cta_url: '/collections#pantry',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'hero-3',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=1920&q=80',
    title: '36-Month Aged DOP Parmigiano & Charcuterie',
    subtitle: 'Mastercrafted by traditional heritage cheesemakers for an unmatched sensory fine dining experience.',
    cta_label: 'Discover Dairy & Charcuterie',
    cta_url: '/collections#dairy',
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
