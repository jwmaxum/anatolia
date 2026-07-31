import React, { Suspense } from 'react';
import { getProducts } from '@/lib/products-db';
import CollectionShowcaseClient from './CollectionShowcaseClient';

export const metadata = {
  title: 'Fine Food Collections & Showcase | Anatolia Gourmet',
  description:
    'Explore Anatolia Gourmet artisanal extra virgin olive oil, DOP cheeses, and organic ingredients. Filter by Size, Processing, Flavor, and Origin.',
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
