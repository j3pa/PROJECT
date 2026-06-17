import './ui/global.css';
import { Poppins } from "next/font/google";
import ConditionalNavbar from '@/app/ui/conditional-navbar';
import PageEffects from '@/app/ui/page-effects';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: {
    default: 'Skybolt Air Cargo',
    template: '%s | Skybolt Air Cargo',
  },
  description: 'Website dan dashboard operasional Skybolt Air Cargo.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased bg-[#0a2540] text-white`}>
        <ConditionalNavbar />
        <PageEffects>{children}</PageEffects>
      </body>
    </html>
  );
}
