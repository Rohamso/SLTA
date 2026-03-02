import { NextRequest, NextResponse } from 'next/server';
import { getPublicMembers, addMember, type Member } from '@/lib/members';

export async function GET(_request: NextRequest) {
  try {
    const publicMembers = getPublicMembers();
    return NextResponse.json(publicMembers);
  } catch (error) {
    console.error('Error reading members:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Omit<Member, 'id' | 'createdAt'>;
    
    const newMember: Member = {
      ...body,
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    addMember(newMember);
    
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Error saving member:', error);
    return NextResponse.json(
      { error: 'Failed to save member' },
      { status: 500 }
    );
  }
}

