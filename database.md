# Database Schema & Data Modeling — PPM Nurisba

> **Project:** `ppm-nurisba-app`  
> **Database:** Supabase PostgreSQL  
> **Version:** 3.0  
> **Status:** Source of truth untuk database schema dan data integrity  
> **Related documents:** `project-plan.md`, `content-website.md`, `DESIGN.md`

---

# 1. Database Principles

Database PPM Nurisba dirancang untuk mendukung:

- Website publik pesantren.
- Content management.
- Program donasi.
- Payment gateway.
- Manual bank transfer.
- Admin dashboard.
- Donor portal.
- Transparency reporting.
- Auditability.
- Secure financial transaction processing.

Prioritas:

```text
Data Integrity
      ↓
Security
      ↓
Financial Accuracy
      ↓
Auditability
      ↓
Performance
      ↓
Developer Experience
```

---

# 2. Technology

Database menggunakan:

- Supabase
- PostgreSQL
- Supabase Auth
- Row Level Security (RLS)
- PostgreSQL constraints
- PostgreSQL indexes
- Server-side trusted operations

Authentication menggunakan:

```text
Supabase Auth
      ↓
auth.users
      ↓
public.profiles
```

---

# 3. Entity Overview

Database MVP dan production terdiri dari:

| Table                    | Fungsi                          | Phase      |
| ------------------------ | ------------------------------- | ---------- |
| `profiles`               | Profile dan role user           | Phase 2    |
| `campaigns`              | Program donasi                  | Phase 2    |
| `donations`              | Intent/catatan donasi           | Phase 3    |
| `payments`               | Data transaksi payment provider | Phase 3    |
| `posts`                  | Berita/artikel                  | Phase 2    |
| `events`                 | Agenda/kegiatan                 | Phase 2    |
| `gallery`                | Galeri foto                     | Phase 2    |
| `transparency_reports`   | Laporan transparansi            | Phase 5    |
| `financial_transactions` | Ledger pemasukan/pengeluaran    | Phase 5    |
| `audit_logs`             | Audit aktivitas sensitif        | Production |

Relationship:

```text
auth.users
    │
    ▼
profiles
    │
    ├───────────────┐
    ▼               ▼
donations       posts
    │
    ▼
payments
    │
    ▼
campaigns

campaigns
    │
    ▼
financial_transactions
    │
    ▼
transparency_reports

profiles
    │
    ▼
audit_logs
```

---

# 4. `profiles`

Menyimpan informasi user aplikasi.

User account sebenarnya berada pada:

```text
auth.users
```

Sedangkan informasi aplikasi berada pada:

```text
public.profiles
```

## Schema

| Column       | Type           | Constraint                             | Description           |
| ------------ | -------------- | -------------------------------------- | --------------------- |
| `id`         | `UUID`         | PK                                     | ID profile            |
| `user_id`    | `UUID`         | FK → `auth.users.id`, UNIQUE, NOT NULL | ID user Supabase Auth |
| `name`       | `VARCHAR(255)` | NOT NULL                               | Nama user             |
| `email`      | `VARCHAR(255)` |                                        | Email                 |
| `role`       | `VARCHAR(20)`  | NOT NULL                               | Role                  |
| `created_at` | `TIMESTAMPTZ`  | DEFAULT now()                          | Waktu dibuat          |
| `updated_at` | `TIMESTAMPTZ`  | DEFAULT now()                          | Waktu diperbarui      |

## Role

```text
admin
donor
```

### Rules

- Satu `auth.users` hanya boleh mempunyai satu profile.
- User tidak boleh mengubah `role` sendiri.
- User tidak boleh menjadikan dirinya `admin`.
- Role assignment harus melalui trusted server-side/admin process.

---

# 5. `campaigns`

Menyimpan program penggalangan dana.

## Schema

