# Product Requirements Document (PRD)

## PPM Nurisba App

**Versi:** 2.0 (revisi — disinkronkan penuh dengan `project-plan.md` & `DESIGN.md`)
**Terakhir diperbarui:** 25 Agustus 2026
**Status:** Draft — acuan pengembangan

> **Catatan revisi:** Versi 1.0 PRD ini tidak konsisten dengan `project-plan.md` (menggunakan 4 fase custom, menyebut tabel `expenses` yang tidak ada, dan salah menandai Admin Dashboard sebagai out-of-scope). Ada juga draft `PRD.md` lama di repo yang mendeskripsikan alur donasi **transfer manual tanpa payment gateway** — draft itu sudah tidak berlaku karena `project-plan.md` versi aktif menetapkan **Midtrans** sebagai payment gateway. Dokumen ini menggantikan keduanya dan mengikuti `project-plan.md` + `DESIGN.md` sebagai satu-satunya source of truth.

---

## 1. Tujuan & Konteks

PPM Nurisba App adalah platform digital untuk Pondok Pesantren Nurisba yang mencakup (lihat `project-plan.md` §1):

1. Website resmi pondok pesantren.
2. Pusat informasi profil dan kegiatan pesantren.
3. Platform program donasi (wakaf, sedekah, dll).
4. Media publikasi berita dan kegiatan.
5. Media transparansi dana dan laporan program.
6. Dashboard administrasi untuk mengelola konten dan transaksi.
7. Portal donatur untuk melihat riwayat donasi dan bukti donasi.

Prioritas produk: **Trust → Security → Transparency → Performance → Accessibility → Responsive → Maintainability → Simple content management.**

**Fungsi PRD ini:** mengunci _apa_ yang dibangun dan _urutannya_, supaya OpenCode (AI coding agent) tidak melebarkan scope di luar yang disepakati. Detail teknis (skema DB lengkap, struktur direktori, security rules) tetap merujuk `project-plan.md`; detail visual/komponen tetap merujuk `DESIGN.md`.

---

## 2. Arsitektur Produk (3 Area)

Mengikuti `DESIGN.md` §2:

```text
PPM Nurisba App
├── Public Website   → Home, Profil, Program, Kegiatan, Berita, Agenda, Galeri,
│                       Donasi, Transparansi, Pendaftaran, Kontak
├── Donor Portal      → Login/Register, Dashboard, Donation History,
│                       Donation Detail, Profile
└── Admin Dashboard   → Dashboard, Campaigns, Donations, Posts, Events,
                        Gallery, Transparency
```

Ketiga area **sama-sama dalam scope produk** — bukan pilihan salah satu. Yang membedakan hanyalah **kapan** masing-masing dibangun (lihat §4 roadmap fase).

---

## 3. Target Pengguna

| Peran                          | Kebutuhan Utama                                                                                     |
| ------------------------------ | --------------------------------------------------------------------------------------------------- |
| **Pengunjung publik**          | Info pesantren, temukan campaign, donasi, lihat transparansi                                        |
| **Donatur terdaftar** (Fase 6) | Login, lihat riwayat donasi & receipt miliknya sendiri                                              |
| **Admin** (Fase 4)             | Kelola campaign, moderasi donasi, kelola konten (posts/events/gallery), kelola laporan transparansi |

---

## 4. Roadmap Fase & Daftar Fitur

Penomoran dan urutan fase **wajib identik** dengan `project-plan.md` §21 dan §27 (`Current Priority`). Fase berikutnya tidak dikerjakan sebelum fase sebelumnya stabil, kecuali ada dependency yang mengharuskan perubahan urutan.

```text
P0 Foundation → P1 Public Website → P2 Content System → P3 Donation MVP
→ P4 Admin Dashboard → P5 Transparency → P6 Donor Portal → P7 Production Hardening
```

### Phase 0 — Foundation

**Goal:** Project siap digunakan untuk development.

