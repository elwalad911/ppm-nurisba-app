"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, HandHeart, BarChart3, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/donasi", label: "Donasi", icon: HandHeart },
  { href: "/transparansi", label: "Laporan", icon: BarChart3 },
  { href: "/profil", label: "Profil", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface rounded-t-xl shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-surface-container">
      <div className="flex justify-around items-center h-16 w-full px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center px-2 py-1 transition-all active:scale-90 duration-200",
                isActive
                  ? "bg-primary-container text-on-primary-container rounded-full px-4"
                  : "text-on-surface-variant hover:text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-semibold mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
