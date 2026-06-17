"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SkyboltLogo from "./skybolt-logo";

export default function Navbar() {
  const pathname = usePathname() || "";

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 z-50 flex h-20 w-full items-center justify-between bg-black/20 px-6 backdrop-blur-md md:px-10">
      <Link href="/" className="flex h-10 items-center">
        <SkyboltLogo />
      </Link>

      <div className="hidden h-10 items-center gap-8 font-medium md:flex">
        <Link
          href="/"
          className={`flex h-10 items-center leading-none ${isActive("/") ? "text-yellow-400" : "hover:text-blue-400"}`}
        >
          HOME
        </Link>

        <Link
          href="/about"
          className={`flex h-10 items-center leading-none ${isActive("/about") ? "text-yellow-400" : "hover:text-blue-400"}`}
        >
          ABOUT
        </Link>

        <Link
          href="/contact"
          className={`flex h-10 items-center leading-none ${isActive("/contact") ? "text-yellow-400" : "hover:text-blue-400"}`}
        >
          CONTACT
        </Link>
        <Link
          href="/login"
          className="flex h-10 items-center rounded-md border border-white/20 bg-blue-900 px-6 leading-none text-white"
        >
          LOG IN
        </Link>
      </div>
    </nav>
  );
}
