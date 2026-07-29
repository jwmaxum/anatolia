import React from 'react';
import { getActiveMenusTree } from '@/lib/menus-db';
import HeaderClient from './HeaderClient';

export default async function Header() {
  // RSC: Fetch active menu items from DB (is_active = true)
  const menus = await getActiveMenusTree('header');

  return <HeaderClient menus={menus} />;
}
