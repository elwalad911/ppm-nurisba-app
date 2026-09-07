# Project Plan — PPM Nurisba App

> **Project:** `ppm-nurisba-app`
> **Purpose:** Full-stack website and information system for Pondok Pesantren Nurisba
> **Primary Goal:** Build a modern, trustworthy, responsive, and maintainable digital platform for the pesantren, with public information, donation management, transparency, and an administrative dashboard.

---

## 1. Project Vision

PPM Nurisba App adalah platform digital Pondok Pesantren Nurisba yang berfungsi sebagai:

1. Website resmi pondok pesantren.
2. Pusat informasi profil dan kegiatan pesantren.
3. Platform program donasi seperti wakaf dan sedekah.
4. Media publikasi berita dan kegiatan.
5. Media transparansi dana dan laporan program.
6. Dashboard administrasi untuk mengelola konten dan transaksi.
7. Portal donatur untuk melihat riwayat donasi dan bukti donasi.

Aplikasi harus mengutamakan:

- **Trust**
- **Security**
- **Transparency**
- **Performance**
- **Accessibility**
- **Responsive design**
- **Maintainability**
- **Simple content management**

---

# 2. Development Principles

Project dikembangkan menggunakan pendekatan **AI-assisted / vibe coding** dengan OpenCode sebagai coding agent.

AI agent wajib mengikuti prinsip berikut:

### 2.1 Inspect Before Modify

Sebelum mengubah kode:

1. Baca struktur project.
2. Identifikasi architecture yang sudah ada.
3. Identifikasi component yang dapat digunakan kembali.
4. Identifikasi dependency yang sudah terpasang.
5. Jangan membuat implementasi duplikat.

### 2.2 Plan Before Coding

Untuk feature yang cukup besar:

```text
Requirement
    ↓
Inspect existing code
    ↓
Implementation plan
    ↓
User approval / proceed
    ↓
Implementation
    ↓
Test
    ↓
Review
```

### 2.3 Reuse Before Create

Sebelum membuat component baru, cari terlebih dahulu apakah component yang dibutuhkan sudah tersedia.

Prioritas:

1. Existing component
2. Existing utility
3. Existing design system
4. New reusable component
5. Page-specific implementation

### 2.4 Keep Scope Controlled

Jangan melakukan refactor besar atau mengganti architecture tanpa alasan yang jelas.

Jika sebuah feature membutuhkan perubahan architecture:

- jelaskan alasannya;
- jelaskan file yang terdampak;
- jelaskan risiko;
- gunakan perubahan minimum yang diperlukan.

---

# 3. Target Tech Stack

## Core

- **Framework:** Next.js dengan App Router
- **Language:** TypeScript
- **Runtime:** Node.js
- **Package Manager:** gunakan package manager yang sudah digunakan repository

## UI

- Tailwind CSS
- shadcn/ui
- Lucide Icons atau icon library yang sudah digunakan project

## Backend

Next.js App Router digunakan sebagai full-stack framework.

Gunakan:

- Server Components untuk default rendering
- Server Actions jika sesuai
- Route Handlers untuk endpoint yang memang membutuhkan HTTP API
- Server-side logic untuk operasi sensitif

## Database

- Supabase
- PostgreSQL
- Supabase Row Level Security (RLS)

## Validation

- Zod

## Payment

- Midtrans

Payment harus mendukung metode pembayaran yang tersedia melalui konfigurasi Midtrans, termasuk:

- QRIS
- E-wallet
- Virtual Account / bank transfer
- metode lain yang tersedia pada environment Midtrans

## Authentication

Authentication digunakan untuk:

- Admin
- Donatur

Gunakan authentication mechanism yang terintegrasi dengan Supabase atau solusi yang sudah dipilih project.

## Deployment

Target deployment:

- Vercel untuk application
- Supabase untuk database
- Midtrans untuk payment gateway

---

# 4. Product Scope

## 4.1 Public Website

Public user dapat mengakses:

- Home
- Profil Pondok
- Sejarah
- Visi & Misi
- Program Pendidikan
- Fasilitas
- Kegiatan
- Berita
- Agenda
- Galeri
- Program Donasi
- Detail Program Donasi
- Laporan Transparansi
- Informasi Pendaftaran
- Kontak
- Lokasi