| Column           | Type           | Constraint                    | Description           |
| ---------------- | -------------- | ----------------------------- | --------------------- |
| `id`             | `UUID`         | PK, DEFAULT gen_random_uuid() | ID campaign           |
| `title`          | `VARCHAR(255)` | NOT NULL                      | Judul campaign        |
| `slug`           | `VARCHAR(255)` | UNIQUE, NOT NULL              | URL campaign          |
| `description`    | `TEXT`         |                               | Deskripsi             |
| `category`       | `VARCHAR(100)` |                               | Kategori              |
| `target_amount`  | `BIGINT`       | NOT NULL, > 0                 | Target rupiah         |
| `current_amount` | `BIGINT`       | NOT NULL, DEFAULT 0           | Cached verified total |
| `image_url`      | `TEXT`         |                               | Gambar campaign       |
| `status`         | `VARCHAR(20)`  | NOT NULL                      | Status                |
| `start_date`     | `DATE`         |                               | Tanggal mulai         |
| `end_date`       | `DATE`         |                               | Tanggal selesai       |
| `created_at`     | `TIMESTAMPTZ`  | DEFAULT now()                 | Waktu dibuat          |
| `updated_at`     | `TIMESTAMPTZ`  | DEFAULT now()                 | Waktu diperbarui      |

## Category

Contoh:

```text
wakaf
sedekah
beasiswa
pembangunan
fasilitas
kebutuhan_santri
lainnya
```

## Status

```text
draft
active
completed
archived
```

## Financial Rule

`current_amount` adalah **cached aggregate dari verified financial transactions/donations**.

Client tidak pernah boleh mengubah:

```text
current_amount
```

Perubahan hanya melalui trusted server-side transaction.

---

# 6. Campaign Seed Data

Campaign pembangunan utama berdasarkan proposal dapat dibuat sebagai seed data:

```text
title:
Pembangunan Masjid dan Ruang Kelas/Asrama PPM Nurisba

category:
wakaf / pembangunan

target_amount:
1203800000
```

Target:

**Rp1.203.800.000**

Angka tersebut adalah **content/business data**, bukan nilai default permanen database.

Jika proposal berubah:

```text
Proposal baru
    ↓
Admin verification
    ↓
Campaign update
```

Jangan hardcode angka proposal di frontend.

---

# 7. `donations`

Menyimpan intent dan catatan donasi.

Donation adalah domain object.

Payment adalah domain object yang berbeda.

## Schema

| Column           | Type           | Constraint                   | Description       |
| ---------------- | -------------- | ---------------------------- | ----------------- |
| `id`             | `UUID`         | PK                           | ID donation       |
| `campaign_id`    | `UUID`         | FK → campaigns.id, NOT NULL  | Campaign tujuan   |
| `user_id`        | `UUID`         | FK → auth.users.id, nullable | Donor terdaftar   |
| `donor_name`     | `VARCHAR(255)` |                              | Nama donor        |
| `donor_email`    | `VARCHAR(255)` |                              | Email donor       |
| `is_anonymous`   | `BOOLEAN`      | DEFAULT false                | Tampilkan anonim  |
| `amount`         | `BIGINT`       | NOT NULL, > 0                | Nominal donasi    |
| `message`        | `TEXT`         |                              | Pesan/doa         |
| `status`         | `VARCHAR(20)`  | NOT NULL                     | Donation state    |
| `payment_method` | `VARCHAR(50)`  |                              | Metode pembayaran |
| `created_at`     | `TIMESTAMPTZ`  | DEFAULT now()                | Waktu dibuat      |
| `updated_at`     | `TIMESTAMPTZ`  | DEFAULT now()                | Waktu diperbarui  |

## Donation Status

```text
pending
success
failed
expired
cancelled
refunded
```

### Important

`donations.status` tidak boleh diubah dari browser.

Client tidak boleh mengirim:

```text
status = success
```

---

# 8. Guest Donation

Donasi tidak harus memiliki account.

Karena itu:

```text
user_id = NULL
```

diperbolehkan.

Contoh:

```text
Visitor
   ↓
Donation
   ↓
Payment
```

Tanpa:

```text
Register
↓
Login
```

Donor account menjadi fitur tambahan.

---

# 9. `payments`

Payment transaction dipisahkan dari donation.

Ini penting agar:

```text
Donation
```

tidak menjadi tempat menyimpan seluruh detail payment gateway.

## Schema

