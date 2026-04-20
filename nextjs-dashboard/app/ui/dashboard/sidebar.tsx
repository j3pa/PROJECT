'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navOperasional = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="1" width="6" height="6" rx="1"/>
        <rect x="9" y="1" width="6" height="6" rx="1"/>
        <rect x="1" y="9" width="6" height="6" rx="1"/>
        <rect x="9" y="9" width="6" height="6" rx="1"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/tracking',
    label: 'Tracking AWB',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="6"/>
        <circle cx="8" cy="8" r="2"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/manifest',
    label: 'Manifest Kargo',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="1" width="12" height="14" rx="1"/>
        <line x1="5" y1="5" x2="11" y2="5"/>
        <line x1="5" y1="8" x2="11" y2="8"/>
        <line x1="5" y1="11" x2="8" y2="11"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/penerbangan',
    label: 'Status Penerbangan',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 10l2-2 3 1 4-5 2-1v2l-4 5 1 3-2 1-1-2-2 1-1-1z"/>
      </svg>
    ),
  },
]

const navSistem = [
  {
    href: '/dashboard/logs',
    label: 'Tracking Log',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="6"/>
        <polyline points="8,4 8,8 11,10"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/pengguna',
    label: 'Pengguna',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="6" r="3"/>
        <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5"/>
      </svg>
    ),
  },
]

export default function Sidebar() {
  const pathname  = usePathname()
  const router    = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  function handleLogout() {
    router.push('/login')
  }

  return (
    <aside
      className={`
        flex flex-col h-screen bg-[#0d1a4a] text-white transition-all duration-250 flex-shrink-0
        ${collapsed ? 'w-[60px]' : 'w-[200px]'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
        <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
          </svg>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-sm font-bold text-white leading-tight">Ekspedisi Petir</div>
            <div className="text-[10px] text-blue-300">Cargo Udara</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {/* Operasional */}
        {!collapsed && (
          <div className="px-4 pt-2 pb-1 text-[10px] font-bold text-blue-300 uppercase tracking-widest">
            Operasional
          </div>
        )}
        {navOperasional.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-2.5 px-4 py-2.5 text-[12.5px] font-medium
                border-l-2 transition-all
                ${active
                  ? 'bg-blue-900/40 border-blue-400 text-white'
                  : 'border-transparent text-blue-200/70 hover:bg-white/5 hover:text-white'}
              `}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}

        {/* Sistem */}
        {!collapsed && (
          <div className="px-4 pt-4 pb-1 text-[10px] font-bold text-blue-300 uppercase tracking-widest">
            Sistem
          </div>
        )}
        {navSistem.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-2.5 px-4 py-2.5 text-[12.5px] font-medium
                border-l-2 transition-all
                ${active
                  ? 'bg-blue-900/40 border-blue-400 text-white'
                  : 'border-transparent text-blue-200/70 hover:bg-white/5 hover:text-white'}
              `}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-4 py-3 w-full text-[12.5px] font-medium text-red-400 hover:bg-white/5 transition"
        >
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6"/>
          </svg>
          {!collapsed && <span>Keluar</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="flex items-center gap-2.5 px-4 py-3 w-full text-[11px] text-blue-300/60 hover:text-blue-200 hover:bg-white/5 transition border-t border-white/10"
        >
          <svg
            className={`w-4 h-4 flex-shrink-0 transition-transform ${collapsed ? 'rotate-180' : ''}`}
            viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
          >
            <polyline points="10,4 6,8 10,12"/>
          </svg>
          {!collapsed && <span>Ciutkan</span>}
        </button>
      </div>
    </aside>
  )
}