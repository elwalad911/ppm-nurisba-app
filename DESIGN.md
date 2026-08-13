# Design System & UI Specification — PPM Nurisba App

> **Purpose:** Menjadi source of truth untuk visual design, UX, layout, component behavior, dan page structure PPM Nurisba App.
>
> **Product:** Website & information system Pondok Pesantren Nurisba
>
> **Design priorities:** Trust → Clarity → Accessibility → Mobile-first → Performance → Visual polish

---

## 1. Design Vision

PPM Nurisba App harus terasa seperti **website resmi pondok pesantren yang modern, hangat, terpercaya, dan profesional**, bukan sekadar website donasi.

Desain harus mampu melayani dua kebutuhan utama:

1. **Public information** — memperkenalkan pondok, program pendidikan, kegiatan, berita, agenda, galeri, pendaftaran, dan kontak.
2. **Donation & transparency** — membantu pengguna menemukan program donasi, memahami penggunaan dana, dan menyelesaikan donasi dengan rasa aman.

### Brand personality

- Islamic
- Modern
- Warm
- Trustworthy
- Professional
- Clean
- Human
- Accessible

### Design principle hierarchy

1. **Clarity** — pengguna selalu tahu sedang berada di halaman apa dan tindakan berikutnya apa.
2. **Trust** — informasi pesantren, angka donasi, payment state, dan laporan harus terlihat kredibel.
3. **Accessibility** — kontras, typography, touch target, focus state, dan semantic structure tidak boleh dikorbankan.
4. **Mobile-first** — seluruh flow harus nyaman digunakan melalui HP.
5. **Consistency** — gunakan token dan component yang sama di seluruh public website dan dashboard.
6. **Visual polish** — gunakan rounded corners, subtle shadow, imagery, dan glass effect secara terukur.

> **Important:** CTA donasi penting, tetapi tidak harus mendominasi setiap halaman. Pada halaman profil, berita, agenda, galeri, atau pendaftaran, primary CTA harus mengikuti tujuan halaman.

---

# 2. Design Architecture

UI dibagi menjadi tiga area produk.

```text
PPM Nurisba App
│
├── Public Website
│   ├── Home
│   ├── Profil
│   ├── Program Pendidikan
│   ├── Kegiatan
│   ├── Berita
│   ├── Agenda
│   ├── Galeri
│   ├── Donasi
│   ├── Transparansi
│   ├── Pendaftaran
│   └── Kontak
│
├── Donor Portal
│   ├── Login / Register
│   ├── Dashboard
│   ├── Donation History
│   ├── Donation Detail
│   └── Profile
│
└── Admin Dashboard
    ├── Dashboard
    ├── Campaigns
    ├── Donations
    ├── Posts
    ├── Events
    ├── Gallery
    └── Transparency
```

### Shared UI layers

```text
Design Tokens
    ↓
Primitive UI
    ↓
Shared Components
    ↓
Feature Components
    ↓
Page Templates
    ↓
Pages
```

AI agent harus **reuse component yang sudah ada** sebelum membuat component baru.

---

# 3. Color System

Gunakan semantic tokens agar warna tidak tersebar sebagai hardcoded value.

| Token | Base | Usage |
|---|---|---|
| `primary` | `teal-600` / `#0d9488` | Brand, navbar, link, heading accent |
| `primary-strong` | `teal-800` | High-contrast text/icon |
| `primary-soft` | `teal-50` | Section background, subtle highlight |
| `cta` | `orange-500` | Primary donation/action button |
| `success` | `emerald-600` | Progress, success, completed state |
| `warning` | `amber-500` | Pending / attention |
| `danger` | `red-500` | Error / destructive action |
| `background` | `#fbfcfc` | Main page background |
| `surface` | `white` | Cards, forms, panels |
| `text-primary` | `gray-800` | Main heading/body |
| `text-secondary` | `gray-600` | Supporting text |
| `border` | `gray-200` | Dividers, card borders |

### Color rules

- Jangan menggunakan `orange` sebagai progress color. Orange adalah semantic CTA.
- `emerald` digunakan untuk progress/success agar tidak bercampur dengan CTA.
- Jangan menggunakan warna brand sebagai teks tanpa memastikan contrast ratio.
- Text normal target contrast minimum **4.5:1**.
- Large text target minimum **3:1**.
- Jangan menggunakan warna saja untuk menyampaikan status; sertakan label/icon/text.

