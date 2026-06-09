import { FaYoutube, FaInstagram, FaTwitter } from 'react-icons/fa';

export const metadata = {
  title: 'Beranda',
};

export default function Home() {
  return (
    <main className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden text-white">
      
      {/* Background image + overlay */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/background.jpeg"
          alt="background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-blue-900/50" />
      </div>

      <p className="text-xl font-medium mb-2">Welcome to</p>
      <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
        SKYBOLT <span className="text-blue-400">AIR CARGO</span>
      </h1>
      <p className="text-lg md:text-xl mb-8 opacity-90">
        Penetrate the Sky, Accelerate Your Business.
      </p>

      <div className="flex space-x-4 mb-6">
        <div className="p-3 bg-red-600 rounded-full cursor-pointer hover:opacity-80 transition">
          <FaYoutube size={20} />
        </div>
        <div className="p-3 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full cursor-pointer hover:opacity-80 transition">
          <FaInstagram size={20} />
        </div>
        <div className="p-3 bg-sky-500 rounded-full cursor-pointer hover:opacity-80 transition">
          <FaTwitter size={20} />
        </div>
      </div>

      <p className="text-xs uppercase tracking-widest font-bold">
        Ekspedisi Petir • Kargo Udara
      </p>
    </main>
  );
}
