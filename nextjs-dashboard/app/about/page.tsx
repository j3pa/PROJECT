import { Clock, Bell, ShieldCheck, Plane } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      title: "Tracking Real-Time",
      description: "Pantau posisi kiriman Anda setiap saat melalui dashboard atau notifikasi WhatsApp otomatis.",
      icon: <Clock className="text-blue-400" size={24} />
    },
    {
      title: "Notifikasi Otomatis",
      description: "Update status pengiriman langsung ke WhatsApp dan email pengirim maupun penerima.",
      icon: <Bell className="text-blue-400" size={24} />
    },
    {
      title: "Asuransi Kargo",
      description: "Perlindungan penuh untuk setiap pengiriman dengan klaim mudah dan proses cepat.",
      icon: <ShieldCheck className="text-blue-400" size={24} />
    },
    {
      title: "Partner Bandara Resmi",
      description: "Kerjasama resmi dengan ground handling di semua bandara mitra untuk penanganan optimal.",
      icon: <Plane className="text-blue-400" size={24} />
    }
  ];

  return (
    <main className="pt-32 pb-20 px-6 md:px-20 min-h-screen bg-[#0a2540] text-white">
      <div className="max-w-6xl mx-auto">
        {/* Section: About Us */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-4xl font-bold mb-6 tracking-tight">ABOUT US</h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              Ekspedisi Petir adalah perusahaan jasa pengiriman kargo udara yang 
              beroperasi di mitra bandara di seluruh Indonesia. Kami mengutamakan 
              kecepatan, keandalan, dan transparansi dalam proses pengiriman secara real-time.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            {/* Container Lingkaran */}
            <div className="w-72 h-72 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 shadow-xl">
                <img 
                src="/logo.png" 
                alt="Skybolt Logo" 
                className="w-full h-full object-cover"
                />
                </div>
            </div>
        </div>

        {/* Section: Why Skybolt? */}
        <div>
          <h2 className="text-3xl font-bold mb-10 text-center md:text-left">WHY SKYBOLT?</h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((item, index) => (
              <div 
                key={index} 
                className="bg-white/10 p-6 rounded-2xl border border-white/5 hover:border-blue-500/50 transition-colors group"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 text-blue-300">{item.title}</h4>
                    <p className="text-gray-400 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}