import fs from 'fs';
import path from 'path';
import { JournalArticle } from './types';

const JOURNAL_DATA_PATH = path.join(process.cwd(), 'data', 'journal.json');

const INITIAL_JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'art-1',
    title: 'Florence Culinary Innovation Lab Opening',
    slug: 'florence-culinary-innovation-lab',
    category: 'Architecture',
    excerpt: 'Anatolia debuts an immersive 8,000 sq ft gastronomy studio in the heart of historic Tuscany.',
    content: '# Florence Culinary Innovation Lab Opening\n\nAnatolia Gourmet is proud to announce the official opening of our flagship Culinary Innovation Lab in Florence, Italy.\n\nDesigned by renowned Italian architects, the studio brings together master cheesemakers, olive oil sommeliers, and Michelin-starred chefs to research organic heritage fermentation and cold-pressing techniques.',
    cover_image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80',
    is_published: true,
    published_date: '2026-06-15',
  },
  {
    id: 'art-2',
    title: 'Paris Gourmet Expo 2026: Terroir & Excellence',
    slug: 'paris-gourmet-expo-2026-terroir',
    category: 'Event',
    excerpt: 'Showcasing 36-month DOP Parmigiano and cold-pressed extra virgin olive oils to international connoisseurs.',
    content: '# Paris Gourmet Expo 2026\n\nAt the annual Paris Fine Food Pavilion, Anatolia unveiled our new certified organic single-estate olive oil series.',
    cover_image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=80',
    is_published: true,
    published_date: '2026-05-20',
  },
  {
    id: 'art-3',
    title: 'The Art of Cold Pressing Extra Virgin Olive Oil',
    slug: 'art-of-cold-pressing-evoo',
    category: 'Design',
    excerpt: 'A deep dive into 200-year-old stone mill extraction techniques preserving polyphenol antioxidants.',
    content: '# The Art of Cold Pressing Extra Virgin Olive Oil\n\nTrue luxury lies in patience. Our organic olives are hand-picked at dawn and crushed within two hours under stone rollers at temperatures strictly below 24°C.',
    cover_image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=1200&q=80',
    is_published: true,
    published_date: '2026-04-10',
  },
];

function ensureJournalFile(): JournalArticle[] {
  if (!fs.existsSync(path.dirname(JOURNAL_DATA_PATH))) {
    fs.mkdirSync(path.dirname(JOURNAL_DATA_PATH), { recursive: true });
  }

  if (!fs.existsSync(JOURNAL_DATA_PATH)) {
    saveJournalData(INITIAL_JOURNAL_ARTICLES);
    return INITIAL_JOURNAL_ARTICLES;
  }

  try {
    const fileData = fs.readFileSync(JOURNAL_DATA_PATH, 'utf-8');
    const parsed = JSON.parse(fileData) as JournalArticle[];
    if (!parsed || parsed.length === 0) {
      saveJournalData(INITIAL_JOURNAL_ARTICLES);
      return INITIAL_JOURNAL_ARTICLES;
    }
    return parsed;
  } catch (error) {
    console.error('Error reading journal.json:', error);
    saveJournalData(INITIAL_JOURNAL_ARTICLES);
    return INITIAL_JOURNAL_ARTICLES;
  }
}

function saveJournalData(items: JournalArticle[]) {
  if (!fs.existsSync(path.dirname(JOURNAL_DATA_PATH))) {
    fs.mkdirSync(path.dirname(JOURNAL_DATA_PATH), { recursive: true });
  }
  fs.writeFileSync(JOURNAL_DATA_PATH, JSON.stringify(items, null, 2), 'utf-8');
}

/**
 * Get all journal articles (Admin mode or Published mode)
 */
export async function getJournalArticles(isPublishedOnly = false): Promise<JournalArticle[]> {
  const articles = ensureJournalFile();
  if (isPublishedOnly) {
    return articles.filter((a) => a.is_published);
  }
  return articles;
}

/**
 * Get journal article by slug or id
 */
export async function getJournalBySlug(slug: string): Promise<JournalArticle | null> {
  const articles = ensureJournalFile();
  return articles.find((a) => a.slug === slug || a.id === slug) || null;
}

/**
 * Save or update journal article
 */
export async function saveJournalArticle(article: Partial<JournalArticle> & { id?: string }): Promise<JournalArticle> {
  const articles = ensureJournalFile();

  if (article.id) {
    const idx = articles.findIndex((a) => a.id === article.id);
    if (idx !== -1) {
      articles[idx] = { ...articles[idx], ...article };
      saveJournalData(articles);
      return articles[idx];
    }
  }

  const newId = `art-${Date.now()}`;
  const newSlug = article.slug || article.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `post-${Date.now()}`;
  
  const newArticle: JournalArticle = {
    id: newId,
    title: article.title || 'Untitled Post',
    slug: newSlug,
    category: article.category || 'News',
    excerpt: article.excerpt || '',
    content: article.content || '',
    cover_image: article.cover_image || '',
    is_published: article.is_published ?? true,
    published_date: article.published_date || new Date().toISOString().split('T')[0],
  };

  articles.unshift(newArticle);
  saveJournalData(articles);
  return newArticle;
}

/**
 * Toggle journal article published status
 */
export async function toggleJournalPublishStatus(id: string, is_published: boolean): Promise<boolean> {
  const articles = ensureJournalFile();
  const idx = articles.findIndex((a) => a.id === id);
  if (idx === -1) return false;

  articles[idx].is_published = is_published;
  saveJournalData(articles);
  return true;
}

/**
 * Delete journal article
 */
export async function deleteJournalArticle(id: string): Promise<boolean> {
  let articles = ensureJournalFile();
  const initLen = articles.length;
  articles = articles.filter((a) => a.id !== id);
  saveJournalData(articles);
  return articles.length < initLen;
}
