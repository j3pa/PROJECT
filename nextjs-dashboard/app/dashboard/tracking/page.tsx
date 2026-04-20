'use client'

import { useState } from 'react'
import Topbar from '@/app/ui/dashboard/topbar'

interface TrackingStep {
  label: string
  time: string
  desc: string
  done: boolean
  current?: boolean
}

interface TrackingData {
  awb: string
  pengirim: string
  penerima: string
  berat: string
  tujuan: string
  penerbangan: string
  status: string
  steps: TrackingStep[]
}

const db: Record<string, TrackingData> = {
  '001-2847393': {
    awb: '001-2847393',
    pengirim: 'PT Cahaya Baru',
    penerima: 'Dewi Sartika',
    berat: '33 kg',
    tujuan: 'MDN',
    penerbangan: 'JT – 892',
    status: 'Sortation',
    steps: [
      { label: 'Received',          time: '05.44 · 06 Apr 2026', desc: 'Barang diterima di gudang Bandara Sudirman', done: true },
      { label: 'Sortation',         time: '05.52 · 06 Apr 2026', desc: 'Barang sedang diproses di area sortasi',      done: true, current: true },
      { label: 'Loaded to Aircraft',time: 'Est. 07.00',           desc: 'Barang dimuat ke pesawat JT – 892',          done: false },
      { label: 'Departed',          time: 'Est. 08.45',           desc: 'Pesawat berangkat dari CGK',                 done: false },
      { label: 'Arrived',           time: 'Est. 11.00',           desc: 'Barang tiba di tujuan MDN',                  done: false },
    ],
  },
  '001-2847395': {
    awb: '001-2847395',
    pengirim: 'UD Makmur',
    penerima: 'Immanuel',
    berat: '12.5 kg',
    tujuan: 'BPN',
    penerbangan: 'SJ – 200',
    status: 'Loaded',
    steps: [
      { label: 'Received',          time: '06.15 · 06 Apr 2026', desc: 'Barang diterima di gudang Bandara Sudirman', done: true },
      { label: 'Sortation',         time: '06.28 · 06 Apr 2026', desc: 'Barang selesai proses sortasi',              done: true },
      { label: 'Loaded to Aircraft',time: '06.55 · 06 Apr 2026', desc: 'Barang dimuat ke pesawat SJ – 200',          done: true, current: true },
      { label: 'Departed',          time: 'Est. 09.00',           desc: 'Pesawat berangkat dari CGK',                 done: false },
      { label: 'Arrived',           time: 'Est. 11.30',           desc: 'Barang tiba di tujuan BPN',                  done: false },
    ],
  },
}

const statusColor: Record<string, string> = {
  Received:  'bg-blue-100 text-blue-700',
  Loaded:    'bg-green-100 text-green-700',
  Sortation: 'bg-orange-100 text-orange-600',
  Departed:  'bg-purple-100 text-purple-700',
  Arrived:   'bg-teal-100 text-teal-700',
}

