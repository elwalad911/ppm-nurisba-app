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
    <footer className="w-full py-12 bg-surface-container border-t border-outline-variant mt-auto">
      <Container>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-lg font-bold text-primary tracking-tight">
              PPM Nurisba
            </span>
            <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed">
              Membangun generasi Islami yang cerdas, berakhlak mulia, dan berkontribusi nyata bagi masyarakat melalui program pendidikan dan sosial yang transparan.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-on-surface">
              Tautan Cepat
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-on-surface">
              Bantuan
            </h4>
            <ul className="space-y-2">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-on-surface-variant text-center md:text-left">
            &copy; {currentYear} PPM Nurisba. All Rights Reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="mailto:nurulikhlassoreangbandung@gmail.com"
              className="text-outline hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href="https://wa.me/6282262893646"
              target="_blank"
              rel="noopener noreferrer"
              className="text-outline hover:text-primary transition-colors"
              aria-label="WhatsApp"
            >
              <Phone className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-outline hover:text-primary transition-colors"
              aria-label="Lokasi"
            >
              <MapPin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
