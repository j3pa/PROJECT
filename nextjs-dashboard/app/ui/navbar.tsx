"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SkyboltLogo from "./skybolt-logo";

export default function Navbar() {
  const pathname = usePathname() || "";

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-10 py-5 bg-black/20 backdrop-blur-md">
      <Link href="/">
        <SkyboltLogo />
      </Link>

      <div className="hidden md:flex space-x-8 font-medium">
        <Link
          href="/"
          className={isActive("/") ? "text-yellow-400" : "hover:text-blue-400"}
        >
          HOME
        </Link>

        <Link
          href="/about"
          className={isActive("/about") ? "text-yellow-400" : "hover:text-blue-400"}
        >
          ABOUT
        </Link>

        <Link
          href="/contact"
          className={isActive("/contact") ? "text-yellow-400" : "hover:text-blue-400"}
        >
          CONTACT
        </Link>
        <Link
          href="/login"
          className="bg-blue-900 px-6 py-1 rounded-md border border-white/20 text-white"
        >
  LOG IN
</Link>
      </div>
    </nav>
  );
}