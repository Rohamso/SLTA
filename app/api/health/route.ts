import { NextResponse } from 'next/server';
import { getDataFileStatus } from '@/lib/members';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = getDataFileStatus();
    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      env: process.env.NODE_ENV,
      dataFile: status,
    }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: String(error),
    }, { status: 500 });
  }
}
