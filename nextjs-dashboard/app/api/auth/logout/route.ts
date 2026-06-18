import postgres from 'postgres';
import { SESSION_COOKIE_NAME, readSessionValue } from '@/app/lib/auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require', prepare: false });

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionMatch = cookieHeader
      .split(';')
      .map((entry) => entry.trim())
      .find((entry) => entry.startsWith(`${SESSION_COOKIE_NAME}=`));

    const sessionValue = sessionMatch?.split('=').slice(1).join('=');
    const session = readSessionValue(sessionValue);

    if (session?.userId) {
      await sql`
        UPDATE users
        SET status_sesi = 'Nonaktif', updated_at = NOW()
        WHERE id = ${session.userId}
      `;
    }
  } catch (error) {
    console.error('Logout Error:', error);
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    },
  });
}