| Column           | Type           | Constraint                  | Description                |
| ---------------- | -------------- | --------------------------- | -------------------------- |
| `id`             | `UUID`         | PK                          | Payment ID                 |
| `donation_id`    | `UUID`         | FK → donations.id, NOT NULL | Donation terkait           |
| `provider`       | `VARCHAR(50)`  | NOT NULL                    | Payment provider           |
| `order_id`       | `VARCHAR(100)` | UNIQUE, NOT NULL            | Internal order ID          |
| `transaction_id` | `VARCHAR(255)` |                             | Provider transaction ID    |
| `payment_type`   | `VARCHAR(100)` |                             | Metode dari provider       |
| `gross_amount`   | `BIGINT`       | NOT NULL, > 0               | Nominal transaksi          |
| `status`         | `VARCHAR(30)`  | NOT NULL                    | Payment state              |
| `raw_status`     | `VARCHAR(50)`  |                             | Status asli provider       |
| `fraud_status`   | `VARCHAR(50)`  |                             | Fraud status jika tersedia |
| `settlement_at`  | `TIMESTAMPTZ`  |                             | Waktu settlement           |
| `expires_at`     | `TIMESTAMPTZ`  |                             | Waktu expiry               |
| `created_at`     | `TIMESTAMPTZ`  | DEFAULT now()               | Waktu dibuat               |
| `updated_at`     | `TIMESTAMPTZ`  | DEFAULT now()               | Waktu diperbarui           |

## Payment Status

```text
pending
success
failed
expired
cancelled
refunded
```

## Relationship

```text
donations
    │
    └──< payments
```

Satu donation dapat memiliki payment attempt lebih dari satu jika architecture payment membutuhkan retry.

Namun setiap `order_id` harus unique.

---

# 10. Payment Provider

Provider pertama:

```text
Midtrans
```

Payment methods dapat mencakup:

- QRIS
- E-wallet
- Virtual Account
- Bank transfer
- metode lain yang tersedia di environment Midtrans.

Jangan mengunci database hanya pada satu payment method.

---

# 11. Midtrans Webhook

Webhook adalah trusted server-side entry point.

Flow:

```text
Midtrans
   ↓
Webhook
   ↓
Verify signature
   ↓
Find payment
   ↓
Validate amount/order
   ↓
Check current state
   ↓
Update payment
   ↓
Update donation
   ↓
Create financial transaction
   ↓
Update campaign aggregate
```

---

# 12. Webhook Idempotency

Webhook dapat dikirim ulang.

Karena itu webhook wajib idempotent.

Minimum protection:

```text
UNIQUE(payments.order_id)
```

dan state checking.

### Example

Jika:

```text
payment.status = success
```

kemudian webhook `settlement` datang lagi:

```text
DO NOT:
+ amount to campaign
```

Tetapi:

```text
ACK webhook
without double counting
```

---

# 13. Webhook Signature

Signature Midtrans harus diverifikasi server-side.

Signature key:

```text
SHA512(
    order_id
    + status_code
    + gross_amount
    + ServerKey
)
```

Server harus:

1. Menerima notification.
2. Mengambil identifier.
3. Mengambil payment dari database.
4. Memvalidasi signature.
5. Memvalidasi amount.
6. Memvalidasi order ID.
7. Memetakan status.
8. Memproses transaction secara atomik.
9. Mengembalikan response yang sesuai.

`ServerKey` tidak boleh berada di client.

---

# 14. Mapping Midtrans Status

| Midtrans                   | Internal    |
| -------------------------- | ----------- |
| `capture` + fraud accepted | `success`   |
| `settlement`               | `success`   |
| `pending`                  | `pending`   |
| `deny`                     | `failed`    |
| `cancel`                   | `cancelled` |
| `expire`                   | `expired`   |
| `refund`                   | `refunded`  |
| `partial_refund`           | `refunded`  |

Status raw provider disimpan di:

```text
payments.raw_status
```

Sedangkan status aplikasi disimpan di:

```text
payments.status
donations.status
```

Jangan menyimpan `settlement`, `expire`, dan status provider lainnya langsung sebagai internal enum.

---

# 15. Financial Transactions

Untuk aplikasi fundraising, transaksi finansial harus mempunyai ledger.

## `financial_transactions`

Menyimpan transaksi finansial yang sudah diverifikasi.

