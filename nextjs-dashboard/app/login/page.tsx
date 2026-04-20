"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  function doLogin() {
    if (user === "Admin" && pass === "Admin123") {
      setError(false);
      router.push("/dashboard");
    } else {
      setError(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#052464]">
      <div className="bg-[#ffffff] w-[500px] rounded-[50px] border border-black p-10 text-center">

        {/* LOGO ATAS */}
        <div className="flex justify-center mb-2">
          <Image src="/logo.png" alt="logo" width={120} height={120} />
        </div>

        {/* TITLE */}
        <h1 className="text-xl font-bold text-blue-900 mb-6">LOGIN</h1>

        {/* FORM */}
        <div className="text-left px-6">
          <label className="block text-sm font-semibold mb-1 text-black">Username</label>
          <input
            type="text"
            placeholder="Masukkan username"
            className="w-full border border-black px-3 py-2 mb-4 bg-white text-black"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />

          <label className="block text-sm font-semibold mb-1 text-black">Password</label>
          <input
            type="password"
            placeholder="Masukkan password"
            className="w-full border border-black px-3 py-2 bg-white text-black"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          {/* ERROR MESSAGE (SESUAI PERMINTAAN) */}
          {error && (
            <p className="text-red-600 text-sm mt-2 italic">
              Username atau Password salah
            </p>
          )}
        </div>

        {/* BUTTON */}
        <button
          onClick={doLogin}
          className="bg-[#fdc00b] px-8 py-2 rounded-[10px] font-semibold mt-6 mb-2 text-black"
        >
          LOG IN
        </button>

        {/* FORGOT */}
        <p className="text-sm text-gray-600 mb-6">Forgot password?</p>

        {/* LOGO BAWAH */}
        <div className="flex justify-center mt-2">
          <Image src="/logo.png" alt="logo" width={110} height={110} />
        </div>
      </div>
    </div>
  );
}