import React, { Suspense } from 'react';
import { getProducts } from '@/lib/products-db';
import CollectionShowcaseClient from './CollectionShowcaseClient';

export const metadata = {
  title: 'Product Collections & Lookbook | Anatolia',
  description:
    'Explore Anatolia porcelain tiles, natural stone, and sintered slabs. Filter by Format, Surface Finish, Color, and Aesthetic Look.',
};

export default async function CollectionsPage() {
  const initialProducts = await getProducts();

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0c] py-24 text-center text-stone-500">Loading Collections...</div>}>
      <CollectionShowcaseClient
        initialProducts={initialProducts}
      />
    </Suspense>
  );
}
