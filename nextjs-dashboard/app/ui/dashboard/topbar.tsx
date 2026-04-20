'use client'

import { useEffect, useState } from 'react'

interface TopbarProps {
  title: string
}

export default function Topbar({ title }: TopbarProps) {
  const [time, setTime] = useState('')

  useEffect(() => {
    function tick() {
      setTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="h-[52px] bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <span className="text-[15px] font-semibold text-[#0d1a4a]">{title}</span>

      <div className="flex items-center gap-3">
        {/* Online badge */}
        <span className="flex items-center gap-1.5 bg-green-100 text-green-700 text-[11px] font-semibold px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Sistem Online
        </span>

        {/* Clock */}
        <span className="text-xs text-gray-500 font-mono min-w-[56px] text-right">{time}</span>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
          A
        </div>
      </div>
    </div>
  )
}