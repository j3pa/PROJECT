import postgres from 'postgres';
import Topbar from '@/app/ui/dashboard/topbar';
import { getServerSession } from '@/app/lib/auth';
import LoginDuration from '@/app/ui/dashboard/login-duration';

export const metadata = {
  title: 'Profil',
};

export const dynamic = 'force-dynamic';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

function formatLoginDate(dateValue?: string | Date | null) {
  const safeDate = dateValue ? new Date(dateValue) : new Date();
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(safeDate);
}

function toIsoString(dateValue?: string | Date | null) {
  if (!dateValue) return new Date().toISOString();
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

export default async function PenggunaPage() {
  const session = await getServerSession();

  let userProfile = {
    username: session?.username || 'Andika',
    email: 'andika123@gmail.com',
    role: session?.role || 'Supervisor',
    status_sesi: 'Aktif',
    last_login: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (session?.userId) {
    try {
      const userRows = await sql`
        SELECT username, email, role, status_sesi, last_login, updated_at
        FROM users
        WHERE id = ${session.userId}
        LIMIT 1
      `;

      if (userRows[0]) {
        userProfile = {
          username: userRows[0].username || userProfile.username,
          email: userRows[0].email || userProfile.email,
          role: userRows[0].role || userProfile.role,
          status_sesi: userRows[0].status_sesi || userProfile.status_sesi,
          last_login: toIsoString(userRows[0].last_login || userProfile.last_login),
          updated_at: toIsoString(userRows[0].updated_at || userProfile.updated_at),
        };
      }
    } catch (error) {
      console.error('Gagal memuat profil pengguna:', error);
    }
  }

  const initials = String(userProfile.username || 'A').slice(0, 1).toUpperCase();

  return (
    <>
      <Topbar title="Profil" />

      <main className="min-h-[calc(100vh-86px)] bg-[#f7f9fc] p-5 text-black lg:p-8">
        <div className="mb-7">
          <h1 className="text-[30px] font-bold tracking-tight text-[#0d1a4a]">Profil Akun</h1>
          <p className="mt-1 text-[14px] text-gray-500">
            Informasi akun operator dan status sesi yang diperbarui secara real-time.
          </p>
        </div>

        <section className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-600 text-4xl font-bold text-white shadow-lg shadow-blue-100">
                {initials}
              </div>
              <h2 className="mt-5 text-2xl font-bold text-[#0d1a4a]">{userProfile.username}</h2>
              <p className="mt-1 text-sm font-medium text-gray-500">{userProfile.email}</p>
              <span className="mt-4 rounded-full bg-green-100 px-4 py-1.5 text-sm font-bold text-green-700">
                {userProfile.status_sesi}
              </span>
            </div>

            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm font-bold text-blue-900">Durasi Login</p>
              <p className="mt-2 text-sm leading-6 text-blue-800">
                Aktif selama <LoginDuration since={userProfile.last_login} /> sejak login terakhir.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-[#0d1a4a]">Informasi Akun</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-500">Username</p>
                  <p className="mt-2 text-lg font-bold text-[#0d1a4a]">{userProfile.username}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-500">Email</p>
                  <p className="mt-2 break-all text-lg font-bold text-[#0d1a4a]">{userProfile.email}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-500">Role</p>
                  <p className="mt-2 text-lg font-bold text-[#0d1a4a]">{userProfile.role}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-500">Status Sesi</p>
                  <p className="mt-2 text-lg font-bold text-green-700">{userProfile.status_sesi}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-gray-500">Login Terakhir</p>
                <p className="mt-3 text-xl font-bold text-[#0d1a4a]">{formatLoginDate(userProfile.last_login)}</p>
                <p className="mt-2 text-sm text-gray-500">Durasi diperbarui otomatis saat halaman aktif.</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-gray-500">Update Data Akun</p>
                <p className="mt-3 text-xl font-bold text-[#0d1a4a]">{formatLoginDate(userProfile.updated_at)}</p>
                <p className="mt-2 text-sm text-gray-500">Sinkron otomatis mengikuti data terbaru sistem.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
