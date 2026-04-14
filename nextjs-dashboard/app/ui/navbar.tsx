import Link from 'next/link';
import SkyboltLogo from './skybolt-logo';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-10 py-5 bg-black/20 backdrop-blur-md">
      <Link href="/"><SkyboltLogo /></Link>
      <div className="hidden md:flex space-x-8 font-medium">
        <Link href="/" className="hover:text-blue-400 transition">HOME</Link>
        <Link href="/about" className="hover:text-blue-400 transition">ABOUT</Link>
        <Link href="/contact" className="hover:text-blue-400 transition">CONTACT</Link>
        <button className="bg-blue-900 px-6 py-1 rounded-md border border-white/20 text-white">LOG IN</button>
      </div>
    </nav>
  );
}