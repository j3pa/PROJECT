import Link from 'next/link';
import Topbar from '@/app/ui/dashboard/topbar';
import { fetchActivityLogs } from '@/app/lib/activity-logs';

export const metadata = {
  title: 'Log Aktivitas',
};

export const dynamic = 'force-dynamic';

function getStatusBadge(status: string) {
  if (status.includes('Selesai') || status.includes('Sampai')) {
    return 'border-emerald-100 bg-emerald-50 text-emerald-700';
  }

  if (status.includes('Pengiriman') || status.includes('Loaded')) {
    return 'border-blue-100 bg-blue-50 text-blue-700';
  }

  if (status.includes('Diproses') || status.includes('Sortation') || status.includes('Pending')) {
    return 'border-amber-100 bg-amber-50 text-amber-700';
  }

  return 'border-gray-100 bg-gray-50 text-gray-600';
}

export default async function LogsPage() {
  const { logs, databaseError, isFallback } = await fetchActivityLogs();
  const statusSelesai = logs.filter((log) => log.status === 'Selesai').length;
  const operatorAktif = new Set(logs.map((log) => log.operator)).size;

  return (
    <>
      <Topbar title="Tracking Log" />

      <div className="p-6 text-black">
        <div className="mb-5 rounded-2xl border border-blue-100 bg-gradient-to-r from-[#0d1a4a] via-[#123176] to-[#0b74e8] px-6 py-5 text-white shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-200">Skybolt Monitoring</p>
              <h1 className="mt-2 text-[22px] font-bold">Log Aktivitas Sistem</h1>
              <p className="mt-1 text-[12px] text-blue-100">
                Riwayat perubahan status cargo dan aktivitas operator dalam satu layar pemantauan.
              </p>
            </div>
            <Link
              href="/dashboard/logs/download"
              className="h-10 px-4 inline-flex items-center gap-2 self-start lg:self-auto rounded-xl bg-[#fdc00b] hover:bg-[#e6ad05] text-[#0d1a4a] text-[12px] font-bold shadow-sm transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.3} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V4.5m0 12 4.5-4.5M12 16.5l-4.5-4.5M21 19.5H3" />
              </svg>
              DOWNLOAD LOG
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Total Log</span>
              <p className="mt-2 text-3xl font-bold text-[#0d1a4a]">{logs.length}</p>
              <p className="mt-1 text-[12px] text-gray-500">Aktivitas tercatat</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Selesai</span>
              <p className="mt-2 text-3xl font-bold text-emerald-600">{statusSelesai}</p>
              <p className="mt-1 text-[12px] text-gray-500">Cargo sukses ditutup</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-white px-5 py-4 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Operator Aktif</span>
              <p className="mt-2 text-3xl font-bold text-amber-600">{operatorAktif}</p>
              <p className="mt-1 text-[12px] text-gray-500">Petugas dalam log</p>
            </div>
          </div>
        </div>

        {databaseError ? (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-amber-700">
            {databaseError}
          </div>
        ) : null}

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100 bg-[#f8fbff] flex items-center justify-between">
            <div>
              <h2 className="text-[14px] font-bold text-[#0d1a4a]">Tracking Log Operator</h2>
              <p className="text-[11px] text-gray-400 mt-1">Disesuaikan dengan manifest aktif dan ritme operasional gudang</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[12px] text-left border-collapse min-w-[860px]">
              <thead>
                <tr className="border-b border-gray-100 bg-[#f8fbff]">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Waktu</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">No AWB</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Perubahan Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Operator</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-[12px] text-gray-400">
                      Belum ada log aktivitas yang bisa ditampilkan.
                    </td>
                  </tr>
                ) : (
                  logs.map((log, index) => (
                    <tr key={`${log.awb}-${index}`} className="hover:bg-blue-50/40 transition">
                      <td className="px-6 py-4 font-mono text-gray-500 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className="h-9 w-1.5 rounded-full bg-[#fdc00b]" />
                          {log.waktu}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-blue-600 font-semibold whitespace-nowrap">{log.awb}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold ${getStatusBadge(log.perubahanStatus)}`}>
                          {log.perubahanStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-blue-700 font-medium whitespace-nowrap">{log.operator}</td>
                      <td className="px-6 py-4 text-gray-500">{log.keterangan}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between text-[11px]">
            <p className="text-gray-400">
              Menampilkan <span className="text-blue-600 font-bold">{logs.length}</span> log aktivitas operator dan perubahan status cargo
            </p>
            <p className="text-gray-400">
              {isFallback ? 'File unduhan akan mengikuti data contoh aktif' : 'File unduhan akan mengikuti data log yang sedang tampil'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
