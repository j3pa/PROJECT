"use client";

import { useMemo } from 'react';
import { useSystemTime } from '@/app/ui/dashboard/use-system-time';

export default function LoginDuration({ since }: { since?: string | Date | null }) {
  const now = useSystemTime();
  const sinceDate = useMemo(() => (since ? new Date(since) : new Date()), [since]);
  const diffMs = Math.max(0, now.getTime() - sinceDate.getTime());
  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <span className="font-semibold text-blue-700">
      {hours > 0 ? `${hours} jam ` : ''}
      {minutes} menit
    </span>
  );
}
