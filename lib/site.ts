/**
 * Konstanta situs PPM Nurisba — satu sumber kebenaran untuk metadata SEO.
 * Nilai deskripsi diambil dari content-website.md (Bagian 2: Hero Homepage).
 */

export const site = {
  name: "PPM Nurisba",
  fullName:
    "Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung",
  url: "https://ppm.nurisba.id",
  // Deskripsi hero dari content-website.md §2, dipendekkan agar ≤ ±160 karakter.
  description:
    "Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung sedang membangun masjid dan tiga ruang kelas/asrama di atas tanah wakaf aset yayasan seluas 3.885 m².",
  locale: "id_ID" as const,
  siteName: "PPM Nurisba",
} as const;
