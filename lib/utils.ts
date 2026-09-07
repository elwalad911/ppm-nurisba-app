import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fungsi pembantu untuk menggabungkan class Tailwind CSS
 * Mencegah konflik styling antar komponen
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Fungsi pembantu untuk mengubah angka nominal menjadi format Rupiah
 * Contoh: 1203800000 -> "Rp 1.203.800.000"
 */
export function formatRupiah(amount: number | bigint): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
