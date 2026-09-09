import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PPM Nurisba — Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung",
    template: "%s | PPM Nurisba",
  },
  description:
    "Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung — memadukan pendidikan salafiyah dan modern untuk generasi berilmu dan berakhlak. Program wakaf pembangunan masjid dan ruang kelas/asrama.",
  keywords: [
    "pondok pesantren",
    "nurul ikhlas",
    "nurisba",
    "soreang",
    "bandung",
    "wakaf",
    "donasi",
    "pendidikan islam",
  ],
  openGraph: {
    title: "PPM Nurisba — Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung",
    description:
      "Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung — memadukan pendidikan salafiyah dan modern untuk generasi berilmu dan berakhlak.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-16 md:pb-0">
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
