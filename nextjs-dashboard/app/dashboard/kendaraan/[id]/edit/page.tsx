import postgres from 'postgres';
import Topbar from '@/app/ui/dashboard/topbar';
import KendaraanForm from '@/app/ui/dashboard/kendaraan-form';
import { updateKendaraan } from '@/app/lib/actions';

export const metadata = {
  title: 'Edit Kendaraan',
};

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export const dynamic = 'force-dynamic';

interface EditKendaraanPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditKendaraanPage({ params }: EditKendaraanPageProps) {
  const resolvedParams = await params;
  const kendaraanId = decodeURIComponent(resolvedParams.id);

  const kendaraanRows = await sql`
    SELECT *
    FROM kendaraan
    WHERE id = ${kendaraanId}
    LIMIT 1
  `;

  const kendaraan = kendaraanRows[0];

  if (!kendaraan) {
    return (
      <>
        <Topbar title="Edit Kendaraan" />
        <div className="p-6 text-red-600 font-bold">
          Data kendaraan dengan ID {kendaraanId} tidak ditemukan.
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title="Edit Kendaraan" />

      <div className="p-6 text-black">
        <h1 className="text-lg font-bold text-[#0d1a4a] mb-1">Edit Armada Kendaraan</h1>
        <p className="text-xs text-gray-500 mb-6">
          Perbarui informasi kendaraan agar tetap sinkron dengan manifest dan dashboard operasional.
        </p>

        <KendaraanForm
          action={updateKendaraan.bind(null, kendaraanId)}
          initialValues={kendaraan}
          submitLabel="SIMPAN PERUBAHAN"
        />
      </div>
    </>
  );
}
