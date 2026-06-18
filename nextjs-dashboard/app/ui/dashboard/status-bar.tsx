"use client";

import LiveClock from '@/app/ui/dashboard/live-clock';

export default function StatusBar() {
  return (
    <div className="h-[46px] flex-shrink-0 border-t border-gray-200 bg-white px-7 text-[15px] text-gray-500">
      <div className="flex h-full items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="h-3 w-3 flex-shrink-0 rounded-full bg-green-500" />
          <span className="truncate">Data diperbarui secara real-time</span>
          <span className="hidden text-gray-300 sm:inline">|</span>
          <span className="hidden truncate sm:inline">Gudang Bandara Sudirman</span>
        </div>

        <div className="hidden items-center gap-2.5 text-right md:flex">
          <LiveClock className="font-mono text-gray-700" />
          <span className="text-gray-300">|</span>
          <span>Ekspedisi Petir V1</span>
        </div>
      </div>
    </div>
  );
}
