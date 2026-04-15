"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SkyboltLogo from './skybolt-logo';

export default function Navbar() {
  const pathname = usePathname();

  const navLink = (path) =>
    `transition ${
      pathname === path
        ? "text-yellow-400 font-semibold"
        : "hover:text-blue-400"
    }`;

  return (
    <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-10 py-5 bg-black/20 backdrop-blur-md">
      <Link href="/"><SkyboltLogo /></Link>

      <div className="hidden md:flex space-x-8 font-medium">
        <Link href="/" className={navLink("/")}>HOME</Link>
        <Link href="/about" className={navLink("/about")}>ABOUT</Link>
        <Link href="/contact" className={navLink("/contact")}>CONTACT</Link>

        <button className="bg-blue-900 px-6 py-1 rounded-md border border-white/20 text-white">
          LOG IN
        </button>
      </div>
    </nav>
  );
}