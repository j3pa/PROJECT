import postgres from 'postgres';
import Topbar from '@/app/ui/dashboard/topbar';
import { getServerSession } from '@/app/lib/auth';
import ProfileTimeCards, { ProfileLoginDurationCard } from '@/app/ui/dashboard/profile-time-cards';
import ProfileActions from '@/app/ui/dashboard/profile-actions';

export const metadata = {
  title: 'Profil',
};

export const dynamic = 'force-dynamic';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export default async function PenggunaPage() {
  const session = await getServerSession();

  let userProfile = {
    username: session?.username || 'Andika',
    email: 'andika123@gmail.com',
    role: session?.role || 'Supervisor',
    status_sesi: 'Aktif',
  };

  if (session?.userId) {
    try {
      const userRows = await sql`
        SELECT username, email, role, status_sesi
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
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[30px] font-bold tracking-tight text-[#0d1a4a]">Profil Akun</h1>
            <p className="mt-1 text-[14px] text-gray-500">
              Informasi akun operator dan identitas layanan SKYBOLT.
            </p>
          </div>
          <ProfileActions />
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

            <div className="mt-6">
              <ProfileLoginDurationCard />
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
              <ProfileTimeCards />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
