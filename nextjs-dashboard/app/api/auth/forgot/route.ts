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

    if (newPassword.length < 4) {
      return Response.json(
        { error: 'Password baru minimal 4 karakter.' },
        { status: 400 },
      );
    }

    // Cari user hanya berdasarkan username (tanpa email)
    const users = await sql`
      SELECT id, username
      FROM users
      WHERE username = ${username}
      LIMIT 1
    `;

    const user = users[0];
    if (!user) {
      return Response.json(
        { error: 'Username tidak ditemukan.' },
        { status: 404 },
      );
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password_hash
    await sql`
      UPDATE users
      SET password_hash = ${hashedPassword}, updated_at = NOW()
      WHERE id = ${user.id}
    `;

    return Response.json({
      success: true,
      message: 'Password berhasil direset. Silakan login dengan password baru.',
    });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return Response.json(
      { error: 'Gagal memproses reset password. Coba lagi nanti.' },
      { status: 500 },
    );
  }
}