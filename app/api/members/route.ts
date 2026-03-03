import { NextRequest, NextResponse } from 'next/server';
import { sendNewMemberEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

interface MemberSubmission {
  fullName: string;
  email: string;
  organization: string;
  expertise: string;
  projectsInterest: string;
  securityLevel: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as MemberSubmission;

    const member = {
      ...body,
      id: `member_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // Send email notification with member details
    await sendNewMemberEmail(member);
    console.log('Member notification email sent for:', member.fullName);

    return NextResponse.json({ success: true, name: member.fullName }, { status: 201 });
  } catch (error) {
    console.error('Error processing member:', error);
    return NextResponse.json(
      { error: 'Failed to process membership', detail: String(error) },
      { status: 500 }
    );
  }
}

