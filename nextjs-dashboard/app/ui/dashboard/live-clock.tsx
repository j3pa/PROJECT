"use client";

import { useEffect, useState } from 'react';
import { formatWibClock } from '@/app/lib/time';

interface LiveClockProps {
  className?: string;
}

export default function LiveClock({ className }: LiveClockProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    function tick() {
      setNow(new Date());
    }

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <span className={className}>
      {now ? formatWibClock(now) : '--.--.--'}
    </span>
  );
}
