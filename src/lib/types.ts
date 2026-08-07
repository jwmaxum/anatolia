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
  category: 'News' | 'Event' | 'Architecture' | 'Design' | '뉴스' | 'K-레시피' | string;
  content: string; // Markdown / Text content
  excerpt: string;
  cover_image: string;
  is_published: boolean;
  published_date: string;
}

export interface ProductItem {
  id: string;
  name: string;
  collection: string;
  category?: string;
  price?: number;
  original_price?: number | null;
  stock?: number;
  rating?: number;
  reviews_count?: number;
  sku?: string;
  format: string;
  finish: string;
  color: string;
  look: string;
  image_url: string;
  description: string;
  thickness?: string;
  origin?: string;
  is_featured?: boolean;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  selectedFormat?: string;
  selectedFinish?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  addresses?: ShippingAddress[];
}

export interface ShippingAddress {
  id: string;
  title: string; // e.g. "Home", "Office"
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  format?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: 'credit_card' | 'bank_transfer' | 'kakao_pay';
}


