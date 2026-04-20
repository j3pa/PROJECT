'use client'

import { useState } from 'react'

export interface CargoRow {
  awb: string
  pengirim: string
  penerima: string
  tujuan: string
  berat: string
  penerbangan: string
  waktuMasuk: string
  status: 'Received' | 'Loaded' | 'Sortation' | 'Departed' | 'Arrived'
}

const badgeClass: Record<CargoRow['status'], string> = {
  Received:  'badge-received',
  Loaded:    'badge-loaded',
  Sortation: 'badge-sortation',
  Departed:  'badge-departed',
  Arrived:   'badge-arrived',
}

const STATUSES: Array<CargoRow['status'] | 'Semua Status'> = [
  'Semua Status', 'Received', 'Loaded', 'Sortation', 'Departed', 'Arrived',
]

interface CargoTableProps {
  data: CargoRow[]
}

export default function CargoTable({ data }: CargoTableProps) {
  const [filter, setFilter] = useState<string>('Semua Status')

  const filtered = filter === 'Semua Status'
    ? data
    : data.filter(r => r.status === filter)

  function handleExport() {
    const headers = ['No AWB', 'Pengirim', 'Penerima', 'Tujuan', 'Berat', 'Penerbangan', 'Waktu Masuk', 'Status']
    const rows = filtered.map(r =>
      [r.awb, r.pengirim, r.penerima, r.tujuan, r.berat, r.penerbangan, r.waktuMasuk, r.status].join(',')
    )
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = Object.assign(document.createElement('a'), { href: url, download: 'kargo-export.csv' })
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Table header row */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-[13px] font-bold text-[#0d1a4a]">Semua Kargo Masuk Hari Ini</h2>
        <div className="flex items-center gap-2">
          {/* Filter dropdown */}
          <div className="relative">
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="appearance-none text-[11.5px] font-semibold border border-gray-200 rounded-lg px-3 py-2 pr-7 bg-white text-gray-700 cursor-pointer focus:outline-none focus:border-blue-400"
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <svg className="w-3 h-3 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="4,6 8,10 12,6"/>
            </svg>
          </div>

          {/* Export button */}
          <button
            onClick={handleExport}
            className="text-[11.5px] font-semibold border border-gray-200 rounded-lg px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition"
          >
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['NO AWB', 'PENGIRIM', 'PENERIMA', 'TUJUAN', 'BERAT', 'PENERBANGAN', 'WAKTU MASUK', 'STATUS'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[10.5px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={row.awb} className={`border-b border-gray-50 hover:bg-blue-50/40 transition ${i % 2 === 0 ? '' : ''}`}>
                <td className="px-5 py-3 font-mono text-blue-700 font-semibold text-[11px] whitespace-nowrap">{row.awb}</td>
                <td className="px-5 py-3 text-gray-700 whitespace-nowrap">{row.pengirim}</td>
                <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{row.penerima}</td>
                <td className="px-5 py-3 text-gray-700 whitespace-nowrap">{row.tujuan}</td>
                <td className="px-5 py-3 text-gray-700 whitespace-nowrap">{row.berat}</td>
                <td className="px-5 py-3 font-mono text-gray-700 text-[11px] whitespace-nowrap">{row.penerbangan}</td>
                <td className="px-5 py-3 text-gray-700 whitespace-nowrap">{row.waktuMasuk}</td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <span className={`badge ${badgeClass[row.status]} text-[10.5px] font-bold px-3 py-1 rounded-full`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-gray-400 text-sm">
                  Tidak ada data untuk filter ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}