import Topbar from '@/app/ui/dashboard/topbar';
import KendaraanForm from '@/app/ui/dashboard/kendaraan-form';
import { createKendaraan } from '@/app/lib/actions';

export const metadata = {
  title: 'Tambah Kendaraan',
};

export const dynamic = 'force-dynamic';

export default function CreateKendaraanPage() {
  return (
    <>
      <Topbar title="Tambah Kendaraan" />

      <div className="p-6 text-black">
        <h1 className="text-lg font-bold text-[#0d1a4a] mb-1">Tambah Armada Kendaraan</h1>
        <p className="text-xs text-gray-500 mb-6">
          Masukkan data kendaraan baru agar bisa dipakai pada form manifest dan operasional harian.
        </p>

        <KendaraanForm action={createKendaraan} submitLabel="SIMPAN KENDARAAN" />
      </div>
    </>
  );
}
