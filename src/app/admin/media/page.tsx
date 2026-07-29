import React from 'react';
import MediaManager from './MediaManager';

export const metadata = {
  title: 'Media Library & File Upload | Anatolia Admin',
  description: 'Upload image and video files directly or manage CDN assets.',
};

export default function AdminMediaPage() {
  return <MediaManager />;
}