---

# 5. Donation System

Donation system adalah salah satu core feature aplikasi.

## 5.1 Campaign

Setiap program donasi memiliki:

```text
id
title
slug
description
category
target_amount
current_amount
image_url
status
start_date
end_date
created_at
updated_at
```

Contoh kategori:

- Wakaf
- Sedekah
- Beasiswa
- Pembangunan
- Fasilitas
- Kebutuhan Santri
- Lainnya

Status campaign:

```text
draft
active
completed
archived
```

---

# 6. Donation Flow

Alur utama:

```text
User
 ↓
Campaign
 ↓
Campaign Detail
 ↓
Donation Form
 ↓
Create Donation
 ↓
Create Midtrans Transaction
 ↓
Payment
 ↓
Midtrans Notification / Webhook
 ↓
Verify Notification
 ↓
Update Donation Status
 ↓
Update Campaign Amount
 ↓
Display Result
```

Status donation:

```text
pending
success
failed
expired
cancelled
```

---

# 7. Donation Form

Donation form harus mendukung:

- Nama donatur
- Anonymous donation
- Email
- Nominal donasi
- Nominal custom
- Pesan/doa
- Campaign
- Terms/confirmation

Validasi menggunakan Zod.

Minimum validation:

- campaign valid
- amount > 0
- amount memenuhi minimum yang ditentukan
- email valid jika diberikan
- input memiliki batas panjang
- input tidak boleh mengandung data yang tidak diperlukan

---

# 8. Midtrans Integration

Midtrans harus diimplementasikan secara server-side untuk credential dan operasi sensitif.

## Rules

Jangan pernah expose:

- Server Key
- Secret Key
- credential database
- service-role credential

ke client/browser.

Client hanya menerima data yang memang aman untuk digunakan.

## Webhook

Webhook Midtrans wajib:

1. Menerima notification.
2. Memvalidasi request.
3. Memverifikasi signature/status transaksi.
4. Mengidentifikasi donation berdasarkan order/transaction identifier.
5. Memastikan transaksi valid.
6. Update status donation.
7. Update campaign amount jika payment berhasil.
8. Aman terhadap duplicate webhook / retry.

Webhook harus bersifat **idempotent**.

---

# 9. Database Design

Arsitektur database mengacu penuh pada `database.md` sebagai _source of truth_ dengan struktur 10 entitas:

## 9.1 profiles

Menyimpan profil dan hak akses pengguna (terhubung ke `auth.users`).

- Kolom kunci: `id`, `user_id`, `name`, `email`, `role` (`admin` | `donor`), `created_at`, `updated_at`.

## 9.2 campaigns

Menyimpan program penggalangan dana aktif dan historis.

- Kolom kunci: `id`, `title`, `slug`, `category`, `target_amount`, `current_amount`, `image_url`, `status` (`draft` | `active` | `completed` | `archived`), `start_date`, `end_date`.

## 9.3 donations

Menyimpan data komitmen/niat donasi dari donatur.

- Kolom kunci: `id`, `campaign_id`, `user_id` (opsional untuk donatur terdaftar), `donor_name`, `donor_email`, `is_anonymous`, `amount`, `message`, `status` (`pending` | `success` | `failed` | `expired` | `cancelled` | `refunded`), `payment_method`.

## 9.4 payments

Menyimpan catatan teknis transaksi pembayaran dari penyedia (Midtrans atau manual transfer).

- Kolom kunci: `id`, `donation_id`, `provider`, `order_id` (unique), `transaction_id`, `gross_amount`, `status`, `raw_status`, `settlement_at`, `expires_at`.

## 9.5 financial_transactions

Buku besar kas (ledger) pencatatan dana riil yang telah terverifikasi.

- Kolom kunci: `id`, `donation_id`, `campaign_id`, `type` (`income` | `expense` | `refund`), `amount`, `source`, `reference`, `transaction_date`, `verified_at`, `verified_by`.

## 9.6 posts

Menyimpan artikel dan publikasi berita pesantren.

- Kolom kunci: `id`, `title`, `slug`, `excerpt`, `content`, `thumbnail_url`, `status` (`draft` | `published` | `archived`), `author_id`.

