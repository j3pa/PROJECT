import postgres from 'postgres';
import Link from 'next/link';
import Topbar from '@/app/ui/dashboard/topbar';
import { updateTransaksi } from '@/app/lib/actions';

export const metadata = {
  title: 'Edit Manifest',
};

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Di Next.js terbaru, params bertipe Promise
interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditManifestPage({ params }: EditPageProps) {
  // 1. Wajib di-await terlebih dahulu sebelum mengambil properti id
  const resolvedParams = await params;
  const resiId = decodeURIComponent(resolvedParams.id);
  let transaction: any = null;
  let kendaraanList: any[] = [];
  let databaseError = '';

  try {
    // 2. Ambil data transaksi lama berdasarkan No Resi untuk ditampilkan kembali di form
    const transactionResult = await sql`SELECT * FROM transaksi WHERE resi = ${resiId}`;
    transaction = transactionResult[0];

    // 3. Ambil seluruh daftar kendaraan dari database agar status aktif maupun data lama tetap bisa dipilih
    kendaraanList = await sql`
      SELECT *
      FROM kendaraan
      ORDER BY id ASC
    `;
  } catch (error: any) {
    console.error('Gagal memuat halaman edit manifest:', error);
    databaseError = error?.code === 'ECONNREFUSED'
      ? 'Koneksi database ditolak. Halaman edit belum bisa mengambil data manifest.'
      : 'Data manifest tidak dapat dimuat saat ini.';
  }

  if (databaseError) {
    return (
      <>
        <Topbar title="Edit Manifest Kargo" />
        <div className="p-6 text-black max-w-2xl mx-auto">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-600">
            {databaseError}
          </div>
        </div>
      </>
    );
  }

  if (!transaction) {
    return (
      <div className="p-6 text-red-500 font-bold">
        Error: Data transaksi kargo dengan resi {resiId} tidak ditemukan!
      </div>
    );
  }

  return (
    <>
      <Topbar title="Edit Manifest Kargo" />
      <div className="p-6 text-black max-w-2xl mx-auto">
        <h1 className="text-lg font-bold text-[#0d1a4a] mb-1">Edit Pengiriman Kargo</h1>
        <p className="text-xs text-gray-500 mb-6">Ubah kendaraan, status, dan tarif pengiriman tanpa mengubah data pengirim utama.</p>

        <form action={updateTransaksi.bind(null, resiId)} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
          
          {/* Field No Resi / AWB (Read-Only) */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 uppercase">No AWB / Resi</label>
            <input type="text" value={transaction.resi} disabled className="border rounded-md p-2 bg-gray-100 font-mono text-gray-500 cursor-not-allowed text-sm" />
          </div>

          {/* Manifes Pengirim & Penerima (Read-Only) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Nama Pengirim</label>
              <input type="text" value={transaction.nama_pengirim} disabled className="border rounded-md p-2 bg-gray-100 text-gray-500 cursor-not-allowed text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Nama Penerima</label>
              <input type="text" value={transaction.nama_penerima} disabled className="border rounded-md p-2 bg-gray-100 text-gray-500 cursor-not-allowed text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Jenis Barang</label>
              <input
                type="text"
                value={transaction.jenis_barang}
                disabled
                className="border rounded-md p-2 bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Berat Barang</label>
              <input
                type="text"
                value={`${transaction.berat_barang} kg`}
                disabled
                className="border rounded-md p-2 bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
              />
            </div>
          </div>

          {/* 1. SELEKSI PENGUBAHAN KENDARAAN */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Pilih Kendaraan / Armada Baru</label>
            <select 
              name="kendaraan_id" 
              defaultValue={transaction.kendaraan_id || ""} 
              required 
              className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="" disabled>-- Pilih Armada Pengganti --</option>
              {kendaraanList.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama_kendaraan} ({k.kode_kendaraan}) - {k.status_kendaraan}
                </option>
              ))}
            </select>
          </div>

          {/* 2. SELEKSI STATUS PENGIRIMAN */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Status Pengiriman</label>
            <select 
              name="status_pengiriman" 
              defaultValue={transaction.status_pengiriman} 
              required 
              className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Pending">Pending</option>
              <option value="Diproses">Diproses</option>
              <option value="Dalam Pengiriman">Dalam Pengiriman</option>
              <option value="Sampai Tujuan">Sampai Tujuan</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>

          {/* 3. INPUT EDIT HARGA/TARIF */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Tarif Pengiriman (Rp)</label>
            <input 
              name="tarif" 
              type="number" 
              defaultValue={transaction.tarif} 
              min="0"
              required 
              className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          {/* Tombol Aksi Kendali Form */}
          <div className="flex justify-end gap-2 mt-4 border-t pt-4">
            <Link href="/dashboard/manifest" className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 text-xs font-semibold transition">
              BATAL
            </Link>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold shadow-sm transition">
              SIMPAN PERUBAHAN
            </button>
          </div>

        </form>
      </div>
    </>
  );
}
