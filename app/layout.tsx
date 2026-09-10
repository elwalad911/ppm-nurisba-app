import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalBottomNav } from "./components/conditional-bottom-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#00685f",
};

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
      <body className="min-h-full flex flex-col">
        {children}
        <ConditionalBottomNav />
      </body>
    </html>
  );
}