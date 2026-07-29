import fs from 'fs';
import path from 'path';
import { MenuItem, ReorderItemPayload } from './types';

const DATA_PATH = path.join(process.cwd(), 'data', 'menus.json');

// Helper to ensure data folder & file exist
function ensureDataFile(): MenuItem[] {
  if (!fs.existsSync(path.dirname(DATA_PATH))) {
    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  }

  if (!fs.existsSync(DATA_PATH)) {
    return [];
  }

  try {
    const fileData = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(fileData) as MenuItem[];
  } catch (error) {
    console.error('Error reading menus.json:', error);
    return [];
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
