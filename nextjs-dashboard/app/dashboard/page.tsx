import postgres from 'postgres';
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

export default async function DashboardPage() {
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
      console.error("Database gagal memuat data kargo:", fallbackError);
      transactions = [];
    }
  }

  // Hitung statistik secara dinamis dari data transaksi yang berhasil ditarik
  const totalKargo = transactions.length;
  const totalSelesai = transactions.filter(t => t.status_pengiriman === 'Selesai' || t.status === 'Selesai' || t.status_pengiriman === 'Sampai Tujuan').length;
  const totalProses = transactions.filter(t => t.status_pengiriman === 'Diproses' || t.status_pengiriman === 'Dalam Pengiriman' || t.status_pengiriman === 'Pending' || t.status === 'Sortation' || t.status === 'Loaded').length;
  const tanggalHariIni = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <>
      <Topbar title="Dashboard Operator" />

      <div className="p-6">
        {/* Heading */}
        <div className="mb-5">
          <h1 className="text-[18px] font-bold text-[#0d1a4a]">Dashboard Operator</h1>
          <p className="text-[11px] text-gray-500 mt-0.5">{tanggalHariIni} · Shift Pagi</p>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Selesai / Sampai"
            value={totalSelesai.toString()}
            sub="Kargo sukses terkirim"
            dotColor="#22c55e"
            valueColor="text-green-600"
          />
          <StatCard
            label="Sedang Diproses"
            value={totalProses.toString()}
            sub="Dalam manifest aktif"
            dotColor="#f59e0b"
            valueColor="text-orange-600"
          />
          <StatCard
            label="Total Transaksi"
            value={totalKargo.toString()}
            sub="Semua riwayat di database"
            dotColor="#3b82f6"
            valueColor="text-blue-600"
          />
          <StatCard
            label="Penerbangan Aktif"
            value={kendaraanAktif.toString()}
            sub="Armada udara siap"
            valueColor="text-blue-800"
          />
        </div>

        <MonthlyBookingChart transactions={transactions} />

        {/* Komponen Tabel Utama */}
        <CargoTable transactions={transactions} actionMode="detail" />
      </div>
    </>
  );
}
