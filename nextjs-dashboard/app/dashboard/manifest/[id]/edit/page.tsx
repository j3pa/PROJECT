import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Topbar from '@/app/ui/dashboard/topbar';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Di Next.js terbaru, params bertipe Promise
interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditManifestPage({ params }: EditPageProps) {
  // 1. Wajib di-await terlebih dahulu sebelum mengambil properti id
  const resolvedParams = await params;
  const resiId = decodeURIComponent(resolvedParams.id);

  // 2. Ambil data transaksi lama berdasarkan No Resi untuk ditampilkan kembali di form
  const [transaction] = await sql`SELECT * FROM transaksi WHERE resi = ${resiId}`;
  
  // 3. Ambil seluruh daftar maskapai penerbangan alternatif yang tersedia dari database
  const kendaraanList = await sql`SELECT * FROM kendaraan WHERE status_kendaraan = 'Tersedia'`;

  if (!transaction) {
    return (
      <div className="p-6 text-red-500 font-bold">
        Error: Data transaksi kargo dengan resi {resiId} tidak ditemukan!
      </div>
    );
  }

  // 4. Server Action untuk mengeksekusi UPDATE database saat tombol simpan diklik
  async function updateCargo(formData: FormData) {
    'use server';

    const kendaraanId = formData.get('kendaraan_id') as string;
    const statusPengiriman = formData.get('status_pengiriman') as string;
    const tarif = formData.get('tarif') as string;

    // Menjalankan Query SQL UPDATE ke database Neon
    await sql`
      UPDATE transaksi 
      SET 
        kendaraan_id = ${kendaraanId},
        status_pengiriman = ${statusPengiriman},
        tarif = ${tarif}
      WHERE resi = ${resiId}
    `;

    // Membersihkan cache halaman lama agar data tabel termutakhirkan
    revalidatePath('/dashboard/manifest');
    
    // Alihkan kembali halaman ke dashboard manifest utama
    redirect('/dashboard/manifest');
  }

  return (
    <>
      <Topbar title="Edit Manifest Kargo" />
      <div className="p-6 text-black max-w-2xl mx-auto">
        <h1 className="text-lg font-bold text-[#0d1a4a] mb-1">Edit Pengiriman Kargo</h1>
        <p className="text-xs text-gray-500 mb-6">Ubah jenis armada penerbangan pesawat atau status logistik kargo.</p>

        <form action={updateCargo} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
          
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

          {/* 1. SELEKSI PENGUBAHAN ARMADA PESAWAT */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Pilih Pesawat / Armada Baru</label>
            <select 
              name="kendaraan_id" 
              defaultValue={transaction.kendaraan_id || ""} 
              required 
              className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="" disabled>-- Pilih Armada Pengganti --</option>
              {kendaraanList.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama_kendaraan} ({k.kode_kendaraan}) — Kapasitas: {k.kapasitas_muatan} kg
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
              required 
              className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          {/* Tombol Aksi Kendali Form */}
          <div className="flex justify-end gap-2 mt-4 border-t pt-4">
            <a href="/dashboard/manifest" className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 text-xs font-semibold transition">
              BATAL
            </a>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold shadow-sm transition">
              SIMPAN PERUBAHAN
            </button>
          </div>

        </form>
      </div>
    </>
  );
}