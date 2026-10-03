# PPM Nurisba App — Portal Donasi & Website Resmi PPM Nurul Ikhlas

Website resmi dan portal donasi **Pondok Pesantren Modern Nurul Ikhlas (PPM Nurisba)**, Soreang Bandung — produksi: `https://ppm.nurisba.id`.

Melayani: profil pesantren, program/kegiatan, berita, agenda, galeri, **donasi online** (transfer bank manual / QRIS + verifikasi admin, dengan infrastruktur Midtrans Snap & webhook yang disiapkan untuk integrasi berikutnya), portal donatur, dashboard admin, dan halaman transparansi dana pembangunan.

## Tech Stack

| Lapisan | Teknologi |
|---|---|
| Framework | Next.js 16.3.5 (App Router), React 19, TypeScript `strict: true` |
| Styling/UI | Tailwind CSS, shadcn/ui, Lucide React |
| Database & Auth | Supabase PostgreSQL + Auth + Storage (RLS aktif di semua tabel publik) |
| Validasi | Zod (form client + handler server-side) |
| Payment | Midtrans Snap SDK & server-side webhook handler (saat ini **disabled** di UI publik; alur aktif = transfer manual/QRIS) |
| Runtime | Node.js `>= 24`, output `standalone` |

## Prasyarat

- Node.js `>= 24.15.0` (wajib — dependency `isomorphic-dompurify`/`jsdom` menolak versi di bawahnya)
- npm (lockfile `package-lock.json` — gunakan `npm ci` untuk install reproduksibel)
- Project Supabase (URL + anon key + service-role key)

## Environment Variables

Salin dan isi sesuai environment (jangan commit file `.env*`):

```env
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MIDTRANS_SERVER_KEY=
MIDTRANS_IS_PRODUCTION=false
```

- Variabel `NEXT_PUBLIC_*` terbaca browser — hanya untuk nilai publik.
- `SUPABASE_SERVICE_ROLE_KEY` dan `MIDTRANS_SERVER_KEY` **server-only**, tidak boleh bocor ke client/Git.

## Scripts

| Command | Kegunaan |
|---|---|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build — **wajib via webpack** (`next build --webpack`) karena Turbopack butuh native binding GLIBC ≥ 2.29 yang tidak ada di server Hostinger |
| `npm run start` | Jalankan hasil build standar |
| `npm run start:standalone` | Jalankan server standalone (`.next/standalone/server.js`) — dipakai di Hostinger |
| `npm run lint` | ESLint |

`postbuild` otomatis menyalin `public/` dan `.next/static/` ke dalam folder standalone.

## Struktur Project

```
app/                    # Routes (App Router): public, donasi, transparansi,
                        # donor/*, admin/*, api/* (webhook, health, dokumen)
components/             # UI (admin, donor, shared) + shadcn/ui
lib/                    # Supabase clients, Midtrans, validasi Zod, utilitas,
                        # financial/idempotency, transparency helpers
proxy.ts                # Proteksi route /admin/* dan /donor/*
```

Dokumen acuan (baca sebelum coding, sesuai `AGENTS.md`):

- `PRD.md`, `project-plan.md` — scope & roadmap
- `content-website.md` — single source of truth teks publik, legalitas, rekening, RAB
- `DESIGN.md` + `stitch-design/` — acuan visual
- `database.md` + `lib/supabase/migrations/` — skema & RLS
- `DEPLOY_HOSTINGER.md` — panduan deploy Hostinger
- `HOSTINGER-MCP.md` — governance pemanggilan Hostinger API
- `checklist-keamanan-produksi-ppm-nurisba-id.md` — checklist keamanan pre-deploy

## Alur Donasi (ringkas)

1. Donatur isi form (`/donasi/[slug]/donate`) → validasi Zod → donasi `pending`.
2. Transfer bank / scan QRIS → konfirmasi via WhatsApp.
3. Admin verifikasi di dashboard → status `success`, ledger `financial_transactions` tercatat, agregat campaign ter-update atomik.
4. Frontend **tidak pernah** berhak mengubah status menjadi `success` — hanya server-side terverifikasi (admin action / webhook Midtrans terverifikasi SHA-512 + idempotent).

## Deploy

Lihat `DEPLOY_HOSTINGER.md` (Node.js Web App, build `npm run build`, start standalone, env production, domain `ppm.nurisba.id`).

## Kontak

Panitia PPM Nurisba via WhatsApp **082262893646** (Yayasan Nurul Ikhlas Soreang Bandung).
