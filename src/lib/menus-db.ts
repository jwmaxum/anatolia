import fs from 'fs';
import path from 'path';
import { MenuItem, ReorderItemPayload } from './types';

const DATA_PATH = path.join(process.cwd(), 'data', 'menus.json');

// Anatolia 실제 사이트 Header & Footer 메뉴 데이터 (404 방지 & 스크린샷 1:1 반영)
const INITIAL_MENUS: MenuItem[] = [
  // Header Menus (Depth 1)
  {
    id: 'menu-hdr-1',
    title: 'Fresh & Gourmet',
    url: '/collections?cat=fresh',
    parent_id: null,
    sort_order: 1,
    is_active: true,
    position: 'header',
    badge: 'ORGANIC',
  },
  {
    id: 'menu-hdr-2',
    title: 'Artisanal Pantry',
    url: '/collections?cat=pantry',
    parent_id: null,
    sort_order: 2,
    is_active: true,
    position: 'header',
    badge: 'HERITAGE',
  },
  {
    id: 'menu-hdr-3',
    title: 'Dairy & Charcuterie',
    url: '/collections?cat=dairy',
    parent_id: null,
    sort_order: 3,
    is_active: true,
    position: 'header',
    badge: 'AGED DOP',
  },
  {
    id: 'menu-hdr-4',
    title: 'About Anatolia Gourmet',
    url: '/about',
    parent_id: null,
    sort_order: 4,
    is_active: true,
    position: 'header',
  },
  {
    id: 'menu-hdr-5',
    title: 'Contact',
    url: '/contact',
    parent_id: null,
    sort_order: 5,
    is_active: true,
    position: 'header',
  },
  {
    id: 'menu-hdr-6',
    title: 'Shop',
    url: '/shop',
    parent_id: null,
    sort_order: 6,
    is_active: true,
    position: 'header',
  },
  {
    id: 'menu-hdr-7',
    title: 'Journal',
    url: '/journal',
    parent_id: null,
    sort_order: 7,
    is_active: true,
    position: 'header',
  },

  // Fresh & Gourmet Sub-Menus (Depth 2)
  {
    id: 'menu-sub-1',
    title: 'Organic Olive Oils',
    url: '/collections?cat=fresh#oil',
    parent_id: 'menu-hdr-1',
    sort_order: 1,
    is_active: true,
    position: 'header',
  },
  {
    id: 'menu-sub-2',
    title: 'Wild Harvest Truffles',
    url: '/collections?cat=fresh#truffle',
    parent_id: 'menu-hdr-1',
    sort_order: 2,
    is_active: true,
    position: 'header',
  },

  // Artisanal Pantry Sub-Menus (Depth 2)
  {
    id: 'menu-sub-3',
    title: 'Aged Modena Vinegars',
    url: '/collections?cat=pantry#balsamic',
    parent_id: 'menu-hdr-2',
    sort_order: 1,
    is_active: true,
    position: 'header',
  },
  {
    id: 'menu-sub-4',
    title: 'Raw Blossom Honey',
    url: '/collections?cat=pantry#honey',
    parent_id: 'menu-hdr-2',
    sort_order: 2,
    is_active: true,
    position: 'header',
  },

  // Dairy & Charcuterie Sub-Menus (Depth 2)
  {
    id: 'menu-sub-5',
    title: '36-Month DOP Cheeses',
    url: '/collections?cat=dairy#cheese',
    parent_id: 'menu-hdr-3',
    sort_order: 1,
    is_active: true,
    position: 'header',
  },
  {
    id: 'menu-sub-6',
    title: 'Pure Iberico Hams',
    url: '/collections?cat=dairy#ham',
    parent_id: 'menu-hdr-3',
    sort_order: 2,
    is_active: true,
    position: 'header',
  },

  // Footer Menus (Depth 1)
  {
    id: 'menu-ftr-1',
    title: 'About Anatolia Gourmet',
    url: '/about',
    parent_id: null,
    sort_order: 1,
    is_active: true,
    position: 'footer',
  },
  {
    id: 'menu-ftr-2',
    title: 'Organic Certified Estates',
    url: '/collections',
    parent_id: null,
    sort_order: 2,
    is_active: true,
    position: 'footer',
  },
  {
    id: 'menu-ftr-3',
    title: 'Heritage Artisans & Journal',
    url: '/journal',
    parent_id: null,
    sort_order: 3,
    is_active: true,
    position: 'footer',
  },
  {
    id: 'menu-ftr-4',
    title: 'Contact & Customer Support',
    url: '/contact',
    parent_id: null,
    sort_order: 4,
    is_active: true,
    position: 'footer',
  },
  {
    id: 'menu-ftr-5',
    title: 'Shipping & Delivery Policy',
    url: '/checkout',
    parent_id: null,
    sort_order: 5,
    is_active: true,
    position: 'footer',
  },
  {
    id: 'menu-ftr-6',
    title: 'Privacy Policy',
    url: '/privacy',
    parent_id: null,
    sort_order: 6,
    is_active: true,
    position: 'footer',
  },
  {
    id: 'menu-ftr-7',
    title: 'Terms of Service',
    url: '/terms',
    parent_id: null,
    sort_order: 7,
    is_active: true,
    position: 'footer',
  },
];

