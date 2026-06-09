"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/app/ui/navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith('/dashboard') || pathname === '/login';

  return hideNavbar ? null : <Navbar />;
}