| Column             | Type           | Description                               |
| ------------------ | -------------- | ----------------------------------------- |
| `id`               | `UUID`         | ID transaksi                              |
| `donation_id`      | `UUID`         | Donation terkait, nullable                |
| `campaign_id`      | `UUID`         | Campaign terkait                          |
| `type`             | `VARCHAR(30)`  | income / expense / refund                 |
| `amount`           | `BIGINT`       | Nominal                                   |
| `source`           | `VARCHAR(50)`  | midtrans / bank_transfer / manual / other |
| `reference`        | `VARCHAR(255)` | Reference transaksi                       |
| `description`      | `TEXT`         | Keterangan                                |
| `transaction_date` | `TIMESTAMPTZ`  | Waktu transaksi                           |
| `verified_at`      | `TIMESTAMPTZ`  | Waktu verifikasi                          |
| `verified_by`      | `UUID`         | Admin yang memverifikasi jika manual      |
| `created_at`       | `TIMESTAMPTZ`  | Waktu dibuat                              |
| `updated_at`       | `TIMESTAMPTZ`  | Waktu diperbarui                          |

## Type

```text
income
expense
refund
```

---

# 16. Financial Integrity

Aturan penting:

```text
Successful donation
        ↓
Financial transaction
        ↓
Campaign aggregate
```

Bukan:

```text
Frontend
   ↓
current_amount
```

`campaigns.current_amount` hanya merupakan cached value untuk kebutuhan UI.

Source of truth finansial adalah transaksi yang telah diverifikasi.

---

# 17. Manual Bank Transfer

PPM Nurisba juga menyediakan donasi melalui rekening bank.

Rekening resmi dikelola sebagai content/configuration, bukan sebagai bagian dari payment gateway.

Flow:

```text
Donor
 ↓
Choose Bank Transfer
 ↓
Create Donation
 ↓
Donation = pending
 ↓
Transfer
 ↓
Submit confirmation / proof
 ↓
Admin verification
 ↓
Donation = success
 ↓
Financial transaction = income
 ↓
Campaign aggregate updated
```

Admin wajib memverifikasi transfer sebelum status menjadi `success`.

---

# 18. Manual Transfer Payment Data

Payment manual dapat menggunakan:

```text
provider = manual
```

atau:

```text
provider = bank_transfer
```

Informasi tambahan seperti:

- bank;
- transfer reference;
- proof document;

disimpan dalam payment/manual-payment layer sesuai implementasi final.

Jangan menyimpan bukti transfer sebagai arbitrary public URL.

---

# 19. Manual Payment Verification

Admin dapat:

```text
pending
    ↓
review proof
    ↓
verified
    ↓
success
```

Admin tidak boleh langsung mengubah:

```text
campaign.current_amount
```

tanpa membuat financial transaction.

---

# 20. `posts`

Untuk berita/artikel.

| Column          | Type           | Description              |
| --------------- | -------------- | ------------------------ |
| `id`            | `UUID`         | PK                       |
| `title`         | `VARCHAR(255)` | Judul                    |
| `slug`          | `VARCHAR(255)` | Unique URL               |
| `excerpt`       | `TEXT`         | Ringkasan                |
| `content`       | `TEXT`         | Isi                      |
| `thumbnail_url` | `TEXT`         | Thumbnail                |
| `status`        | `VARCHAR(20)`  | draft/published/archived |
| `published_at`  | `TIMESTAMPTZ`  | Waktu publish            |
| `author_id`     | `UUID`         | FK → profiles.id         |
| `created_at`    | `TIMESTAMPTZ`  | —                        |
| `updated_at`    | `TIMESTAMPTZ`  | —                        |

---

# 21. `events`

Untuk agenda/kegiatan.

| Column        | Type           | Description              |
| ------------- | -------------- | ------------------------ |
| `id`          | `UUID`         | PK                       |
| `title`       | `VARCHAR(255)` | Judul                    |
| `slug`        | `VARCHAR(255)` | Unique URL               |
| `description` | `TEXT`         | Deskripsi                |
| `location`    | `VARCHAR(255)` | Lokasi                   |
| `start_at`    | `TIMESTAMPTZ`  | Mulai                    |
| `end_at`      | `TIMESTAMPTZ`  | Selesai                  |
| `image_url`   | `TEXT`         | Gambar                   |
| `status`      | `VARCHAR(20)`  | draft/published/archived |
| `created_at`  | `TIMESTAMPTZ`  | —                        |
| `updated_at`  | `TIMESTAMPTZ`  | —                        |

