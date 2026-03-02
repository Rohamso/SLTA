import { NextRequest, NextResponse } from 'next/server';
import { getMembers, getStatistics } from '@/lib/members';

const DASHBOARD_TOKEN = process.env.DASHBOARD_TOKEN || 'LSTA-Dashboard-2024';

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-dashboard-token');
  
  if (token !== DASHBOARD_TOKEN) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const members = getMembers();
    return NextResponse.json(members);
  } catch (error) {
    console.error('Error reading members:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  const token = request.headers.get('x-dashboard-token');
  
  if (token !== DASHBOARD_TOKEN) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const action = request.nextUrl.searchParams.get('action');
    
    if (action === 'statistics') {
      const stats = getStatistics();
      return NextResponse.json(stats);
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error getting statistics:', error);
    return NextResponse.json(
      { error: 'Failed to get statistics' },
      { status: 500 }
    );
  }
}

