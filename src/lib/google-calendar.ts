import { google } from 'googleapis';

export function getOAuth2Client() {
  const clientId = '326035771916-hbcfh0en7pfg6hnjst06udqlkufvh59t.apps.googleusercontent.com';
  const clientSecret = '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';
  const redirectUri = 'https://heaveninteractive.net/api/auth/callback';
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getAuthedClient() {
  const oauth2 = getOAuth2Client();
  const refreshToken = (process.env.GOOGLE_REFRESH_TOKEN || '').replace(/\s/g, '');
  if (!refreshToken) throw new Error('GOOGLE_REFRESH_TOKEN not set');
  oauth2.setCredentials({ refresh_token: refreshToken });
  return oauth2;
}

export function getCalendar() {
  return google.calendar({ version: 'v3', auth: getAuthedClient() });
}
