import postgres from 'postgres';
import Topbar from '@/app/ui/dashboard/topbar';
import StatCard from '@/app/ui/dashboard/stat-card';
import CargoTable from '@/app/ui/dashboard/cargo-table';

// Inisialisasi koneksi database Neon
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let transactions: any[] = [];

  try {
    // KEMUNGKINAN 1: Mencoba JOIN standard menggunakan tabel manifest sebagai jembatan
    transactions = await sql`
      SELECT 
        t.*, 
        p.kode_penerbangan,
        k.nama_kendaraan,
        k.kode_kendaraan,
        b_asal.kota AS kota_asal,
        b_tujuan.kota AS kota_tujuan
      FROM transaksi t
      LEFT JOIN manifest m ON (t.id = m.transaksi_id OR t.resi = m.transaksi_resi)
      LEFT JOIN penerbangan p ON m.penerbangan_id = p.id
      LEFT JOIN kendaraan k ON p.kendaraan_id = k.id
      LEFT JOIN bandara b_asal ON p.bandara_asal_id = b_asal.id
      LEFT JOIN bandara b_tujuan ON p.bandara_tujuan_id = b_tujuan.id
      ORDER BY t.tanggal_kirim DESC
    `;
  } catch (error) {
    try {
      // KEMUNGKINAN 2 (FALLBACK): Jika tabel manifest ternyata tidak punya kaitan langsung,
      // kita coba tarik data transaksi murni terlebih dahulu agar halaman tidak crash/blank screen
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
  const totalProses = transactions.filter(t => t.status_pengiriman === 'Diproses' || t.status_pengiriman === 'Dalam Pengiriman' || t.status === 'Sortation' || t.status === 'Loaded').length;

  return (
    <>
      <Topbar title="Dashboard Operator" />

      <div className="p-6">
        {/* Heading */}
        <div className="mb-5">
          <h1 className="text-[18px] font-bold text-[#0d1a4a]">Dashboard Operator</h1>
          <p className="text-[11px] text-gray-500 mt-0.5">Senin, 06 April 2026 · Shift Pagi</p>
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
            value="5"
            sub="Armada udara siap"
            valueColor="text-blue-800"
          />
        </div>

        {/* Komponen Tabel Utama */}
        <CargoTable transactions={transactions} />
      </div>
    </>
  );
}