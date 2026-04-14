import './ui/global.css';
import Navbar from './ui/navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0a2540] text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}