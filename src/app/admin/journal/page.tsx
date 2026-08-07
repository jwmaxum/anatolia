import React from 'react';
import JournalManager from './JournalManager';

export const metadata = {
  title: 'K-레시피 & 저널 아티클 에디터 | 송영민푸드 관리자',
  description: '송영민푸드 한식 레시피, 미식 인사이트, 이벤트 및 블로그 아티클 편집기.',
};

export default function AdminJournalPage() {
  return <JournalManager />;
}
