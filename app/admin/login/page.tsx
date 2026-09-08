import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginClient } from "./admin-login-client";

export const metadata: Metadata = {
  title: "Admin Login — PPM Nurisba",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Memuat...</div>}>
      <AdminLoginClient />
    </Suspense>
  );
}
