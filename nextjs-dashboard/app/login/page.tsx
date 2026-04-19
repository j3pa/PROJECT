"use client";

import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "Admin" && password === "Admin123") {
      alert("Login Berhasil");
    } else {
      alert("Username atau Password salah");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1f3b63]">
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="block text-sm font-semibold mb-1 text-black">Password</label>
          <input
            type="password"
            placeholder="Masukkan password"
            className="w-full border border-black px-3 py-2 mb-6 bg-white text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          className="bg-yellow-400 px-8 py-2 rounded-full font-semibold mb-2"
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