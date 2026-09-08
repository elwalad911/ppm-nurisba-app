"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/profil", label: "Profil" },
  { href: "/program", label: "Program" },
  { href: "/kegiatan", label: "Kegiatan" },
  { href: "/kontak", label: "Kontak" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <Container>
        <nav className="flex h-16 items-center justify-between sm:h-18">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary sm:text-xl">
              PPM Nurisba
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-soft hover:text-primary",
                  pathname === item.href
                    ? "bg-primary-soft text-primary"
                    : "text-text-secondary"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA + Mobile menu button */}
          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/donasi">Donasi Sekarang</Link>
            </Button>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-primary-soft hover:text-primary lg:hidden"
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

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-white lg:hidden">
          <Container>
            <div className="flex flex-col gap-1 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex h-11 items-center rounded-lg px-4 text-sm font-medium transition-colors hover:bg-primary-soft hover:text-primary",
                    pathname === item.href
                      ? "bg-primary-soft text-primary"
                      : "text-text-secondary"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild className="mt-2 w-full">
                <Link href="/donasi" onClick={() => setMobileMenuOpen(false)}>
                  Donasi Sekarang
                </Link>
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
