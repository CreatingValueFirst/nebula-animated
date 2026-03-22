import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const params = new URLSearchParams({
    client_id: '326035771916-hbcfh0en7pfg6hnjst06udqlkufvh59t.apps.googleusercontent.com',
    redirect_uri: 'https://heaveninteractive.net/api/auth/callback',
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
    access_type: 'offline',
    prompt: 'consent',
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
