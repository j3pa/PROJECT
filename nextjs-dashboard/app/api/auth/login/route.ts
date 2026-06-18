import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { createSessionValue, SESSION_COOKIE_NAME } from '@/app/lib/auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require', prepare: false });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identifier = String(body.identifier || '').trim();
    const password = String(body.password || '').trim();

    if (!identifier || !password) {
      return Response.json(
        { error: 'Username/email dan password wajib diisi.' },
        { status: 400 },
      );
    }

    const users = await sql`
      SELECT id, username, email, password_hash, role, status_sesi
      FROM users
      WHERE username = ${identifier} OR email = ${identifier}
      LIMIT 1
    `;

    const user = users[0];
    if (!user) {
      return Response.json(
        { error: 'Email/username atau password salah.' },
        { status: 401 },
      );
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return Response.json(
        { error: 'Email/username atau password salah.' },
        { status: 401 },
      );
    }

    const loginRows = await sql`
      UPDATE users
      SET status_sesi = 'Aktif', last_login = NOW(), updated_at = NOW()
      WHERE id = ${user.id}
      RETURNING last_login
    `;

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString();
    const loginAt = new Date(loginRows[0]?.last_login || Date.now()).toISOString();
    const sessionValue = createSessionValue({
      userId: user.id,
      username: user.username,
      role: user.role,
      expiresAt,
      loginAt,
    });

    return new Response(
      JSON.stringify({ success: true, redirectTo: '/dashboard' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `${SESSION_COOKIE_NAME}=${sessionValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800`,
        },
      },
    );
  } catch (error) {
    console.error('Login Error:', error);
    return Response.json(
      { error: 'Login gagal diproses. Pastikan database dan akun aktif.' },
      { status: 500 },
    );
  }
}