---

# 4. Typography

### Font

Primary font:

- Inter atau Geist Sans

Jika project sudah memiliki font configuration, gunakan konfigurasi existing daripada menambah font baru tanpa alasan.

### Scale

| Role | Mobile | Desktop | Weight |
|---|---:|---:|---|
| Display | 36–44px | 52–64px | 700–800 |
| H1 | 32–36px | 44–52px | 700–800 |
| H2 | 28–32px | 36–40px | 700 |
| H3 | 22–24px | 28–32px | 700 |
| Body | 16px | 16–18px | 400 |
| Small | 14px | 14px | 400–500 |
| Caption | 12–13px | 12–13px | 400 |

### Rules

- Body text default minimum **16px**.
- Jangan menggunakan `text-gray-500` untuk paragraph utama.
- Heading menggunakan `tracking-tight` bila sesuai.
- Nominal Rupiah menggunakan `font-bold` dan `tabular-nums`.
- Angka target, terkumpul, dan persentase harus mudah dipindai.
- Line-height harus cukup longgar untuk bahasa Indonesia dan content panjang.

---

# 5. Spacing & Layout

Gunakan spacing scale Tailwind sebagai dasar. Jangan membuat arbitrary spacing tanpa alasan.

### Container

```text
Mobile:  px-4
Tablet:  px-6
Desktop: max-width 1200–1280px + px-8
```

### Section spacing

- Mobile: `py-12` sampai `py-16`
- Desktop: `py-16` sampai `py-24`

### Grid

```text
Mobile   → 1 column
Tablet   → 2 columns
Desktop  → 3 columns
```

Gunakan 4-column atau lebih hanya untuk layout yang memang membutuhkan katalog padat seperti statistik atau admin table.

### Content width

- Reading content: sekitar 65–75ch.
- Marketing sections: max-width sekitar 1200–1280px.
- Dashboard: gunakan width yang lebih luas untuk table dan data visualization.

---

# 6. Responsive Strategy

Design harus **mobile-first**.

Breakpoint baseline:

```text
< 640px   Mobile
640px+    Tablet / small desktop
1024px+   Desktop
1280px+   Wide desktop
```

### Mobile rules

- Touch target minimum **44×44px**.
- Tidak ada horizontal overflow.
- Navigation berubah menjadi compact/mobile menu.
- CTA utama mudah ditemukan tanpa scrolling berlebihan.
- Form menggunakan satu kolom kecuali field yang memang aman berdampingan.
- Table kompleks berubah menjadi card/list atau horizontal scroll yang terkontrol.
- Modal tidak boleh membuat content utama sulit diakses.

---

# 7. Global Navigation

## Public Navbar

Desktop:

```text
[Logo]  Profil  Program  Kegiatan  Berita  Donasi  Transparansi  [CTA Donasi]
```

Mobile:

```text
[Logo]                                  [Menu]
```

### Rules

- Sticky top navigation.
- `bg-white/90 backdrop-blur-md` dapat digunakan.
- Gunakan `shadow-sm` atau border bottom sebagai fallback visual.
- Logo dan brand name harus tetap jelas.
- CTA donasi menggunakan `cta` color.
- Navigation item aktif memiliki visual state yang jelas.
- Mobile menu harus memiliki touch target minimal 44×44px.

## Admin Navigation

Admin tidak menggunakan visual language yang sama beratnya dengan public marketing site.

```text
Sidebar
├── Dashboard
├── Campaigns
├── Donations
├── Posts
├── Events
├── Gallery
└── Transparency
```

Prioritas admin adalah **density, speed, clarity, dan data visibility**.

---

# 8. Homepage Design

Homepage adalah entry point utama public website.

Urutan section:

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
Programs & Activities
  ↓
Latest News
  ↓
Upcoming Agenda
  ↓
Transparency Highlight
  ↓
Donation CTA
  ↓
Contact / Location
  ↓
Footer
```

### Hero

Tujuan:

- menjelaskan identitas pondok dalam beberapa detik;
- membangun trust;
- memberikan satu primary CTA.

Struktur:

```text
Eyebrow / label
Headline
Short description
[Primary CTA] [Secondary CTA]
Supporting visual / pesan pondok
```

Primary CTA dapat berupa **Lihat Program Donasi** jika donation campaign sedang menjadi fokus utama. Untuk periode non-campaign, CTA dapat diarahkan ke Profil atau Pendaftaran.

---

# 9. Public Page Templates

## 9.1 Profil

Tujuan: membangun identitas dan kredibilitas pondok.

```text
Page Header
 ↓
