import fs from 'fs';
import path from 'path';
import { ContentBlock } from './types';

const CONTENT_BLOCKS_PATH = path.join(process.cwd(), 'data', 'content-blocks.json');

const INITIAL_CONTENT_BLOCKS: ContentBlock[] = [
  {
    id: 'block-1',
    section_key: 'featured_categories',
    page: 'home',
    title: 'Curated Gourmet Collections',
    subtitle: 'Product Categories',
    description: 'From cold-pressed Tuscan EVOO to 36-month DOP Parmigiano Reggiano and wild truffles, each item is imported directly from heritage artisans.',
    badge: 'Fine Foods Showcase',
    media_url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'block-2',
    section_key: 'brand_story',
    page: 'home',
    title: 'Pioneering Heritage Gastronomy.',
    subtitle: 'Leadership & Excellence',
    description: 'Anatolia Gourmet stands at the pinnacle of global fine food sourcing. Guided by 100% sustainable organic farming and direct partnerships with heritage producers across Italy, Spain, and Japan.',
    badge: 'Organic Farm Partnership',
    media_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'block-3',
    section_key: 'banner_alert',
    page: 'home',
    title: 'Complimentary Express Refrigerated Shipping',
    subtitle: 'Worldwide Delivery',
    description: 'Enjoy free temperature-controlled express air shipping on all artisanal cheese & olive oil orders over $200.',
    badge: 'Limited Offer',
    media_url: '',
    media_type: 'image',
    updated_at: new Date().toISOString(),
  },
];

function ensureBlocksFile(): ContentBlock[] {
  if (!fs.existsSync(path.dirname(CONTENT_BLOCKS_PATH))) {
    fs.mkdirSync(path.dirname(CONTENT_BLOCKS_PATH), { recursive: true });
  }

  if (!fs.existsSync(CONTENT_BLOCKS_PATH)) {
    saveBlocksData(INITIAL_CONTENT_BLOCKS);
    return INITIAL_CONTENT_BLOCKS;
  }

  try {
    const fileData = fs.readFileSync(CONTENT_BLOCKS_PATH, 'utf-8');
    const parsed = JSON.parse(fileData) as ContentBlock[];
    if (!parsed || parsed.length === 0) {
      saveBlocksData(INITIAL_CONTENT_BLOCKS);
      return INITIAL_CONTENT_BLOCKS;
    }
    return parsed;
  } catch (error) {
    console.error('Error reading content-blocks.json:', error);
    saveBlocksData(INITIAL_CONTENT_BLOCKS);
    return INITIAL_CONTENT_BLOCKS;
  }
}

function saveBlocksData(items: ContentBlock[]) {
  if (!fs.existsSync(path.dirname(CONTENT_BLOCKS_PATH))) {
    fs.mkdirSync(path.dirname(CONTENT_BLOCKS_PATH), { recursive: true });
  }
  fs.writeFileSync(CONTENT_BLOCKS_PATH, JSON.stringify(items, null, 2), 'utf-8');
}

/**
 * Get all content blocks
 */
export async function getAllContentBlocks(): Promise<ContentBlock[]> {
  return ensureBlocksFile();
}

/**
 * Get content block by section_key
 */
export async function getContentBlockByKey(sectionKey: string): Promise<ContentBlock | null> {
  const blocks = ensureBlocksFile();
  return blocks.find((b) => b.section_key === sectionKey) || null;
}

/**
 * Create or update content block
 */
export async function saveContentBlock(block: Partial<ContentBlock> & { id?: string; section_key: string }): Promise<ContentBlock> {
  const blocks = ensureBlocksFile();

  const now = new Date().toISOString();
  if (block.id) {
    const idx = blocks.findIndex((b) => b.id === block.id);
    if (idx !== -1) {
      blocks[idx] = { ...blocks[idx], ...block, updated_at: now };
      saveBlocksData(blocks);
      return blocks[idx];
    }
  }

  const existingIdx = blocks.findIndex((b) => b.section_key === block.section_key);
  if (existingIdx !== -1) {
    blocks[existingIdx] = { ...blocks[existingIdx], ...block, updated_at: now };
    saveBlocksData(blocks);
    return blocks[existingIdx];
  }

  const newBlock: ContentBlock = {
    id: `block-${Date.now()}`,
    section_key: block.section_key,
    page: block.page || 'home',
    title: block.title || '',
    subtitle: block.subtitle || '',
    description: block.description || '',
    media_url: block.media_url || '',
    media_type: block.media_type || 'image',
    badge: block.badge || '',
    updated_at: now,
  };

  blocks.push(newBlock);
  saveBlocksData(blocks);
  return newBlock;
}
