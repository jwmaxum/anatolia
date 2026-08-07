import fs from 'fs';
import path from 'path';
import { ProductItem } from './types';

const PRODUCTS_DATA_PATH = path.join(process.cwd(), 'data', 'products.json');

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'CJ 비비고 수제 프리미엄 왕교자 만두 (Bibigo Pork & Leek Mandu)',
    collection: 'K-냉동식품',
    category: '만두 & 교자',
    price: 18,
    original_price: 22,
    stock: 150,
    rating: 4.9,
    reviews_count: 88,
    sku: 'KFD-BIBI-MANDU',
    format: '1.05kg Family Pack',
    finish: 'Quick Frozen (-40°C)',
    color: 'Golden Crispy',
    look: 'Hand-Pleated Dumplings',
    image_url: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
    description: '100% 얇은 피 속 국내산 돼지고기와 신선한 부추, 당면이 듬뿍 들어간 대한민국 대표 비비고 왕교자 만두.',
    thickness: '1.05 kg',
    origin: '대한민국 (Korea)',
    is_featured: true,
  },
  {
    id: 'prod-2',
    name: '원소주 프리미엄 증류식 소주 24% (WON SOJU Distilled Spirits)',
    collection: 'K-주류 & 전통주',
    category: '증류식 소주',
    price: 28,
    original_price: 35,
    stock: 80,
    rating: 5.0,
    reviews_count: 124,
    sku: 'KLQ-WON-SOJU-375',
    format: '375ml Glass Bottle',
    finish: '100% Domestic Rice Distillation',
    color: 'Crystal Clear',
    look: 'Artisanal Clay Pot Aged',
    image_url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80',
    description: '100% 국내산 쌀만을 발효하여 옹기 숙성한 부드럽고 깔끔한 풍미의 박재범 원소주 24% 전통 증류주.',
    thickness: '375 ml',
    origin: '원주, 대한민국',
    is_featured: true,
  },
  {
    id: 'prod-3',
    name: 'K-수제 눈꽃 떡볶이 & 모둠튀김 3인분 밀키트 (K-Street Tteokbokki Kit)',
    collection: 'K-냉동식품',
    category: '떡볶이 & 밀키트',
    price: 15,
    original_price: 19,
    stock: 95,
    rating: 4.8,
    reviews_count: 64,
    sku: 'KFD-TTEOK-KIT',
    format: '650g Meal Kit',
    finish: 'Flash Frozen Seasoned Sauce',
    color: 'Rich Crimson Red',
    look: 'Chewy Rice Cake & Assorted Tempura',
    image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    description: '쫄깃한 쌀떡과 매콤달콤 비법 양념소스, 김말이·야채튀김이 어우러진 스트리트 K-떡볶이 수제 밀키트.',
    thickness: '650g',
    origin: '서울, 대한민국',
    is_featured: true,
  },
  {
    id: 'prod-4',
    name: '느린마을 수제 생막걸리 750ml (Slow Village Raw Rice Wine)',
    collection: 'K-주류 & 전통주',
    category: '막걸리 & 탁주',
    price: 14,
    original_price: null,
    stock: 60,
    rating: 4.9,
    reviews_count: 72,
    sku: 'KLQ-SLOW-MAK-750',
    format: '750ml Cold-Chilled Bottle',
    finish: 'No Artificial Sweeteners (Aspartame-Free)',
    color: 'Milky White',
    look: 'Natural Carbonated Rice Ferment',
    image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    description: '인공 감미료 없이 쌀, 누룩, 물만으로 장기 순수 발효시킨 프레시 생막걸리. 부드러운 탄산과 순수한 탄수화물의 단맛.',
    thickness: '750 ml',
    origin: '포천, 대한민국',
    is_featured: false,
  },
  {
    id: 'prod-5',
    name: '크리스피 순살 양념 & 간장 반반 치킨 (K-Fried Chicken Wings)',
    collection: 'K-냉동식품',
    category: '치킨 & 안주',
    price: 24,
    original_price: 29,
    stock: 110,
    rating: 5.0,
    reviews_count: 145,
    sku: 'KFD-CHIK-HALF',
    format: '800g (400g x 2 Packs)',
    finish: 'Double Air-Fried Batter Technology',
    color: 'Glossy Sweet Garlic Soy & Red Glaze',
    look: '100% Domestic Boneless Chicken',
    image_url: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80',
    description: '에어프라이어 15분으로 에어크리스피 겉바속촉 완성! 달콤매콤 양념소스크런치와 단짠 마늘간장치킨 반반 세트.',
    thickness: '800g',
    origin: '대한민국 (Korea)',
    is_featured: true,
  },
  {
    id: 'prod-6',
    name: '하이트 진로 참이슬 후레쉬 소주 (Chamisul Fresh Soju 16.5%)',
    collection: 'K-주류 & 전통주',
    category: '소주',
    price: 9,
    original_price: null,
    stock: 200,
    rating: 4.8,
    reviews_count: 210,
    sku: 'KLQ-JINRO-SOJU-360',
    format: '360ml Glass Bottle',
    finish: 'Bamboo Charcoal Filtered',
    color: 'Crystal Clear',
    look: 'Korea Classic Green Bottle',
    image_url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80',
    description: '대나무 숯 4번 정제로 깨끗하고 이슬 같은 깔끔한 맛! 대한민국 1등 대표 소주 참이슬 후레쉬.',
    thickness: '360 ml',
    origin: '대한민국 (Korea)',
    is_featured: false,
  },
];