---

# 22. `gallery`

| Column        | Type           | Description             |
| ------------- | -------------- | ----------------------- |
| `id`          | `UUID`         | PK                      |
| `title`       | `VARCHAR(255)` | Judul                   |
| `description` | `TEXT`         | Deskripsi               |
| `image_url`   | `TEXT`         | Image storage reference |
| `category`    | `VARCHAR(100)` | Kategori                |
| `created_at`  | `TIMESTAMPTZ`  | —                       |
| `updated_at`  | `TIMESTAMPTZ`  | —                       |

---

# 23. `transparency_reports`

Laporan transparansi publik.

| Column         | Type           | Description       |
| -------------- | -------------- | ----------------- |
| `id`           | `UUID`         | PK                |
| `title`        | `VARCHAR(255)` | Judul             |
| `description`  | `TEXT`         | Ringkasan         |
| `period_start` | `DATE`         | Awal periode      |
| `period_end`   | `DATE`         | Akhir periode     |
| `document_url` | `TEXT`         | Dokumen pendukung |
| `published_at` | `TIMESTAMPTZ`  | Waktu publish     |
| `created_at`   | `TIMESTAMPTZ`  | —                 |
| `updated_at`   | `TIMESTAMPTZ`  | —                 |

## Financial Summary

Jangan menjadikan:

```text
income
expense
balance
```

sebagai angka manual yang menjadi source of truth.

Summary harus dihitung dari:

```text
financial_transactions
```

atau dibuat sebagai snapshot yang memiliki reference jelas terhadap ledger.

Dengan demikian:

```text
financial_transactions
        ↓
report calculation
        ↓
transparency report
```

---

# 24. `audit_logs`

Audit trail diperlukan untuk operasi sensitif.

## Schema

| Column        | Type           | Description            |
| ------------- | -------------- | ---------------------- |
| `id`          | `UUID`         | PK                     |
| `user_id`     | `UUID`         | Actor                  |
| `action`      | `VARCHAR(100)` | Action                 |
| `entity_type` | `VARCHAR(100)` | Resource               |
| `entity_id`   | `UUID`         | Resource ID            |
| `metadata`    | `JSONB`        | Metadata non-sensitive |
| `created_at`  | `TIMESTAMPTZ`  | Timestamp              |

Contoh:

```text
admin
 ↓
verify manual donation
 ↓
audit_logs
```

atau:

```text
admin
 ↓
publish campaign
 ↓
audit_logs
```

---

# 25. Audit Rules

Audit log digunakan untuk operasi seperti:

- perubahan campaign;
- publish/archive campaign;
- verifikasi manual transfer;
- publish transparency report;
- perubahan financial record;
- perubahan role;
- administrative actions.

Jangan memasukkan secret ke `metadata`.

Jangan menyimpan:

```text
ServerKey
password
access token
service role key
```

di audit log.

---

# 26. Row Level Security

**RLS wajib aktif pada seluruh tabel public.**

Authorization harus dilakukan pada:

```text
Application layer
+
Database layer
```

Bukan hanya UI.

---

# 27. Public Access

### `campaigns`

Public:

```text
SELECT
WHERE status = 'active'
```

### `posts`

```text
SELECT
WHERE status = 'published'
```

### `events`

```text
SELECT
WHERE status = 'published'
```

### `gallery`

Public dapat membaca konten yang memang ditujukan untuk publik.

### `transparency_reports`

Public hanya dapat membaca:

```text
published_at IS NOT NULL
```

### `donations`

Public:

```text
INSERT
```

hanya untuk membuat donation baru.

Public tidak boleh:

```text
SELECT
UPDATE
DELETE
```

terhadap donation secara bebas.

---

# 28. Donor Access

Authenticated donor dapat:

```text
profiles
    ↓
own profile

donations
    ↓
own donations
```

Policy:

```text
user_id = auth.uid()
```

Donor tidak boleh:

