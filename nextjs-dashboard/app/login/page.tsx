import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1f3b63]">
      
      <div className="bg-gray-100 rounded-[40px] w-[400px] p-10 text-center shadow-xl">
        
        {/* LOGO ATAS */}
        <div className="flex justify-center mb-4">
          <Image src="/logo.png" alt="logo" width={120} height={120} className="rounded-full" />
        </div>

        <h1 className="text-2xl font-bold text-blue-900 mb-6">LOGIN</h1>

        {/* INPUT */}
        <div className="text-left">
          <label className="font-semibold">Username</label>
          <input
            type="text"
            placeholder="Masukkan username"
            className="w-full border p-2 mb-4"
          />

          <label className="font-semibold">Password</label>
          <input
            type="password"
            placeholder="Masukkan password"
            className="w-full border p-2 mb-6"
          />
        </div>

        {/* BUTTON */}
        <button className="bg-yellow-400 hover:bg-yellow-500 px-8 py-2 rounded-full font-semibold mb-3">
          LOG IN
        </button>

        <p className="text-sm text-gray-500 mb-6">Forgot password?</p>

        {/* LOGO BAWAH */}
        <div className="flex justify-center mt-4">
          <Image src="/logo.png" alt="logo" width={100} height={100} />
        </div>

      </div>
    </div>
  );
}