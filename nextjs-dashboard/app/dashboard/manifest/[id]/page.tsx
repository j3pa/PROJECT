
import Link from 'next/link';
import postgres from 'postgres';
import Topbar from '@/app/ui/dashboard/topbar';
import { formatWibDate } from '@/app/lib/time';

export const metadata = {
  title: 'Detail Manifest',
};

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export const dynamic = 'force-dynamic';

function formatTanggal(value: string | Date | null | undefined) {
  return formatWibDate(value, '-');
}

function formatRupiah(value: number | string | null | undefined) {
  const nominal = Number(value || 0);

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(nominal);
}

function getStatusClass(status: string) {
  const map: Record<string, string> = {
    Pending: 'bg-gray-100 text-gray-600 border border-gray-200',
    Diproses: 'bg-amber-50 text-amber-700 border border-amber-100',
    'Dalam Pengiriman': 'bg-blue-50 text-blue-700 border border-blue-100',
    'Sampai Tujuan': 'bg-purple-50 text-purple-700 border border-purple-100',
    Selesai: 'bg-green-50 text-green-700 border border-green-100',
  };

  return map[status] || 'bg-gray-100 text-gray-600 border border-gray-200';
}

export default async function ManifestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let cargo: any = null;

  try {
    const rows = await sql`
      SELECT
        t.*,
        k.nama_kendaraan,
        k.kode_kendaraan,
        k.jenis_kendaraan,
        k.status_kendaraan
      FROM transaksi t
      LEFT JOIN kendaraan k ON t.kendaraan_id = k.id
      WHERE t.resi = ${decodeURIComponent(id)}
      LIMIT 1
    `;

    cargo = rows[0] ?? null;
  } catch (error) {
    console.error('Gagal memuat detail manifest:', error);
  }

  return (
    <>
      <Topbar title="Detail Manifest Kargo" />

      <div className="mx-auto max-w-5xl p-6 text-black">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-[18px] font-bold text-[#0d1a4a]">Detail Data Kargo</h1>
            <p className="mt-1 text-[12px] text-gray-500">
              Ringkasan lengkap data pengiriman yang dipilih dari dashboard.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/dashboard"
              className="rounded-md border border-gray-200 px-4 py-2 text-[11px] font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              KEMBALI
            </Link>
            {cargo ? (
              <Link
                href={`/dashboard/manifest/${encodeURIComponent(cargo.resi)}/edit`}
                className="rounded-md bg-blue-600 px-4 py-2 text-[11px] font-bold text-white transition hover:bg-blue-700"
              >
                EDIT DATA
              </Link>
            ) : null}
          </div>
        </div>

        {!cargo ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-[13px] text-red-600">
            Data manifest tidak ditemukan atau belum bisa dimuat dari database.
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Nomor AWB</p>
                  <h2 className="mt-2 font-mono text-[22px] font-bold text-[#0d1a4a]">{cargo.resi}</h2>
                  <p className="mt-1 text-[12px] text-gray-500">
                    Dibuat pada {formatTanggal(cargo.created_at || cargo.tanggal_kirim)}
                  </p>
                </div>
                <span className={`inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-bold ${getStatusClass(cargo.status_pengiriman)}`}>
                  {cargo.status_pengiriman}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-5 md:grid-cols-2">
                <div className="rounded-xl bg-gray-50 px-4 py-3">
                  <p className="text-[11px] font-bold uppercase text-gray-400">Pengirim</p>
                  <p className="mt-1 text-[15px] font-semibold text-gray-800">{cargo.nama_pengirim}</p>
                  <p className="mt-1 text-[12px] text-gray-500">Telepon: {cargo.no_telepon}</p>
                </div>
                <div className="rounded-xl bg-gray-50 px-4 py-3">
                  <p className="text-[11px] font-bold uppercase text-gray-400">Penerima</p>
                  <p className="mt-1 text-[15px] font-semibold text-gray-800">{cargo.nama_penerima}</p>
                  <p className="mt-1 text-[12px] text-gray-500">Tujuan akhir: {cargo.kota_tujuan}</p>
                </div>
                <div className="rounded-xl bg-gray-50 px-4 py-3">
                  <p className="text-[11px] font-bold uppercase text-gray-400">Rute Pengiriman</p>
                  <p className="mt-1 text-[15px] font-semibold text-gray-800">
                    {cargo.kota_asal} ke {cargo.kota_tujuan}
                  </p>
                  <p className="mt-1 text-[12px] text-gray-500">Tanggal kirim: {formatTanggal(cargo.tanggal_kirim)}</p>
                </div>
                <div className="rounded-xl bg-gray-50 px-4 py-3">
                  <p className="text-[11px] font-bold uppercase text-gray-400">Barang</p>
                  <p className="mt-1 text-[15px] font-semibold text-gray-800">{cargo.jenis_barang}</p>
                  <p className="mt-1 text-[12px] text-gray-500">Berat: {cargo.berat_barang} kg</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-[14px] font-bold text-[#0d1a4a]">Detail Armada</h3>
                <div className="mt-4 space-y-3 text-[13px] text-gray-600">
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3">
                    <span>Nama Kendaraan</span>
                    <span className="font-semibold text-gray-800">{cargo.nama_kendaraan || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3">
                    <span>Kode Kendaraan</span>
                    <span className="font-mono font-semibold text-gray-800">{cargo.kode_kendaraan || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3">
                    <span>Jenis Kendaraan</span>
                    <span className="font-semibold text-gray-800">{cargo.jenis_kendaraan || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3">
                    <span>Status Armada</span>
                    <span className="font-semibold text-gray-800">{cargo.status_kendaraan || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-[14px] font-bold text-[#0d1a4a]">Ringkasan Transaksi</h3>
                <div className="mt-4 space-y-3 text-[13px] text-gray-600">
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3">
                    <span>Jenis Pengiriman</span>
                    <span className="font-semibold text-gray-800">{cargo.jenis_pengiriman}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3">
                    <span>Tarif</span>
                    <span className="font-semibold text-gray-800">{formatRupiah(cargo.tarif)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3">
                    <span>Update Terakhir</span>
                    <span className="font-semibold text-gray-800">{formatTanggal(cargo.updated_at)}</span>
                  </div>
                  <div className="rounded-xl bg-gray-50 px-4 py-3">
                    <p className="text-[11px] font-bold uppercase text-gray-400">Deskripsi Barang</p>
                    <p className="mt-2 leading-6 text-gray-700">{cargo.catatan}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
