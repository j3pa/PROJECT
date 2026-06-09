import Link from 'next/link';
import postgres from 'postgres';
import Topbar from '@/app/ui/dashboard/topbar';
import CargoTable from '@/app/ui/dashboard/cargo-table';

export const metadata = {
  title: 'Manifest Cargo',
};

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export const dynamic = 'force-dynamic';

interface ManifestPageProps {
  searchParams?: Promise<{ query?: string }>;
}

export default async function ManifestPage({ searchParams }: ManifestPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const query = resolvedSearchParams?.query?.trim() || '';
  let transactions: any[] = [];
  let databaseError = '';

  try {
    transactions = query
      ? await sql`
          SELECT t.*, k.nama_kendaraan, k.kode_kendaraan
          FROM transaksi t
          LEFT JOIN kendaraan k ON t.kendaraan_id = k.id
          WHERE
            t.resi ILIKE ${`%${query}%`}
            OR t.nama_pengirim ILIKE ${`%${query}%`}
            OR t.nama_penerima ILIKE ${`%${query}%`}
            OR t.jenis_barang ILIKE ${`%${query}%`}
          ORDER BY t.tanggal_kirim DESC
        `
      : await sql`
          SELECT t.*, k.nama_kendaraan, k.kode_kendaraan
          FROM transaksi t
          LEFT JOIN kendaraan k ON t.kendaraan_id = k.id
          ORDER BY t.tanggal_kirim DESC
        `;
  } catch (error: any) {
    console.error('Gagal memuat manifest cargo:', error);
    databaseError = error?.code === 'ECONNREFUSED'
      ? 'Koneksi database ditolak. Pastikan POSTGRES_URL aktif dan database Neon dapat diakses.'
      : 'Data manifest belum bisa dimuat dari database.';
  }

  return (
    <>
      <Topbar title="Manifest Kargo" />

      <div className="p-6 text-black">
        <h1 className="text-[18px] font-bold text-[#0d1a4a] mb-1">Manifest Kargo</h1>
        <p className="text-[11px] text-gray-500 mb-5">
          Data lengkap pengiriman – diperbarui otomatis dari database Neon
        </p>

        <form action="/dashboard/manifest" className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
          <input
            type="text"
            name="query"
            defaultValue={query}
            placeholder="Cari No Resi, Nama Pengirim, Nama Penerima, atau Jenis Barang"
            className="h-10 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-[12px] text-gray-700 outline-none transition focus:border-blue-500"
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="h-10 px-4 inline-flex items-center justify-center bg-[#0d1a4a] hover:bg-[#132561] text-white rounded-lg text-[12px] font-bold shadow-sm transition"
            >
              CARI DATA
            </button>
            {query ? (
              <Link
                href="/dashboard/manifest"
                className="h-10 px-4 inline-flex items-center justify-center border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg text-[12px] font-semibold transition"
              >
                RESET
              </Link>
            ) : null}
          </div>
        </form>

        {databaseError ? (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-600">
            {databaseError}
          </div>
        ) : null}

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div>
              <h2 className="text-[14px] font-bold text-[#0d1a4a]">
                Manifest Transaksi Aktif • Ekspedisi Petir
              </h2>
              <p className="text-[11px] text-gray-400 mt-1">
                {query ? `Hasil pencarian untuk "${query}"` : 'Menampilkan seluruh data cargo dari database'}
              </p>
            </div>

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
