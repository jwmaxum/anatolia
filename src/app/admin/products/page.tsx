import React from 'react';
import ProductManager from './ProductManager';

export const metadata = {
  title: 'Product CRUD & Image Upload | Anatolia Admin',
  description: 'Manage collection tile products, 4-attribute metadata and gallery images.',
};

export default function AdminProductsPage() {
  return <ProductManager />;
}
