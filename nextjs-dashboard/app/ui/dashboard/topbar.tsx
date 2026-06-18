'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import LiveClock from '@/app/ui/dashboard/live-clock'

interface TopbarProps {
  title: string
}

export default function Topbar({ title }: TopbarProps) {
  const [username, setUsername] = useState('Andika')
  const [role, setRole] = useState('Operator')
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const displayRole = role.trim().toLowerCase() === username.trim().toLowerCase() ? '' : role

  useEffect(() => {
    async function loadSession() {
      try {
        const response = await fetch('/api/auth/session')
        if (!response.ok) return

        const result = await response.json()
        if (result.user?.username) setUsername(result.user.username)
        if (result.user?.role) setRole(result.user.role)
      } catch (error) {
        console.error('Gagal mengambil session:', error)
      }
    }

    loadSession()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

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
    <div className="h-[68px] bg-white border-b border-gray-200 flex items-center justify-between px-7 flex-shrink-0">
      <span className="text-[20px] font-semibold text-[#0d1a4a]">{title}</span>

      <div className="flex items-center gap-4">

        <span className="flex items-center gap-2 bg-green-100 text-green-700 text-[14px] font-semibold px-4 py-1.5 rounded-full">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          Sistem Online
        </span>


        <LiveClock className="text-[16px] text-gray-500 font-mono min-w-[92px] text-right" />


        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="flex items-center gap-3 rounded-full px-2 py-1.5 transition hover:bg-gray-100"
            aria-expanded={open}
            aria-haspopup="menu"
          >
            <div className="w-11 h-11 rounded-full bg-blue-600 text-white text-[16px] font-bold flex items-center justify-center">
              {username.slice(0, 1).toUpperCase()}
            </div>
            <div className="hidden text-left leading-tight sm:block">
              <p className="text-[15px] font-bold text-[#0d1a4a]">{username}</p>
              {displayRole ? <p className="text-[13px] text-gray-400">{displayRole}</p> : null}
            </div>
            <svg className={`hidden h-5 w-5 text-gray-400 transition sm:block ${open ? 'rotate-180' : ''}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {open ? (
            <div className="absolute right-0 top-14 z-50 w-[280px] overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 shadow-[0_18px_45px_rgba(15,23,42,0.16)] animate-[accountMenu_160ms_ease-out]" role="menu">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex h-14 items-center gap-3 px-4 text-[15px] font-semibold text-gray-700 transition hover:bg-gray-50"
                role="menuitem"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                  <svg className="h-5 w-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <rect x="2" y="2" width="4.5" height="4.5" rx="1" />
                    <rect x="9.5" y="2" width="4.5" height="4.5" rx="1" />
                    <rect x="2" y="9.5" width="4.5" height="4.5" rx="1" />
                    <rect x="9.5" y="9.5" width="4.5" height="4.5" rx="1" />
                  </svg>
                </span>
                Kembali ke Dashboard
              </Link>
              <div className="mx-4 my-1 h-px bg-gray-100" />
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-14 w-full items-center gap-3 px-4 text-left text-[15px] font-semibold text-red-600 transition hover:bg-red-50"
                role="menuitem"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <svg className="h-5 w-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path d="M6 14H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3M11 11l3-3-3-3M14 8H6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