// Helper to ensure data folder & file exist with initial data fallback
function ensureDataFile(): MenuItem[] {
  if (!fs.existsSync(path.dirname(DATA_PATH))) {
    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  }

  if (!fs.existsSync(DATA_PATH)) {
    saveMenusData(INITIAL_MENUS);
    return INITIAL_MENUS;
  }

  try {
    const fileData = fs.readFileSync(DATA_PATH, 'utf-8');
    const parsed = JSON.parse(fileData) as MenuItem[];
    if (!parsed || parsed.length === 0) {
      saveMenusData(INITIAL_MENUS);
      return INITIAL_MENUS;
    }
    return parsed;
  } catch (error) {
    console.error('Error reading menus.json:', error);
    saveMenusData(INITIAL_MENUS);
    return INITIAL_MENUS;
  }
}

function saveMenusData(items: MenuItem[]) {
  if (!fs.existsSync(path.dirname(DATA_PATH))) {
    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  }
  fs.writeFileSync(DATA_PATH, JSON.stringify(items, null, 2), 'utf-8');
}

/**
 * Get raw menus array from database
 */
export async function getRawMenus(): Promise<MenuItem[]> {
  return ensureDataFile();
}

/**
 * Build 2-Depth menu tree for RSC (Header / Footer) filtering only `is_active === true`
 */
export async function getActiveMenusTree(position?: 'header' | 'footer'): Promise<MenuItem[]> {
  const allMenus = await getRawMenus();

  // Filter only active items
  let activeMenus = allMenus.filter((m) => m.is_active);

  if (position) {
    activeMenus = activeMenus.filter((m) => m.position === position || m.position === 'both');
  }

  // Separate Depth 1 (parent_id null) and Depth 2 (has parent_id)
  const depth1 = activeMenus
    .filter((m) => !m.parent_id)
    .sort((a, b) => a.sort_order - b.sort_order);

  const depth2 = activeMenus.filter((m) => m.parent_id);

  // Nest depth 2 into depth 1
  return depth1.map((parent) => {
    const children = depth2
      .filter((child) => child.parent_id === parent.id)
      .sort((a, b) => a.sort_order - b.sort_order);

    return {
      ...parent,
      children: children.length > 0 ? children : undefined,
    };
  });
}

/**
 * Build 2-Depth menu tree for Admin Manager (Includes inactive items)
 */
export async function getAllMenusTree(): Promise<MenuItem[]> {
  const allMenus = await getRawMenus();

  const depth1 = allMenus
    .filter((m) => !m.parent_id)
    .sort((a, b) => a.sort_order - b.sort_order);

  const depth2 = allMenus.filter((m) => m.parent_id);

  return depth1.map((parent) => {
    const children = depth2
      .filter((child) => child.parent_id === parent.id)
      .sort((a, b) => a.sort_order - b.sort_order);

    return {
      ...parent,
      children: children.length > 0 ? children : [],
    };
  });
}

/**
 * Toggle menu is_active status
 */
export async function toggleMenuStatus(id: string, is_active: boolean): Promise<boolean> {
  const allMenus = await getRawMenus();
  const index = allMenus.findIndex((m) => m.id === id);
  if (index === -1) return false;

  allMenus[index].is_active = is_active;
  saveMenusData(allMenus);
  return true;
}

/**
 * Reorder menus (update sort_order for list of items)
 */
export async function reorderMenus(payload: ReorderItemPayload[]): Promise<boolean> {
  const allMenus = await getRawMenus();

  const updateMap = new Map<string, ReorderItemPayload>();
  payload.forEach((item) => updateMap.set(item.id, item));

  const updatedMenus = allMenus.map((menu) => {
    if (updateMap.has(menu.id)) {
      const p = updateMap.get(menu.id)!;
      return {
        ...menu,
        sort_order: p.sort_order,
        ...(p.parent_id !== undefined ? { parent_id: p.parent_id } : {}),
      };
    }
    return menu;
  });

  saveMenusData(updatedMenus);
  return true;
}

/**
 * Add a new menu item
 */
export async function createMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
  const allMenus = await getRawMenus();
  const newId = `menu-${Date.now()}`;
  const newItem: MenuItem = {
    ...item,
    id: newId,
  };

  allMenus.push(newItem);
  saveMenusData(allMenus);
  return newItem;
}

/**
 * Delete a menu item and its children
 */
export async function deleteMenuItem(id: string): Promise<boolean> {
  let allMenus = await getRawMenus();
  // Delete target item and any children with parent_id === id
  allMenus = allMenus.filter((m) => m.id !== id && m.parent_id !== id);
  saveMenusData(allMenus);
  return true;
}
