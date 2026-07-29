import fs from 'fs';
import path from 'path';
import { MediaItem } from './types';

const MEDIA_DATA_PATH = path.join(process.cwd(), 'data', 'media-library.json');

function ensureMediaFile(): MediaItem[] {
  if (!fs.existsSync(path.dirname(MEDIA_DATA_PATH))) {
    fs.mkdirSync(path.dirname(MEDIA_DATA_PATH), { recursive: true });
  }

  if (!fs.existsSync(MEDIA_DATA_PATH)) {
    return [];
  }

  try {
    const fileData = fs.readFileSync(MEDIA_DATA_PATH, 'utf-8');
    return JSON.parse(fileData) as MediaItem[];
  } catch (error) {
    console.error('Error reading media-library.json:', error);
    return [];
  }
}

function saveMediaData(items: MediaItem[]) {
  if (!fs.existsSync(path.dirname(MEDIA_DATA_PATH))) {
    fs.mkdirSync(path.dirname(MEDIA_DATA_PATH), { recursive: true });
  }
  fs.writeFileSync(MEDIA_DATA_PATH, JSON.stringify(items, null, 2), 'utf-8');
}

export async function getMediaItems(type?: 'image' | 'video'): Promise<MediaItem[]> {
  const items = ensureMediaFile();
  if (type) {
    return items.filter((i) => i.type === type);
  }
  return items;
}

export async function addMediaItem(item: Omit<MediaItem, 'id' | 'created_at'>): Promise<MediaItem> {
  const items = ensureMediaFile();
  const newItem: MediaItem = {
    ...item,
    id: `media-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  items.unshift(newItem);
  saveMediaData(items);
  return newItem;
}

export async function deleteMediaItem(id: string): Promise<boolean> {
  let items = ensureMediaFile();
  const initLen = items.length;
  items = items.filter((i) => i.id !== id);
  saveMediaData(items);
  return items.length < initLen;
}
