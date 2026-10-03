# Hostinger MCP — Governance & Operational Rules

**Project:** `ppm-nurisba-app`
**Cakupan:** Aturan ini WAJIB dipatuhi setiap kali tool `hostinger_*` dipanggil — baik lewat OpenCode interaktif maupun dari prompt terstruktur yang dibuat untuk OpenCode.

> **Catatan:** Token Hostinger yang dipakai untuk MCP ini kemungkinan **full-account access** (tergantung opsi scope yang dipilih saat generate token di hPanel), bukan scoped ke satu website. Karena itu, pembatasan di dokumen ini dilakukan di level *behavior/approval*, bukan diasumsikan sudah dibatasi oleh token-nya sendiri.

---

## 1. Approval Gate — WAJIB konfirmasi eksplisit

Operasi berikut **tidak boleh dieksekusi** tanpa persetujuan eksplisit dari Walid di turn yang sama, meskipun tool-nya tersedia dan terlihat "aman" di schema:

- **Billing** — pembelian, upgrade/downgrade paket, pembatalan subscription, perubahan metode pembayaran
- **Domain** — registrasi, transfer, perubahan nameserver, penghapusan domain
- **DNS** — tambah/ubah/hapus record apapun (A, CNAME, MX, TXT, dst.)
- **VPS** — create, delete, reboot, reinstall OS, perubahan firewall rule
- **Database** — `hosting_databases_create` dan operasi destruktif (drop/delete). Membuat backup/snapshot read-only boleh tanpa approval, tapi bikin user/database baru tetap WAJIB konfirmasi
- **`hosting_websites_create`** — provisioning website baru
- **`hosting_nodejs_replace-environment-variables`** — ini operasi **full replace**, bukan merge. WAJIB ditunjukkan diff-nya (var mana yang hilang/berubah) ke Walid sebelum dieksekusi

## 2. Boleh jalan tanpa approval tambahan (read-only)

- `hosting_websites_list`, `hosting_databases_list`, `hosting_nodejs_build-logs`, `hosting_nodejs_analyse-failed-build`, `wordpress_installations_list`, `agency-hosting_website-setups_status`, dan semua operasi `list` / `get` / `status` / `logs` lainnya
- `search` (mencari operasi yang tersedia) — selalu aman, tidak mengeksekusi apapun

## 3. Kredensial

- Password database atau API token **tidak boleh** ditulis ke source code, client-side JS, atau file `.env` yang ter-commit (sejalan dengan `project-plan.md` §18)
- Env var Node.js production diganti lewat `hosting_nodejs_replace-environment-variables` — cek dulu semua variable yang sudah ada sebelum memanggil tool ini, karena ini full replace bukan incremental
- Env var build-time (`NEXT_PUBLIC_*`) butuh build ulang setelah diganti — jangan asumsikan auto-refresh
- Aplikasi PHP (kalau ada) baca config dari file di server, bukan dari MCP ini

## 4. Koneksi database

- MySQL jalan di server yang sama dengan website → aplikasi Node.js **wajib** konek ke `127.0.0.1:3306`, bukan `localhost` (Node.js bisa resolve `localhost` ke `::1`/IPv6, dan grant user database biasanya cuma cover IPv4)
- Host `srvNNNN.hstgr.io` dari `hosting_databases_list` **hanya** untuk koneksi eksternal (dari luar Hostinger), setelah `hosting_databases_create-remote-connection` — **jangan** dipakai di connection string aplikasi production

## 5. Operasi asynchronous — "sukses" ≠ "selesai"

- Response sukses dari operasi async berarti **"queued"**, bukan "done". WAJIB poll status (backoff: detik → menit) sebelum lanjut ke langkah yang depend ke hasil operasi itu
- `hosting_websites_create` → poll `hosting_websites_list-setups` sampai status `completed`; call file/deploy/database sebelum itu akan 404/409
- `hosting_nodejs_start-build` → cek progress lewat `hosting_nodejs_build` + `hosting_nodejs_build-logs`
- **Jangan retry operasi write** (create/update/delete) hanya karena timeout atau hasil belum kelihatan — cek status dulu. Retry buta bisa menduplikasi side-effect (prinsip sama seperti webhook idempotency Midtrans di `invariants-and-safeguards.md`)

## 6. Pola teknis (referensi)

- Alur kerja: `search` dulu buat nemu operasi yang tersedia → baca `inputSchema` yang dikembalikan (otoritatif untuk bentuk request) → baru `execute`
- Multi-step: `execute` bisa dirangkai sampai 20 operasi berurutan, berhenti di kegagalan pertama
- Reference antar-step pakai format `$steps.<i>.<path>` (misal `$steps.0.0.id`)

---

**Catatan integrasi:** supaya OpenCode otomatis baca file ini di setiap task (bukan cuma pas diingetin manual), tambahkan baris referensi ke file ini di `AGENTS.md` §1 (Hierarchy of Source of Truth), sejajar dengan `PRD.md`, `project-plan.md`, `DESIGN.md`, dll.