- melihat donation user lain;
- mengubah donation;
- mengubah payment status;
- mengubah campaign;
- mengubah financial transaction;
- mengubah transparency report;
- mengakses admin resource.

---

# 29. Admin Access

Admin dapat mengelola:

```text
campaigns
posts
events
gallery
transparency_reports
```

Admin dapat membaca:

```text
donations
payments
financial_transactions
audit_logs
profiles
```

Namun ada batas penting.

### Admin tidak boleh mengubah payment status secara sembarangan.

Payment status:

```text
Payment Provider
      ↓
Verified Server Logic
      ↓
Database
```

Untuk manual transfer:

```text
Admin verification
      ↓
Trusted server-side action
      ↓
Financial transaction
```

---

# 30. Service Role

Service role hanya boleh digunakan server-side untuk operasi yang memang membutuhkan privilege tinggi.

Contoh:

```text
Midtrans webhook
Financial transaction processing
Trusted administrative operation
```

Service role key:

```text
SUPABASE_SERVICE_ROLE_KEY
```

harus:

- berada di server;
- berada di environment secret;
- tidak pernah dikirim ke browser;
- tidak pernah masuk Git.

---

# 31. Donation Immutability

Setelah donation dibuat:

```text
donation amount
campaign
order/payment identity
```

tidak boleh diubah oleh donor.

Jika terdapat koreksi finansial:

```text
Original transaction
       ↓
Correction / refund transaction
```

bukan:

```text
UPDATE historical donation
```

Tujuannya menjaga auditability.

---

# 32. Database Constraints

Minimum constraints:

```sql
campaigns.target_amount > 0

campaigns.current_amount >= 0

donations.amount > 0

payments.gross_amount > 0

financial_transactions.amount > 0
```

Unique:

```text
campaigns.slug
posts.slug
events.slug
payments.order_id
profiles.user_id
```

Foreign key harus digunakan untuk relationship yang jelas.

---

# 33. Indexes

Minimum index:

```sql
CREATE UNIQUE INDEX idx_campaigns_slug
ON campaigns(slug);

CREATE INDEX idx_campaigns_status
ON campaigns(status);

CREATE UNIQUE INDEX idx_posts_slug
ON posts(slug);

CREATE INDEX idx_posts_status_published_at
ON posts(status, published_at DESC);

CREATE UNIQUE INDEX idx_events_slug
ON events(slug);

CREATE INDEX idx_events_status_start_at
ON events(status, start_at);

CREATE INDEX idx_donations_campaign_id
ON donations(campaign_id);

CREATE INDEX idx_donations_user_id
ON donations(user_id);

CREATE INDEX idx_donations_status
ON donations(status);

CREATE UNIQUE INDEX idx_payments_order_id
ON payments(order_id);

CREATE INDEX idx_payments_donation_id
ON payments(donation_id);

CREATE INDEX idx_payments_status
ON payments(status);

CREATE INDEX idx_financial_transactions_campaign_id
ON financial_transactions(campaign_id);

CREATE INDEX idx_financial_transactions_type_date
ON financial_transactions(type, transaction_date DESC);

CREATE INDEX idx_transparency_period
ON transparency_reports(period_start, period_end);

CREATE INDEX idx_audit_logs_entity
ON audit_logs(entity_type, entity_id);

CREATE INDEX idx_audit_logs_user
ON audit_logs(user_id);
```

Jangan menambahkan index secara berlebihan tanpa query pattern yang jelas.

---

# 34. Money Representation

Seluruh nominal Rupiah disimpan sebagai:

```text
BIGINT
```

Contoh:

```text
Rp100.000
```

disimpan sebagai:

```text
100000
```

Jangan menggunakan:

```text
FLOAT
DOUBLE
```

untuk nominal uang.

Frontend bertugas melakukan formatting:

```text
100000
↓
Rp100.000
```

---

# 35. Transaction Atomicity

Operasi finansial penting harus bersifat atomic.

Contoh donation success:

```text
BEGIN
   ↓
Update payment
   ↓
Update donation
   ↓
Insert financial transaction
   ↓
Update campaign aggregate
   ↓
COMMIT
```

Jika salah satu gagal:

```text
ROLLBACK
```

