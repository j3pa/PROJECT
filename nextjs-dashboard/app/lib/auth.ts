

import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'skybolt_session';

export interface SessionPayload {
  userId: string;
  username: string;
  role: string;
  expiresAt: string;
}

export function createSessionValue(payload: SessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

export function readSessionValue(value?: string) {
  if (!value) return null;

  try {
    const parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf-8')) as SessionPayload;
    if (!parsed.expiresAt || new Date(parsed.expiresAt) < new Date()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function getServerSession() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return readSessionValue(sessionValue);
}