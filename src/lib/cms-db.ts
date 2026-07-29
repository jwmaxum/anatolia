import fs from 'fs';
import path from 'path';
import { HeroSlide } from './types';

const HERO_DATA_PATH = path.join(process.cwd(), 'data', 'hero-slides.json');

function ensureHeroDataFile(): HeroSlide[] {
  if (!fs.existsSync(path.dirname(HERO_DATA_PATH))) {
    fs.mkdirSync(path.dirname(HERO_DATA_PATH), { recursive: true });
  }

  if (!fs.existsSync(HERO_DATA_PATH)) {
    return [];
  }

  try {
    const fileData = fs.readFileSync(HERO_DATA_PATH, 'utf-8');
    return JSON.parse(fileData) as HeroSlide[];
  } catch (error) {
    console.error('Error reading hero-slides.json:', error);
    return [];
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
