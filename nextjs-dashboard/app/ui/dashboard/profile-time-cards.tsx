"use client";

import { useEffect, useMemo, useState } from 'react';
import LoginDuration from '@/app/ui/dashboard/login-duration';
import { formatWibDate, toSafeIsoString } from '@/app/lib/time';

type ProfileTimeCardsProps = {
  initialLastLogin?: string | null;
  initialUpdatedAt?: string | null;
  initialWarning?: string;
};

function useProfileTimeData({
  initialLastLogin,
  initialUpdatedAt,
  initialWarning = '',
}: ProfileTimeCardsProps) {
  const [lastLogin, setLastLogin] = useState(initialLastLogin || null);
  const [updatedAt, setUpdatedAt] = useState(initialUpdatedAt || null);
  const [warning, setWarning] = useState(initialWarning);

  useEffect(() => {
    let mounted = true;

    async function loadTimeData() {
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store' });

        if (!response.ok) {
          if (mounted) setWarning('Data waktu akun belum bisa dimuat dari sesi aktif.');
          return;
        }

        const result = await response.json();

        if (!mounted) return;

        setLastLogin(toSafeIsoString(result.user?.lastLogin) || null);
        setUpdatedAt(toSafeIsoString(result.user?.updatedAt) || null);
        setWarning(result.user?.timeWarning || '');
      } catch {
        if (mounted) setWarning('Data waktu akun gagal disinkronkan. Sistem akan mencoba lagi otomatis.');
      }
    }

    loadTimeData();
    const intervalId = window.setInterval(loadTimeData, 60000);
    window.addEventListener('focus', loadTimeData);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
      window.removeEventListener('focus', loadTimeData);
    };
  }, []);

  return { lastLogin, updatedAt, warning };
}

export function ProfileLoginDurationCard(props: ProfileTimeCardsProps) {
  const { lastLogin } = useProfileTimeData(props);

  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
      <p className="text-sm font-bold text-blue-900">Durasi Login</p>
      <p className="mt-2 text-sm leading-6 text-blue-800">
        Aktif selama <LoginDuration since={lastLogin} /> sejak login terakhir.
      </p>
      {!lastLogin ? (
        <p className="mt-2 text-xs font-medium text-amber-700">
          Waktu login belum tersedia dari database.
        </p>
      ) : null}
    </div>
  );
}

export default function ProfileTimeCards(props: ProfileTimeCardsProps) {
  const { lastLogin, updatedAt, warning } = useProfileTimeData(props);
  const formattedLastLogin = useMemo(
    () => formatWibDate(lastLogin, 'Login terakhir belum tercatat di database.'),
    [lastLogin],
  );
  const formattedUpdatedAt = useMemo(
    () => formatWibDate(updatedAt, 'Waktu update data akun belum tersedia.'),
    [updatedAt],
  );

  return (
    <>
      {warning ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-700 md:col-span-2">
          {warning}
        </div>
      ) : null}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-gray-500">Login Terakhir</p>
        <p className="mt-3 text-xl font-bold text-[#0d1a4a]">{formattedLastLogin}</p>
        <p className="mt-2 text-sm text-gray-500">Mengikuti timestamp login terakhir dari database.</p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-gray-500">Update Data Akun</p>
        <p className="mt-3 text-xl font-bold text-[#0d1a4a]">{formattedUpdatedAt}</p>
        <p className="mt-2 text-sm text-gray-500">Mengikuti kolom updated_at akun dari database.</p>
      </div>
    </>
  );
}
