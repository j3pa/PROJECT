import Link from 'next/link';
import postgres from 'postgres';
import Topbar from '@/app/ui/dashboard/topbar';
import { deleteKendaraan } from '@/app/lib/actions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export const dynamic = 'force-dynamic';

export default async function KendaraanPage() {
  let kendaraanList: any[] = [];
  let databaseError = '';

  try {
    kendaraanList = await sql`
      SELECT *
      FROM kendaraan
      ORDER BY id ASC
    `;
  } catch (error) {
    console.error('Gagal memuat data kendaraan:', error);
    databaseError = 'Data kendaraan belum bisa dimuat dari database.';
  }

  return (
    <>
      <Topbar title="Data Kendaraan" />

      <div className="p-6 text-black">
        <h1 className="text-[18px] font-bold text-[#0d1a4a] mb-1">Data Kendaraan</h1>
        <p className="text-[11px] text-gray-500 mb-5">
          Kelola armada pengiriman yang dipakai pada manifest cargo dan operasional harian.
        </p>

        {databaseError ? (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-600">
            {databaseError}
          </div>
        ) : null}

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div>
              <h2 className="text-[14px] font-bold text-[#0d1a4a]">Armada Aktif • Ekspedisi Petir</h2>
              <p className="text-[11px] text-gray-400 mt-1">Simpan, edit, dan hapus data kendaraan langsung dari dashboard admin</p>
            </div>

            <Link
              href="/dashboard/kendaraan/create"
              className="h-9 px-4 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[12px] font-bold shadow-sm transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              TAMBAH KENDARAAN
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[12px] text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nama Kendaraan</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Jenis</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kode / Plat</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kapasitas</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {kendaraanList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-[12px] text-gray-400">
                      Belum ada data kendaraan yang tersimpan.
                    </td>
                  </tr>
                ) : (
                  kendaraanList.map((kendaraan) => (
                    <tr key={kendaraan.id} className="hover:bg-blue-50/10 transition">
                      <td className="px-6 py-4 font-mono text-gray-500">{kendaraan.id}</td>
                      <td className="px-6 py-4 text-gray-700 font-medium">{kendaraan.nama_kendaraan}</td>
                      <td className="px-6 py-4 text-gray-500">{kendaraan.jenis_kendaraan}</td>
                      <td className="px-6 py-4 text-blue-600 font-mono font-semibold">{kendaraan.kode_kendaraan}</td>
                      <td className="px-6 py-4 text-gray-600">{Number(kendaraan.kapasitas_muatan).toLocaleString('id-ID')} kg</td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          {kendaraan.status_kendaraan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/dashboard/kendaraan/${kendaraan.id}/edit`}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50/60 hover:bg-blue-100 px-2.5 py-1.5 rounded border border-blue-100/50 transition uppercase"
                          >
                            Edit
                          </Link>
                          <form action={deleteKendaraan.bind(null, kendaraan.id)}>
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded border border-red-100/50 transition uppercase"
                            >
                              Hapus
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/50 text-[11px] text-gray-400">
            Total <span className="text-blue-600 font-bold">{kendaraanList.length}</span> kendaraan tercatat dalam sistem
          </div>
        </div>
      </div>
    </>
  );
}