import React from 'react';
import ProductManager from './ProductManager';

export const metadata = {
  title: 'K-푸드 & 주류 제품 관리 | 송영민푸드 관리자',
  description: '송영민푸드 K-냉동식품 및 K-주류 카탈로그, 4대 특성(용량/가공/풍미/원산지) 및 이미지 CRUD 관리.',
};

export default function AdminProductsPage() {
  return <ProductManager />;
}
