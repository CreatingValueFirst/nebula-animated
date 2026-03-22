import { NextRequest, NextResponse } from 'next/server';
import { getCalendar } from '@/lib/google-calendar';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, date, startTime, endTime, notes } = body;

    if (!name || !email || !startTime || !endTime) {
      return NextResponse.json({ error: 'name, email, startTime, endTime required' }, { status: 400 });
    }

    const calendar = getCalendar();

    // Create Google Calendar event
    const event = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: `Discovery Call - ${name}`,
        description: `30-minute discovery session with ${name}\nEmail: ${email}${notes ? `\nNotes: ${notes}` : ''}`,
        start: {
          dateTime: startTime,
          timeZone: 'Europe/Sofia',
        },
        end: {
          dateTime: endTime,
          timeZone: 'Europe/Sofia',
        },
        attendees: [{ email }],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 60 },
            { method: 'popup', minutes: 15 },
          ],
        },
        conferenceData: {
          createRequest: {
            requestId: `hi-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      },
      conferenceDataVersion: 1,
      sendUpdates: 'all',
    });

    // Send confirmation email via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      const startDate = new Date(startTime);
      const formattedDate = startDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const formattedTime = startDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Sofia',
      });

      await resend.emails.send({
        from: 'Heaven Interactive <onboarding@resend.dev>',
        to: ['info@heaven-interactive.com'],
        subject: `New Booking: Discovery Call with ${name}`,
        html: `
          <div style="font-family: system-ui; max-width: 500px; padding: 24px; background: #0a0a0f; color: #e8e8ec; border-radius: 12px;">
            <h2 style="color: #2d8a8a; margin: 0 0 16px;">New Discovery Call Booked</h2>
            <p><strong>Client:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${formattedTime} (Sofia)</p>
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
            <p style="margin-top: 16px; color: #888;">A Google Calendar invite has been sent to both parties.</p>
          </div>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      eventId: event.data.id,
      meetLink: event.data.hangoutLink,
    });
  } catch (err) {
    console.error('Booking create error:', err);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
