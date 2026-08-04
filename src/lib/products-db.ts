import fs from 'fs';
import path from 'path';
import { ProductItem } from './types';

const PRODUCTS_DATA_PATH = path.join(process.cwd(), 'data', 'products.json');

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'Tuscan Artisanal Organic EVOO Extra Virgin Olive Oil',
    collection: 'Artisanal Pantry',
    category: 'Oil & Vinegar',
    price: 48,
    original_price: 55,
    stock: 120,
    rating: 4.9,
    reviews_count: 34,
    sku: 'ANA-EVOO-500',
    format: '500ml Bottle',
    finish: 'First Cold-Pressed',
    color: 'Emerald Gold',
    look: 'Tuscan Heritage Estate',
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    description: 'First cold-pressed extra virgin olive oil harvested from 200-year-old organic Tuscan olive groves.',
    thickness: '500ml',
    origin: 'Tuscany, Italy',
    is_featured: true,
  },
  {
    id: 'prod-2',
    name: '36-Month Aged DOP Parmigiano Reggiano Wheel Chunk',
    collection: 'Dairy & Charcuterie',
    category: 'Artisanal Cheese',
    price: 65,
    original_price: 75,
    stock: 45,
    rating: 5.0,
    reviews_count: 52,
    sku: 'ANA-PARM-36M',
    format: '1kg Block',
    finish: '36-Month Natural Aging',
    color: 'Deep Amber Grain',
    look: 'DOP Parma Certification',
    image_url: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=80',
    description: 'Intense crystalline crunch and complex nutty umami aromas aged in stone cellars in Emilia-Romagna.',
    thickness: '1 kg',
    origin: 'Parma, Italy',
    is_featured: true,
  },
  {
    id: 'prod-3',
    name: 'Piedmont Black Winter Truffle Infused Condiment Oil',
    collection: 'Artisanal Pantry',
    category: 'Rare Oils',
    price: 82,
    original_price: 95,
    stock: 30,
    rating: 4.8,
    reviews_count: 19,
    sku: 'ANA-TRUF-250',
    format: '250ml Glass Dropper',
    finish: 'Infused & Filtered',
    color: 'Rich Amber',
    look: 'Piedmont Artisan',
    image_url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    description: 'Infused with real wild Tuber melanosporum truffles harvested from Alba oak forests.',
    thickness: '250ml',
    origin: 'Alba, Italy',
    is_featured: true,
  },
  {
    id: 'prod-4',
    name: 'Aceto Balsamico Tradizionale di Modena DOP (25-Year Extravecchio)',
    collection: 'Artisanal Pantry',
    category: 'Balsamic Vinegar',
    price: 140,
    original_price: 160,
    stock: 15,
    rating: 5.0,
    reviews_count: 28,
    sku: 'ANA-BAL-25Y',
    format: '100ml Consortium Bottle',
    finish: '25-Year Barrel Aged',
    color: 'Velvet Dark Mahogany',
    look: 'DOP Consortium Sealed',
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    description: 'Aged in oak, chestnut, mulberry, and juniper battery casks according to 300-year-old family traditions.',
    thickness: '100ml',
    origin: 'Modena, Italy',
    is_featured: false,
  },
  {
    id: 'prod-5',
    name: 'Jamón Ibérico de Bellota 100% Pata Negra (Hand-Sliced)',
    collection: 'Dairy & Charcuterie',
    category: 'Charcuterie',
    price: 95,
    original_price: 110,
    stock: 50,
    rating: 4.9,
    reviews_count: 41,
    sku: 'ANA-PAT-100G',
    format: '100g Vacuum Pack',
    finish: '48-Month Acorn Cured',
    color: 'Ruby Red & Marbled Fat',
    look: 'Jabugo DOP Black Label',
    image_url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    description: '100% free-range acorn-fed pure Iberian pigs aged for 4 years in natural mountain bodegas.',
    thickness: '100g',
    origin: 'Jabugo, Spain',
    is_featured: true,
  },
  {
    id: 'prod-6',
    name: 'Sicilian Organic Wildflower Blossom Honey & Sea Salt Flakes',
    collection: 'Fresh & Gourmet',
    category: 'Gourmet Condiment',
    price: 32,
    original_price: null,
    stock: 80,
    rating: 4.7,
    reviews_count: 15,
    sku: 'ANA-HON-350',
    format: '350g Jar',
    finish: 'Unfiltered Cold-Extracted',
    color: 'Golden Topaz',
    look: 'Sicilian Artisan Estate',
    image_url: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=80',
    description: 'Raw unheated nectar gathered from Mount Etna slopes paired with sun-evaporated Trapani salt crystals.',
    thickness: '350g',
    origin: 'Sicily, Italy',
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
