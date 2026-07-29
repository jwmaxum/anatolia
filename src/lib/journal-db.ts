import fs from 'fs';
import path from 'path';
import { JournalArticle } from './types';

const JOURNAL_DATA_PATH = path.join(process.cwd(), 'data', 'journal.json');

function ensureJournalFile(): JournalArticle[] {
  if (!fs.existsSync(path.dirname(JOURNAL_DATA_PATH))) {
    fs.mkdirSync(path.dirname(JOURNAL_DATA_PATH), { recursive: true });
  }

  if (!fs.existsSync(JOURNAL_DATA_PATH)) {
    return [];
  }

  try {
    const fileData = fs.readFileSync(JOURNAL_DATA_PATH, 'utf-8');
    return JSON.parse(fileData) as JournalArticle[];
  } catch (error) {
    console.error('Error reading journal.json:', error);
    return [];
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
