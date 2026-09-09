"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Heart,
  Info,
  BookOpen,
  CalendarCheck,
  Newspaper,
  Calendar,
  Image as ImageIcon,
  BarChart3,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/container";

const desktopNavItems = [
  { href: "/profil", label: "Profil" },
  { href: "/program", label: "Program" },
  { href: "/kegiatan", label: "Kegiatan" },
  { href: "/berita", label: "Berita" },
  { href: "/agenda", label: "Agenda" },
  { href: "/galeri", label: "Galeri" },
];

const mobileNavItems = [
  { href: "/profil", label: "Profil", icon: Info },
  { href: "/program", label: "Program", icon: BookOpen },
  { href: "/kegiatan", label: "Kegiatan", icon: CalendarCheck },
  { href: "/berita", label: "Berita", icon: Newspaper },
  { href: "/agenda", label: "Agenda", icon: Calendar },
  { href: "/galeri", label: "Galeri", icon: ImageIcon },
  { href: "/transparansi", label: "Transparansi", icon: BarChart3 },
  { href: "/kontak", label: "Kontak", icon: Phone },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300",
          "bg-white/80 backdrop-blur-md",
          scrolled ? "shadow-md" : "shadow-sm",
        )}
      >
        <Container>
          <nav className="flex h-[72px] items-center justify-between">
            {/* Brand Logo & Name */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shadow-sm border border-primary/20">
                <Image
                  src="/logo-ppm-nurisba.png"
                  alt="PPM Nurisba"
                  width={122}
                  height={122}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-primary tracking-tight">
                PPM Nurisba
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {desktopNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-sm font-semibold transition-colors duration-200 pb-1",
                      "hover:text-cta",
                      isActive
                        ? "text-primary border-b-2 border-primary font-bold"
                        : "text-on-surface-variant",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Actions + Mobile controls */}
            <div className="flex items-center gap-4">
              {/* Desktop Transparansi Link */}
              <Link
                href="/transparansi"
                className={cn(
                  "hidden lg:inline-flex text-sm font-semibold transition-colors duration-200",
                  pathname === "/transparansi"
                    ? "text-primary font-bold"
                    : "text-primary hover:text-cta",
                )}
              >
                Transparansi
              </Link>

              {/* Desktop CTA Button */}
              <Link
                href="/donasi"
                className="hidden sm:inline-flex items-center gap-2 bg-cta text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all duration-200 hover:bg-cta-strong hover:-translate-y-0.5 active:scale-95"
              >
                <Heart className="h-4 w-4" />
                Donasi Sekarang
              </Link>

              {/* Mobile donation icon button */}
              <Link
                href="/donasi"
                className="sm:hidden flex items-center justify-center w-11 h-11 rounded-full text-primary hover:bg-surface-container transition-colors"
                aria-label="Donasi"
              >
                <Heart className="h-5 w-5" />
              </Link>

              {/* Mobile hamburger button */}
              <button
                type="button"
                className="lg:hidden flex items-center justify-center w-11 h-11 rounded-full text-primary hover:bg-surface-container transition-colors active:scale-95"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </nav>
        </Container>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-on-surface/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation Drawer */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-[280px] z-50 bg-surface-container shadow-2xl lg:hidden",
          "flex flex-col border-r border-outline-variant/30 transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/30">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
              <Image
                src="/logo-ppm-nurisba.png"
                alt="PPM Nurisba"
                width={16}
                height={16}
                className="object-contain"
              />
            </div>
            <h2 className="text-base font-bold text-primary">Menu Navigasi</h2>
          </div>
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-highest transition-colors"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5 text-on-surface-variant" />
          </button>
        </div>

        {/* Drawer nav items */}
        <nav className="flex-1 overflow-y-auto flex flex-col p-4 space-y-1.5 hide-scrollbar">
          {mobileNavItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer",
                  isActive
                    ? "bg-primary-soft text-primary font-bold shadow-xs"
                    : "text-on-surface-variant hover:bg-surface-container-high",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Drawer CTA footer */}
        <div className="p-4 border-t border-outline-variant/30 bg-surface-container-low">
          <Link
            href="/donasi"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full bg-cta text-white py-3.5 rounded-xl text-sm font-semibold shadow-md transition-all duration-200 hover:bg-cta-strong hover:-translate-y-0.5 active:scale-95"
          >
            <Heart className="h-4 w-4" />
            Donasi Sekarang
          </Link>
        </div>
      </aside>
    </>
  );
}
