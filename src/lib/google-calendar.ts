import { google } from 'googleapis';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'https://heaveninteractive.net/api/auth/callback';

export function getOAuth2Client() {
  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
}

export function getAuthedClient() {
  const oauth2 = getOAuth2Client();
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (!refreshToken) throw new Error('GOOGLE_REFRESH_TOKEN not set');
  oauth2.setCredentials({ refresh_token: refreshToken });
  return oauth2;
}

export function getCalendar() {
  return google.calendar({ version: 'v3', auth: getAuthedClient() });
}
