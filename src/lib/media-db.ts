import fs from 'fs';
import path from 'path';
import { MediaItem } from './types';

const MEDIA_DATA_PATH = path.join(process.cwd(), 'data', 'media-library.json');

const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'media-1',
    name: 'hero-olive-oil-pour.mp4',
    url: 'https://cdn.coverr.co/videos/coverr-pouring-extra-virgin-olive-oil-5421/1080p.mp4',
    type: 'video',
    size: '12.4 MB',
    created_at: new Date().toISOString(),
  },
  {
    id: 'media-2',
    name: 'tuscan-evoo-bottle-hd.jpg',
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    size: '2.1 MB',
    created_at: new Date().toISOString(),
  },
  {
    id: 'media-3',
    name: 'parmigiano-reggiano-36m-block.jpg',
    url: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    size: '3.4 MB',
    created_at: new Date().toISOString(),
  },
  {
    id: 'media-4',
    name: 'piedmont-black-truffle-oil.jpg',
    url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80',
    type: 'image',
    size: '1.8 MB',
    created_at: new Date().toISOString(),
  },
];

function ensureMediaFile(): MediaItem[] {
  if (!fs.existsSync(path.dirname(MEDIA_DATA_PATH))) {
    fs.mkdirSync(path.dirname(MEDIA_DATA_PATH), { recursive: true });
  }

  if (!fs.existsSync(MEDIA_DATA_PATH)) {
    saveMediaData(INITIAL_MEDIA_ITEMS);
    return INITIAL_MEDIA_ITEMS;
  }

  try {
    const fileData = fs.readFileSync(MEDIA_DATA_PATH, 'utf-8');
    const parsed = JSON.parse(fileData) as MediaItem[];
    if (!parsed || parsed.length === 0) {
      saveMediaData(INITIAL_MEDIA_ITEMS);
      return INITIAL_MEDIA_ITEMS;
    }
    return parsed;
  } catch (error) {
    console.error('Error reading media-library.json:', error);
    saveMediaData(INITIAL_MEDIA_ITEMS);
    return INITIAL_MEDIA_ITEMS;
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