## 9.7 events

Menyimpan jadwal agenda dan kegiatan santri/pondok.

- Kolom kunci: `id`, `title`, `slug`, `description`, `location`, `start_at`, `end_at`, `image_url`, `status`.

## 9.8 gallery

Menyimpan arsip dokumentasi visual kegiatan dan pembangunan.

- Kolom kunci: `id`, `title`, `description`, `image_url`, `category`.

## 9.9 transparency_reports

Menyimpan laporan pertanggungjawaban dana publik per periode (ringkasan angka dihitung dari `financial_transactions`).

- Kolom kunci: `id`, `title`, `description`, `period_start`, `period_end`, `document_url`, `published_at`.

## 9.10 audit_logs

Menyimpan jejak aktivitas penting yang dilakukan oleh admin.

- Kolom kunci: `id`, `user_id`, `action`, `entity_type`, `entity_id`, `metadata`, `created_at`.

---

# 10. Row Level Security

RLS wajib digunakan di Supabase.

## Public

Public user dapat membaca data yang memang ditujukan untuk publik:

- active campaigns
- published posts
- published events
- gallery
- published transparency reports
- public profile/content

## Authenticated Donor

Donor dapat:

- melihat profile sendiri;
- melihat donation miliknya sendiri.

Donor tidak boleh:

- melihat donation user lain;
- mengubah status payment;
- mengubah campaign;
- mengubah laporan;
- mengakses admin data.

## Admin

Admin dapat mengelola resource yang memang menjadi tanggung jawab admin.

Authorization harus dilakukan di server-side dan database policy.

**Jangan hanya mengandalkan hidden UI untuk security.**

---

# 11. Admin Dashboard

Admin dashboard digunakan untuk mengelola platform.

## Dashboard

Menampilkan:

- Total donasi
- Total campaign aktif
- Total donasi sukses
- Total donasi pending
- Campaign dengan performa terbaik
- Recent donations
- Recent activity

---

## Campaign Management

Admin dapat:

- Create campaign
- Edit campaign
- Publish campaign
- Archive campaign
- Upload campaign image
- Set target amount
- Set category
- Set campaign period

---

## Donation Management

Admin dapat:

- Melihat donation
- Filter status
- Filter campaign
- Search donor
- Melihat detail transaksi
- Melihat payment reference

Admin **tidak boleh mengubah status payment secara sembarangan**.

Status payment berasal dari payment provider / trusted server-side process.

---

## Content Management

Admin dapat mengelola:

### Posts

- Create
- Edit
- Publish
- Archive

### Events

- Create
- Edit
- Publish
- Archive

### Gallery

- Upload
- Delete
- Categorize

### Transparency Reports

- Create
- Edit
- Publish
- Archive

---

# 12. Donor Portal

Donor portal adalah feature setelah MVP utama stabil.

Fitur:

- Login
- Register
- Profile
- Donation history
- Donation detail
- Payment status
- Digital donation receipt

Donor hanya boleh melihat data miliknya sendiri.

---

# 13. Public Pages

Minimum route structure:

```text
/
├── /profil
├── /program
├── /program/[slug]
├── /berita
├── /berita/[slug]
├── /agenda
├── /agenda/[slug]
├── /galeri
├── /transparansi
├── /pendaftaran
└── /kontak
```

Admin:

```text
/admin
/admin/login
/admin/dashboard
/admin/campaigns
/admin/campaigns/new
/admin/campaigns/[id]
/admin/donations
/admin/posts
/admin/events
/admin/gallery
/admin/transparency
```

Donor:

```text
/donor
/donor/login
/donor/register
/donor/donations
/donor/donations/[id]
/donor/profile
```

Route dapat berubah mengikuti architecture aktual project.

Jangan membuat route hanya karena tercantum di dokumen ini jika feature tersebut belum dibutuhkan oleh milestone aktif.

---

# 14. UI / UX Direction

Design harus merepresentasikan:

- Islamic
- Modern
- Trustworthy
- Warm
- Professional
- Clean
- Accessible

Prioritas UX:

1. Mobile-first
2. Clear CTA
3. Fast loading
4. Readable typography
5. Clear donation flow
6. Strong visual hierarchy
7. Consistent spacing
8. Accessible form controls
9. Clear error states
10. Clear loading states
11. Clear empty states
12. Clear success states

