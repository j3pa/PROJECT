import postgres from 'postgres';
import Link from 'next/link';
import Topbar from '@/app/ui/dashboard/topbar';
import StatCard from '@/app/ui/dashboard/stat-card';
import CargoTable from '@/app/ui/dashboard/cargo-table';
import MonthlyBookingChart from '@/app/ui/dashboard/monthly-booking-chart';

export const metadata = {
  title: 'Dashboard Operator',
};

// Inisialisasi koneksi database Neon
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export const dynamic = 'force-dynamic';

function getDateFilterValue(value: string | Date | null | undefined) {
  if (!value) return '';

  if (typeof value === 'string') {
    const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (dateOnly) return `${dateOnly[1]}-${dateOnly[2]}-${dateOnly[3]}`;
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return '';

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const day = String(parsedDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

interface DashboardPageProps {
  searchParams?: Promise<{
    query?: string;
    status?: string;
    date?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const query = resolvedSearchParams?.query?.trim().toLowerCase() || '';
  const statusFilter = resolvedSearchParams?.status?.trim() || '';
  const dateFilter = resolvedSearchParams?.date?.trim() || '';
  let transactions: any[] = [];
  let kendaraanAktif = 0;

  try {
    transactions = await sql`
      SELECT
        t.*,
        k.nama_kendaraan,
        k.kode_kendaraan
      FROM transaksi t
      LEFT JOIN kendaraan k ON t.kendaraan_id = k.id
      ORDER BY t.tanggal_kirim DESC
    `;

    const totalKendaraanAktif = await sql`
      SELECT COUNT(*) AS count
      FROM kendaraan
      WHERE status_kendaraan IN ('Aktif', 'Tersedia')
    `;

    kendaraanAktif = Number(totalKendaraanAktif[0]?.count || 0);
  } catch (error) {
    try {
      transactions = await sql`
        SELECT * FROM transaksi ORDER BY tanggal_kirim DESC
      `;
    } catch (fallbackError) {
      console.error('Database gagal memuat data kargo:', fallbackError);
      transactions = [];
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const status = transaction.status_pengiriman || transaction.status || '';
    const dateValue = getDateFilterValue(transaction.tanggal_kirim);
    const searchableText = [
      transaction.resi,
      transaction.awb,
      transaction.nama_pengirim,
      transaction.nama_penerima,
      transaction.jenis_barang,
      transaction.kota_tujuan,
      transaction.kode_kendaraan,
      transaction.nama_kendaraan,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return (
      (!query || searchableText.includes(query)) &&
      (!statusFilter || status === statusFilter) &&
      (!dateFilter || dateValue === dateFilter)
    );
  });

  // Hitung statistik secara dinamis dari data transaksi yang sedang difilter
  const totalKargo = filteredTransactions.length;
  const totalSelesai = filteredTransactions.filter(
    (t) =>
      t.status_pengiriman === 'Selesai' ||
      t.status === 'Selesai' ||
      t.status_pengiriman === 'Sampai Tujuan',
  ).length;
  const totalProses = filteredTransactions.filter(
    (t) =>
      t.status_pengiriman === 'Diproses' ||
      t.status_pengiriman === 'Dalam Pengiriman' ||
      t.status_pengiriman === 'Pending' ||
      t.status === 'Sortation' ||
      t.status === 'Loaded',
  ).length;
  const tanggalHariIni = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
  return (
    <>
      <Topbar title="Dashboard Operator" />

    <div className="min-h-full bg-[#f7f9fc] px-6 py-7 text-black lg:px-9">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[38px] font-bold tracking-tight text-[#0d1a4a]">Dashboard Operator</h1>
          <p className="mt-1 text-[14px] text-gray-500">{tanggalHariIni} - Shift Pagi</p>
        </div>
      </div>

      <form action="/dashboard" className="mb-6 grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:grid-cols-[1.5fr_1fr_1fr_auto]">
        <input
          type="text"
          name="query"
          defaultValue={resolvedSearchParams?.query || ''}
          placeholder="Cari AWB, pengirim, penerima, tujuan, atau penerbangan"
          className="min-h-[52px] rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 text-[16px] text-gray-700 outline-none focus:border-blue-500 focus:bg-white"
        />
        <select
          name="status"
          defaultValue={statusFilter}
          className="min-h-[52px] rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 text-[16px] text-gray-700 outline-none focus:border-blue-500 focus:bg-white"
        >
          <option value="">Semua Status</option>
          <option value="Pending">Pending</option>
          <option value="Diproses">Diproses</option>
          <option value="Dalam Pengiriman">Dalam Pengiriman</option>
          <option value="Sampai Tujuan">Sampai Tujuan</option>
          <option value="Selesai">Selesai</option>
        </select>
        <input
          type="date"
          name="date"
          defaultValue={dateFilter}
          className="min-h-[52px] rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 text-[16px] text-gray-700 outline-none focus:border-blue-500 focus:bg-white"
        />
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="min-h-[52px] rounded-xl bg-[#0d1a4a] px-6 py-3 text-[15px] font-bold text-white shadow-sm hover:bg-[#152665]"
          >
            FILTER
          </button>
          {(query || statusFilter || dateFilter) ? (
            <Link
              href="/dashboard"
              className="flex min-h-[52px] items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-[15px] font-bold text-gray-600 hover:bg-gray-50"
            >
              RESET
            </Link>
          ) : null}
        </div>
      </form>

      <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Selesai / Sampai"
          value={totalSelesai.toString()}
          sub="Kargo sukses terkirim"
          dotColor="#22c55e"
          valueColor="text-green-600"
          tone="green"
          icon="box"
        />
        <StatCard
          label="Sedang Diproses"
          value={totalProses.toString()}
          sub="Dalam manifest aktif"
          dotColor="#f59e0b"
          valueColor="text-orange-600"
          tone="orange"
          icon="clock"
        />
        <StatCard
          label="Total Transaksi"
          value={totalKargo.toString()}
          sub="Semua riwayat di database"
          dotColor="#3b82f6"
          valueColor="text-blue-600"
          tone="blue"
          icon="document"
        />
        <StatCard
          label="Penerbangan Aktif"
          value={kendaraanAktif.toString()}
          sub="Armada udara siap"
          dotColor="#8b5cf6"
          valueColor="text-purple-700"
          tone="purple"
          icon="plane"
        />
      </div>

      <MonthlyBookingChart transactions={filteredTransactions} />

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <CargoTable transactions={filteredTransactions} actionMode="detail" />
      </div>
    </div>
    </>
  );
}
