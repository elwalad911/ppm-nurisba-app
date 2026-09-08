"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/container";

const navItems = [
  { href: "/profil", label: "Profil" },
  { href: "/program", label: "Program" },
  { href: "/kegiatan", label: "Kegiatan" },
  { href: "/berita", label: "Berita" },
  { href: "/kontak", label: "Kontak" },
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

  return (
    <>
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300",
          "bg-white/80 backdrop-blur-md",
          scrolled ? "shadow-md" : "shadow-sm"
        )}
      >
        <Container>
          <nav className="flex h-[72px] items-center justify-between">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary tracking-tight sm:text-xl">
                PPM Nurisba
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden items-center gap-6 md:flex">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-sm font-semibold transition-colors duration-200 pb-1",
                      "hover:text-cta",
                      isActive
                        ? "text-primary border-b-2 border-primary font-bold"
                        : "text-on-surface-variant"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTA + Mobile controls */}
            <div className="flex items-center gap-4">
              {/* Desktop CTA */}
              <Link
                href="/donasi"
                className="hidden md:inline-flex items-center gap-2 bg-cta text-white px-6 py-2 rounded-xl text-sm font-semibold shadow-md transition-all duration-200 hover:bg-cta-strong hover:-translate-y-0.5 active:scale-95"
              >
                <Heart className="h-4 w-4" />
                Donasi Sekarang
              </Link>

              {/* Mobile donation icon button */}
              <Link
                href="/donasi"
                className="md:hidden flex items-center justify-center w-11 h-11 rounded-full text-primary hover:bg-surface-container transition-colors"
                aria-label="Donasi"
              >
                <Heart className="h-5 w-5" />
              </Link>

              {/* Mobile hamburger */}
              <button
                type="button"
                className="md:hidden flex items-center justify-center w-11 h-11 rounded-full text-primary hover:bg-surface-container transition-colors active:scale-95"
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
          className="fixed inset-0 z-40 bg-on-surface/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-[280px] z-50 bg-surface-container shadow-lg md:hidden",
          "flex flex-col transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/30">
          <h2 className="text-base font-bold text-primary">Menu Navigasi</h2>
          <button
            type="button"
            className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-surface-container-highest transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5 text-on-surface-variant" />
          </button>
        </div>

        {/* Drawer nav items */}
        <nav className="flex-1 overflow-y-auto flex flex-col p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                  isActive
                    ? "bg-primary-soft text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-highest"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Drawer CTA */}
        <div className="p-4 border-t border-outline-variant/30">
          <Link
            href="/donasi"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center w-full bg-cta text-white py-3 rounded-xl text-sm font-semibold shadow-md transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            Donasi Sekarang
          </Link>
        </div>
      </div>
    </>
  );
}
