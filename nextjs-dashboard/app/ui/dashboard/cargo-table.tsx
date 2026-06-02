'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Import action deleteTransaction dari lib actions kamu
import { deleteTransaction } from '@/app/lib/actions';

interface CargoTableProps {
  transactions?: any[];
  actionMode?: 'manage' | 'detail';
}

export default function CargoTable({ transactions = [], actionMode = 'manage' }: CargoTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = transactions.slice(startIndex, startIndex + itemsPerPage);

  // Fungsi konfirmasi dan eksekusi delete data ke database Neon
  const handleDelete = async (resi: string) => {
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus transaksi dengan No AWB: ${resi}?`);
    if (!confirmDelete) return;

    try {
      setIsDeleting(resi);
      await deleteTransaction(resi);
      router.refresh();
      alert('Data kargo berhasil dihapus secara permanen!');
    } catch (error) {
      alert('Gagal menghapus data kargo.');
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  // Tema Badge Status sesuai visual asli
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

  const totalSelesai = transactions.filter((row) =>
    ['Selesai', 'Sampai Tujuan', 'Arrived', 'OnTime'].includes(row.status_pengiriman || row.status)
  ).length;

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
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center text-[12px] text-gray-400">
                  Tidak ada data cargo yang cocok dengan pencarian saat ini.
                </td>
              </tr>
            ) : paginatedData.map((row, i) => {
              const resiCode = row.resi || row.awb;
              const pengirim = row.nama_pengirim || row.pengirim;
              const statusKargo = row.status_pengiriman || row.status;
              const tujuan = row.kota_tujuan || row.tujuan || 'SUB';
              
              let berat = row.berat || row.berat_barang || '0 kg';
              if (typeof berat === 'number') berat = `${berat} kg`;

              const armada = row.nama_kendaraan && row.kode_kendaraan
                ? `${row.kode_kendaraan}`
                : row.penerbangan || '-';

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
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {resiCode ? (
                      <div className="flex items-center justify-center gap-1.5">
                        {actionMode === 'detail' ? (
                          <Link
                            href={`/dashboard/manifest/${encodeURIComponent(resiCode)}`}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-2.5 py-1.5 rounded border border-sky-100/60 transition uppercase"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" />
                            </svg>
                            Detail
                          </Link>
                        ) : (
                          <>
                            <Link
                              href={`/dashboard/manifest/${encodeURIComponent(resiCode)}/edit`}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50/60 hover:bg-blue-100 px-2.5 py-1.5 rounded border border-blue-100/50 transition uppercase"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                              </svg>
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(resiCode)}
                              disabled={isDeleting === resiCode}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded border border-red-100/50 transition uppercase disabled:opacity-50"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                              {isDeleting === resiCode ? '...' : 'Hapus'}
                            </button>
                          </>
                        )}
                      </div>
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
          Total <span className="text-blue-600 font-bold">{transactions.length}</span> kargo · <span className="text-green-600 font-bold">{totalSelesai}</span> selesai / sampai tujuan
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