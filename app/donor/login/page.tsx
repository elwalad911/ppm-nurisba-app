import type { Metadata } from "next";
import { Suspense } from "react";
import { DonorLoginClient } from "./donor-login-client";

export const metadata: Metadata = {
  title: "Login Donatur — PPM Nurisba",
  robots: { index: false, follow: false },
};

export default function DonorLoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Memuat...</div>}>
      <DonorLoginClient />
    </Suspense>
  );
}
