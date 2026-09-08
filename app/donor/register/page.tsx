import type { Metadata } from "next";
import { DonorRegisterClient } from "./donor-register-client";

export const metadata: Metadata = {
  title: "Daftar Donatur — PPM Nurisba",
  robots: { index: false, follow: false },
};

export default function DonorRegisterPage() {
  return <DonorRegisterClient />;
}