Tidak boleh terjadi kondisi:

```text
Donation = success
Financial transaction = missing
```

atau:

```text
Campaign amount +100.000
Donation = pending
```

---

# 36. Refund

Refund harus diperlakukan sebagai financial event baru.

Jangan menghapus transaksi lama.

Contoh:

```text
Income
+100.000
    ↓
Refund
-100.000
```

Ledger tetap menyimpan keduanya.

---

# 37. Transparency Calculation

Public transparency sebaiknya berasal dari verified financial data.

Concept:

```text
Verified Income
      +
Verified Expense
      +
Verified Refund
      ↓
Transparency Summary
```

Jangan menghitung transparansi berdasarkan:

```text
donation form submission
```

tetapi berdasarkan:

```text
verified financial transaction
```

---

# 38. Proposal Data vs Operational Data

Data proposal seperti:

```text
target Rp1.203.800.000
masjid 10 × 10 m
3 ruang kelas/asrama
tanah wakaf 3.885 m²
```

merupakan **business/content data**.

Database tidak boleh mengasumsikan bahwa angka tersebut akan selalu sama.

Jika proposal berubah:

```text
New official proposal
        ↓
Verification
        ↓
Content update
        ↓
Campaign update
```

---

# 39. Migration Strategy

Semua perubahan schema harus menggunakan migration.

Jangan melakukan perubahan production database secara manual tanpa migration.

Workflow:

```text
Schema change
     ↓
Migration
     ↓
Local test
     ↓
Staging
     ↓
Verification
     ↓
Production
```

Migration harus:

- deterministic;
- versioned;
- reviewable;
- reversible jika memungkinkan.

---

# 40. Seed Strategy

Seed digunakan untuk:

- development;
- staging;
- initial official content.

Seed tidak boleh memasukkan:

- real payment transaction;
- real secret;
- real production credential;
- fake successful donation yang terlihat sebagai transaksi nyata.

Untuk development:

```text
seed campaign
seed posts
seed events
seed gallery
```

boleh digunakan.

Tetapi production financial data harus berasal dari transaksi nyata.

---

# 41. Backup & Recovery

Database production wajib memiliki:

- automated backup;
- retention policy;
- restore procedure;
- periodic restore test.

Minimal lakukan restore test secara berkala.

Backup dianggap valid hanya jika:

```text
Backup
 ↓
Restore
 ↓
Application can read data
```

---

# 42. Data Retention

Data transaksi finansial tidak boleh dihapus sembarangan.

Untuk data:

```text
donations
payments
financial_transactions
audit_logs
```

gunakan retention policy yang sesuai kebutuhan operasional dan kewajiban hukum yang berlaku.

Jika transaksi perlu disembunyikan dari public:

```text
UPDATE visibility
```

bukan:

```text
DELETE financial history
```

---

# 43. Sensitive Data

Jangan menyimpan data yang tidak diperlukan.

Hindari menyimpan:

- password;
- payment card data;
- payment secret;
- authentication token;
- unnecessary identity information.

Payment credential tetap berada di provider.

---

# 44. Database Security Checklist

Sebelum production:

- [ ] RLS aktif seluruh public tables.
- [ ] RLS policy diuji.
- [ ] Admin authorization diuji.
- [ ] Donor ownership diuji.
- [ ] Service role hanya server-side.
- [ ] No secret di database.
- [ ] No secret di seed.
- [ ] No secret di audit logs.
- [ ] Foreign key constraints aktif.
- [ ] Financial amount menggunakan BIGINT.
- [ ] Payment order ID unique.
- [ ] Webhook idempotent.
- [ ] Duplicate webhook tested.
- [ ] Refund tested.
- [ ] Backup tested.
- [ ] Restore tested.

---

# 45. Database Development Order

Implementasi database mengikuti roadmap:

```text
Phase 1
Public Website
    ↓
Phase 2
profiles
campaigns
posts
events
gallery
    ↓
Phase 3
donations
payments
    ↓
Phase 4
Admin access
    ↓
Phase 5
financial_transactions
transparency_reports
audit_logs
    ↓
Phase 6
Donor Portal
    ↓
Phase 7
Production hardening
```

---

# 46. Source of Truth Hierarchy

