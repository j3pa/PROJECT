import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Kontak',
};

export default function ContactPage() {
  return (
    <main className="pt-32 pb-20 px-10 min-h-screen bg-[#07192e]">

      <div className="max-w-6xl mx-auto bg-[#0d2a4a] rounded-3xl p-10 border border-white/5">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white">CONTACT US</h2>
          <p className="text-gray-400">Hubungi kami untuk pertanyaan atau pelacakan kiriman:</p>
        </div>


        <div className="grid md:grid-cols-3 gap-6 mb-16">


          <div className="bg-white/5 p-8 rounded-2xl text-center flex flex-col items-center">
            <Phone className="text-red-500 mb-4" size={40} />
            <h4 className="font-bold mb-2 text-white">Contact</h4>
            <p className="text-blue-400">+62 1234567890</p>
          </div>


          <div className="bg-white/5 p-8 rounded-2xl text-center flex flex-col items-center">
            <MessageCircle className="text-green-500 mb-4" size={40} />
            <h4 className="font-bold mb-2 text-white">WhatsApp</h4>
            <p className="text-xs text-gray-400 mb-2">Chat langsung dengan agen</p>
            <p className="text-blue-400 font-medium">+62 1234567890</p>
          </div>


          <div className="bg-white/5 p-8 rounded-2xl text-center flex flex-col items-center">
            <Mail className="text-orange-400 mb-4" size={40} />
            <h4 className="font-bold mb-2 text-white">Email</h4>
            <p className="text-xs text-gray-400 mb-2">Untuk penawaran dan kerja sama</p>
            <p className="text-blue-400 font-medium">skybolt@gmail.com</p>
          </div>
        </div>


        <div className="flex flex-col items-center text-center border-t border-white/10 pt-12">
          <div className="bg-blue-500/10 p-4 rounded-full mb-4">
            <MapPin className="text-blue-400" size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-white">Kantor Pusat Kami</h3>
          <p className="text-gray-400 leading-relaxed max-w-lg">
            Jl. Laksda Adisucipto No. 45, Demangan, Kec. Depok,<br />
            Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281
          </p>
          <div className="mt-6 px-5 py-2 bg-white/5 rounded-full border border-white/10">
            <p className="text-sm text-blue-300">Jam Operasional: 08:00 - 21:00 WIB</p>
          </div>
        </div>
      </div>
    </main>
  );
}
