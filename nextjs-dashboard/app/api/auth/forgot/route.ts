import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username || '').trim();
    const newPassword = String(body.newPassword || '').trim();

    if (!username || !newPassword) {
      return Response.json(
        { error: 'Username dan password baru wajib diisi.' },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return Response.json(
        { error: 'Password baru minimal 6 karakter.' },
        { status: 400 },
      );
    }

    const users = await sql`
      SELECT id, username
      FROM users
      WHERE username = ${username}
      LIMIT 1
    `;

    const user = users[0];
    if (!user) {
      return Response.json(
        { error: 'Username tidak terdaftar dalam sistem.' },
        { status: 404 },
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await sql`
      UPDATE users
      SET password_hash = ${hashedPassword}, updated_at = NOW()
      WHERE id = ${user.id}
    `;

    return Response.json({
      success: true,
      message: 'Password berhasil diubah. Silakan kembali ke login.',
    });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return Response.json(
      { error: 'Gagal memproses permintaan reset password. Coba lagi nanti.' },
      { status: 500 },
    );
  }
}
