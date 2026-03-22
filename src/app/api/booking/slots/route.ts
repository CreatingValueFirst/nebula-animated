import { NextRequest, NextResponse } from 'next/server';
import { getCalendar } from '@/lib/google-calendar';

export const dynamic = 'force-dynamic';

// Business hours: 9:00-18:00 EET (UTC+2 / UTC+3 depending on DST)
const SLOT_DURATION_MIN = 30;
const BUSINESS_START_HOUR = 9; // 9:00
const BUSINESS_END_HOUR = 18; // 18:00
const TIMEZONE = 'Europe/Sofia';

export async function GET(req: NextRequest) {
  const dateParam = req.nextUrl.searchParams.get('date');
  if (!dateParam) {
    return NextResponse.json({ error: 'date parameter required (YYYY-MM-DD)' }, { status: 400 });
  }

  try {
    const calendar = getCalendar();

    // Build time range for the requested date in Sofia timezone
    const dayStart = new Date(`${dateParam}T0${BUSINESS_START_HOUR}:00:00`);
    const dayEnd = new Date(`${dateParam}T${BUSINESS_END_HOUR}:00:00`);

    // Get busy times from Google Calendar
    const freeBusy = await calendar.freebusy.query({
      requestBody: {
        timeMin: dayStart.toISOString(),
        timeMax: dayEnd.toISOString(),
        timeZone: TIMEZONE,
        items: [{ id: 'primary' }],
      },
    });

    const busySlots = freeBusy.data.calendars?.primary?.busy || [];

    // Generate all possible 30-min slots during business hours
    const slots: { start: string; end: string; available: boolean }[] = [];
    const current = new Date(dayStart);

    while (current.getTime() + SLOT_DURATION_MIN * 60000 <= dayEnd.getTime()) {
      const slotStart = new Date(current);
      const slotEnd = new Date(current.getTime() + SLOT_DURATION_MIN * 60000);

      // Check if this slot overlaps with any busy period
      const isBusy = busySlots.some((busy) => {
        const busyStart = new Date(busy.start!);
        const busyEnd = new Date(busy.end!);
        return slotStart < busyEnd && slotEnd > busyStart;
      });

      slots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        available: !isBusy,
      });

      current.setMinutes(current.getMinutes() + SLOT_DURATION_MIN);
    }

    return NextResponse.json({ date: dateParam, slots });
  } catch (err) {
    console.error('Slots error:', err);
    return NextResponse.json({ error: 'Failed to fetch available slots' }, { status: 500 });
  }
}
