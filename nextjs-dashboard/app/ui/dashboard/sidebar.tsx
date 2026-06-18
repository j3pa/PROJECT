'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navOperasional = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
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
      <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="6"/>
        <circle cx="8" cy="8" r="2"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/manifest',
    label: 'Manifest Kargo',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="1" width="12" height="14" rx="1"/>
        <line x1="5" y1="5" x2="11" y2="5"/>
        <line x1="5" y1="8" x2="11" y2="8"/>
        <line x1="5" y1="11" x2="8" y2="11"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/kendaraan',
    label: 'Data Kendaraan',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1.5" y="5" width="13" height="6" rx="1.5"/>
        <circle cx="4.5" cy="11.5" r="1"/>
        <circle cx="11.5" cy="11.5" r="1"/>
        <path d="M4 5V3.5h8V5"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/penerbangan',
    label: 'Status Penerbangan',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
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
      <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="6"/>
        <polyline points="8,4 8,8 11,10"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/pengguna',
    label: 'Profil',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
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

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout gagal:', error)
    } finally {
      router.push('/login')
      router.refresh()
    }
  }

  return (
    <aside
      className={`
        flex flex-col h-screen bg-gradient-to-b from-[#061b4d] via-[#071b47] to-[#05143a] text-white transition-all duration-250 flex-shrink-0 shadow-2xl
        ${collapsed ? 'w-[78px]' : 'w-[270px]'}
      `}
    >

      <div className={`flex items-center border-b border-white/10 py-7 ${collapsed ? 'justify-center px-3' : 'gap-4 px-5'}`}>
        <div className={`${collapsed ? 'h-12 w-12' : 'h-14 w-14'} bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-950/40`}>
          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="orange">
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
          </svg>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-[20px] font-bold text-white leading-tight">SKYBOLT</div>
            <div className="text-[15px] text-blue-200/80">Cargo Udara Modern</div>
          </div>
        )}
      </div>


      <nav className="flex-1 overflow-y-auto px-3 py-5">

        {!collapsed && (
          <div className="px-2 pb-3 text-[13px] font-bold text-cyan-400 uppercase tracking-wide">
            OPERASIONAL
          </div>
        )}
        {navOperasional.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                mb-2 flex items-center rounded-lg py-3.5 text-[16px] font-semibold
                transition-all
                ${collapsed ? 'justify-center px-0' : 'gap-3.5 px-4'}
                ${active
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/30'
                  : 'text-blue-100/65 hover:bg-white/[0.07] hover:text-white'}
              `}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}


        {!collapsed && (
          <div className="px-2 pb-3 pt-6 text-[13px] font-bold text-cyan-400 uppercase tracking-wide">
            SISTEM
          </div>
        )}
        {navSistem.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                mb-2 flex items-center rounded-lg py-3.5 text-[16px] font-semibold
                transition-all
                ${collapsed ? 'justify-center px-0' : 'gap-3.5 px-4'}
                ${active
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/30'
                  : 'text-blue-100/65 hover:bg-white/[0.07] hover:text-white'}
              `}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>


      <div className="border-t border-white/10 px-3 py-3">
        <button
          onClick={handleLogout}
          className={`flex items-center rounded-lg py-3.5 w-full text-[16px] font-semibold text-red-400 hover:bg-white/5 transition ${collapsed ? 'justify-center px-0' : 'gap-3.5 px-4'}`}
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6"/>
          </svg>
          {!collapsed && <span>Keluar</span>}
        </button>


        <button
          onClick={() => setCollapsed(c => !c)}
          className={`mt-3 flex items-center rounded-lg py-3.5 w-full text-[16px] text-blue-100/65 hover:text-blue-100 hover:bg-white/5 transition border-t border-white/10 ${collapsed ? 'justify-center px-0' : 'gap-3.5 px-4'}`}
          aria-label={collapsed ? 'Buka sidebar' : 'Ciutkan sidebar'}
        >
          <svg
            className={`w-5 h-5 flex-shrink-0 transition-transform ${collapsed ? 'rotate-180' : ''}`}
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
