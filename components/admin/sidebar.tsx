"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Megaphone,
  HeartHandshake,
  Newspaper,
  CalendarDays,
  Image as ImageIcon,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/admin/donations", label: "Donations", icon: HeartHandshake },
  { href: "/admin/posts", label: "Posts (Berita)", icon: Newspaper },
  { href: "/admin/events", label: "Events (Agenda)", icon: CalendarDays },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="flex flex-col border-r border-border bg-surface w-64 min-h-screen p-4 shrink-0">
      <div className="py-4 px-3 mb-4 border-b border-border-light">
        <h2 className="text-lg font-bold text-primary">PPM Nurisba Admin</h2>
        <p className="text-xs text-text-muted">Panel Pengelolaan Data</p>
      </div>

      <nav className="space-y-1 flex-1">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
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
    </aside>
  );
}