function ensureProductsFile(): ProductItem[] {
  if (!fs.existsSync(path.dirname(PRODUCTS_DATA_PATH))) {
    fs.mkdirSync(path.dirname(PRODUCTS_DATA_PATH), { recursive: true });
  }

  if (!fs.existsSync(PRODUCTS_DATA_PATH)) {
    saveProductsData(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }

  try {
    const fileData = fs.readFileSync(PRODUCTS_DATA_PATH, 'utf-8');
    const parsed = JSON.parse(fileData) as ProductItem[];
    if (!parsed || parsed.length === 0) {
      saveProductsData(INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    return parsed;
  } catch (error) {
    console.error('Error reading products.json:', error);
    saveProductsData(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }
}

function saveProductsData(items: ProductItem[]) {
  if (!fs.existsSync(path.dirname(PRODUCTS_DATA_PATH))) {
    fs.mkdirSync(path.dirname(PRODUCTS_DATA_PATH), { recursive: true });
  }
  fs.writeFileSync(PRODUCTS_DATA_PATH, JSON.stringify(items, null, 2), 'utf-8');
}

/**
 * Get all products with optional attribute filter criteria
 */
export async function getProducts(filters?: {
  collection?: string;
  format?: string[];
  finish?: string[];
  color?: string[];
  look?: string[];
  search?: string;
}): Promise<ProductItem[]> {
  let products = ensureProductsFile();

  if (!filters) return products;

  if (filters.collection) {
    products = products.filter(
      (p) => p.collection.toLowerCase() === filters.collection?.toLowerCase()
    );
  }

  if (filters.format && filters.format.length > 0) {
    products = products.filter((p) => filters.format?.includes(p.format));
  }

  if (filters.finish && filters.finish.length > 0) {
    products = products.filter((p) => filters.finish?.includes(p.finish));
  }

  if (filters.color && filters.color.length > 0) {
    products = products.filter((p) => filters.color?.includes(p.color));
  }

  if (filters.look && filters.look.length > 0) {
    products = products.filter((p) => filters.look?.includes(p.look));
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q)
    );
  }

  return products;
}

/**
 * Get single product details by ID
 */
export async function getProductById(id: string): Promise<ProductItem | null> {
  const products = ensureProductsFile();
  return products.find((p) => p.id === id) || null;
}

/**
 * Create or update a product item
 */
export async function saveProduct(product: Partial<ProductItem> & { id?: string }): Promise<ProductItem> {
  const products = ensureProductsFile();

  if (product.id) {
    const idx = products.findIndex((p) => p.id === product.id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...product };
      saveProductsData(products);
      return products[idx];
    }
  }

  const newId = `prod-${Date.now()}`;
  const newProd: ProductItem = {
    id: newId,
    name: product.name || 'New Gourmet Ingredient',
    collection: product.collection || 'Artisanal Pantry',
    format: product.format || '500ml Bottle',
    finish: product.finish || 'Cold-Pressed',
    color: product.color || 'Emerald Gold',
    look: product.look || 'Italian Heritage',
    image_url: product.image_url || '',
    description: product.description || '',
    thickness: product.thickness || '9 mm',
    origin: product.origin || 'Italy',
    is_featured: product.is_featured ?? false,
  };

  products.unshift(newProd);
  saveProductsData(products);
  return newProd;
}

/**
 * Delete a product item
 */
export async function deleteProduct(id: string): Promise<boolean> {
  let products = ensureProductsFile();
  const initLen = products.length;
  products = products.filter((p) => p.id !== id);
  saveProductsData(products);
  return products.length < initLen;
}
