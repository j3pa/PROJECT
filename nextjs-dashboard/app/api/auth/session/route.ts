import { getServerSession } from '@/app/lib/auth';
import postgres from 'postgres';
import { toSafeIsoString } from '@/app/lib/time';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return Response.json({ user: null }, { status: 401 });
  }

  try {
    const rows = await sql`
      SELECT username, email, role, status_sesi, last_login, updated_at
      FROM users
      WHERE id = ${session.userId}
      LIMIT 1
    `;

    const user = rows[0];

    if (user) {
      return Response.json({
        user: {
          username: user.username || session.username,
          email: user.email || '',
          role: user.role || session.role,
          statusSesi: user.status_sesi || '',
          lastLogin: toSafeIsoString(user.last_login) || session.loginAt || null,
          updatedAt: toSafeIsoString(user.updated_at),
        },
      });
    }
  } catch (error) {
    console.error('Session database error:', error);
  }

  return Response.json({
    user: {
      username: session.username,
      role: session.role,
      lastLogin: session.loginAt || null,
      updatedAt: null,
      timeWarning: 'Data waktu akun belum bisa dimuat dari database.',
    },
  });
}
