"use client";

import { usePathname } from "next/navigation";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

export function ConditionalBottomNav() {
  const pathname = usePathname();
  // Only show bottom nav on PUBLIC routes (not admin or donor)
  const showNav = !["/admin", "/donor"].includes(pathname);

  // Don't render if should be hidden
  if (!showNav) {
    return null;
  }

  return <MobileBottomNav />;
}