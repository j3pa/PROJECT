"use client"; // Wajib ditambahkan agar usePathname bisa berfungsi

import './ui/global.css';
import { Poppins } from "next/font/google";
import { usePathname } from 'next/navigation'; // Import hook untuk cek URL
import Navbar from '@/app/ui/navbar'; // Sesuaikan dengan lokasi file navbar Anda

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Logika: Navbar tidak muncul jika URL dimulai dengan /dashboard atau /login
  const hideNavbar = pathname.startsWith('/dashboard') || pathname === '/login';

  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased bg-[#0a2540] text-white`}>
        {/* Navbar hanya muncul jika hideNavbar bernilai false */}
        {!hideNavbar && <Navbar />}
        
        {children}
      </body>
    </html>
  );
} 