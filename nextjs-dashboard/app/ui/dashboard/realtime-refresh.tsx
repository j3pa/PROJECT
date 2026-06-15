"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RealtimeRefresh({ intervalMs = 7000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === 'visible') {
        router.refresh();
      }
    };

    const intervalId = window.setInterval(refresh, intervalMs);
    return () => window.clearInterval(intervalId);
  }, [intervalMs, router]);

  return null;
}
