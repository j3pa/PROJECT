import Topbar    from '@/app/ui/dashboard/topbar'
import StatCard  from '@/app/ui/dashboard/stat-card'
import CargoTable, { CargoRow } from '@/app/ui/dashboard/cargo-table'

const cargoData: CargoRow[] = [
  { awb: '001-2847391', pengirim: 'PT Solusi Maju',   penerima: 'Rizky Jerico',  tujuan: 'SUB', berat: '50 kg',  penerbangan: 'GA – 136',  waktuMasuk: '05.12', status: 'Received'  },
  { awb: '001-2847392', pengirim: 'PT Nusantara',     penerima: 'Andi Pratama',  tujuan: 'DPS', berat: '7.5 kg', penerbangan: 'IU – 602',  waktuMasuk: '05.28', status: 'Loaded'    },
  { awb: '001-2847393', pengirim: 'PT Cahaya Baru',   penerima: 'Dewi Sartika',  tujuan: 'MDN', berat: '33 kg',  penerbangan: 'JT – 892',  waktuMasuk: '05.44', status: 'Sortation' },
  { awb: '001-2847394', pengirim: 'CV Berkah Jaya',   penerima: 'Hanna Safi',    tujuan: 'UPG', berat: '45 kg',  penerbangan: 'ID – 7531', waktuMasuk: '06.02', status: 'Received'  },
  { awb: '001-2847395', pengirim: 'UD Makmur',        penerima: 'Immanuel',      tujuan: 'BPN', berat: '12.5 kg',penerbangan: 'SJ – 200',  waktuMasuk: '06.15', status: 'Loaded'    },
  { awb: '001-2847396', pengirim: 'PT Permata',       penerima: 'Budi Susanto',  tujuan: 'PLM', berat: '41 kg',  penerbangan: 'GA – 803',  waktuMasuk: '06.33', status: 'Received'  },
  { awb: '001-2847397', pengirim: 'CV Mitra Abadi',   penerima: 'Praka Liam',    tujuan: 'JOG', berat: '120 kg', penerbangan: 'QG – 778',  waktuMasuk: '06.49', status: 'Sortation' },
]

export default function DashboardPage() {
  return (
    <>
      <Topbar title="Dashboard Operator" />

      <div className="p-6">
        {/* Page heading */}
        <div className="mb-5">
          <h1 className="text-[18px] font-bold text-[#0d1a4a]">Dashboard Operator</h1>
          <p className="text-[11px] text-gray-500 mt-0.5">Senin, 06 April 2026 · Shift Pagi</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Kargo Hari Ini"
            value="148"
            sub="+12 dari kemarin"
            dotColor="#22c55e"
          />
          <StatCard
            label="Sudah Dimuad (Loaded)"
            value="97"
            sub="65.5% dari total"
            valueColor="text-green-600"
          />
          <StatCard
            label="Menunggu Sortasi"
            value="34"
            sub="3 hampir terlambat"
            dotColor="#f59e0b"
            valueColor="text-orange-500"
          />
          <StatCard
            label="Penerbangan Hari Ini"
            value="8"
            sub="2 delayed · 6 on-time"
            valueColor="text-blue-800"
          />
        </div>

        {/* Cargo table */}
        <CargoTable data={cargoData} />
      </div>
    </>
  )
}