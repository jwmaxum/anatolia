import fs from 'fs';
import path from 'path';
import { ProductItem } from './types';

const PRODUCTS_DATA_PATH = path.join(process.cwd(), 'data', 'products.json');

function ensureProductsFile(): ProductItem[] {
  if (!fs.existsSync(path.dirname(PRODUCTS_DATA_PATH))) {
    fs.mkdirSync(path.dirname(PRODUCTS_DATA_PATH), { recursive: true });
  }

  if (!fs.existsSync(PRODUCTS_DATA_PATH)) {
    return [];
  }

  try {
    const fileData = fs.readFileSync(PRODUCTS_DATA_PATH, 'utf-8');
    return JSON.parse(fileData) as ProductItem[];
  } catch (error) {
    console.error('Error reading products.json:', error);
    return [];
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