- Inspect repo, konfirmasi framework/dependency/package manager
- Setup TypeScript, Tailwind, shadcn/ui, linting, formatting, `.gitignore`, environment variables
- Dokumentasi project, konvensi UI reusable

**Definition of Done:** Project jalan lokal tanpa critical build error; basic UI system berfungsi; environment strategy terdokumentasi.

### Phase 1 — Public Website MVP

**Goal:** Website resmi pesantren dapat diakses publik (belum dinamis/DB).

- Navbar & Footer (`DESIGN.md` §7)
- Homepage dengan urutan section sesuai `DESIGN.md` §8 (Hero → Trust/Introduction → Featured Campaigns → About Pondok → Programs & Activities → Latest News → Upcoming Agenda → Transparency Highlight → Donation CTA → Contact → Footer)
- Halaman Profil, Visi & Misi, Program Pendidikan, Fasilitas, Kegiatan, Kontak
- Responsive layout (mobile-first), basic SEO

**Definition of Done:** Semua halaman dapat diakses, responsive mobile/tablet/desktop, navigasi tidak rusak, loading/error/empty state tersedia bila relevan.

### Phase 2 — Content System

**Goal:** Content tidak lagi hardcoded.

- Koneksi Supabase + skema database (§6 di bawah) + RLS
- CMS untuk **Posts** (berita), **Events** (agenda), **Gallery**, **Campaigns**
- Dynamic public pages, image storage

**Definition of Done:** Admin/content source dapat mengubah content tanpa mengubah source code.

### Phase 3 — Donation MVP

**Goal:** User dapat melakukan donasi end-to-end.

- Campaign listing & detail (slug-based URL, sesuai `DESIGN.md` §10)
- Donation form (nominal, quick amount, custom amount, nama/anonim, email, pesan/doa) — validasi Zod
- Integrasi Midtrans (Snap payment: QRIS, e-wallet, VA/transfer bank)
- Webhook Midtrans — **wajib idempotent**, verifikasi signature/status transaksi server-side
- Update status donasi & `current_amount` campaign otomatis setelah verifikasi
- Halaman hasil pembayaran: success / pending / failed-expired (`DESIGN.md` §12)

**Definition of Done:** Transaksi test dapat mengalir penuh — Campaign → Donation → Midtrans → Payment → Webhook → Verification → Database update — tanpa modifikasi database manual.

### Phase 4 — Admin Dashboard

**Goal:** Pengelolaan aplikasi dilakukan melalui dashboard (bukan Supabase Studio manual).

- Admin authentication & authorization
- Dashboard ringkasan: total donasi, campaign aktif, donasi sukses/pending, recent donations & activity (`DESIGN.md` §15)
- Campaign CRUD (create/edit/publish/archive, upload image, set target & kategori & periode)
- Donation management (lihat, filter status/campaign, search donor, lihat detail transaksi & payment reference — **admin tidak mengubah status payment secara manual**, status berasal dari Midtrans)
- Post management, Event management, Gallery management
- Transparency management (lihat §4 Phase 5)

**Definition of Done:** Admin dapat mengelola seluruh content utama tanpa menyentuh database secara manual.

### Phase 5 — Transparency

**Goal:** Meningkatkan trust publik.

- Halaman transparansi publik: Income data, Expense data, Balance, Reporting period, Supporting documents, Public report detail (`DESIGN.md` §13)
- Dikelola admin lewat `transparency_reports` (lihat §6)

**Definition of Done:** Publik dapat memahami penggunaan dana berdasarkan laporan yang telah dipublikasikan.

### Phase 6 — Donor Portal

**Goal:** Pengalaman personal untuk donatur terdaftar.

- Donor authentication (login/register)
- Profile, Donation history, Donation detail, Receipt
- Digital donation certificate (jika diperlukan)

**Definition of Done:** Donor hanya dapat mengakses data donasi miliknya sendiri (ditegakkan oleh RLS, bukan hanya UI).

### Phase 7 — Production Hardening

