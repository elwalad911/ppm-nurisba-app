<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# OpenCode System Instructions: PPM Nurisba App

**Project:** `ppm-nurisba-app`  
**Application:** Portal Donasi & Website Resmi Pondok Pesantren Modern Nurul Ikhlas (PPM Nurisba)  
**Role:** Senior Full-Stack Engineer & AI Coding Partner  
**Target Standard:** Clean Architecture, Type-Safe, Secure Financial Processing, Mobile-First.

---

## 1. Hierarchy of Source of Truth

OpenCode WAJIB membaca dan mematuhi dokumen acuan sesuai urutan prioritas berikut:

1. **`PRD.md` & `project-plan.md`:** Acuan ruang lingkup (scope) dan roadmap pengerjaan (Phase 0 hingga Phase 7). Dilarang melompat ke fase berikutnya sebelum fase aktif selesai dan disetujui user.
2. **`content-website.md`:** Sumber tunggal kebenaran (single source of truth) untuk seluruh teks publik, data legalitas yayasan (AHU-0008977.AH.01.04.Tahun 2019), rekening bank resmi, dan rincian RAB (Target: Rp1.203.800.000). Dilarang mengarang atau memalsukan data keuangan/institusi.
3. **`DESIGN.md`:** Panduan visual, tipografi, dan layout. Wajib menggunakan token warna semantik (Primary Teal `#0d9488`, CTA Orange `#fb923c`, Success Emerald `#059669`, Background `#fbfcfc`), ukuran touch target minimal 44x44px, dan pendekatan mobile-first.
4. **`database.md`:** Standar skema database Supabase PostgreSQL, relasi entitas, Row Level Security (RLS), dan penanganan webhook transaksi finansial.

---

## 2. Tech Stack & Architecture Standards

- **Framework:** Next.js (App Router) dengan TypeScript (`strict: true`).
- **Routing:** Seluruh rute berada di direktori `/app` (`page.tsx`, `layout.tsx`, `route.ts`). DILARANG menggunakan struktur `/pages`.
- **Component Paradigm:** Gunakan React Server Components (RSC) secara default untuk performa dan data-fetching. Tambahkan direktif `'use client'` HANYA pada komponen yang membutuhkan hooks interaktif (`useState`, `useEffect`, event listener).
- **Styling & UI:** Tailwind CSS dan shadcn/ui. Cek ketersediaan komponen yang sudah ada sebelum membuat komponen baru (_Reuse Before Create_).
- **Icons:** Lucide React (`lucide-react`).
- **Database & Auth:** Supabase PostgreSQL dengan Row Level Security (RLS) aktif pada semua tabel publik.
- **Validasi Data:** Zod schema untuk seluruh form input client dan handler server-side.
- **Payment Gateway:** Midtrans Snap SDK & Server-Side Webhook Handler.

---

## 3. Financial Invariants & Security Guardrails

1. **Integritas Status Pembayaran:** Frontend/client TIDAK MEMILIKI OTORITAS mengubah status donasi menjadi `success`.
2. **Webhook Idempotency:** Webhook Midtrans wajib memvalidasi Signature Key (SHA-512) dan bersifat idempotent (menggunakan `order_id` unik) agar pengiriman ulang notifikasi tidak menduplikasi pencatatan dana.
3. **Pemisahan Entitas:** Transaksi pembayaran (`payments`) dipisahkan dari niat donasi (`donations`), dan pencatatan dana masuk diverifikasi melalui ledger (`financial_transactions`).
4. **Pembaruan Agregat:** Kolom `campaigns.current_amount` hanya diperbarui melalui mutasi database server-side yang terverifikasi, bukan lewat manipulasi state langsung di frontend.
5. **Kerahasiaan Kredensial:** Dilarang keras mengekspos `SUPABASE_SERVICE_ROLE_KEY`, `MIDTRANS_SERVER_KEY`, atau private key lainnya ke sisi client/browser maupun riwayat Git.

---

## 4. OpenCode Operational Workflow

Setiap kali menerima perintah coding dari user, OpenCode WAJIB menjalankan tahapan:

1. **Inspect:** Periksa struktur direktori dan file yang relevan sebelum menulis kode.
2. **Plan:** Sampaikan rencana perubahan file secara ringkas dan modular.
3. **Reuse:** Manfaatkan komponen dan utilitas yang sudah ada di repositori.
4. **Code:** Tulis kode lengkap, bersih, modular, tanpa placeholder komentar yang belum selesai (hindari `// implement later`).
5. **Verify:** Pastikan tidak ada type error, broken imports, atau visual regression pada layout responsif.

---

## Visual Source of Truth (Update Sep 2026)

Folder `stitch-design/` di root project adalah SATU-SATUNYA acuan visual
pixel-accurate untuk seluruh UI, MENGGANTIKAN Stitch MCP (sudah di-disable)
dan mengoreksi bagian visual DESIGN.md yang mungkin sudah tidak akurat.

Setiap subfolder di `stitch-design/` merepresentasikan satu halaman/state
spesifik (nama folder deskriptif, misal `campaign_detail_desktop`,
`donation_form_mobile_default_state`, `payment_success_desktop`).

WAJIB untuk setiap task yang menyentuh UI:
1. Cari subfolder yang relevan di stitch-design/ SEBELUM menulis/mengubah kode.
2. Baca file HTML/CSS di dalamnya sebagai referensi pixel-accurate: layout,
   spacing, typography, warna, struktur komponen.
3. Reconcile ke semantic token DESIGN.md §3 (jangan hardcode value custom dari
   Stitch kalau ada token terdekat yang sudah didefinisikan) — TAPI kalau ada
   konflik nyata antara struktur/spacing Stitch vs DESIGN.md, Stitch folder
   lokal ini yang menang untuk urusan visual, laporkan konflik yang ditemukan.
4. Kalau subfolder untuk halaman tertentu TIDAK ada, treat DESIGN.md sebagai
   fallback authoritative (contoh: admin dashboard tidak punya referensi Stitch).

DILARANG memanggil Stitch MCP lagi untuk task apa pun ke depannya.
