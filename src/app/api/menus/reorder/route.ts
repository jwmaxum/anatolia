import { NextRequest, NextResponse } from 'next/server';
import { reorderMenus } from '@/lib/menus-db';
import { ReorderItemPayload } from '@/lib/types';

export const dynamic = 'force-static';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items = body.items as ReorderItemPayload[];

    if (!Array.isArray(items)) {
      return NextResponse.json({ success: false, error: 'Invalid items array' }, { status: 400 });
    }

    const ok = await reorderMenus(items);
    return NextResponse.json({ success: ok });
  } catch (error) {
    console.error('API POST /api/menus/reorder error:', error);
    return NextResponse.json({ success: false, error: 'Failed to reorder menus' }, { status: 500 });
  }
}