---

# 15. Homepage Structure

Homepage minimum:

```text
Navbar
 ↓
Hero
 ↓
Trust / Introduction
 ↓
Featured Campaigns
 ↓
About Pondok
 ↓
Programs / Activities
 ↓
Latest News
 ↓
Transparency
 ↓
Donation CTA
 ↓
Contact
 ↓
Footer
```

Hero harus memiliki CTA yang jelas menuju program donasi atau informasi utama pesantren.

---

# 16. SEO

Setiap public page harus memiliki:

- meaningful title
- meta description
- canonical URL jika diperlukan
- Open Graph metadata
- semantic HTML
- descriptive image alt
- clean URL
- sitemap
- robots configuration

Dynamic content seperti campaign dan article harus memiliki metadata yang sesuai.

---

# 17. Performance

Prioritas:

- Server Components by default
- Hindari unnecessary client components
- Optimized images
- Lazy loading jika relevan
- Minimize JavaScript
- Avoid unnecessary API calls
- Pagination untuk dataset besar
- Proper database indexes
- Efficient queries

Jangan melakukan premature optimization sebelum ada kebutuhan nyata.

---

# 18. Security Requirements

## Environment Variables

Sensitive credentials hanya boleh berada di environment variables.

Contoh:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY

MIDTRANS_SERVER_KEY
MIDTRANS_CLIENT_KEY
MIDTRANS_IS_PRODUCTION
```

Nama variable dapat disesuaikan dengan implementation.

## Never Commit Secrets

Jangan commit:

```text
.env
.env.local
.env.production
credentials
private keys
service-role keys
payment secrets
opencode.json
```

Pastikan `.gitignore` sesuai.

---

# 19. Input Security

Semua input dari user harus dianggap tidak terpercaya.

Gunakan:

- Zod validation
- Server-side validation
- Proper authorization
- Output escaping
- Database constraints
- Rate limiting jika diperlukan

Jangan mengandalkan client-side validation sebagai security boundary.

---

# 20. Donation Security

Donation amount tidak boleh dipercaya dari frontend.

Server harus:

1. Validate campaign.
2. Validate amount.
3. Generate order ID.
4. Create payment transaction.
5. Store transaction reference.
6. Wait for payment provider notification.
7. Verify payment.
8. Update database.

Client tidak boleh menentukan:

```text
status = success
```

---

# 21. Development Roadmap

## Phase 0 — Foundation

### Goal

Project siap digunakan untuk development.

Tasks:

- [ ] Inspect existing repository
- [ ] Confirm framework and dependencies
- [ ] Confirm package manager
- [ ] Confirm environment strategy
- [ ] Configure TypeScript
- [ ] Configure Tailwind
- [ ] Configure shadcn/ui
- [ ] Configure linting
- [ ] Configure formatting
- [ ] Configure `.gitignore`
- [ ] Configure environment variables
- [ ] Create project documentation
- [ ] Establish reusable UI conventions

### Definition of Done

- Project runs locally.
- No critical build errors.
- Basic UI system works.
- Environment strategy documented.

---

# Phase 1 — Public Website MVP

### Goal

Website resmi pesantren dapat digunakan oleh publik.

Tasks:

- [ ] Navbar
- [ ] Footer
- [ ] Homepage
- [ ] Profil
- [ ] Visi & Misi
- [ ] Program Pendidikan
- [ ] Fasilitas
- [ ] Kegiatan
- [ ] Kontak
- [ ] Responsive layout
- [ ] Basic SEO

### Definition of Done

- All pages accessible.
- Responsive on mobile/tablet/desktop.
- No broken navigation.
- Loading/error/empty states handled where applicable.

---

# Phase 2 — Content System

### Goal

Content tidak lagi hardcoded.

Tasks:

- [ ] Supabase connection
- [ ] Database schema
- [ ] RLS
- [ ] Posts
- [ ] Events
- [ ] Gallery
- [ ] Campaigns
- [ ] Dynamic public pages
- [ ] Image storage

### Definition of Done

Admin/content source dapat mengubah content tanpa mengubah source code.

---

# Phase 3 — Donation MVP

### Goal

User dapat melakukan donasi end-to-end.

Tasks:

- [ ] Campaign listing
- [ ] Campaign detail
- [ ] Donation form
- [ ] Zod validation
- [ ] Donation creation
- [ ] Midtrans integration
- [ ] Snap payment
- [ ] Webhook
- [ ] Payment verification
- [ ] Donation status
- [ ] Campaign amount update
- [ ] Donation success page
- [ ] Donation failure page

### Definition of Done

Test transaction dapat:

```text
Campaign
→ Donation
→ Midtrans
→ Payment
→ Webhook
→ Verification
→ Database update
```

tanpa manual database modification.

---

# Phase 4 — Admin Dashboard

### Goal

Pengelolaan aplikasi dilakukan melalui dashboard.

Tasks:

- [ ] Admin authentication
- [ ] Authorization
- [ ] Dashboard
- [ ] Campaign CRUD
- [ ] Donation management
- [ ] Post management
- [ ] Event management
- [ ] Gallery management
- [ ] Transparency management

### Definition of Done

Admin dapat mengelola seluruh content utama tanpa menyentuh database secara manual.

---

# Phase 5 — Transparency

### Goal

Meningkatkan trust publik.

Tasks:

- [ ] Transparency page
- [ ] Income data
- [ ] Expense data
- [ ] Balance
- [ ] Reporting period
- [ ] Supporting documents
- [ ] Public report detail

### Definition of Done

Publik dapat memahami penggunaan dana berdasarkan laporan yang telah dipublikasikan.

---

# Phase 6 — Donor Portal

### Goal

Memberikan pengalaman personal kepada donatur.

Tasks:

- [ ] Donor authentication
- [ ] Profile
- [ ] Donation history
- [ ] Donation detail
- [ ] Receipt
- [ ] Digital donation certificate if required

### Definition of Done

Donor hanya dapat mengakses data miliknya sendiri.

---

# Phase 7 — Production Hardening

### Goal

Project siap digunakan secara production.

Tasks:

- [ ] Security review
- [ ] RLS review
- [ ] Authentication review
- [ ] Payment flow review
- [ ] Webhook idempotency review
- [ ] Input validation review
- [ ] Rate limiting where required
- [ ] Error handling
- [ ] Logging
- [ ] Monitoring
- [ ] Performance review
- [ ] SEO review
- [ ] Accessibility review
- [ ] Mobile testing
- [ ] Production environment
- [ ] Domain configuration
- [ ] Backup strategy

### Definition of Done

Application can be deployed to production without known critical security or functional issues.

---

# 22. Testing Strategy

Minimum testing layers:

## Unit

Test:

- validation
- formatting
- utility functions
- business logic

## Integration

Test:

- database operations
- authentication
- donation creation
- Midtrans integration
- webhook processing

## End-to-End

Critical flow:

```text
Visitor
→ Campaign
→ Donation Form
→ Payment
→ Webhook
→ Donation Success
```

Admin:

```text
Admin Login
→ Dashboard
→ Create Campaign
→ Publish
→ Campaign visible publicly
```

---

# 23. Error Handling

Setiap feature penting harus memiliki:

### Loading State

User mengetahui proses sedang berjalan.

### Empty State

Jika data kosong, tampilkan pesan yang jelas.

### Error State

Error harus:

- understandable
- actionable
- tidak membocorkan sensitive information

### Success State

Setelah action berhasil, user mendapatkan feedback yang jelas.

---

# 24. Git Workflow

Gunakan commit yang kecil dan terfokus.

Contoh:

```text
feat: add campaign listing
feat: add donation form
feat: integrate midtrans
fix: handle duplicate webhook
fix: validate donation amount
refactor: extract campaign card
```

Jangan membuat satu commit besar berisi banyak feature yang tidak berkaitan.

---

# 25. AI Coding Workflow

OpenCode harus bekerja dengan pola:

```text
1. Read project-plan.md
2. Inspect repository
3. Identify current state
4. Identify dependencies
5. Propose implementation
6. Implement smallest complete unit
7. Run relevant checks
8. Fix errors
9. Summarize changes
10. Wait for next task
```

Untuk setiap task, AI harus:

- tidak mengubah unrelated files;
- tidak menghapus functionality tanpa alasan;
- menggunakan existing patterns;
- menggunakan reusable components;
- menjaga TypeScript types;
- menjaga security boundary;
- melakukan validation;
- menjalankan lint/typecheck/test yang relevan.

---

# 26. Definition of Done

Sebuah feature dianggap selesai jika:

- [ ] Requirement terpenuhi.
- [ ] UI responsive.
- [ ] TypeScript tidak menghasilkan error.
- [ ] Lint tidak menghasilkan critical error.
- [ ] Validation tersedia jika diperlukan.
- [ ] Authorization tersedia jika diperlukan.
- [ ] Loading state tersedia.
- [ ] Error state tersedia.
- [ ] Empty state tersedia jika diperlukan.
- [ ] Tidak ada secret yang terekspos.
- [ ] Tidak merusak feature existing.
- [ ] Relevant tests berhasil.
- [ ] Code menggunakan existing architecture.
- [ ] Dokumentasi diperbarui jika diperlukan.

---

# 27. Current Priority

Prioritas pengembangan harus mengikuti urutan:

```text
P0 — Foundation
     ↓
