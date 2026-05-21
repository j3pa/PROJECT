import Topbar from '@/app/ui/dashboard/topbar'

interface Flight {
  nomor: string
  rute: string
  status: 'On-time' | 'Delayed' | 'Boarding'
  delayMenit?: number
  labelKiri: string
  labelKanan: string
  jamKiri: string
  jamKanan: string
  info: string
  progress: number
}

const flights: Flight[] = [
  {
    nomor: 'GA – 401',
    rute: 'CGK → SUB',
    status: 'On-time',
    labelKiri: 'Berangkat',
    labelKanan: 'Tiba',
    jamKiri: '06:30',
    jamKanan: '07:45',
    info: '18 kargo • Sudah terbang',
    progress: 100,
  },
  {
    nomor: 'JT – 712',
    rute: 'CGK → BPN',
    status: 'Delayed',
    delayMenit: 35,
    labelKiri: 'Jadwal',
    labelKanan: 'Estimasi',
    jamKiri: '08:45',
    jamKanan: '09:20',
    info: '24 kargo • Menunggu di gate',
    progress: 0,
  },
  {
    nomor: 'ID - 203',
    rute: 'CGK → MAK',
    status: 'On-time',
    labelKiri: 'Berangkat',
    labelKanan: 'Tiba',
    jamKiri: '08:00',
    jamKanan: '09:30',
    info: '12 kargo • Sedang take-off',
    progress: 80,
  },
  {
    nomor: 'ID – 305',
    rute: 'CGK → DPS',
    status: 'On-time',
    labelKiri: 'Berangkat',
    labelKanan: 'Tiba',
    jamKiri: '09:15',
    jamKanan: '10:50',
    info: '31 kargo • Sedang loading',
    progress: 0,
  },
  {
    nomor: 'GA – 552',
    rute: 'CGK → MDN',
    status: 'Boarding',
    labelKiri: 'Berangkat',
    labelKanan: 'Tiba',
    jamKiri: '10:00',
    jamKanan: '12:15',
    info: '22 kargo • Loaded semua',
    progress: 0,
  },
  {
    nomor: 'SJ – 200',
    rute: 'CGK → UPG',
    status: 'Delayed',
    delayMenit: 20,
    labelKiri: 'Jadwal',
    labelKanan: 'Estimasi',
    jamKiri: '11:30',
    jamKanan: '11:50',
    info: '15 kargo • 3 belum loaded',
    progress: 0,
  },
  {
    nomor: 'GA – 803',
    rute: 'CGK → PLM',
    status: 'On-time',
    labelKiri: 'Berangkat',
    labelKanan: 'Tiba',
    jamKiri: '13:00',
    jamKanan: '14:20',
    info: '10 kargo • Sortasi selesai',
    progress: 0,
  },
]

function StatusBadge({ status, delayMenit }: { status: Flight['status']; delayMenit?: number }) {
  if (status === 'On-time') {
    return (
      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">
        On-time
      </span>
    )
  }
  if (status === 'Boarding') {
    return (
      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
        Boarding
      </span>
    )
  }
  return (
    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-600">
      Delayed {delayMenit}m
    </span>
  )
}

function FlightCard({ flight }: { flight: Flight }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[15px] font-bold text-[#0d1a4a]">{flight.nomor}</p>
          <p className="text-[12px] text-gray-400 mt-0.5">{flight.rute}</p>
        </div>
        <StatusBadge status={flight.status} delayMenit={flight.delayMenit} />
      </div>

      {/* Time row */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-[11px] text-gray-400 mb-1">{flight.labelKiri}</p>
          <p className={`text-[26px] font-bold leading-none ${
            flight.status === 'Delayed' ? 'text-gray-800' : 'text-[#0d1a4a]'
          }`}>
            {flight.jamKiri}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-gray-400 mb-1">{flight.labelKanan}</p>
          <p className={`text-[26px] font-bold leading-none ${
            flight.status === 'Delayed' ? 'text-orange-500' : 'text-[#0d1a4a]'
          }`}>
            {flight.jamKanan}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-100 rounded-full mb-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            flight.status === 'Delayed' ? 'bg-orange-400' :
            flight.status === 'Boarding' ? 'bg-blue-400' : 'bg-[#0d1a4a]'
          }`}
          style={{ width: `${flight.progress}%` }}
        />
      </div>

      {/* Info footer */}
      <p className="text-[11.5px] text-gray-400">{flight.info}</p>
    </div>
  )
}

export default function PenerbanganPage() {
  const onTime  = flights.filter(f => f.status === 'On-time').length
  const delayed = flights.filter(f => f.status === 'Delayed').length
  const boarding = flights.filter(f => f.status === 'Boarding').length

  return (
    <>
      <Topbar title="Status Penerbangan" />

      <div className="p-6">
        {/* Page header */}
        <h1 className="text-[18px] font-bold text-[#0d1a4a] mb-1">Status Penerbangan</h1>
        <p className="text-[11px] text-gray-500 mb-5">Pembaruan real-time jadwal penerbangan kargo</p>

        {/* Summary pills */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[12px] font-semibold text-gray-700">{onTime} On-time</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            <span className="text-[12px] font-semibold text-gray-700">{delayed} Delayed</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-[12px] font-semibold text-gray-700">{boarding} Boarding</span>
          </div>
          <span className="text-[11px] text-gray-400 ml-auto">
            Total {flights.length} penerbangan hari ini
          </span>
        </div>

        {/* Flight cards grid */}
        <div className="grid grid-cols-3 gap-4">
          {flights.map(f => (
            <FlightCard key={f.nomor} flight={f} />
          ))}
        </div>
      </div>
    </>
  )
}