Sejarah
 ↓
Visi & Misi
 ↓
Nilai / Prinsip Pendidikan
 ↓
Fasilitas
 ↓
Program Pendidikan
 ↓
Kegiatan
 ↓
CTA Pendaftaran / Kontak
```

Tone visual lebih editorial dan institutional, bukan donation-heavy.

## 9.2 Program Pendidikan

Gunakan card katalog:

```text
Image / Icon
Title
Short description
Key information
[Detail]
```

Jika content bertambah banyak, gunakan category/filter.

## 9.3 Berita

Listing:

```text
Featured Article
      ↓
Article Grid
      ↓
Pagination / Load More
```

Card wajib menampilkan:

- thumbnail
- category bila ada
- title
- date
- short excerpt

## 9.4 Detail Berita

```text
Breadcrumb
Title
Metadata
Hero Image
Article Content
Related Articles
CTA / Contact
```

Prioritaskan readability daripada dekorasi.

## 9.5 Agenda

Gunakan kombinasi:

- date indicator
- title
- location
- time
- detail link

Upcoming event dapat dibuat lebih prominent daripada event lampau.

## 9.6 Galeri

Grid image yang responsif.

- Gunakan aspect ratio konsisten.
- Image dapat dibuka dalam lightbox.
- Jangan mengorbankan performance untuk masonry yang berat.

## 9.7 Pendaftaran

Tujuan halaman adalah mengubah visitor menjadi calon pendaftar.

```text
Introduction
 ↓
Program / Jalur Pendaftaran
 ↓
Requirements
 ↓
Timeline
 ↓
FAQ
 ↓
[CTA Daftar / Hubungi Admin]
```

## 9.8 Kontak

Tampilkan:

- alamat
- nomor kontak
- WhatsApp jika tersedia
- email jika tersedia
- social links jika tersedia
- embedded map bila diperlukan

Jangan menampilkan informasi sensitif yang tidak diperlukan.

---

# 10. Donation Experience

Donation flow adalah critical user journey.

```text
Campaign Listing
 ↓
Campaign Detail
 ↓
Donation Form
 ↓
Payment
 ↓
Payment Result
 ↓
Receipt / Confirmation
```

## Campaign Card

Card minimum:

```text
[Image]
Category / Status
Title
Short description
Progress bar
Rp terkumpul / Rp target
Percentage
[Donasi Sekarang]
```

### Rules

- Progress selalu disertai angka, bukan visual bar saja.
- CTA menggunakan `cta` token.
- Status campaign jelas.
- Image memiliki aspect ratio konsisten.
- Jangan membuat card terlalu tinggi sehingga katalog sulit dipindai.

## Campaign Detail

```text
Breadcrumb
Hero / Campaign Image
Category
Title
Description
Progress + Amount
Campaign metadata
[Donasi Sekarang]
Transparency / supporting info
Related Campaigns
```

Desktop dapat menggunakan two-column layout dengan donation CTA sticky di sisi kanan.

Mobile menggunakan single-column flow dengan CTA yang mudah ditemukan.

---

# 11. Donation Form

Form harus terasa **simple, safe, dan focused**.

Urutan:

```text
Nominal
Quick Amounts
Custom Amount
Donor Information
Anonymous Toggle
Email
Message / Doa
Confirmation
[Bayar Sekarang]
```

### UX rules

- Nominal menjadi visual focus.
- Format Rupiah mudah dibaca.
- Quick amount buttons minimal 44×44px.
- Error message muncul dekat field terkait.
- Jangan reset form ketika validasi gagal.
- Submit button menunjukkan loading state.
- Jangan menampilkan credential payment provider.
- Client validation membantu UX, server validation adalah security boundary.

### Payment state

Gunakan state eksplisit:

```text
idle
submitting
payment_pending
success
failed
expired
cancelled
```

Jangan hanya mengandalkan warna.

---

# 12. Payment Result Pages

## Success

Gunakan positive but calm visual.

```text
Success icon
Pembayaran berhasil
Donation reference
Amount
Campaign
Next action
[Ke Riwayat Donasi] / [Kembali ke Program]
```

## Pending

```text
Pending icon
Pembayaran sedang diproses
Reference
Instructions bila diperlukan
[Refresh Status]
```

## Failed / Expired

```text
Error icon
Pembayaran belum berhasil
Reason yang aman untuk ditampilkan
[Ulangi Pembayaran]
[Ke Program]
```

Jangan menampilkan technical error, secret, signature, atau internal stack trace.

---

# 13. Transparency Design

Transparency harus memperkuat trust tanpa membuat user tenggelam dalam data.

Halaman:

```text
Transparency Header
 ↓