P1 — Public Website
     ↓
P2 — Content System
     ↓
P3 — Donation MVP
     ↓
P4 — Admin Dashboard
     ↓
P5 — Transparency
     ↓
P6 — Donor Portal
     ↓
P7 — Production Hardening
```

Jangan mengerjakan P4/P5/P6 sebelum P0–P3 cukup stabil, kecuali terdapat dependency yang mengharuskan perubahan urutan.

---

# 28. Important AI Agent Rules

> **These rules are mandatory for AI coding agents.**

1. Jangan mengarang architecture yang tidak ada di repository.
2. Selalu inspect existing code sebelum membuat perubahan.
3. Jangan duplicate component.
4. Jangan expose secret.
5. Jangan percaya input dari client.
6. Jangan mengubah payment status berdasarkan request frontend.
7. Jangan bypass RLS untuk convenience.
8. Jangan menggunakan service-role credential di client.
9. Jangan melakukan massive refactor tanpa approval.
10. Jangan menghapus existing feature tanpa alasan.
11. Jangan menambahkan dependency jika functionality dapat dilakukan dengan dependency yang sudah tersedia.
12. Prioritaskan implementation sederhana dan maintainable.
13. Setiap feature harus memiliki clear acceptance criteria.
14. Jika requirement ambigu, jelaskan asumsi sebelum implementasi.
15. Jika menemukan masalah architecture yang signifikan, laporkan sebelum melakukan perubahan besar.

---

# 29. First Task for OpenCode

Sebelum melakukan implementation besar, OpenCode harus melakukan:

```text
TASK:

