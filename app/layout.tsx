import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

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
  metadataBase: new URL(site.url),
  title: {
    default: "PPM Nurisba — Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung",
    template: "%s | PPM Nurisba",
  },
  description: site.description,
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
    description: site.description,
    type: "website",
    locale: site.locale,
    siteName: site.siteName,
    url: site.url,
    images: [
      {
        url: "/og-ppm-nurisba.png",
        width: 1200,
        height: 630,
        alt: "PPM Nurisba — Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PPM Nurisba — Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung",
    description: site.description,
    site: site.siteName,
  },
  alternates: {
    canonical: site.url,
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
      </body>
    </html>
  );
}