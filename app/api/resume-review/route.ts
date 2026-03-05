import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.lionandsuntech.org',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'contact@lionandsuntech.org',
    pass: process.env.SMTP_PASS || '',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const country = formData.get('country') as string;
    const resumeFile = formData.get('resume') as File | null;

    // Validation
    if (!fullName || !email || !country || !resumeFile) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (resumeFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(resumeFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PDF, DOC, or DOCX.' },
        { status: 400 }
      );
    }

    // Read file into buffer
    const fileBuffer = Buffer.from(await resumeFile.arrayBuffer());

    const fromAddress = process.env.SMTP_USER || 'contact@lionandsuntech.org';
    const notifyTo = process.env.NOTIFY_EMAIL || 'contact@lionandsuntech.org';

    // 1. Send notification email to the team (with resume attached)
    await transporter.sendMail({
      from: `"LSTA Services" <${fromAddress}>`,
      to: notifyTo,
      subject: `[LSTA] Resume Review Request: ${fullName}`,
      text: [
        'New Resume Review Request',
        '========================',
        `Name: ${fullName}`,
        `Email: ${email}`,
        `Target Country: ${country}`,
        `Submitted: ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}`,
        '',
        'Resume is attached to this email.',
      ].join('\n'),
      html: `
        <div style="font-family: monospace; background: #0a0a0a; color: #4ade80; padding: 24px; border: 1px solid #22c55e33; border-radius: 8px;">
          <h2 style="color: #4ade80; margin-top: 0;">[+] New Resume Review Request</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 12px; color: #86efac; font-weight: bold;">Name</td><td style="padding: 8px 12px; color: #d1fae5;">${fullName}</td></tr>
            <tr><td style="padding: 8px 12px; color: #86efac; font-weight: bold;">Email</td><td style="padding: 8px 12px; color: #d1fae5;"><a href="mailto:${email}" style="color: #4ade80;">${email}</a></td></tr>
            <tr><td style="padding: 8px 12px; color: #86efac; font-weight: bold;">Target Country</td><td style="padding: 8px 12px; color: #d1fae5;">${country}</td></tr>
            <tr><td style="padding: 8px 12px; color: #86efac; font-weight: bold;">Submitted</td><td style="padding: 8px 12px; color: #d1fae5;">${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</td></tr>
          </table>
          <p style="color: #86efac; margin-top: 16px; font-size: 14px;">📎 Resume attached below.</p>
        </div>
      `,
      attachments: [
        {
          filename: resumeFile.name,
          content: fileBuffer,
          contentType: resumeFile.type,
        },
      ],
    });

    // 2. Send auto-reply to the applicant
    await transporter.sendMail({
      from: `"Lion & Sun Tech Association" <${fromAddress}>`,
      to: email,
      subject: 'Thank You — Resume Received | Lion & Sun Tech Association',
      text: [
        `Dear ${fullName},`,
        '',
        'Thank you for submitting your resume for review!',
        '',
        `We have received your resume for your job search in ${country}. Our team of experienced reviewers will carefully review your resume and provide detailed, actionable feedback.`,
        '',
        'You can expect to hear back from us within 10 business days.',
        '',
        'If you have any questions in the meantime, feel free to reply to this email.',
        '',
        'Best regards,',
        'Lion & Sun Tech Association',
        'https://lionandsuntech.org',
      ].join('\n'),
      html: `
        <div style="font-family: 'Courier New', monospace; background: #0a0a0a; color: #d1fae5; padding: 32px; border: 1px solid #22c55e33; border-radius: 12px; max-width: 600px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #4ade80; font-size: 20px; margin: 0;">Lion & Sun Tech Association</h1>
            <p style="color: #86efac80; font-size: 12px; margin: 4px 0 0;">Community Services</p>
          </div>
          <hr style="border: none; border-top: 1px solid #22c55e33; margin: 16px 0;" />
          <p style="color: #d1fae5; font-size: 15px;">Dear <strong style="color: #4ade80;">${fullName}</strong>,</p>
          <p style="color: #bbf7d0cc; font-size: 14px; line-height: 1.7;">
            Thank you for submitting your resume for review! We have received your resume for your job search in <strong style="color: #4ade80;">${country}</strong>.
          </p>
          <p style="color: #bbf7d0cc; font-size: 14px; line-height: 1.7;">
            Our team of experienced reviewers will carefully review your resume and provide detailed, actionable feedback to help strengthen your application.
          </p>
          <div style="background: #052e16; border: 1px solid #22c55e44; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="color: #4ade80; font-size: 14px; margin: 0; font-weight: bold;">⏱ Expected Response Time</p>
            <p style="color: #d1fae5; font-size: 14px; margin: 8px 0 0;">You can expect to hear back from us within <strong>10 business days</strong>.</p>
          </div>
          <p style="color: #bbf7d0cc; font-size: 14px; line-height: 1.7;">
            If you have any questions in the meantime, feel free to reply to this email.
          </p>
          <p style="color: #bbf7d0cc; font-size: 14px; margin-top: 24px;">
            Best regards,<br/>
            <strong style="color: #4ade80;">Lion & Sun Tech Association</strong>
          </p>
          <hr style="border: none; border-top: 1px solid #22c55e33; margin: 24px 0 12px;" />
          <p style="color: #86efac40; font-size: 11px; text-align: center;">
            <a href="https://lionandsuntech.org" style="color: #4ade8080;">lionandsuntech.org</a>
          </p>
        </div>
      `,
    });

    console.log('Resume review request processed for:', fullName, '→', country);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Resume review error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.', detail: String(error) },
      { status: 500 }
    );
  }
}
