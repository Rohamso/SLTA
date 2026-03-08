import { NextRequest, NextResponse } from 'next/server';
import {
  getImpressionSnapshot,
  normalizeLocale,
  normalizePathname,
  recordImpression,
} from '@/lib/impressionStats';

export const dynamic = 'force-dynamic';

interface ImpressionPayload {
  pathname?: string;
  locale?: string;
}

function parseInteger(value: string | null, fallback: number, min: number, max: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
}

export async function GET(request: NextRequest) {
  try {
    const recentDays = parseInteger(request.nextUrl.searchParams.get('days'), 30, 1, 120);
    const topPages = parseInteger(request.nextUrl.searchParams.get('top'), 20, 1, 100);
    const snapshot = await getImpressionSnapshot({ recentDays, topPages });

    return NextResponse.json(snapshot, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Failed to load impression stats:', error);
    return NextResponse.json(
      { error: 'Failed to load impression stats', detail: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ImpressionPayload;
    const locale = normalizeLocale(body.locale);

    if (!locale) {
      return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
    }

    const pathname = normalizePathname(body.pathname, locale);
    if (!pathname) {
      return NextResponse.json({ error: 'Invalid pathname' }, { status: 400 });
    }

    const snapshot = await recordImpression(pathname, locale);
    return NextResponse.json(
      { success: true, totals: snapshot.totals, updatedAt: snapshot.updatedAt },
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Failed to record impression:', error);
    return NextResponse.json(
      { error: 'Failed to record impression', detail: String(error) },
      { status: 500 }
    );
  }
}