Summary Metrics
 ├── Total Income
 ├── Total Expense
 └── Balance
 ↓
Income / Donation Data
 ↓
Expense Data
 ↓
Campaign Allocation
 ↓
Supporting Documents
 ↓
Reporting Period
```

### Data visualization

- Gunakan chart hanya jika membantu memahami data.
- Tabel digunakan untuk detail dan auditability.
- Selalu tampilkan angka dalam text.
- Gunakan period filter bila dataset sudah besar.
- Dokumen pendukung memiliki label yang jelas.

### Trust rules

- Jangan menyembunyikan angka negatif atau status penting melalui warna.
- Tampilkan periode laporan dengan jelas.
- Jangan membuat angka terlihat seperti real-time jika sebenarnya data periodik.

---

# 14. Donor Portal

Visual language tetap menggunakan public design system tetapi lebih utility-oriented.

```text
Dashboard
├── Total Donation
├── Recent Donation
└── Quick Actions

Donation History
├── Date
├── Campaign
├── Amount
└── Status

Donation Detail
├── Reference
├── Amount
├── Campaign
├── Payment Method
├── Status
└── Receipt
```

### Privacy

- Donor hanya melihat data miliknya sendiri.
- Data anonim tetap mengikuti aturan privacy yang ditetapkan aplikasi.
- Jangan expose email/phone donor lain.

---

# 15. Admin Dashboard Design

Admin UI berbeda dari public UI: lebih padat, cepat, dan operational.

## Dashboard

Top-level metrics:

```text
Total Donation
Active Campaigns
Successful Donations
Pending Donations
```

Kemudian:

```text
Recent Donations
Campaign Performance
Recent Activity
```

## Data Table

Table minimum memiliki:

- search
- filter
- sort bila diperlukan
- pagination
- row action
- loading state
- empty state
- error state

Mobile table harus berubah menjadi card/list atau memiliki horizontal scroll yang jelas.

## CRUD Form

Form admin harus:

- grouped by information hierarchy;
- memiliki inline validation;
- memiliki save/loading state;
- memiliki unsaved-change warning bila relevan;
- memiliki destructive action confirmation.

---

# 16. Component System

## Primitive

Gunakan Shadcn UI atau primitive existing untuk:

- Button
- Input
- Textarea
- Select
- Checkbox
- Switch
- Dialog
- Sheet
- Dropdown
- Tabs
- Badge
- Tooltip
- Skeleton
- Alert

## Shared components

Minimum shared components:

```text
Navbar
Footer
PageHeader
SectionHeader
Container
Button
Card
Badge
Breadcrumb
EmptyState
ErrorState
LoadingState
Modal/Dialog
```

## Feature components

Donation:

```text
CampaignCard
CampaignGrid
CampaignProgress
DonationAmountSelector
DonationForm
PaymentStatus
DonationReceipt
```

Content:

```text
PostCard
EventCard
GalleryGrid
ProgramCard
```

Dashboard:

```text
StatCard
DataTable
FilterBar
FormSection
ActivityList
```

### Component rules

- Component harus punya single responsibility.
- Props harus typed.
- Jangan membuat component hanya untuk membungkus markup sederhana jika tidak ada reuse/value.
- Hindari component yang terlalu besar dan menangani seluruh page logic.
- Business logic sensitif tetap di server-side.

---

# 17. Cards, Radius & Shadows

### Border radius

| Component | Radius |
|---|---|
| Card | `rounded-2xl` |
| Modal | `rounded-2xl` |
| Button | `rounded-xl` |
| Badge | `rounded-full` |
| Input | `rounded-xl` |
| Image | `rounded-xl` / mengikuti parent |

Hindari radius ekstrem seperti `rounded-[2.5rem]` untuk card berisi banyak text.

### Shadow hierarchy

| Level | Shadow | Usage |
|---|---|---|
| 0 | none | Flat content / dashboard table |
| 1 | `shadow-sm` | Navbar, input, subtle cards |
| 2 | `shadow-md` | Campaign/content cards |
| 3 | `shadow-lg` | Featured card / floating panel |
| 4 | `shadow-2xl` | Hanya untuk focal element tertentu |

Jangan menggunakan `shadow-xl`/`shadow-2xl` secara massal.

---

# 18. Motion & Interaction

Motion harus membantu feedback, bukan menjadi dekorasi berlebihan.

### Default

```text
transition duration: 150–300ms
```

### Hover

Desktop boleh menggunakan:

```text
hover:-translate-y-1
```

secara selektif.

### Active

Mobile harus memiliki tap feedback:

```text
active:scale-95
```

Gunakan secukupnya.

### Focus

Semua interactive element wajib memiliki visible keyboard focus:

```text
focus-visible:ring-2
focus-visible:ring-offset-2
```

### Reduced motion

Hormati `prefers-reduced-motion` untuk animation yang tidak essential.

---

# 19. States

Setiap interactive/data component harus mempertimbangkan:

```text
Default
Hover
Active
Focus
Disabled
Loading
Empty
Error
Success
```

### Loading

Gunakan skeleton untuk content-heavy section dan spinner untuk action singkat.

### Empty

Jelaskan:

- data apa yang kosong;
- apakah user perlu melakukan sesuatu;
- CTA jika ada.

### Error

Error harus:

- jelas;
- actionable;
- tidak membocorkan detail internal.

---

# 20. Accessibility

Minimum requirements:

- Semantic HTML.
- Keyboard navigable.
- Visible focus state.
- Minimum touch target 44×44px.
- Proper label untuk form.
- Error message terhubung dengan field.
- Image memiliki meaningful alt atau empty alt jika decorative.
- Jangan menggunakan color-only status.
- Modal/dialog memiliki keyboard behavior yang benar.
- Heading hierarchy tidak boleh dilompati tanpa alasan.
- Contrast minimum WCAG AA.

Target utama: **WCAG 2.2 AA** untuk public critical flows jika feasible.

---

# 21. Content & Imagery

Visual pesantren harus terasa authentic.

Prioritas imagery:

1. Foto asli pondok.
2. Foto kegiatan santri.
3. Foto fasilitas.
4. Foto program yang benar-benar sedang berjalan.
5. Illustration hanya sebagai pendukung.

Hindari:

- stock imagery yang terlalu generik;
- visual yang misleading;
- terlalu banyak decorative illustration;
- gambar tanpa optimasi.

Semua image harus dioptimalkan untuk web.

---

# 22. Empty / Placeholder Content

Jika content CMS/database belum tersedia:

- gunakan realistic placeholder yang jelas ditandai;
- jangan hardcode fake donation amount yang terlihat seperti data nyata;
- jangan menampilkan testimonial palsu;
- jangan membuat laporan keuangan fiktif.

Data demo harus mudah dibedakan dari production data.

---

# 23. SEO & Social Sharing

Public page harus memiliki visual yang baik ketika dibagikan melalui WhatsApp/social media.

Prioritas:

- title
- description
- Open Graph image
- readable URL/slug
- canonical URL bila diperlukan

Campaign detail menggunakan slug, bukan UUID, untuk URL yang mudah dibaca dan dibagikan.

---

# 24. Performance Rules

- Server Components sebagai default.
- Gunakan Client Components hanya ketika diperlukan.
- Optimalkan image.
- Hindari giant client-side bundles.
- Hindari unnecessary API round trips.
- Pagination untuk dataset besar.
- Jangan render chart berat jika data tidak membutuhkan chart.
- Loading UI harus dirancang sejak awal, bukan ditambahkan belakangan.

---

# 25. Design-to-Code Rules for OpenCode

OpenCode wajib membaca `project-plan.md` dan `DESIGN.md` sebelum mengimplementasikan feature UI yang signifikan.

### Workflow

```text
Requirement
 ↓
