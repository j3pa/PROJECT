import Link from 'next/link';
import postgres from 'postgres';
import Topbar from '@/app/ui/dashboard/topbar';
import { createTransaksi } from '@/app/lib/actions';

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

        <form action={createTransaksi} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 uppercase">No AWB / Resi</label>
            <input
              type="text"
              value="Auto Generated Setelah Submit"
              disabled
              className="border rounded-md p-2 bg-gray-100 font-mono text-gray-500 cursor-not-allowed text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Tanggal Kirim</label>
              <input
                name="tanggal_kirim"
                type="date"
                defaultValue={tanggalHariIni}
                required
                className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">No Telepon</label>
              <input
                name="no_telepon"
                type="tel"
                required
                inputMode="numeric"
                minLength={12}
                maxLength={12}
                pattern="^[0-9]{12}$"
                title="Nomor telepon harus terdiri dari tepat 12 angka."
                placeholder="081234567890"
                className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Nama Pengirim</label>
              <input
                name="nama_pengirim"
                type="text"
                required
                minLength={2}
                className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Nama Penerima</label>
              <input
                name="nama_penerima"
                type="text"
                required
                minLength={2}
                className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Kota Asal</label>
              <input
                name="kota_asal"
                type="text"
                required
                minLength={2}
                className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Kota Tujuan</label>
              <input
                name="kota_tujuan"
                type="text"
                required
                minLength={2}
                className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Jenis Barang</label>
              <input
                name="jenis_barang"
                type="text"
                required
                minLength={2}
                className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Jenis Pengiriman</label>
              <select
                name="jenis_pengiriman"
                defaultValue="Biasa"
                required
                className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Biasa">Biasa</option>
                <option value="Cepat">Cepat</option>
                <option value="Vvip">Vvip</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Berat Barang (Kg)</label>
              <input
                name="berat_barang"
                type="number"
                min="0"
                step="0.01"
                required
                className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Harga / Tarif Pengiriman (Rp)</label>
              <input
                name="tarif"
                type="number"
                min="0"
                required
                className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Pilih Kendaraan</label>
              <select
                name="kendaraan_id"
                required
                defaultValue=""
                disabled={kendaraanList.length === 0}
                className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="" disabled>-- Pilih Kendaraan --</option>
                {kendaraanList.map((kendaraan) => (
                  <option key={kendaraan.id} value={kendaraan.id}>
                    {kendaraan.nama_kendaraan} ({kendaraan.kode_kendaraan}) - {kendaraan.jenis_kendaraan} [{kendaraan.status_kendaraan}]
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Status Pengiriman</label>
              <select
                name="status_pengiriman"
                defaultValue="Pending"
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
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Deskripsi / Catatan Barang</label>
            <textarea
              name="catatan"
              rows={4}
              required
              minLength={5}
              placeholder="Contoh: barang pecah belah, jangan tertindih, prioritas cepat, dll."
              className="border rounded-md p-3 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4 border-t pt-4">
            <Link
              href="/dashboard/manifest"
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 text-xs font-semibold transition"
            >
              BATAL
            </Link>
            <button
              type="submit"
              disabled={kendaraanList.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold shadow-sm transition"
            >
              SIMPAN DATA
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
