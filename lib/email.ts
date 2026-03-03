import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.lionandsuntech.org',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, // SSL
  auth: {
    user: process.env.SMTP_USER || 'contact@lionandsuntech.org',
    pass: process.env.SMTP_PASS || '',
  },
});

interface MemberDetails {
  fullName: string;
  email: string;
  organization: string;
  expertise: string;
  projectsInterest: string;
  securityLevel: string;
  createdAt: string;
}

const securityLevelLabels: Record<string, string> = {
  publicAdvocate: 'Public Advocate',
  discreteContributor: 'Discrete Contributor',
  confidentialMember: 'Confidential Member',
};

export async function sendNewMemberEmail(member: MemberDetails): Promise<void> {
  const to = process.env.NOTIFY_EMAIL || 'contact@lionandsuntech.org';

  const htmlBody = `
    <div style="font-family: monospace; background: #0a0a0a; color: #4ade80; padding: 24px; border: 1px solid #22c55e33; border-radius: 8px;">
      <h2 style="color: #4ade80; margin-top: 0;">[+] New Member Joined</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 12px; color: #86efac; font-weight: bold;">Name</td><td style="padding: 8px 12px; color: #d1fae5;">${member.fullName}</td></tr>
        <tr><td style="padding: 8px 12px; color: #86efac; font-weight: bold;">Email</td><td style="padding: 8px 12px; color: #d1fae5;"><a href="mailto:${member.email}" style="color: #4ade80;">${member.email}</a></td></tr>
        <tr><td style="padding: 8px 12px; color: #86efac; font-weight: bold;">Organization</td><td style="padding: 8px 12px; color: #d1fae5;">${member.organization || '—'}</td></tr>
        <tr><td style="padding: 8px 12px; color: #86efac; font-weight: bold;">Expertise</td><td style="padding: 8px 12px; color: #d1fae5;">${member.expertise || '—'}</td></tr>
        <tr><td style="padding: 8px 12px; color: #86efac; font-weight: bold;">Projects Interest</td><td style="padding: 8px 12px; color: #d1fae5;">${member.projectsInterest || '—'}</td></tr>
        <tr><td style="padding: 8px 12px; color: #86efac; font-weight: bold;">Security Level</td><td style="padding: 8px 12px; color: #d1fae5;">${securityLevelLabels[member.securityLevel] || member.securityLevel}</td></tr>
        <tr><td style="padding: 8px 12px; color: #86efac; font-weight: bold;">Joined</td><td style="padding: 8px 12px; color: #d1fae5;">${new Date(member.createdAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</td></tr>
      </table>
    </div>
  `;

  const textBody = `
New Member Joined
-----------------
Name: ${member.fullName}
Email: ${member.email}
Organization: ${member.organization || '—'}
Expertise: ${member.expertise || '—'}
Projects Interest: ${member.projectsInterest || '—'}
Security Level: ${securityLevelLabels[member.securityLevel] || member.securityLevel}
Joined: ${member.createdAt}
  `.trim();

  await transporter.sendMail({
    from: `"LSTA Membership" <${process.env.SMTP_USER || 'contact@lionandsuntech.org'}>`,
    to,
    subject: `[LSTA] New Member: ${member.fullName}`,
    text: textBody,
    html: htmlBody,
  });
}