**Goal:** Siap produksi.

- Security review, RLS review, auth review, payment flow review, webhook idempotency review
- Input validation review, rate limiting pada endpoint publik
- Error handling, logging, monitoring
- Performance review, SEO review, accessibility review (WCAG 2.2 AA — `DESIGN.md` §20)
- Mobile testing, production environment, domain configuration, backup strategy

**Definition of Done:** Aplikasi dapat di-deploy ke production tanpa known critical issue (security maupun fungsional).

---

## 5. User Flow

### 5.1 Alur Donasi (Public — Phase 3)

Sesuai `project-plan.md` §6 dan `DESIGN.md` §10–12:

```
Campaign Listing → Campaign Detail → Donation Form → Create Donation (status: pending)
 → Create Midtrans Transaction (Snap Token) → Payment (QRIS/e-wallet/VA)
 → Midtrans Notification/Webhook → Verify Notification (signature + status)
 → Update Donation Status → Update Campaign current_amount → Display Result
   (success / pending / failed / expired)
```

Status donasi yang valid: `pending, success, failed, expired, cancelled`.

### 5.2 Alur Admin — Kelola Campaign (Phase 4)

Sesuai `project-plan.md` §22 (Testing Strategy — E2E Admin):

```
Admin Login → Dashboard → Create Campaign → Publish → Campaign visible publicly
```

Alur serupa berlaku untuk Posts, Events, Gallery (create → edit → publish/archive).

### 5.3 Alur Transparansi (Public — Phase 5)

```
Transparency Header → Summary Metrics (Total Income / Expense / Balance)
 → Income/Donation Data → Expense Data → Campaign Allocation
 → Supporting Documents → Reporting Period
```

### 5.4 Alur Donor Portal (Phase 6)

```
Donor Login → Dashboard (Total Donation, Recent Donation, Quick Actions)
 → Donation History (Date, Campaign, Amount, Status) → Donation Detail (Reference,
   Amount, Campaign, Payment Method, Status, Receipt)
```

---

## 6. Skema Data (Ringkasan)

Arsitektur database mengadopsi 10 entitas terpadu sesuai ketetapan `database.md` untuk menjamin integritas transaksi keuangan:

| Tabel                    | Fungsi                                   | Kolom Kunci Utama                                                      |
| ------------------------ | ---------------------------------------- | ---------------------------------------------------------------------- |
| `profiles`               | Data identitas & role pengguna           | `user_id`, `role` (`admin` \| `donor`)                                 |
| `campaigns`              | Program penggalangan dana                | `slug`, `category`, `target_amount`, `current_amount`, `status`        |
| `donations`              | Niat & data komitmen donasi              | `campaign_id`, `amount`, `is_anonymous`, `status`                      |
| `payments`               | Detail teknis transaksi payment gateway  | `donation_id`, `order_id` (unique), `gross_amount`, `status`           |
| `financial_transactions` | Ledger kas mutasi keuangan terverifikasi | `campaign_id`, `donation_id`, `type` (`income` \| `expense`), `amount` |
| `posts`                  | Publikasi berita & artikel               | `slug`, `status` (`draft` \| `published`), `published_at`              |
| `events`                 | Agenda & kegiatan pesantren              | `slug`, `start_at`, `end_at`, `location`                               |
| `gallery`                | Dokumentasi foto & media                 | `category`, `image_url`                                                |
| `transparency_reports`   | Laporan transparansi periodik            | `period_start`, `period_end`, `document_url`, `published_at`           |
| `audit_logs`             | Jejak audit tindakan administratif       | `user_id`, `action`, `entity_type`, `entity_id`                        |

> **Prinsip Integritas:** Angka pemasukan pada `transparency_reports` dan `campaigns.current_amount` tidak diinput manual, melainkan diagregasi otomatis dari mutasi yang sah di `financial_transactions`

---

## 7. Kebutuhan Non-Fungsional