Untuk database:

```text
project-plan.md
        ↓
database.md
        ↓
SQL migrations
        ↓
Generated TypeScript types
        ↓
Application code
```

Jangan membuat schema baru langsung dari frontend.

Jika application membutuhkan kolom baru:

```text
Requirement
    ↓
project-plan.md
    ↓
database.md
    ↓
migration
    ↓
types
    ↓
application
```

---

# 47. AI Agent Database Rules

OpenCode wajib mengikuti aturan:

1. Selalu membaca `database.md` sebelum mengubah schema.
2. Jangan membuat tabel baru tanpa alasan yang jelas.
3. Jangan mengubah financial schema tanpa review.
4. Jangan menghapus historical financial data.
5. Jangan menonaktifkan RLS.
6. Jangan bypass authorization untuk memperbaiki error.
7. Jangan menggunakan service-role key di client.
8. Jangan mengubah payment status dari frontend.
9. Jangan mengupdate `current_amount` secara langsung dari client.
10. Jangan membuat duplicate payment record untuk webhook retry.
11. Gunakan transaction untuk financial operations.
12. Gunakan migration untuk setiap schema change.
13. Update database documentation setelah schema berubah.
14. Generate/update TypeScript database types setelah migration.
15. Jika ada konflik antara implementation dan `database.md`, hentikan perubahan besar dan laporkan conflict tersebut.

---

# 48. Definition of Done — Database

Database feature dianggap selesai jika:

- [ ] Schema sesuai specification.
- [ ] Migration tersedia.
- [ ] Foreign key tersedia.
- [ ] Constraints tersedia.
- [ ] Index sesuai query pattern.
- [ ] RLS tersedia.
- [ ] Authorization diuji.
- [ ] TypeScript types tersedia.
- [ ] Unit/integration test relevan tersedia.
- [ ] Financial operation atomic.
- [ ] Webhook idempotent.
- [ ] Tidak ada secret.
- [ ] Documentation diperbarui.

---

# 49. Critical Financial Invariants

Invariant berikut **tidak boleh dilanggar**:

### Invariant 1

```text
Payment success
→ Donation success
```

### Invariant 2

```text
Donation success
→ Verified financial transaction
```

### Invariant 3

```text
Verified financial transaction
→ Campaign aggregate dapat diperbarui
```

### Invariant 4

```text
Same payment event
→ Cannot increase campaign amount twice
```

### Invariant 5

```text
Client input
≠
Payment truth
```

### Invariant 6

```text
Admin UI
≠
Payment authority
```

### Invariant 7

```text
Historical financial record
→ immutable/auditable
```

---

# 50. Final Architecture

Database architecture final:

```text
                       ┌───────────────┐
                       │ Supabase Auth │
                       └───────┬───────┘
                               │
                               ▼
                         ┌───────────┐
                         │ profiles  │
                         └─────┬─────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌───────────┐    ┌───────────┐    ┌───────────┐
        │ campaigns │    │   posts   │    │  events   │
        └─────┬─────┘    └───────────┘    └───────────┘
              │
              ▼
        ┌───────────┐
        │ donations │
        └─────┬─────┘
              │
              ▼
        ┌───────────┐
        │ payments  │◄──────── Midtrans
        └─────┬─────┘
              │
              ▼
   ┌─────────────────────────┐
   │ Financial Transactions  │
   └────────────┬────────────┘
                │
                ▼
        ┌───────────────┐
        │  Transparency │
        └───────────────┘

        ┌───────────────┐
        │     Audit     │
        │     Logs      │
        └───────────────┘

        ┌───────────────┐
        │    Gallery    │
        └───────────────┘
```

---

# 51. Final Principle

Database PPM Nurisba bukan sekadar tempat menyimpan data website.

Karena aplikasi akan menangani donasi publik, database harus diperlakukan sebagai **financially sensitive system**.

Prinsip utamanya:

```text
Never trust the client.
Never trust a payment status blindly.
Never double-count money.
Never silently mutate financial history.
Never bypass RLS for convenience.
Always verify.
Always audit.
Always reconcile.
```

Jika terjadi konflik antara kemudahan development dan integritas transaksi:

> **Pilih integritas transaksi.**
