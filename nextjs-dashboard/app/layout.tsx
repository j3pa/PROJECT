import './ui/global.css';
import Navbar from './ui/navbar';
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased bg-[#0a2540] text-white`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}