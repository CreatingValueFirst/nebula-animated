import { NextRequest, NextResponse } from 'next/server';
import { getOAuth2Client } from '@/lib/google-calendar';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'No authorization code' }, { status: 400 });
  }

  try {
    const oauth2 = getOAuth2Client();
    const { tokens } = await oauth2.getToken(code);

    // Display the refresh token so it can be saved as env var
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html><head><title>Google Calendar Connected</title>
      <style>
        body { background: #0a0a0f; color: #e8e8ec; font-family: system-ui; padding: 40px; }
        .token { background: #111; padding: 20px; border-radius: 8px; word-break: break-all; border: 1px solid #2d8a8a; margin: 20px 0; }
        h1 { color: #2d8a8a; }
        code { color: #4ade80; }
      </style></head>
      <body>
        <h1>Google Calendar Connected!</h1>
        <p>Copy this refresh token and add it as <code>GOOGLE_REFRESH_TOKEN</code> environment variable on Vercel:</p>
        <div class="token"><code>${tokens.refresh_token}</code></div>
        <p>Then run: <code>npx vercel env add GOOGLE_REFRESH_TOKEN production</code></p>
        <p>Access token (temporary): <code>${tokens.access_token?.substring(0, 20)}...</code></p>
      </body></html>
      `,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.json({ error: 'Failed to exchange code' }, { status: 500 });
  }
}
