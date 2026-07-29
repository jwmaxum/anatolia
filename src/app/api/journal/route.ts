import { NextRequest, NextResponse } from 'next/server';
import {
  getJournalArticles,
  getJournalBySlug,
  saveJournalArticle,
  toggleJournalPublishStatus,
  deleteJournalArticle,
} from '@/lib/journal-db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode');
    const slug = searchParams.get('slug');

    if (slug) {
      const article = await getJournalBySlug(slug);
      return NextResponse.json({ success: true, data: article });
    }

    const isPublishedOnly = mode !== 'admin';
    const articles = await getJournalArticles(isPublishedOnly);
    return NextResponse.json({ success: true, count: articles.length, data: articles });
  } catch (error) {
    console.error('API GET /api/journal error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch journal articles' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, is_published } = body;

    if (!id || typeof is_published !== 'boolean') {
      return NextResponse.json({ success: false, error: 'Invalid parameters' }, { status: 400 });
    }

    const ok = await toggleJournalPublishStatus(id, is_published);
    return NextResponse.json({ success: ok });
  } catch (error) {
    console.error('API PATCH /api/journal error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update publish status' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const saved = await saveJournalArticle(body);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error('API POST /api/journal error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save journal article' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    const ok = await deleteJournalArticle(id);
    return NextResponse.json({ success: ok });
  } catch (error) {
    console.error('API DELETE /api/journal error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete journal article' }, { status: 500 });
  }
}
