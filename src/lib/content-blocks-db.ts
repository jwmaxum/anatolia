import fs from 'fs';
import path from 'path';
import { ContentBlock } from './types';

const CONTENT_BLOCKS_PATH = path.join(process.cwd(), 'data', 'content-blocks.json');

function ensureBlocksFile(): ContentBlock[] {
  if (!fs.existsSync(path.dirname(CONTENT_BLOCKS_PATH))) {
    fs.mkdirSync(path.dirname(CONTENT_BLOCKS_PATH), { recursive: true });
  }

  if (!fs.existsSync(CONTENT_BLOCKS_PATH)) {
    return [];
  }

  try {
    const fileData = fs.readFileSync(CONTENT_BLOCKS_PATH, 'utf-8');
    return JSON.parse(fileData) as ContentBlock[];
  } catch (error) {
    console.error('Error reading content-blocks.json:', error);
    return [];
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
