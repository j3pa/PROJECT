import { createTransaksi } from '@/app/lib/actions';
import postgres from 'postgres';
import Link from 'next/link';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export default async function Page() {
  // Menarik data kendaraan langsung dari database untuk opsi Dropdown
  const kendaraanList = await sql`SELECT id, nama_kendaraan, kode_kendaraan FROM kendaraan`;

  return (
    <main className="max-w-4xl mx-auto p-6 text-black">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Tambah Data Pengiriman Kargo</h1>
        <p className="text-gray-800">Form input transaksi baru Ekspedisi Petir (Skybolt)</p>
      </div>

      <form action={createTransaksi} className="bg-white p-6 rounded-xl shadow-sm border border-gray-300">
        {/* Menggunakan CSS Grid agar form berjejer rapi 2 kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black">Tanggal Kirim</label>
            <input type="date" name="tanggal_kirim" required className="border border-gray-300 rounded-md p-2 bg-gray-50 text-black" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black">Nama Pengirim</label>
            <input type="text" name="nama_pengirim" placeholder="PT Solusi Maju" required className="border border-gray-300 rounded-md p-2 bg-gray-50 text-black placeholder:text-gray-500" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black">Nama Penerima</label>
            <input type="text" name="nama_penerima" placeholder="Budi Santoso" required className="border border-gray-300 rounded-md p-2 bg-gray-50 text-black placeholder:text-gray-500" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black">No Telepon Penerima</label>
            <input type="text" name="no_telepon" placeholder="081234..." required className="border border-gray-300 rounded-md p-2 bg-gray-50 text-black placeholder:text-gray-500" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black">Kota Asal</label>
            <input type="text" name="kota_asal" placeholder="Jakarta" required className="border border-gray-300 rounded-md p-2 bg-gray-50 text-black placeholder:text-gray-500" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black">Kota Tujuan</label>
            <input type="text" name="kota_tujuan" placeholder="Surabaya" required className="border border-gray-300 rounded-md p-2 bg-gray-50 text-black placeholder:text-gray-500" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black">Jenis Barang</label>
            <input type="text" name="jenis_barang" placeholder="Elektronik, Garmen, dll" required className="border border-gray-300 rounded-md p-2 bg-gray-50 text-black placeholder:text-gray-500" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black">Berat Barang (Kg)</label>
            <input type="number" step="0.1" name="berat_barang" placeholder="50.5" required className="border border-gray-300 rounded-md p-2 bg-gray-50 text-black placeholder:text-gray-500" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black">Tarif / Harga (Rp)</label>
            <input type="number" name="tarif" placeholder="150000" required className="border border-gray-300 rounded-md p-2 bg-gray-50 text-black placeholder:text-gray-500" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black">Jenis Pengiriman</label>
            <select name="jenis_pengiriman" required className="border border-gray-300 rounded-md p-2 bg-gray-50 text-black">
              <option value="Biasa">Biasa</option>
              <option value="Cepat">Cepat</option>
              <option value="Vvip">VVIP</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black">Armada / Kendaraan</label>
            <select name="kendaraan_id" required defaultValue="" className="border border-gray-300 rounded-md p-2 bg-gray-50 text-black">
              <option value="" disabled>Pilih Kendaraan...</option>
              {kendaraanList.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama_kendaraan} ({k.kode_kendaraan})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black">Status Pengiriman</label>
            <select name="status_pengiriman" required className="border border-gray-300 rounded-md p-2 bg-gray-50 text-black">
              <option value="Pending">Pending</option>
              <option value="Diproses">Diproses</option>
              <option value="Dalam Pengiriman">Dalam Pengiriman</option>
              <option value="Sampai Tujuan">Sampai Tujuan</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <label className="text-sm font-medium text-black">Catatan / Deskripsi Barang</label>
          <textarea name="catatan" rows={3} placeholder="Fragile, jangan dibanting..." className="border border-gray-300 rounded-md p-2 bg-gray-50 text-black placeholder:text-gray-500"></textarea>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-8 flex justify-end gap-4">
          <Link 
            href="/dashboard/manifest" 
            className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-black font-medium border border-gray-400"
          >
            Batal
          </Link>
          <button 
            type="submit" 
            className="px-6 py-2 rounded-md bg-blue-300 hover:bg-blue-400 text-black font-bold border border-blue-500"
          >
            Simpan Data
          </button>
        </div>
      </form>
    </main>
  );
}