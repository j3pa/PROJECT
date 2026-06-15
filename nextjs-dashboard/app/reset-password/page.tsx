"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ResetPasswordPage() {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleResetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!username.trim() || !newPassword.trim()) {
      setError('Username dan password baru wajib diisi.');
      return;
    }

    if (newPassword.trim().length < 6) {
      setError('Password baru minimal 6 karakter.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, newPassword }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Permintaan reset password gagal diproses.');
        return;
      }

      setMessage(result.message || 'Password berhasil diubah.');
    } catch (requestError) {
      setError('Gagal menghubungi server. Periksa koneksi dan coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#EEF2FB] px-6 py-10 text-black">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-lg items-center justify-center">
        <form onSubmit={handleResetPassword} className="w-full rounded-[34px] border border-white/80 bg-white px-9 py-10 text-center shadow-[0_24px_70px_rgba(13,26,74,0.14)]">
          <div className="mb-3 flex justify-center">
            <Image src="/logo.png" alt="Skybolt logo" width={116} height={116} priority />
          </div>

          <h1 className="text-[28px] font-bold tracking-wide text-[#0d1a4a]">FORGOT PASSWORD</h1>
          <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-gray-500">
            Masukkan username dan password baru anda.
          </p>

          <div className="mt-8 space-y-5 text-left">
            <div>
            <label htmlFor="reset-username" className="block text-sm font-semibold text-gray-800">
              Username
            </label>
            <input
              id="reset-username"
              type="text"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setError('');
                setMessage('');
              }}
              placeholder="Masukkan username"
              className="mt-2 h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            </div>

            <div>
              <label htmlFor="reset-password" className="block text-sm font-semibold text-gray-800">
                Password Baru
              </label>
              <div className="relative mt-2">
                <input
                  id="reset-password"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                    setError('');
                    setMessage('');
                  }}
                  placeholder="Masukkan password baru"
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pr-12 text-sm text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3l18 18" strokeLinecap="round" />
                      <path d="M10.6 10.6A2 2 0 0 0 12 14a2 2 0 0 0 1.4-.6M9.9 5.2A10.8 10.8 0 0 1 12 5c5.5 0 9 5 9 7a8.2 8.2 0 0 1-2.3 3.5M6.1 6.8C4.1 8.2 3 10.5 3 12c0 2 3.5 7 9 7 1.7 0 3.2-.5 4.4-1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {message ? (
            <p className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
              {message}
            </p>
          ) : null}

          {error ? (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm italic text-red-600">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 h-12 w-full rounded-xl bg-[#fdc00b] px-8 text-sm font-bold text-black shadow-sm transition hover:bg-[#e6ad05] disabled:opacity-60"
          >
            {loading ? 'MEMPROSES...' : 'UBAH PASSWORD'}
          </button>

          <div className="mt-3">
            <Link href="/login" className="flex h-12 w-full items-center justify-center rounded-xl border border-gray-300 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50">
              &larr; Kembali ke Login
            </Link>
          </div>

          <div className="mt-7 flex justify-center">
            <Image src="/logo.png" alt="Skybolt logo" width={100} height={100} />
          </div>
        </form>
      </div>
    </main>
  );
}
