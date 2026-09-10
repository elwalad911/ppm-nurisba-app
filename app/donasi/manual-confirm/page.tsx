import type { Metadata } from "next";
import { ManualConfirmClient } from "./manual-confirm-client";

export const metadata: Metadata = {
  title: "Konfirmasi Pembayaran Manual",
  description:
    "Instruksi pembayaran manual donasi untuk PPM Nurisba — transfer bank atau QRIS.",
};

export default function ManualConfirmPage() {
  return <ManualConfirmClient />;
}
