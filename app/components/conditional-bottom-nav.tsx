"use client";

import { usePathname } from "next/navigation";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

export function ConditionalBottomNav() {
  const pathname = usePathname();
  const isHidden = pathname.startsWith("/admin") || pathname.startsWith("/donor");

  if (isHidden) {
    return null;
  }

  return <MobileBottomNav />;
}