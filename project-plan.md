# Project Plan: Web Donasi Pondok Pesantren (ppm-nurisba-app)

## 1. Deskripsi Proyek
Aplikasi web untuk memfasilitasi program donasi (wakaf, sedekah, dll) bagi Pondok Pesantren. Berfokus pada keamanan transaksi, transparansi dana, dan kemudahan antarmuka bagi donatur.

## 2. Tech Stack Utama
*   **Framework:** Next.js (App Router) - Untuk frontend dan backend API.
*   **Styling:** Tailwind CSS & Shadcn UI - Untuk tampilan UI yang cepat dan responsif.
*   **Database:** Supabase (PostgreSQL) - Untuk menyimpan data program dan riwayat donasi.
*   **Payment Gateway:** Midtrans - Untuk memproses pembayaran (QRIS, e-wallet, transfer bank).
*   **Validasi Data:** Zod - Untuk memastikan form donasi diisi dengan benar dan aman dari spam.

## 3. Struktur Direktori (Referensi AI)
```text
/ppm-nurisba-app
├── /app                  
│   ├── /api              
│   │   ├── /donations    # Endpoint untuk mengambil/menyimpan data Supabase
│   │   └── /midtrans     # Endpoint Snap Token & Webhook (dengan verifikasi Signature Key)
│   ├── /campaigns        
│   │   └── [id]          # Halaman detail masing-masing program donasi
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
│   └── utils.ts          # Fungsi utilitas (misal: format Rupiah)
└── /types                # Definisi TypeScript untuk tipe data
```

## 4. Skema Database (Supabase)
*   **Tabel `campaigns`:** `id`, `title`, `description`, `target_amount`, `current_amount`, `image_url`. 
    *   *Security (RLS):* Publik hanya boleh melihat (SELECT).
*   **Tabel `donations`:** `id`, `campaign_id`, `donor_name`, `amount`, `message`, `status` (pending/success/failed).
    *   *Security (RLS):* Publik boleh menambah data (INSERT). Hanya API Backend yang boleh mengubah status (UPDATE).

## 5. Peta Jalan Fitur (Roadmap)

### Fase 1: Penemuan & Landing Page
*   **Hero Section:** Menampilkan pesan utama dan Call to Action (CTA).
*   **Sistem Pencarian:** Kolom teks untuk mencari program amal.
*   **Filter Kategori:** Tombol penyaring untuk menampilkan jenis donasi tertentu (contoh: Semua, Wakaf, Beasiswa).
*   **Katalog Program:** Tampilan *Grid* kartu program donasi yang sedang aktif.

### Fase 2: Alur Transaksi (Checkout)
*   **Halaman Detail Program:** Menampilkan deskripsi lengkap, target pengumpulan dana, dan *progress bar*.
*   **Formulir Donasi:** Input data donatur (opsi anonim) dan pemilihan nominal.
*   **Integrasi Midtrans:** Memunculkan *Snap Pop-up* untuk eksekusi pembayaran.
*   **Sistem Webhook:** Memperbarui status pembayaran secara otomatis di *database* setelah transaksi berhasil.

### Fase 3: Transparansi & Profil
*   **Laporan Keuangan:** Halaman publik yang menampilkan grafik/tabel pemasukan dan pengeluaran dana pesantren.
*   **Halaman Profil:** Menampilkan sejarah, fasilitas, dan kontak pesantren.

### Fase 4: Portal Donatur
*   **Autentikasi:** Fitur *Login/Register* untuk donatur.
*   **Dashboard Personal:** Menampilkan riwayat donasi pengguna dan sertifikat/bukti amal digital.

## 4. Keamanan & Batasan (Constraints)
*   Rahasia kunci API (Midtrans & Supabase) wajib disimpan dalam file `.env.local`.
*   Akses pengubahan data transaksi di *database* (Row Level Security) hanya boleh dilakukan oleh *Backend API*, bukan dari *Frontend*.