Inspect the current ppm-nurisba-app repository.

Do not modify application code yet.

Analyze:

1. Current framework
2. Current dependencies
3. Current directory structure
4. Existing UI components
5. Existing routes
6. Existing database integration
7. Existing authentication
8. Existing environment variables
9. Existing styling system
10. Existing technical debt
11. Missing infrastructure
12. Conflicts between the current implementation and this project plan

Then produce:

- Current architecture summary
- Existing features
- Missing features
- Recommended implementation order
- Risks
- Proposed next task

Do not rewrite the architecture unless necessary.
Do not install dependencies yet.
Do not modify application code.

The goal is to understand the existing project before implementation.
```

---

# 30. Project Success Criteria

PPM Nurisba App dianggap berhasil apabila:

1. Website dapat menjadi representasi resmi Pondok Pesantren Nurisba.
2. Publik dapat memperoleh informasi pesantren dengan mudah.
3. Publik dapat menemukan dan mendukung program donasi.
4. Donasi dapat diproses secara aman melalui payment gateway.
5. Status transaksi dapat diverifikasi secara reliable.
6. Informasi donasi dan transparansi dapat dikelola dengan baik.
7. Admin dapat mengelola content melalui dashboard.
8. Donor dapat melihat riwayat donasinya sendiri.
9. Application responsive dan accessible.
10. Application dapat di-maintain dan dikembangkan menggunakan AI coding agent tanpa architecture menjadi tidak terkontrol.
