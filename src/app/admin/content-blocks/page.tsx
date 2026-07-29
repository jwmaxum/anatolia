import React from 'react';
import ContentBlockManager from './ContentBlockManager';

export const metadata = {
  title: 'Content Block Editor | Anatolia Admin',
  description: 'Manage section headlines, subtitles, descriptions and media assets.',
};

export default function AdminContentBlocksPage() {
  return <ContentBlockManager />;
}
