"use client";

import { useMemo } from 'react';
import { useSystemTime } from '@/app/ui/dashboard/use-system-time';
import { parseDateValue } from '@/app/lib/time';

export default function LoginDuration({ since }: { since?: string | Date | null }) {
  const now = useSystemTime();
  const sinceDate = useMemo(() => parseDateValue(since), [since]);

  if (!sinceDate) {
    return (
      <span className="font-semibold text-amber-700">
        waktu login belum tersedia
      </span>
    );
  }

  const diffSeconds = Math.max(0, Math.floor((now.getTime() - sinceDate.getTime()) / 1000));
  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  return (
    <span className="font-semibold text-blue-700">
      {hours} jam {minutes} menit {seconds} detik
    </span>
  );
}
