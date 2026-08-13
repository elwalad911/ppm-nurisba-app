# Project Plan: Web Donasi Pondok Pesantren (ppm-nurisba-app)

## 1. Deskripsi Proyek
Aplikasi web untuk memfasilitasi program donasi (wakaf, sedekah, dll) bagi Pondok Pesantren. Berfokus pada keamanan transaksi, transparansi dana, dan kemudahan antarmuka bagi donatur.

## 2. Tech Stack Utama
*   **Framework:** Next.js (App Router) - Untuk frontend dan backend API.
*   **Styling:** Tailwind CSS & Shadcn UI - Untuk tampilan UI yang cepat dan responsif.
*   **Database:** Supabase (PostgreSQL) - Untuk menyimpan data program, donasi, dan pengeluaran dana.
*   **Payment Gateway:** Midtrans - Untuk memproses pembayaran (QRIS, e-wallet, transfer bank).
*   **Validasi Data:** Zod - Untuk memastikan form donasi diisi dengan benar dan aman dari spam.

## 3. Struktur Direktori (Referensi AI)
```text
/ppm-nurisba-app
├── /app
│   ├── /api
│   │   ├── /donations    # Endpoint untuk mengambil/menyimpan data Supabase
│   │   ├── /expenses     # Endpoint untuk data pengeluaran (Fase 3 - transparansi)
│   │   └── /midtrans     # Endpoint Snap Token & Webhook (dengan verifikasi Signature Key + idempotency)
│   ├── /campaigns
│   │   └── [slug]         # Halaman detail program (pakai slug, bukan UUID, untuk SEO & share link)
│   ├── layout.tsx        # UI pembungkus (Navbar & Footer)
│   └── page.tsx          # Halaman Beranda (Landing Page)
├── /components
│   ├── /ui               # Komponen dasar dari Shadcn UI
│   ├── DonationForm.tsx  # Form donasi dengan validasi Zod
│   ├── CampaignCard.tsx  # Kartu tampilan program
│   └── ProgressBar.tsx   # Indikator progress dana terkumpul
├── /lib
│   ├── supabase.ts       # Konfigurasi Supabase client
│   ├── midtrans.ts       # Konfigurasi Midtrans client
│   ├── rate-limit.ts     # Rate limiting untuk endpoint publik (insert donasi)
│   └── utils.ts          # Fungsi utilitas (misal: format Rupiah)
└── /types                # Definisi TypeScript untuk tipe data
```

## 4. Skema Database (Supabase)

### Tabel `campaigns`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid | Primary key |
| `slug` | text (unique) | Untuk URL SEO-friendly & share link, mis. `/campaigns/renovasi-asrama` |
| `title` | text | Judul program |
| `description` | text | Deskripsi lengkap |
| `category` | text | Wakaf / Beasiswa / Sedekah / dll — dipakai oleh fitur Filter Kategori di Fase 1 |
| `target_amount` | numeric | Target dana |
| `current_amount` | numeric | Dana terkumpul (di-update lewat webhook, bukan langsung dari frontend) |
| `image_url` | text | URL gambar program |
| `status` | text | `active` / `completed` / `closed` — supaya campaign yang sudah tercapai tidak terus tampil di katalog |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

*Security (RLS):* Publik hanya boleh `SELECT` baris dengan `status = 'active'` atau `'completed'`. Insert/update hanya lewat service role (backend/admin).

### Tabel `donations`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid | Primary key |
| `campaign_id` | uuid | FK ke `campaigns` |
| `donor_name` | text | Boleh "Hamba Allah" jika opsi anonim dipilih |
| `donor_email` | text (nullable) | Untuk kirim bukti donasi / notifikasi |
| `donor_phone` | text (nullable) | Opsional, untuk notifikasi via WA jika diperlukan |
| `is_anonymous` | boolean | |
| `amount` | numeric | |
| `message` | text (nullable) | Doa/pesan dari donatur |
| `status` | text | `pending` / `success` / `failed` — default `pending`, hanya diubah oleh backend lewat webhook |
| `midtrans_order_id` | text (unique) | Wajib untuk rekonsiliasi & mencegah duplikasi saat webhook retry |
| `payment_method` | text (nullable) | QRIS/e-wallet/VA — diisi setelah callback Midtrans, berguna untuk laporan Fase 3 |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

