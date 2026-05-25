import Link from 'next/link';
import postgres from 'postgres';
import Topbar from '@/app/ui/dashboard/topbar';
import CargoTable from '@/app/ui/dashboard/cargo-table';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export const dynamic = 'force-dynamic';

export default async function ManifestPage() {
  // Mengambil data transaksi beserta info armada pesawatnya menggunakan LEFT JOIN
  const transactions = await sql`
    SELECT t.*, k.nama_kendaraan, k.kode_kendaraan 
    FROM transaksi t
    LEFT JOIN kendaraan k ON t.kendaraan_id = k.id
    ORDER BY t.tanggal_kirim DESC
  `;

  return (
    <>
      <Topbar title="Manifest Kargo" />

      <div className="p-6 text-black">
        <h1 className="text-[18px] font-bold text-[#0d1a4a] mb-1">Manifest Kargo</h1>
        <p className="text-[11px] text-gray-500 mb-5">
          Data lengkap pengiriman – diperbarui otomatis dari database Neon
        </p>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-[14px] font-bold text-[#0d1a4a]">
              Manifest Transaksi Aktif • Ekspedisi Petir
            </h2>

            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/manifest/create"
                className="h-9 px-4 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[12px] font-bold shadow-sm transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                TAMBAH KARGO
              </Link>
            </div>
          </div>

          <CargoTable transactions={transactions} />
        </div>
      </div>
    </>
  );
}