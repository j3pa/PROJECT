import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/app/lib/auth';

function readSessionValue(value?: string) {
  if (!value) return null;

  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const parsed = JSON.parse(atob(padded)) as { expiresAt?: string };

    if (!parsed.expiresAt || new Date(parsed.expiresAt) < new Date()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const session = readSessionValue(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (!session) {
    return NextResponse.redirect(new URL('/auth/notauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
