
import Link from 'next/link';

export default async function NotAuthorizedPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const loginHref = next ? `/login?next=${encodeURIComponent(next)}` : '/login';

  return (
    <main className="min-h-screen bg-[#052464] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
        <div className="w-full rounded-[28px] border border-white/15 bg-white px-8 py-10 text-center text-black shadow-2xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="h-8 w-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636 5.636 18.364M5.636 5.636l12.728 12.728" />
            </svg>
          </div>

          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-red-500">Akses Ditolak</p>
          <h1 className="mt-3 text-3xl font-bold text-[#0d1a4a]">Anda belum login</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
            Halaman dashboard hanya bisa diakses oleh pengguna yang sudah masuk ke sistem.
            Silakan login terlebih dahulu untuk melanjutkan.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={loginHref}
              className="rounded-xl bg-[#fdc00b] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#e6ad05]"
            >
              LOGIN SEKARANG
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              KEMBALI KE BERANDA
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}