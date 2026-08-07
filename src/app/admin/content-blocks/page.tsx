import React from 'react';
import ContentBlockManager from './ContentBlockManager';

export const metadata = {
  title: '페이지 섹션 콘텐츠 블록 | 송영민푸드 관리자',
  description: '송영민푸드 메인/서브 페이지 섹션별 타이틀, 서브 카피, 대표 미디어 블록 편집.',
};

export default function AdminContentBlocksPage() {
  return <ContentBlockManager />;
}
