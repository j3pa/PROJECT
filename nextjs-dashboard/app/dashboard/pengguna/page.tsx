import Link from 'next/link';
import postgres from 'postgres';
import Topbar from '@/app/ui/dashboard/topbar';
import { getServerSession } from '@/app/lib/auth';

export const metadata = {
  title: 'Pengguna',
};

export const dynamic = 'force-dynamic';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

function formatLoginDate(dateValue?: string | Date) {
  const safeDate = dateValue ? new Date(dateValue) : new Date();
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(safeDate);
}

export default async function PenggunaPage() {
  const session = await getServerSession();

  let userProfile = {
    username: 'Andika',
    email: 'andika123@gmail.com',
    role: 'Supervisor',
    status_sesi: 'Aktif',
    updated_at: new Date().toISOString(),
  };

  if (session?.userId) {
    try {
      const userRows = await sql`
        SELECT username, email, role, status_sesi, updated_at
        FROM users
        WHERE id = ${session.userId}
        LIMIT 1
      `;

      if (userRows[0]) {
        userProfile = {
          username: String(userRows[0].username),
          email: String(userRows[0].email),
          role: String(userRows[0].role),
          status_sesi: String(userRows[0].status_sesi),
          updated_at: String(userRows[0].updated_at),
        };
      }
    } catch (error) {
      console.error('Gagal memuat profil pengguna:', error);
    }
  }

  const displayName = userProfile.username;
  const roleLabel = userProfile.role;
  const lastLogin = formatLoginDate(userProfile.updated_at);
  const statusSesi = userProfile.status_sesi || 'Aktif';
  const avatarLabel = displayName.charAt(0).toUpperCase();

  return (
    <>
      <Topbar title="Pengguna" />

      <div className="p-6 text-black">
        <h1 className="text-[18px] font-bold text-[#0d1a4a] mb-1">Profil Pengguna</h1>
        <p className="text-[11px] text-gray-500 mb-5">
          Kelola informasi akun, keamanan dasar, dan preferensi sistem operator.
        </p>

        <div className="space-y-5 max-w-5xl">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-[28px] font-bold shadow-sm">
                  {avatarLabel}
                </div>
                <div>
                  <h2 className="text-[30px] leading-none font-bold text-[#0d1a4a]">{displayName}</h2>
                  <p className="text-[12px] text-blue-500 mt-1">{userProfile.email}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{roleLabel} Operasional Cargo Udara</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-[11px] font-bold">
                  Status Sesi: {statusSesi}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold">
                  Role: {roleLabel}
                </span>
              </div>
            </div>

            <div className="grid gap-6 px-6 py-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-[12px] font-semibold text-blue-300 mb-1">Username</p>
                <p className="text-[18px] font-bold text-[#0d1a4a]">{displayName}</p>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-blue-300 mb-1">Role</p>
                <p className="text-[18px] font-bold text-[#0d1a4a]">{roleLabel}</p>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-blue-300 mb-1">Login Terakhir</p>
                <p className="text-[18px] font-bold text-[#0d1a4a]">{lastLogin}</p>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-blue-300 mb-1">Status Sesi</p>
                <p className="text-[18px] font-bold text-green-600">{statusSesi}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.3fr_0.9fr]">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-[22px] font-bold text-[#0d1a4a] mb-4">Sesi Aktif</h2>

              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0d1a4a] text-white flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17 3 17m0 0 3.75-3.75M3 17l3.75 3.75M21 7H7m14 0-3.75-3.75M21 7l-3.75 3.75" />
                  </svg>
                </div>
                <div>
                  <p className="text-[22px] font-bold text-blue-700">Desktop - Ruang Kendali</p>
                  <p className="text-[14px] text-[#0d1a4a] font-semibold mt-1">Chrome - Sesi Ini</p>
                  <p className="text-[12px] text-gray-500 mt-2">
                    Aktivitas operator sedang terhubung ke dashboard utama dan sinkron dengan tracking log secara real-time.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Perangkat</p>
                  <p className="text-[13px] font-bold text-[#0d1a4a] mt-1">Windows Desktop</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Lokasi</p>
                  <p className="text-[13px] font-bold text-[#0d1a4a] mt-1">Gudang Sudirman</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Keamanan</p>
                  <p className="text-[13px] font-bold text-green-600 mt-1">Terverifikasi</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-[22px] font-bold text-[#0d1a4a] mb-4">Ringkasan Akun</h2>

              <div className="space-y-3">
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Akses Modul</p>
                  <p className="text-[15px] font-bold text-[#0d1a4a] mt-1">Manifest, Tracking, Log, Penerbangan</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Notifikasi</p>
                  <p className="text-[15px] font-bold text-[#0d1a4a] mt-1">Aktif untuk update status dan manifest</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Preferensi</p>
                  <p className="text-[15px] font-bold text-[#0d1a4a] mt-1">Bahasa Indonesia, zona WIB, sinkron otomatis</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-[22px] font-bold text-[#0d1a4a] mb-3">Keluar dari Akun</h2>
            <p className="text-[13px] text-gray-600 max-w-3xl leading-relaxed">
              Anda akan keluar dari sistem operator. Pastikan seluruh pembaruan manifest, log aktivitas, dan perubahan status cargo sudah selesai disimpan sebelum mengakhiri sesi ini.
            </p>

            <div className="flex flex-wrap gap-3 mt-5">
              <Link
                href="/dashboard"
                className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-[12px] font-semibold text-gray-700 transition"
              >
                Batal, kembali ke dashboard
              </Link>
              <Link
                href="/login"
                className="px-4 py-2.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-[12px] font-bold text-red-600 transition"
              >
                Ya, keluar sekarang
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
