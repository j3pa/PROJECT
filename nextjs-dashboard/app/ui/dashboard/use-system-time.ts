"use client";

import { useEffect, useState } from 'react';

export function useSystemTime(updateEveryMs = 1000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();

    const intervalId = window.setInterval(tick, updateEveryMs);
    return () => window.clearInterval(intervalId);
  }, [updateEveryMs]);

  return now;
}