Read project-plan.md
 ↓
Read DESIGN.md
 ↓
Inspect existing components
 ↓
Define page/component structure
 ↓
Implement
 ↓
Responsive check
 ↓
Accessibility check
 ↓
Typecheck / lint / test
 ↓
Review
```

### Mandatory rules

1. Jangan membuat warna baru jika semantic token existing sudah cukup.
2. Jangan membuat radius/shadow baru tanpa alasan.
3. Reuse shared components.
4. Jangan membuat setiap section sebagai component jika tidak reusable atau tidak memiliki logic.
5. Mobile layout harus dipikirkan terlebih dahulu.
6. Semua form harus memiliki validation/error/loading state.
7. Semua CTA harus memiliki hover, active, disabled, dan focus state yang sesuai.
8. Jangan mengorbankan readability demi glassmorphism atau visual effect.
9. Jangan menggunakan fake data yang terlihat seperti production financial data.
10. Jangan mengubah design system secara lokal tanpa mempertimbangkan dampaknya ke halaman lain.

---

# 26. Page-by-Page Design Matrix

| Area | Primary Goal | Primary CTA | Visual Density |
|---|---|---|---|
| Home | Introduce & direct | Donasi / Pendaftaran | Medium |
| Profil | Trust & identity | Kontak / Pendaftaran | Low–Medium |
| Program | Explain education | Lihat Detail | Medium |
| Kegiatan | Show activities | Lihat Kegiatan | Medium |
| Berita | Information | Baca Artikel | Medium |
| Agenda | Event discovery | Lihat Detail | Medium |
| Galeri | Visual storytelling | Lihat Galeri | High visual |
| Campaign Listing | Donation discovery | Donasi Sekarang | Medium |
| Campaign Detail | Donation conversion | Donasi Sekarang | Medium |
| Donation Form | Payment conversion | Bayar Sekarang | High focus |
| Transparency | Build trust | Lihat Laporan | Medium–High data |
| Pendaftaran | Conversion | Daftar / Hubungi | Medium |
| Kontak | Communication | Hubungi | Low |
| Donor Portal | Personal data | View Donation | High utility |
| Admin | Operations | Contextual action | High utility |

---

# 27. Design QA Checklist

## Global

- [ ] Design mengikuti semantic color tokens.
- [ ] Contrast WCAG AA terpenuhi.
- [ ] Typography readable di mobile.
- [ ] Touch target minimal 44×44px.
- [ ] No horizontal overflow.
- [ ] Focus state terlihat.
- [ ] Loading/error/empty/success state tersedia.
- [ ] Tidak ada fake production data.

## Public Website

- [ ] Navbar responsive.
- [ ] CTA sesuai tujuan halaman.
- [ ] Homepage hierarchy jelas.
- [ ] Profil terasa institutional dan trustworthy.
- [ ] Berita mudah dipindai.
- [ ] Agenda mudah dipindai.
- [ ] Galeri performant.
- [ ] Pendaftaran memiliki CTA jelas.
- [ ] Kontak mudah ditemukan.

## Donation

- [ ] Campaign card konsisten.
- [ ] Progress menampilkan visual + angka.
- [ ] Nominal Rupiah mudah dipindai.
- [ ] Donation form tidak membingungkan.
- [ ] Validation jelas.
- [ ] Loading state jelas.
- [ ] Payment status jelas.
- [ ] Success/failure/pending state tersedia.

## Transparency

- [ ] Reporting period jelas.
- [ ] Income/expense/balance jelas.
- [ ] Chart tidak menggantikan angka.
- [ ] Supporting documents memiliki label jelas.

## Admin

- [ ] Data table readable.
- [ ] Search/filter/pagination tersedia jika diperlukan.
- [ ] CRUD state jelas.
- [ ] Destructive actions memiliki confirmation.
- [ ] Mobile admin tidak unusable.

---

# 28. Definition of Design Done

Sebuah page/component dianggap **Design Done** jika:

- [ ] Mengikuti design token.
- [ ] Menggunakan shared component jika tersedia.
- [ ] Responsive mobile/tablet/desktop.
- [ ] Accessible.
- [ ] Memiliki required interaction states.
- [ ] Memiliki loading/empty/error state bila berhubungan dengan data.
- [ ] Tidak menggunakan visual effect berlebihan.
- [ ] Tidak mengandung fake production data.
- [ ] CTA dan hierarchy sesuai tujuan halaman.
- [ ] Tidak menyebabkan visual regression pada shared component.
- [ ] Lulus design QA checklist.
