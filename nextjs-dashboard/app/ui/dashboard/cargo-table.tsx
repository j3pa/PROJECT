'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CargoTableProps {
  transactions?: any[];
}

export default function CargoTable({ transactions = [] }: CargoTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = transactions.slice(startIndex, startIndex + itemsPerPage);

  // Tema Badge Status sesuai visual asli (image_0c395f.png)
  const badgeStyle: Record<string, string> = {
    'Received': 'bg-blue-50 text-blue-600 border border-blue-100',
    'Sortation': 'bg-amber-50 text-amber-600 border border-amber-100',
    'Loaded': 'bg-gray-100 text-gray-700 border border-gray-200',
    'OnTime': 'bg-green-50 text-green-600 border border-green-100',
    'Departed': 'bg-purple-50 text-purple-600 border border-purple-100',
    // Fallback status database alternatif
    'Pending': 'bg-gray-50 text-gray-500 border border-gray-200',
    'Diproses': 'bg-amber-50 text-amber-600 border border-amber-100',
    'Dalam Pengiriman': 'bg-blue-50 text-blue-600 border border-blue-100',
    'Sampai Tujuan': 'bg-purple-50 text-purple-600 border border-purple-100',
    'Selesai': 'bg-green-50 text-green-600 border border-green-100',
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-[12px] text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">NO AWB</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">PENGIRIM</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">TUJUAN</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">BERAT</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">PENERBANGAN</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">STATUS</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">WAKTU UPDATE</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {paginatedData.map((row, i) => {
              // Pemetaan field fleksibel untuk menjamin data tampil (image_0c395f.png -> image_0d1a1b.png)
              const resiCode = row.resi || row.awb;
              const pengirim = row.nama_pengirim || row.pengirim;
              const statusKargo = row.status_pengiriman || row.status;
              
              const tujuan = row.kota_tujuan || row.tujuan || 'SUB';
              
              // Normalisasi tampilan string berat kargo
              let berat = row.berat || row.berat_barang || '0 kg';
              if (typeof berat === 'number') berat = `${berat} kg`;

              // Tampilan Armada Pesawat
              const armada = row.nama_kendaraan && row.kode_kendaraan
                ? `${row.kode_kendaraan}` // Menampilkan kode penerbangan saja agar ringkas seperti GA-136
                : row.penerbangan || '-';

              // Tampilan Waktu Penerbangan
              let waktu = row.waktuMasuk || '-';
              if (row.tanggal_kirim && !row.waktuMasuk) {
                waktu = new Date(row.tanggal_kirim).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
              }

              return (
                <tr key={resiCode || i} className="hover:bg-blue-50/10 transition group">
                  <td className="px-6 py-4 font-mono text-blue-600 font-semibold tracking-tight whitespace-nowrap">
                    {resiCode}
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium whitespace-nowrap">
                    {pengirim}
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium whitespace-nowrap">
                    {tujuan}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {berat}
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono whitespace-nowrap">
                    {armada}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${badgeStyle[statusKargo] || 'bg-gray-100 text-gray-600'}`}>
                      {statusKargo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 whitespace-nowrap font-mono text-[11px]">
                    {waktu}
                  </td>
                  
                  {/* TOMBOL EDIT SESUAI DENGAN FOTO KEDUA (image_0d1a9d.png) */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {resiCode ? (
                      <Link
                        href={`/dashboard/manifest/${encodeURIComponent(resiCode)}/edit`}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50/60 hover:bg-blue-100 px-2.5 py-1.5 rounded border border-blue-100/50 transition uppercase"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                        Edit
                      </Link>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between text-[11px]">
        <p className="text-gray-400 font-medium">
          Total <span className="text-blue-600 font-bold">{transactions.length}</span> kargo · 2 sudah dikirim
        </p>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40 transition"
            >
              ← Sebelumnya
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-6 h-6 rounded text-center font-bold transition ${currentPage === idx + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 text-gray-500 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40 transition"
            >
              Berikutnya →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}