| Aspek         | Kebutuhan                                                                                                                                                               | Sumber                                 |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Keamanan      | Server Key/Secret Key/service-role credential tidak boleh terekspos ke client; payment status hanya diupdate oleh trusted server-side logic setelah verifikasi Midtrans | `project-plan.md` §8, §18–20           |
| Idempotency   | Webhook Midtrans tidak boleh memproses ulang transaksi yang sama (retry/duplicate-safe)                                                                                 | `project-plan.md` §8                   |
| Rate limiting | Endpoint publik (misal create-donation) dibatasi bila diperlukan                                                                                                        | `project-plan.md` §19, §27 (Phase 7)   |
| Aksesibilitas | WCAG 2.2 AA untuk flow publik kritikal; kontras teks minimum 4.5:1 (large text 3:1); touch target 44×44px; tidak ada status berbasis warna saja                         | `DESIGN.md` §20, §3                    |
| Mobile-first  | Semua flow nyaman di HP; navigasi jadi compact menu; form 1 kolom                                                                                                       | `DESIGN.md` §6                         |
| Performa      | Server Components default, image dioptimasi, pagination untuk dataset besar, hindari client bundle besar                                                                | `project-plan.md` §17, `DESIGN.md` §24 |
| SEO           | Title/meta description/OG image/slug (bukan UUID) untuk campaign & artikel, sitemap, robots config                                                                      | `project-plan.md` §16, `DESIGN.md` §23 |

---

## 8. Batasan & Guardrail (Agar Scope Tidak Melebar)

Merujuk `project-plan.md` §28 (Important AI Agent Rules):

1. Jangan mengerjakan Phase 4/5/6 sebelum Phase 0–3 stabil, kecuali ada dependency yang mengharuskan.
2. Jangan mengarang arsitektur yang tidak ada di repository — selalu inspect kode existing dulu.
3. Jangan duplikasi component — reuse dulu (`Reuse Before Create`, §2.3).
4. Jangan expose secret (server key, service-role key) ke client.
5. Jangan percaya input dari client — validasi server-side + Zod adalah security boundary, bukan client-side validation.
6. Jangan mengubah status payment berdasarkan request dari frontend — hanya via webhook Midtrans terverifikasi.
7. Jangan bypass RLS untuk kenyamanan development.
8. Jangan melakukan massive refactor tanpa approval eksplisit.
9. Jangan menambah dependency baru jika fungsionalitas sudah bisa dilakukan dengan dependency yang ada.
10. Jika requirement ambigu, jelaskan asumsi sebelum implementasi — jangan menebak diam-diam.

**Di luar scope PRD ini** (tidak muncul di `project-plan.md`/`DESIGN.md`, sehingga tidak dikerjakan tanpa update dokumen ini terlebih dahulu):

- Payment gateway selain Midtrans.
- Live chat / chatbot in-app.
- Model 3D interaktif / virtual tour untuk galeri/denah bangunan.
- Recurring donation / donasi berlangganan.
- Aplikasi mobile native (scope tetap web responsive).
- Multi-bahasa (i18n) — kecuali disebutkan lain di iterasi berikutnya.

---

## 9. Dokumen Rujukan

PRD ini adalah lapisan "apa, urutan, dan batasan". Untuk detail lanjut:

- `project-plan.md` — tech stack, skema database lengkap, struktur direktori, security rules, testing strategy, AI coding workflow.
- `DESIGN.md` — design tokens, tipografi, komponen, page template per halaman, accessibility & QA checklist.
- `content-website.md` — salinan konten aktual (copy campaign, profil organisasi, rekening resmi, microcopy).

**Aturan sinkronisasi:** setiap perubahan fitur/scope harus diperbarui di PRD ini terlebih dahulu, baru diturunkan ke `project-plan.md` (jika berdampak teknis) dan/atau `DESIGN.md` (jika berdampak visual/komponen). Jangan biarkan ketiga dokumen ini saling bertentangan seperti yang terjadi pada draft `PRD.md` sebelumnya.
