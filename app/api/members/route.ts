import { NextRequest, NextResponse } from 'next/server';
import { getPublicMembers, addMember, type Member } from '@/lib/members';
import { sendNewMemberEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  try {
    const publicMembers = await getPublicMembers();
    return NextResponse.json(publicMembers, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    });
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
    
    // Persist to MongoDB
    await addMember(newMember);

    // Send email notification
    try {
      await sendNewMemberEmail(newMember);
      console.log('Member notification email sent for:', newMember.fullName);
    } catch (emailError) {
      console.error('Failed to send member email:', emailError);
      // Don't fail the request — member was still saved to DB
    }
    
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Error saving member:', error);
    return NextResponse.json(
      { error: 'Failed to save member', detail: String(error) },
      { status: 500 }
    );
  }
}

