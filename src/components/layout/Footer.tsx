import React from 'react';
import { getActiveMenusTree } from '@/lib/menus-db';
import FooterClient from './FooterClient';

export default async function Footer() {
  // RSC: Fetch active menu items for footer
  const menus = await getActiveMenusTree('footer');

  return <FooterClient menus={menus} />;
}
