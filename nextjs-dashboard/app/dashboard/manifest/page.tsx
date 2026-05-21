'use client'

import { useState } from 'react'
import Topbar from '@/app/ui/dashboard/topbar'

interface ManifestRow {
  awb: string
  pengirim: string
  tujuan: string
  koli: number
  berat: string
  penerbangan: string
  status: 'Received' | 'Sortation' | 'Loaded' | 'Departed' | 'Arrived'
  waktuUpdate: string
}

const allData: ManifestRow[] = [
  { awb: '001-2847391', pengirim: 'PT Solusi Maju',  tujuan: 'SUB', koli: 3, berat: '50 kg',   penerbangan: 'GA – 136',  status: 'Received',  waktuUpdate: '05.12' },
  { awb: '001-2847392', pengirim: 'PT Nusantara',    tujuan: 'DPS', koli: 1, berat: '7.5 kg',  penerbangan: 'IU – 602',  status: 'Sortation', waktuUpdate: '05.41' },
  { awb: '001-2847393', pengirim: 'PT Cahaya Baru',  tujuan: 'MDN', koli: 8, berat: '33 kg',   penerbangan: 'JT – 892',  status: 'Loaded',    waktuUpdate: '06.05' },
  { awb: '001-2847394', pengirim: 'CV Berkah Jaya',  tujuan: 'UPG', koli: 1, berat: '45 kg',   penerbangan: 'ID – 7531', status: 'Received',  waktuUpdate: '06.03' },
  { awb: '001-2847395', pengirim: 'UD Makmur',       tujuan: 'BPN', koli: 4, berat: '12.5 kg', penerbangan: 'SJ – 200',  status: 'Departed',  waktuUpdate: '07.22' },
  { awb: '001-2847396', pengirim: 'PT Permata',      tujuan: 'PLM', koli: 2, berat: '41 kg',   penerbangan: 'GA – 803',  status: 'Sortation', waktuUpdate: '06.47' },
  { awb: '001-2847397', pengirim: 'CV Mitra Abadi',  tujuan: 'JOG', koli: 1, berat: '120 kg',  penerbangan: 'QG – 778',  status: 'Received',  waktuUpdate: '06.50' },
  { awb: '001-2847398', pengirim: 'PT Angkasa',      tujuan: 'BDJ', koli: 6, berat: '88 kg',   penerbangan: 'GA – 910',  status: 'Loaded',    waktuUpdate: '07.10' },
  { awb: '001-2847399', pengirim: 'UD Prima',        tujuan: 'TIM', koli: 2, berat: '27 kg',   penerbangan: 'ID – 820',  status: 'Received',  waktuUpdate: '07.18' },
  { awb: '001-2847400', pengirim: 'PT Sinar Jaya',   tujuan: 'BTH', koli: 3, berat: '41 kg',   penerbangan: 'SJ – 440',  status: 'Arrived',   waktuUpdate: '07.55' },
]

const badgeStyle: Record<ManifestRow['status'], string> = {
  Received:  'bg-blue-100 text-blue-700',
  Sortation: 'bg-orange-100 text-orange-600',
  Loaded:    'bg-gray-200 text-gray-700',
  Departed:  'bg-purple-100 text-purple-700',
  Arrived:   'bg-green-100 text-green-700',
}

const PERIODS = ['Harian', 'Mingguan', 'Bulanan']

export default function ManifestPage() {
  const [period, setPeriod]   = useState('Harian')
  const [showDrop, setShowDrop] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const totalPages = Math.ceil(allData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = allData.slice(startIndex, endIndex)

  function handleExport() {
    const headers = ['No AWB', 'Pengirim', 'Tujuan', 'Koli', 'Berat', 'Penerbangan', 'Status', 'Waktu Update']
    const rows = allData.map(r =>
      [r.awb, r.pengirim, r.tujuan, r.koli, r.berat, r.penerbangan, r.status, r.waktuUpdate].join(',')
    )
    const csv  = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = Object.assign(document.createElement('a'), {
      href: url,
      download: `manifest-${period.toLowerCase()}-06-apr-2026.csv`,
    })
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Topbar title="Manifest Kargo" />

      <div className="p-6">
        {/* Page header */}
        <h1 className="text-[18px] font-bold text-[#0d1a4a] mb-1">Manifest Kargo</h1>
        <p className="text-[11px] text-gray-500 mb-5">
          Data lengkap pengiriman – diperbarui otomatis
        </p>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-[14px] font-bold text-[#0d1a4a]">
              Manifest Harian • 06 April 2026
            </h2>

            <div className="flex items-center gap-2">
              {/* Period dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDrop(d => !d)}
                  className="flex items-center gap-2 h-9 px-3 border border-gray-200 rounded-lg text-[12px] font-semibold text-gray-700 bg-white hover:bg-gray-50 transition"
                >
                  {period.toUpperCase()}
                  <svg className="w-3 h-3 text-gray-500" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="4,6 8,10 12,6"/>
                  </svg>
                </button>
                {showDrop && (
                  <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden min-w-[120px]">
                    {PERIODS.map(p => (
                      <button
                        key={p}
                        onClick={() => { setPeriod(p); setShowDrop(false) }}
                        className={`w-full text-left px-4 py-2.5 text-[12px] font-medium hover:bg-gray-50 transition ${
                          period === p ? 'text-blue-700 font-semibold bg-blue-50' : 'text-gray-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Export button */}
              <button
                onClick={handleExport}
                className="h-9 px-4 border border-gray-200 rounded-lg text-[12px] font-semibold text-gray-700 bg-white hover:bg-gray-50 transition"
              >
                EXPORT
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {['NO AWB', 'PENGIRIM', 'TUJUAN', 'KOLI', 'BERAT', 'PENERBANGAN', 'STATUS', 'WAKTU UPDATE'].map(h => (
                    <th
                      key={h}
                      className="text-left px-6 py-3 text-[10.5px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, i) => (
                  <tr
                    key={row.awb}
                    className={`border-b border-gray-50 hover:bg-blue-50/30 transition ${
                      i === paginatedData.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-6 py-4 font-mono text-blue-600 font-semibold text-[12px] whitespace-nowrap">
                      {row.awb}
                    </td>
                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                      {row.pengirim}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {row.tujuan}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {row.koli}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {row.berat}
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-600 text-[12px] whitespace-nowrap">
                      {row.penerbangan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${badgeStyle[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-400 text-[12px] whitespace-nowrap">
                      {row.waktuUpdate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[11px] text-gray-400">
              Total {allData.length} kargo ·{' '}
              {allData.reduce((sum, r) => sum + r.koli, 0)} koli ·{' '}
              {allData.filter(r => r.status === 'Arrived' || r.status === 'Departed').length} sudah dikirim
            </p>
            
            {/* Pagination */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-[11px] font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ← Sebelumnya
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2.5 py-1.5 text-[11px] font-medium rounded-lg transition ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-[11px] font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Berikutnya →
              </button>
            </div>

            <p className="text-[11px] text-gray-400">
              Periode: <span className="font-semibold text-gray-600">{period}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}