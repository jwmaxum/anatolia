export interface MenuItem {
  id: string;
  title: string;
  url: string;
  parent_id: string | null; // null for Depth 1, string ID for Depth 2
  sort_order: number;
  is_active: boolean;
  position: 'header' | 'footer' | 'both';
  image_url?: string;
  badge?: string;
  children?: MenuItem[];
}

export interface ReorderItemPayload {
  id: string;
  sort_order: number;
  parent_id?: string | null;
}

export interface HeroSlide {
  id: string;
  media_type: 'image' | 'video';
  media_url: string;
  poster_url?: string;
  title: string;
  subtitle: string;
  cta_label: string;
  cta_url: string;
  sort_order: number;
  is_active: boolean;
}

export interface ContentBlock {
  id: string;
  section_key: string; // e.g. "featured_categories", "brand_philosophy", "banner_alert"
  page: string; // e.g. "home", "about", "collections"
  title: string;
  subtitle: string;
  description: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  badge?: string;
  updated_at?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size?: string;
  created_at: string;
}

export interface JournalArticle {
  id: string;
  title: string;
  slug: string;
  category: 'News' | 'Event' | 'Architecture' | 'Design';
  content: string; // Markdown / Text content
  excerpt: string;
  cover_image: string;
  is_published: boolean;
  published_date: string;
}

export interface ProductItem {
  id: string;
  name: string;
  collection: string; // e.g. "Ceramic + Porcelain", "Natural Stone", "Sintered Slab"
  format: string; // e.g. "60x120 cm", "120x280 cm Slab", "30x60 cm", "Mosaics"
  finish: string; // e.g. "Polished", "Matte", "Honed", "Textured"
  color: string; // e.g. "Bianco", "Nero", "Calacatta Gold", "Travertine", "Beige", "Gray"
  look: string; // e.g. "Marble Look", "Stone Look", "Sintered Slab", "Wood Look", "Onyx Look"
  image_url: string;
  description: string;
  thickness?: string;
  origin?: string;
  is_featured?: boolean;
}

