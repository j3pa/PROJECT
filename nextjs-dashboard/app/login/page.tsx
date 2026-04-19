export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900">
      <div className="bg-white rounded-3xl p-10 w-[400px] text-center">
        <h1 className="text-2xl font-bold mb-6">LOGIN</h1>

        <input
          type="text"
          placeholder="Masukkan username"
          className="border w-full p-2 mb-4"
        />

        <input
          type="password"
          placeholder="Masukkan password"
          className="border w-full p-2 mb-4"
        />

        <button className="bg-yellow-400 px-6 py-2 rounded-md w-full">
          LOG IN
        </button>
      </div>
    </div>
  );
}