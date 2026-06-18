'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfileActions() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout gagal:', error);
    } finally {
      router.push('/login');
      router.refresh();
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href="/dashboard"
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-[13px] font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
      >
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M10 3 5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Kembali ke Dashboard
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-red-50 px-4 text-[13px] font-bold text-red-600 shadow-sm transition hover:bg-red-100"
      >
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 14H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3M11 11l3-3-3-3M14 8H6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Logout
      </button>
    </div>
  );
}