*Security (RLS):* Publik boleh `INSERT` (dengan `status` dikunci default `pending` di level backend, bukan dikirim dari client). Hanya API Backend (service role) yang boleh `UPDATE` status.

### Tabel `expenses` (baru — untuk Fase 3: Laporan Keuangan)
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid | Primary key |
| `campaign_id` | uuid (nullable) | Boleh null jika pengeluaran bersifat umum/operasional, bukan terikat 1 campaign |
| `category` | text | Operasional / Renovasi / Konsumsi / dll |
| `description` | text | |
| `amount` | numeric | |
| `proof_url` | text (nullable) | Bukti pengeluaran (nota/foto) — penting untuk kredibilitas transparansi |
| `spent_at` | date | Tanggal pengeluaran |
| `created_at` | timestamptz | |

*Security (RLS):* Publik hanya boleh `SELECT`. Insert/update hanya lewat dashboard admin (di luar cakupan Fase 1–2, disiapkan skemanya dari awal supaya tidak perlu migrasi besar nanti).

## 5. Peta Jalan Fitur (Roadmap)

### Fase 1: Penemuan & Landing Page
*   **Hero Section:** Menampilkan pesan utama dan Call to Action (CTA).
*   **Sistem Pencarian:** Kolom teks untuk mencari program amal.
*   **Filter Kategori:** Tombol penyaring berdasarkan kolom `category` di tabel `campaigns`.
*   **Katalog Program:** Tampilan *Grid* kartu program donasi dengan `status = active`.

### Fase 2: Alur Transaksi (Checkout)
*   **Halaman Detail Program:** Deskripsi lengkap, target dana, *progress bar* berbasis `current_amount`.
*   **Formulir Donasi:** Input data donatur (opsi anonim) dan pemilihan nominal, validasi Zod di client & server.
*   **Integrasi Midtrans:** *Snap Pop-up* untuk eksekusi pembayaran, simpan `midtrans_order_id` sebelum popup dibuka.
*   **Sistem Webhook:** Update status pembayaran otomatis, dengan:
    *   Verifikasi Signature Key dari Midtrans (wajib, bukan opsional).
    *   Idempotency check berbasis `midtrans_order_id` — cegah `current_amount` bertambah dobel jika Midtrans retry webhook.
    *   Update `current_amount` campaign dan `payment_method` donasi dalam satu transaksi database.

### Fase 3: Transparansi & Profil
*   **Laporan Keuangan:** Halaman publik menampilkan grafik/tabel pemasukan (dari `donations`) dan pengeluaran (dari `expenses`) — termasuk bukti pengeluaran jika tersedia.
*   **Halaman Profil:** Sejarah, fasilitas, dan kontak pesantren.

### Fase 4: Portal Donatur
*   **Autentikasi:** Login/Register donatur (Supabase Auth).
*   **Dashboard Personal:** Riwayat donasi (join by `donor_email` atau `user_id` setelah login), sertifikat/bukti amal digital.

## 6. Keamanan & Batasan (Constraints)
*   Rahasia kunci API (Midtrans & Supabase) wajib disimpan di environment variable Vercel — jangan pernah commit `.env.local`.
*   Akses pengubahan data transaksi (`donations.status`, `campaigns.current_amount`) di database (Row Level Security) hanya boleh dilakukan oleh Backend API (service role), bukan dari Frontend.
*   Endpoint publik yang menerima `INSERT` (form donasi) wajib diberi rate limiting di level API route — bukan hanya mengandalkan RLS — untuk mencegah spam data pending.
*   Webhook Midtrans wajib idempotent: gunakan `midtrans_order_id` sebagai constraint unik untuk mencegah double-processing saat Midtrans melakukan retry.
*   Sebelum go-live, uji webhook di URL production (bukan hanya localhost/ngrok) dan pastikan URL sudah terdaftar di dashboard Midtrans.