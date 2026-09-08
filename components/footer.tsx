import Link from "next/link";
import { Container } from "@/components/container";

const quickLinks = [
  { href: "/profil", label: "Profil" },
  { href: "/program", label: "Program" },
  { href: "/kegiatan", label: "Kegiatan" },
  { href: "/kontak", label: "Kontak" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-strong text-white">
      <Container>
        <div className="grid grid-cols-1 gap-10 py-12 sm:py-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold">PPM Nurisba</h3>
            <p className="mt-3 text-sm text-white/70 leading-relaxed">
              Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung.
              <br />
              Bagian dari Yayasan Nurul Ikhlas Soreang Bandung.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Tautan
            </h4>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Donation Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Program Wakaf
            </h4>
            <p className="mt-4 text-sm text-white/70">
              Pembangunan Masjid dan Ruang Kelas/Asrama PPM Nurisba.
            </p>
            <p className="mt-2 text-sm font-semibold text-cta">
              Target: Rp1.203.800.000
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Kontak
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>
                WhatsApp:{" "}
                <a
                  href="https://wa.me/6282262893646"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white transition-colors hover:underline"
                >
                  082262893646
                </a>
              </li>
              <li>
                Email:{" "}
                <a
                  href="mailto:nurulikhlassoreangbandung@gmail.com"
                  className="text-white transition-colors hover:underline"
                >
                  nurulikhlassoreangbandung@gmail.com
                </a>
              </li>
              <li className="leading-relaxed">
                Perum Bumi Parahyangan Kencana
                <br />
                Jl. Bhayangkara Blok N 7 No. 10–12
                <br />
                RT. 01/RW. 24, Soreang
                <br />
                Bandung 40911, Jawa Barat
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
          <p>
            &copy; {currentYear} Pondok Pesantren Modern Nurul Ikhlas Soreang
            Bandung. Hak cipta dilindungi.
          </p>
        </div>
      </Container>
    </footer>
  );
}
