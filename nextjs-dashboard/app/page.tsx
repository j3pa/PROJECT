import SkyboltLogo from '@/app/ui/skybolt-logo';
import { Phone, MessageCircle, Mail, Youtube, Instagram, Twitter } from 'lucide-react';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-10 py-5 bg-black/20 backdrop-blur-md">
        <SkyboltLogo />
        <div className="hidden md:flex space-x-8 font-medium">
          <a href="#" className="hover:text-blue-400 transition">HOME</a>
          <a href="#about" className="hover:text-blue-400 transition">ABOUT</a>
          <a href="#contact" className="hover:text-blue-400 transition">CONTACT</a>
          <button className="bg-blue-900 px-6 py-1 rounded-md border border-white/20">LOG IN</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1506012733851-462978393e2a?q=80&w=2000')] bg-cover bg-center">
          <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply"></div>
        </div>

        <h2 className="text-xl font-medium mb-2">Welcome to</h2>
        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
          SKYBOLT <span className="text-blue-400">AIR CARGO</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 opacity-90">Penetrate the Sky, Accelerate Your Business.</p>
        
        <div className="flex space-x-4 mb-6">
          <div className="p-3 bg-red-600 rounded-full cursor-pointer"><Youtube size={20} /></div>
          <div className="p-3 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full cursor-pointer"><Instagram size={20} /></div>
          <div className="p-3 bg-sky-500 rounded-full cursor-pointer"><Twitter size={20} /></div>
        </div>
        <p className="text-xs uppercase tracking-widest font-bold">Ekspedisi Petir • Kargo Udara</p>
      </section>

      {/* ABOUT & WHY SECTION */}
      <section id="about" className="bg-[#0a2540] py-20 px-10 md:px-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-6">ABOUT US</h2>
          <p className="text-gray-300 leading-relaxed mb-10">
            Ekspedisi Petir adalah perusahaan jasa pengiriman kargo udara yang beroperasi di mitra bandara di seluruh Indonesia. Kami mengutamakan kecepatan, keandalan, dan transparansi dalam proses pengiriman secara real-time.
          </p>

          <h2 className="text-3xl font-bold mb-6">WHY SKYBOLT?</h2>
          <div className="space-y-4">
            {[
              { title: "Tracking Real-Time", desc: "Pantau posisi kiriman Anda setiap saat melalui dashboard atau notifikasi WhatsApp otomatis." },
              { title: "Notifikasi Otomatis", desc: "Update status pengiriman langsung ke WhatsApp dan email pengirim maupun penerima." },
              { title: "Asuransi Kargo", desc: "Perlindungan penuh untuk setiap pengiriman dengan klaim mudah dan proses cepat." },
              { title: "Partner Bandara Resmi", desc: "Kerjasama resmi dengan ground handling di semua bandara mitra untuk penanganan optimal." },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-300">{item.title}</h4>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
            {/* Logo Lingkaran Besar */}
            <div className="w-64 h-64 md:w-80 md:h-80 bg-white rounded-full flex items-center justify-center p-8 shadow-2xl">
                <img src="/skybolt-logo-circle.png" alt="Skybolt Logo" className="w-full object-contain" />
                {/* Gunakan placeholder jika file belum ada */}
            </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="bg-[#07192e] py-20 px-10">
        <div className="max-w-6xl mx-auto bg-[#0d2a4a] rounded-3xl p-10 border border-white/5">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">CONTACT US</h2>
            <p className="text-gray-400">Hubungi kontak ini untuk pertanyaan, jadwal pick-up, atau pelacakan kiriman:</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 p-8 rounded-2xl text-center flex flex-col items-center">
              <Phone className="text-red-500 mb-4" size={40} />
              <h4 className="font-bold mb-2">Contact</h4>
              <p className="text-xs text-gray-400 mb-2">Hotline operasional 24/7</p>
              <p className="text-blue-400 font-medium">+62 1234567890</p>
            </div>
            
            <div className="bg-white/5 p-8 rounded-2xl text-center flex flex-col items-center">
              <MessageCircle className="text-green-500 mb-4" size={40} />
              <h4 className="font-bold mb-2">WhatsApp</h4>
              <p className="text-xs text-gray-400 mb-2">Chat langsung dengan agen</p>
              <p className="text-blue-400 font-medium">+62 1234567890</p>
            </div>

            <div className="bg-white/5 p-8 rounded-2xl text-center flex flex-col items-center">
              <Mail className="text-orange-400 mb-4" size={40} />
              <h4 className="font-bold mb-2">Email</h4>
              <p className="text-xs text-gray-400 mb-2">Untuk penawaran dan kerja sama</p>
              <p className="text-blue-400 font-medium">skybolt@gmail.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0a2540] py-6 text-center border-t border-white/5">
        <p className="text-xs text-gray-500 uppercase tracking-widest">
          2026 SKYBOLT AIR CARGO • CARGO UDARA
        </p>
      </footer>
    </main>
  );
}