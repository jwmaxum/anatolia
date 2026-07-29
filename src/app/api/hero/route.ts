import { NextRequest, NextResponse } from 'next/server';
import {
  getAllHeroSlides,
  getActiveHeroSlides,
  toggleHeroSlideActive,
  saveHeroSlide,
  deleteHeroSlide,
} from '@/lib/cms-db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode');

    if (mode === 'admin') {
      const slides = await getAllHeroSlides();
      return NextResponse.json({ success: true, data: slides });
    }

    const activeSlides = await getActiveHeroSlides();
    return NextResponse.json({ success: true, data: activeSlides });
  } catch (error) {
    console.error('API GET /api/hero error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch hero slides' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, is_active } = body;

    if (!id || typeof is_active !== 'boolean') {
      return NextResponse.json({ success: false, error: 'Invalid parameters' }, { status: 400 });
    }

    const ok = await toggleHeroSlideActive(id, is_active);
    return NextResponse.json({ success: ok });
  } catch (error) {
    console.error('API PATCH /api/hero error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update slide status' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const saved = await saveHeroSlide(body);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error('API POST /api/hero error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save hero slide' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    const ok = await deleteHeroSlide(id);
    return NextResponse.json({ success: ok });
  } catch (error) {
    console.error('API DELETE /api/hero error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete hero slide' }, { status: 500 });
  }
}
