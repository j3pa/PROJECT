import Link from 'next/link';
import Topbar from '@/app/ui/dashboard/topbar';
import { createKendaraan } from '@/app/lib/actions';

export const dynamic = 'force-dynamic';

export default function CreateKendaraanPage() {
  return (
    <>
      <Topbar title="Tambah Kendaraan" />

      <div className="p-6 text-black max-w-3xl mx-auto">
        <h1 className="text-lg font-bold text-[#0d1a4a] mb-1">Tambah Armada Kendaraan</h1>
        <p className="text-xs text-gray-500 mb-6">
          Masukkan data kendaraan baru agar bisa dipakai pada form manifest dan operasional harian.
        </p>

        <form action={createKendaraan} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Nama Kendaraan</label>
              <input name="nama_kendaraan" type="text" required minLength={2} className="border rounded-md p-2 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Jenis Kendaraan</label>
              <input name="jenis_kendaraan" type="text" required minLength={2} className="border rounded-md p-2 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Kode / Plat Kendaraan</label>
              <input name="kode_kendaraan" type="text" required minLength={3} className="border rounded-md p-2 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Kapasitas Muatan (Kg)</label>
              <input name="kapasitas_muatan" type="number" required min={1} className="border rounded-md p-2 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Status Kendaraan</label>
            <select name="status_kendaraan" required defaultValue="Aktif" className="border rounded-md p-2 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option value="Aktif">Aktif</option>
              <option value="Tersedia">Tersedia</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Tidak Tersedia">Tidak Tersedia</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4 border-t pt-4">
            <Link href="/dashboard/kendaraan" className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 text-xs font-semibold transition">
              BATAL
            </Link>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold shadow-sm transition">
              SIMPAN KENDARAAN
            </button>
          </div>
        </form>
      </div>
    </>
  );
}