import React from 'react';
import MediaManager from './MediaManager';

export const metadata = {
  title: '미디어 라이브러리 CDN | 송영민푸드 관리자',
  description: '송영민푸드 고화질 이미지 및 MP4 동영상 파일 안전 업로드 & 1-Click CDN URL 복사.',
};

export default function AdminMediaPage() {
  return <MediaManager />;
}
