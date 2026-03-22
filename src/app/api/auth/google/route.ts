import { NextResponse } from 'next/server';
import { getOAuth2Client } from '@/lib/google-calendar';

export const dynamic = 'force-dynamic';

export async function GET() {
  const oauth2 = getOAuth2Client();
  const url = oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ],
  });
  return NextResponse.redirect(url);
}
