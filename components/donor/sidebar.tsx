"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  History,
  User,
  Home,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const donorNavItems = [
  { href: "/donor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/donor/donations", label: "Riwayat Donasi", icon: History },
  { href: "/donor/profile", label: "Profil Saya", icon: User },
  { href: "/", label: "Beranda Utama", icon: Home },
];

export function DonorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/donor/login" || pathname === "/donor/register") {
    return null;
  }

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/donor/login");
    router.refresh();
  };

  const sidebarContent = (
    <>
      <div className="py-4 px-3 mb-4 border-b border-border-light flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-primary">Portal Donatur</h2>
          <p className="text-xs text-text-muted">PPM Nurisba</p>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg hover:bg-primary-soft transition-colors"
          aria-label="Tutup menu"
        >
          <X className="h-5 w-5 text-text-secondary" />
        </button>
      </div>

      <nav className="space-y-1 flex-1">
        {donorNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-primary-soft hover:text-primary"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-border-light mt-auto">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger-soft"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Keluar</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-surface border border-border shadow-sm hover:bg-primary-soft transition-colors"
        aria-label="Buka menu navigasi"
      >
        <Menu className="h-5 w-5 text-text-primary" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "flex flex-col border-r border-border bg-surface w-64 min-h-screen p-4 shrink-0",
          "fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:relative md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
