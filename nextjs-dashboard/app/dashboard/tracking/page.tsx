'use client'

import { useState } from 'react'
import Topbar from '@/app/ui/dashboard/topbar'
import { getTrackingData } from '@/app/lib/actions' // Impor fungsi server action database

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

const statusColor: Record<string, string> = {
  Received:  'bg-blue-100 text-blue-700',
  Loaded:    'bg-green-100 text-green-700',
  Sortation: 'bg-orange-100 text-orange-600',
  Departed:  'bg-purple-100 text-purple-700',
  Arrived:   'bg-teal-100 text-teal-700',
  Pending:   'bg-amber-100 text-amber-700',
  Diproses: 'bg-orange-100 text-orange-700',
  'Dalam Pengiriman': 'bg-blue-100 text-blue-700',
  'Sampai Tujuan': 'bg-purple-100 text-purple-700',
  Selesai:   'bg-emerald-100 text-emerald-700',
}

function ModalOperator({
  awb,
  onClose,
}: {
  awb: string
  onClose: () => void
}) {
  const [form, setForm] = useState({ nama: '', awb: awb, telepon: '', kendala: '', catatan: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  function handleSend() {
    if (!form.nama.trim() || !form.awb.trim() || !form.telepon.trim() || !form.kendala.trim()) {
      setError('Pastikan pengisian form tersebut benar.')
      return
    }
    setError('')
    setSent(true)
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-[15px] font-bold text-[#0d1a4a]">Hubungi Operator</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-white hover:bg-blue-800 transition text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {sent ? (
          <div className="px-6 py-10 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p className="text-[15px] font-bold text-gray-800 mb-2">Laporan Terkirim</p>
            <p className="text-[12.5px] text-gray-500 mb-6">
              Operator akan menindaklanjuti dalam 2–5 menit.
            </p>
            <button
              onClick={onClose}
              className="text-[12.5px] font-semibold px-6 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
            >
              Tutup
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 py-5">
              <p className="text-[12px] text-blue-600 mb-5">
                Isi form berikut, operator akan menindaklanjuti dalam 2–5 menit.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-[12.5px] font-semibold text-gray-700 w-28 flex-shrink-0">Nama Pelapor :</label>
                  <input
                    type="text"
                    value={form.nama}
                    onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
                    placeholder="Nama Anda"
                    className="flex-1 h-9 border border-gray-200 rounded-lg px-3 text-[12.5px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-400 bg-white"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-[12.5px] font-semibold text-gray-700 w-28 flex-shrink-0">No AWB :</label>
                  <input
                    type="text"
                    value={form.awb}
                    onChange={e => setForm(f => ({ ...f, awb: e.target.value }))}
                    placeholder="Nomor AWB"
                    className="flex-1 h-9 border border-gray-200 rounded-lg px-3 text-[12.5px] font-mono text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-400 bg-white"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-[12.5px] font-semibold text-gray-700 w-28 flex-shrink-0">No. Telepon :</label>
                  <input
                    type="tel"
                    value={form.telepon}
                    onChange={e => setForm(f => ({ ...f, telepon: e.target.value }))}
                    placeholder="Contoh: 0812-3456-7890"
                    className="flex-1 h-9 border border-gray-200 rounded-lg px-3 text-[12.5px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-400 bg-white"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-[12.5px] font-semibold text-gray-700 w-28 flex-shrink-0">Kendala :</label>
                  <input
                    type="text"
                    value={form.kendala}
                    onChange={e => setForm(f => ({ ...f, kendala: e.target.value }))}
                    placeholder="Jelaskan kendala"
                    className="flex-1 h-9 border border-gray-200 rounded-lg px-3 text-[12.5px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-400 bg-white"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-[12.5px] font-semibold text-gray-700 w-28 flex-shrink-0">Catatan :</label>
                  <input
                    type="text"
                    value={form.catatan}
                    onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))}
                    placeholder="Catatan tambahan (opsional)"
                    className="flex-1 h-9 border border-gray-200 rounded-lg px-3 text-[12.5px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-400 bg-white"
                  />
                </div>
              </div>

              {error && <p className="text-[11.5px] text-red-500 mt-3">{error}</p>}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <p className="text-[11px] text-gray-400">Pastikan pengisian form benar.</p>
              <div className="flex gap-2">
                <button onClick={onClose} className="text-[12.5px] font-semibold px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition">Batal</button>
                <button onClick={handleSend} className="text-[12.5px] font-semibold px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition leading-tight">Kirim<br/>Laporan</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function TrackingPage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<TrackingData | null | 'not-found'>(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  async function handleTrack(targetKey?: string) {
    const key = (targetKey || input).trim()
    if (!key) return
    
    setLoading(true)
    try {
      const data = await getTrackingData(key) // Memanggil Server Action Neon
      if (data) {
        setResult(data as TrackingData)
      } else {
        setResult('not-found')
      }
    } catch (err) {
      setResult('not-found')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleTrack()
  }

  function handleCariLagi() {
    setInput('')
    setResult(null)
  }

  return (
    <>
      <Topbar title="Tracking AWB" />

      <div className="p-6 max-w-3xl">
        <h1 className="text-[18px] font-bold text-[#0d1a4a] mb-1">Tracking Airway Bill</h1>
        <p className="text-[11px] text-gray-500 mb-5">Lacak status pengiriman kargo berdasarkan nomor AWB</p>

        {/* Form input */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-5">
          <label className="block text-[12px] font-semibold text-gray-700 mb-2">Nomor Airway Bill (AWB)</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="AWB-XXXXXXXXXXXX"
              className="flex-1 h-10 border border-gray-200 rounded-lg px-3 text-[13px] font-mono text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 bg-white transition"
            />
            <button
              onClick={() => handleTrack()}
              disabled={loading}
              className="h-10 px-6 bg-blue-700 text-white text-[13px] font-semibold rounded-lg hover:bg-blue-800 disabled:bg-gray-400 transition"
            >
              {loading ? 'Memuat...' : 'Lacak Kargo'}
            </button>
          </div>

          {result === 'not-found' && (
            <p className="text-[11.5px] font-mono text-gray-500 mb-1">
              No AWB <span className="text-red-500 font-semibold">{input}</span> tidak ditemukan
            </p>
          )}
        </div>

        {/* Jika belum melakukan pencarian */}
        {result === null && !loading && (
          <div className="bg-white border border-gray-200 rounded-xl p-16 flex flex-col items-center justify-center">
            <p className="text-[16px] font-semibold text-gray-600 mb-1">Belum ada data tracking</p>
            <p className="text-[13px] text-gray-400">Masukkan nomor AWB aktif dari database</p>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="bg-white border border-gray-200 rounded-xl p-16 flex items-center justify-center text-gray-500 text-[13px]">
            Sedang mencari data dari database Neon...
          </div>
        )}

        {/* AWB ga ditemukan */}
        {result === 'not-found' && !loading && (
          <div className="bg-white border border-red-100 rounded-xl p-12 flex flex-col items-center justify-center">
            <p className="text-[16px] font-bold text-gray-800 mb-2">AWB Tidak Ditemukan</p>
            <p className="text-[13px] text-gray-500 text-center mb-7">
              Nomor <span className="font-mono font-semibold text-red-500">{input}</span> tidak ada di sistem.
            </p>
            <div className="flex gap-3">
              <button onClick={handleCariLagi} className="text-[13px] font-semibold px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition">Cari Lagi</button>
              <button onClick={() => setShowModal(true)} className="text-[13px] font-semibold px-5 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition">Hubungi Operator</button>
            </div>
          </div>
        )}

        {/* Hasil tracking kargo real-time berhasil */}
        {result && result !== 'not-found' && !loading && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-[#0d1a4a] px-6 py-4 flex items-start justify-between">
              <div>
                <p className="font-mono text-white text-[15px] font-bold">AWB {result.awb}</p>
                <p className="text-blue-300 text-[11px] mt-1">Gudang Udara → {result.tujuan}</p>
              </div>
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${statusColor[result.status] ?? 'bg-blue-100 text-blue-700'}`}>
                {result.status}
              </span>
            </div>

            <div className="flex gap-6 px-6 py-4 border-b border-gray-100 text-[12px]">
              <div><p className="text-gray-400 mb-0.5">Pengirim</p><p className="font-semibold text-gray-800">{result.pengirim}</p></div>
              <div><p className="text-gray-400 mb-0.5">Penerima</p><p className="font-semibold text-gray-800">{result.penerima}</p></div>
              <div><p className="text-gray-400 mb-0.5">Berat</p><p className="font-semibold text-gray-800">{result.berat}</p></div>
              <div><p className="text-gray-400 mb-0.5">Penerbangan</p><p className="font-semibold font-mono text-gray-800">{result.penerbangan}</p></div>
            </div>

            <div className="px-6 py-5">
              {result.steps.map((step, i) => (
                <div key={i} className="flex gap-4 pb-5 relative last:pb-0">
                  {i < result.steps.length - 1 && (
                    <div className={`absolute left-[9px] top-5 w-[2px] h-full ${step.done ? 'bg-blue-400' : 'bg-gray-200'}`} />
                  )}
                  <div className={`w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 flex items-center justify-center z-10 mt-0.5
                    ${step.done && !step.current ? 'bg-blue-700 border-blue-700' : ''}
                    ${step.current ? 'bg-blue-50 border-blue-400' : ''}
                    ${!step.done && !step.current ? 'bg-white border-gray-300' : ''}
                  `}>
                    {step.done && !step.current && (
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="2,6 5,9 10,3"/>
                      </svg>
                    )}
                    {step.current && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                  </div>
                  <div>
                    <p className={`text-[13px] font-semibold ${step.done ? 'text-[#0d1a4a]' : 'text-gray-400'}`}>{step.label}</p>
                    <p className="text-[10.5px] font-mono text-gray-400 mt-0.5">{step.time}</p>
                    <p className="text-[11.5px] text-gray-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <ModalOperator awb={input} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}