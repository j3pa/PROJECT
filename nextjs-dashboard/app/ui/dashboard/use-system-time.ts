"use client";

import { useEffect, useState } from 'react';

type TimeListener = (date: Date) => void;

let currentTime = new Date();
let intervalId: number | null = null;
const listeners = new Set<TimeListener>();

function emitTime() {
  currentTime = new Date();
  listeners.forEach((listener) => listener(currentTime));
}

function subscribeTime(listener: TimeListener, updateEveryMs: number) {
  listeners.add(listener);
  listener(currentTime);

  if (intervalId === null) {
    emitTime();
    intervalId = window.setInterval(emitTime, updateEveryMs);
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0 && intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };
}

export function useSystemTime(updateEveryMs = 1000) {
  const [now, setNow] = useState(() => currentTime);

  useEffect(() => {
    return subscribeTime(setNow, updateEveryMs);
  }, [updateEveryMs]);

  return now;
}
