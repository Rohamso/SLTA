import { NextRequest, NextResponse } from 'next/server';
import { sendNewMemberEmail } from '@/lib/email';
import { getMemberCounts, incrementMemberCount, normalizeSecurityLevel } from '@/lib/memberCounts';

export const dynamic = 'force-dynamic';

interface MemberSubmission {
  fullName: string;
  email: string;
  organization: string;
  expertise: string;
  projectsInterest: string;
  securityLevel: string;
}

export async function GET() {
  try {
    const counts = await getMemberCounts();
    return NextResponse.json({ counts }, { status: 200 });
  } catch (error) {
    console.error('Error loading member counts:', error);
    return NextResponse.json(
      { error: 'Failed to load member counts', detail: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as MemberSubmission;
    const securityLevel = normalizeSecurityLevel(body.securityLevel);

    if (!securityLevel) {
      return NextResponse.json(
        { error: 'Invalid security level' },
        { status: 400 }
      );
    }

    const member = {
      ...body,
      securityLevel,
      id: `member_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // Send email notification with member details
    await sendNewMemberEmail(member);
    console.log('Member notification email sent for:', member.fullName);
    const counts = await incrementMemberCount(securityLevel);

    return NextResponse.json({ success: true, name: member.fullName, counts }, { status: 201 });
  } catch (error) {
    console.error('Error processing member:', error);
    return NextResponse.json(
      { error: 'Failed to process membership', detail: String(error) },
      { status: 500 }
    );
  }
}
