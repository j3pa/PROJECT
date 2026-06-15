import Link from 'next/link';
import Topbar from '@/app/ui/dashboard/topbar';

export const metadata = {
  title: 'Data Tidak Ditemukan',
};

export default async function TrackingErrorPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const query = resolvedSearchParams?.query?.trim() || '';

  return (
    <>
      <Topbar title="Tracking AWB" />

      <main className="flex min-h-[calc(100vh-52px)] items-center justify-center bg-gray-100 px-4 py-8 text-black">
        <section className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center shadow-sm sm:px-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
            <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            </svg>
          </div>

          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-orange-500">Tracking Error</p>
          <h1 className="mt-2 text-3xl font-bold text-[#0d1a4a]">Data Tidak Ditemukan</h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-500">
            Data dengan kata kunci {query ? <span className="font-mono font-bold text-gray-700">"{query}"</span> : 'yang dimasukkan'} tidak ditemukan dalam sistem.
            Pastikan nomor AWB, nama pengirim, nama penerima, atau nama barang yang dimasukkan sudah benar.
          </p>

          <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-gray-100 bg-gray-50 p-5 text-left">
            <p className="text-sm font-bold text-[#0d1a4a]">Kemungkinan penyebab:</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-400" />
                Nomor AWB atau kata kunci salah ketik
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-400" />
                Data kargo belum terinput dalam sistem
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-400" />
                Data baru saja masuk dan belum tersinkronisasi
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-400" />
                Data berada pada periode pencarian yang berbeda
              </li>
            </ul>
          </div>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard/tracking"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-700 px-6 text-sm font-bold text-white transition hover:bg-blue-800"
            >
              Cari Data Lain
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-200 px-6 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Kembali ke Dashboard
            </Link>
          </div>

          <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4 text-left">
            <p className="text-sm font-bold text-blue-900">Butuh bantuan?</p>
            <p className="mt-1 text-sm leading-6 text-blue-800">
              Hubungi Supervisor Operasional atau Helpdesk Skybolt di <span className="font-semibold">+62 1234567890</span> untuk pengecekan manual data kargo.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