export default function TrackingPage() {
  const [input, setInput]   = useState('')
  const [result, setResult] = useState<TrackingData | null | 'not-found'>(null)

  function handleTrack() {
    const key = input.trim()
    if (!key) return
    const found = db[key]
    setResult(found ?? 'not-found')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleTrack()
  }

  return (
    <>
      <Topbar title="Tracking AWB" />

      <div className="p-6 max-w-3xl">
        <h1 className="text-[18px] font-bold text-[#0d1a4a] mb-1">Tracking Airway Bill</h1>
        <p className="text-[11px] text-gray-500 mb-5">Lacak status pengiriman kargo berdasarkan nomor AWB</p>

        {/* Form input */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-5">
          <label className="block text-[11.5px] font-semibold text-gray-700 mb-2">
            Nomor Airway Bill (AWB)
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Contoh: 001-2847391"
              className="flex-1 h-10 border border-gray-200 rounded-lg px-3 text-[13px] font-mono text-[#0d1a4a] outline-none focus:border-blue-400 bg-gray-50"
            />
            <button
              onClick={handleTrack}
              className="h-10 px-6 bg-blue-700 text-white text-[13px] font-semibold rounded-lg hover:bg-blue-800 transition"
            >
              Lacak Kargo
            </button>
          </div>
          <p className="text-[11px] text-gray-400">
            Coba:{' '}
            <span
              className="font-mono text-blue-600 cursor-pointer hover:underline"
              onClick={() => { setInput('001-2847393'); setResult(db['001-2847393']) }}
            >
              001-2847393
            </span>
            {' · '}
            <span
              className="font-mono text-blue-600 cursor-pointer hover:underline"
              onClick={() => { setInput('001-2847395'); setResult(db['001-2847395']) }}
            >
              001-2847395
            </span>
          </p>
        </div>

        {/* Belum ada data */}
        {result === null && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center">
            {/* Illustration */}
            <div className="mb-6 opacity-40">
              <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
                <circle cx="48" cy="48" r="44" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 4"/>
                <rect x="28" y="32" width="40" height="32" rx="4" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1.5"/>
                <rect x="34" y="38" width="12" height="12" rx="2" fill="#60a5fa"/>
                <rect x="50" y="38" width="12" height="8" rx="1" fill="#93c5fd"/>
                <rect x="50" y="48" width="12" height="2" rx="1" fill="#93c5fd"/>
                <path d="M44 56 Q48 48 56 44" stroke="#1d4ed8" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <circle cx="58" cy="42" r="3" fill="#1d4ed8"/>
                <path d="M56 40 L62 36 L60 44 Z" fill="#f59e0b"/>
              </svg>
            </div>
            <p className="text-[16px] font-semibold text-gray-600 mb-1">Belum ada data tracking</p>
            <p className="text-[13px] text-gray-400">Masukkan nomor AWB untuk melihat status pengiriman</p>
          </div>
        )}

        {/* AWB tidak ditemukan */}
        {result === 'not-found' && (
          <div className="bg-white border border-red-200 rounded-xl p-10 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-gray-700 mb-1">AWB Tidak Ditemukan</p>
            <p className="text-[12px] text-gray-400 mb-4 text-center">
              Nomor <span className="font-mono text-red-500">{input}</span> tidak ada di sistem.<br/>
              Periksa kembali atau hubungi petugas.
            </p>
            <button
              onClick={() => { setInput(''); setResult(null) }}
              className="text-[12px] font-semibold px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600"
            >
              Cari Lagi
            </button>
          </div>
        )}

        {/* Hasil tracking */}
        {result && result !== 'not-found' && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="bg-[#0d1a4a] px-6 py-4 flex items-start justify-between">
              <div>
                <p className="font-mono text-white text-[15px] font-bold">AWB {result.awb}</p>
                <p className="text-blue-300 text-[11px] mt-1">CGK (Jakarta) → {result.tujuan}</p>
              </div>
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${statusColor[result.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {result.status}
              </span>
            </div>

            {/* Meta info */}
            <div className="flex gap-6 px-6 py-4 border-b border-gray-100 text-[12px]">
              <div><p className="text-gray-400 mb-0.5">Pengirim</p><p className="font-semibold text-gray-800">{result.pengirim}</p></div>
              <div><p className="text-gray-400 mb-0.5">Penerima</p><p className="font-semibold text-gray-800">{result.penerima}</p></div>
              <div><p className="text-gray-400 mb-0.5">Berat</p><p className="font-semibold text-gray-800">{result.berat}</p></div>
              <div><p className="text-gray-400 mb-0.5">Penerbangan</p><p className="font-semibold font-mono text-gray-800">{result.penerbangan}</p></div>
            </div>

            {/* Timeline */}
            <div className="px-6 py-5">
              {result.steps.map((step, i) => (
                <div key={i} className="flex gap-4 pb-5 relative last:pb-0">
                  {/* Vertical line */}
                  {i < result.steps.length - 1 && (
                    <div className={`absolute left-[10px] top-5 w-[2px] h-full ${step.done ? 'bg-blue-400' : 'bg-gray-200'}`} />
                  )}

                  {/* Dot */}
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center z-10 mt-0.5
                    ${step.done && !step.current ? 'bg-blue-700 border-blue-700' : ''}
                    ${step.current ? 'bg-blue-50 border-blue-400' : ''}
                    ${!step.done && !step.current ? 'bg-white border-gray-300' : ''}
                  `}>
                    {step.done && !step.current && (
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="2,6 5,9 10,3"/>
                      </svg>
                    )}
                    {step.current && (
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <p className={`text-[13px] font-semibold ${step.done ? 'text-[#0d1a4a]' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    <p className="text-[10.5px] font-mono text-gray-400 mt-0.5">{step.time}</p>
                    <p className="text-[11.5px] text-gray-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}