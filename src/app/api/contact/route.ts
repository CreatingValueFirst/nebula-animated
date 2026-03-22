import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Force dynamic - don't try to prerender this route
export const dynamic = 'force-dynamic';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY not configured');
  return new Resend(key);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: 'Heaven Interactive <onboarding@resend.dev>',
      to: ['info@heaven-interactive.com'],
      replyTo: email,
      subject: `New inquiry from ${name}${company ? ` (${company})` : ''}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0a0a0f; color: #e8e8ec; border-radius: 12px;">
          <div style="border-bottom: 1px solid rgba(45, 138, 138, 0.3); padding-bottom: 20px; margin-bottom: 24px;">
            <h1 style="margin: 0; font-size: 24px; color: #2d8a8a; letter-spacing: 0.1em;">HEAVEN INTERACTIVE</h1>
            <p style="margin: 4px 0 0; font-size: 13px; color: #888;">New Contact Form Submission</p>
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #888; width: 120px; vertical-align: top;">Name</td>
              <td style="padding: 8px 0; color: #fff;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888; vertical-align: top;">Email</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2d8a8a;">${email}</a></td>
            </tr>
            ${company ? `<tr>
              <td style="padding: 8px 0; color: #888; vertical-align: top;">Company</td>
              <td style="padding: 8px 0; color: #fff;">${company}</td>
            </tr>` : ''}
            ${service ? `<tr>
              <td style="padding: 8px 0; color: #888; vertical-align: top;">Service</td>
              <td style="padding: 8px 0; color: #fff;">${service}</td>
            </tr>` : ''}
          </table>

          <div style="margin-top: 20px; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 3px solid #2d8a8a;">
            <p style="margin: 0 0 4px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em;">Message</p>
            <p style="margin: 0; color: #e8e8ec; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
            <p style="margin: 0; font-size: 11px; color: #555;">Sent from heaveninteractive.net contact form</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
