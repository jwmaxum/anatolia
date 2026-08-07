import React from 'react';
import NavigationManager from './NavigationManager';

export const metadata = {
  title: '메뉴 엔진 (GNB & Footer) | 송영민푸드 관리자',
  description: '송영민푸드 Header GNB 2단 메뉴 및 Footer 링크그룹 Drag & Drop 순서변경 및 On/Off 토글.',
};

export default function AdminNavigationPage() {
  return <NavigationManager />;
}
