import postgres from 'postgres';
import Topbar from '@/app/ui/dashboard/topbar';
import ManifestCreateForm from '@/app/ui/dashboard/manifest-create-form';

export const metadata = {
  title: 'Tambah Manifest',
};

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export const dynamic = 'force-dynamic';

export default async function CreateManifestPage() {
  let kendaraanList: any[] = [];
  let databaseError = '';

  try {
    kendaraanList = await sql`
      SELECT *
      FROM kendaraan
      ORDER BY
        CASE
          WHEN status_kendaraan IN ('Aktif', 'Tersedia') THEN 0
          WHEN status_kendaraan = 'Maintenance' THEN 1
          ELSE 2
        END,
        id ASC
    `;
  } catch (error: any) {
    console.error('Gagal memuat form create manifest:', error);
    databaseError = error?.code === 'ECONNREFUSED'
      ? 'Koneksi database belum aktif, jadi daftar kendaraan belum bisa dimuat.'
      : 'Form belum bisa mengambil data kendaraan dari database.';
  }

  const tanggalHariIni = new Date().toISOString().split('T')[0];

  return (
    <>
      <Topbar title="Tambah Manifest Kargo" />

      <div className="p-6 text-black max-w-4xl mx-auto">
        <h1 className="text-lg font-bold text-[#0d1a4a] mb-1">Tambah Pengiriman Kargo</h1>
        <p className="text-xs text-gray-500 mb-6">
          Isi seluruh data cargo sesuai requirement UGD. Nomor AWB akan dibuat otomatis saat data disimpan.
        </p>

        {databaseError ? (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-600">
            {databaseError}
          </div>
        ) : null}

        <ManifestCreateForm kendaraanList={kendaraanList} tanggalHariIni={tanggalHariIni} />
      </div>
    </>
  );
}
