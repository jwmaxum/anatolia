import productsData from '@/../data/products.json';
import { ProductItem } from '@/lib/types';
import ProductDetailClient from './ProductDetailClient';

export function generateStaticParams() {
  const products = productsData as ProductItem[];
  return products.map((p) => ({
    id: p.id,
  }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;
  const products = productsData as ProductItem[];

  const product = products.find((p) => p.id === productId) || products[0];

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.collection === product.collection)
    .slice(0, 3);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
