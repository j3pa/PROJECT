

import Link from 'next/link';
import Topbar from '@/app/ui/dashboard/topbar';
import { fetchActivityLogs } from '@/app/lib/activity-logs';

export const dynamic = 'force-dynamic';
export default async function LogsPage() {
  const { logs, databaseError, isFallback } = await fetchActivityLogs();
  const statusSelesai = logs.filter((log) => log.status === 'Selesai').length;
  const operatorAktif = new Set(logs.map((log) => log.operator)).size;

  return (
    <>
      <Topbar title="Tracking Log" />

      <div className="p-6 text-black">
        <h1 className="text-[18px] font-bold text-[#0d1a4a] mb-1">Log Aktivitas Sistem</h1>
        <p className="text-[11px] text-gray-500 mb-5">
          Riwayat perubahan status cargo dan aktivitas operator dalam satu layar pemantauan.
        </p>

        <div className="flex flex-col gap-4 mb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 rounded-full bg-white border border-gray-200 text-[12px] shadow-sm">
              <span className="text-gray-400">Total Log</span>{' '}
              <span className="font-bold text-[#0d1a4a]">{logs.length}</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-white border border-gray-200 text-[12px] shadow-sm">
              <span className="text-gray-400">Selesai</span>{' '}
              <span className="font-bold text-green-600">{statusSelesai}</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-white border border-gray-200 text-[12px] shadow-sm">
              <span className="text-gray-400">Operator Aktif</span>{' '}
              <span className="font-bold text-blue-600">{operatorAktif}</span>
            </div>
          </div>
          <Link
            href="/dashboard/logs/download"
            className="h-10 px-4 inline-flex items-center gap-2 self-start lg:self-auto rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold shadow-sm transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.3} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V4.5m0 12 4.5-4.5M12 16.5l-4.5-4.5M21 19.5H3" />
            </svg>
            DOWNLOAD LOG
          </Link>
        </div>

        {databaseError ? (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-amber-700">
            {databaseError}
          </div>
        ) : null}

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div>
              <h2 className="text-[14px] font-bold text-[#0d1a4a]">Tracking Log Operator</h2>
              <p className="text-[11px] text-gray-400 mt-1">Disesuaikan dengan manifest aktif dan ritme operasional gudang</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[12px] text-left border-collapse min-w-[860px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
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
                    <tr key={`${log.awb}-${index}`} className="hover:bg-blue-50/20 transition">
                      <td className="px-6 py-4 font-mono text-gray-500 whitespace-nowrap">{log.waktu}</td>
                      <td className="px-6 py-4 font-mono text-blue-600 font-semibold whitespace-nowrap">{log.awb}</td>
                      <td className="px-6 py-4 text-[#0d1a4a] font-semibold whitespace-nowrap">{log.perubahanStatus}</td>
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