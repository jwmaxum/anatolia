import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { addMediaItem } from '@/lib/media-db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(file.name) || (file.type.includes('video') ? '.mp4' : '.jpg');
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadsDir, safeName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeName}`;
    const mediaType = file.type.startsWith('video') ? 'video' : 'image';
    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    const mediaItem = await addMediaItem({
      name: file.name,
      url: publicUrl,
      type: mediaType,
      size: fileSizeMb,
    });

    return NextResponse.json({ success: true, data: mediaItem });
  } catch (error) {
    console.error('File Upload Error:', error);
    return NextResponse.json({ success: false, error: 'File upload failed' }, { status: 500 });
  }
}
