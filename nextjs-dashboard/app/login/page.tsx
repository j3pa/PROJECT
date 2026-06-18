"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function doLogin() {
    if (!user.trim() || !pass.trim()) {
      setError("Username dan password wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: user,
          password: pass,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Login gagal. Silakan periksa akun Anda.");
        return;
      }

      setSuccess(true);
      const nextPath =
        (typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("next")
          : null) ||
        result.redirectTo ||
        "/dashboard";

      setTimeout(() => {
        router.push(nextPath);
        router.refresh();
      }, 1200);
    } catch (error) {
      setError("Login gagal diproses. Pastikan koneksi dan database aktif.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#052464] px-4">


      <div className="relative w-full max-w-[500px] bg-[#ffffff] rounded-[50px] border border-black p-6 text-center sm:p-10">


        {success && (
          <div className="absolute inset-0 flex items-center justify-center z-10 backdrop-blur-sm bg-black/30 rounded-[25px]">
            <div className="bg-white border shadow-lg px-6 py-4 text-center rounded-md">


              <div className="flex justify-center mb-2">
                <div className="w-8 h-8 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500">
                  ✓
                </div>
              </div>


              <p className="font-semibold text-gray-800">
                Login berhasil!
              </p>
              <p className="text-xs text-gray-500">
                Selamat datang di SKYBOLT
              </p>
            </div>
          </div>
        )}


        <div className="flex justify-center mb-2">
          <Image src="/logo.png" alt="logo" width={120} height={120} />
        </div>


        <h1 className="text-xl font-bold text-blue-900 mb-6">LOGIN</h1>


        <div className="text-left px-2 sm:px-6">
          <label className="block text-sm font-semibold mb-1 text-black">
            Username
          </label>
          <input
            type="text"
            placeholder="Masukkan username"
            className="mt-2 mb-4 h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={user}
            onChange={(e) => {
              setUser(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && doLogin()}
          />

          <label className="block text-sm font-semibold mb-1 text-black">
            Password
          </label>
          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pr-12 text-sm text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && doLogin()}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-[48%] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 leading-none hover:bg-gray-100 hover:text-gray-700"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? (
                <svg className="block h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3l18 18" strokeLinecap="round" />
                  <path d="M10.6 10.6A2 2 0 0 0 12 14a2 2 0 0 0 1.4-.6M9.9 5.2A10.8 10.8 0 0 1 12 5c5.5 0 9 5 9 7a8.2 8.2 0 0 1-2.3 3.5M6.1 6.8C4.1 8.2 3 10.5 3 12c0 2 3.5 7 9 7 1.7 0 3.2-.5 4.4-1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg className="block h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>
              )}
            </button>
          </div>


          {error && (
            <p className="text-red-600 text-sm mt-2 italic">
              {error}
            </p>
          )}
        </div>


        <button
          onClick={doLogin}
          disabled={loading}
          className="bg-[#fdc00b] px-8 py-2 rounded-[10px] font-semibold mt-6 text-black disabled:opacity-60"
        >
          {loading ? "MEMPROSES..." : "LOG IN"}
        </button>


        <Link href="/reset-password" className="mt-3 mb-6 block text-sm font-semibold text-blue-700 hover:text-blue-900">
          Lupa Password?
        </Link>


        <div className="flex justify-center mt-2">
          <Image src="/logo.png" alt="logo" width={110} height={110} />
        </div>
      </div>
    </div>
  );
}
