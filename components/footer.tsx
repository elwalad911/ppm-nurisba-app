import Link from "next/link";
import { Container } from "@/components/container";
import { Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { href: "/profil", label: "Tentang Kami" },
  { href: "/program", label: "Program" },
  { href: "/berita", label: "Berita & Artikel" },
  { href: "/transparansi", label: "Transparansi Donasi" },
];

const helpLinks = [
  { href: "/kontak", label: "Hubungi Kami" },
  { href: "#", label: "Kebijakan Privasi" },
  { href: "#", label: "Syarat & Ketentuan" },
  { href: "#", label: "FAQ" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full pt-12 pb-10 bg-surface-container-highest mt-auto">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <span className="text-base font-bold text-primary tracking-tight">
              PPM Nurisba
            </span>
            <p className="text-sm text-on-surface-variant max-w-xs leading-relaxed">
              Pusat Pendidikan dan Manajemen Nurul Ikhlas Soreang Bandung.
              Berkomitmen pada pendidikan dan transparansi.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 flex flex-col">
            <h4 className="text-sm font-semibold text-on-surface mb-2">
              Tautan Cepat
            </h4>
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-on-surface-variant hover:text-cta transition-colors underline-offset-4 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Help Links */}
          <div className="space-y-2 flex flex-col">
            <h4 className="text-sm font-semibold text-on-surface mb-2">
              Bantuan
            </h4>
            {helpLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-on-surface-variant hover:text-cta transition-colors underline-offset-4 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-outline-variant/50 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-on-surface-variant text-center md:text-left">
            &copy; {currentYear} PPM Nurisba. Amanah &amp; Transparan.
          </p>
          <div className="flex gap-4">
            <a
              href="mailto:nurulikhlassoreangbandung@gmail.com"
              className="w-10 h-10 rounded-full bg-surface text-primary flex items-center justify-center shadow-sm hover:bg-primary-soft transition-colors"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a
              href="https://wa.me/6282262893646"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-surface text-primary flex items-center justify-center shadow-sm hover:bg-primary-soft transition-colors"
              aria-label="WhatsApp"
            >
              <Phone className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-surface text-primary flex items-center justify-center shadow-sm hover:bg-primary-soft transition-colors"
              aria-label="Lokasi"
            >
              <MapPin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
