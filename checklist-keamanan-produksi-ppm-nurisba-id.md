# Checklist Keamanan Produksi
## Aplikasi Node.js `ppm.nurisba.id`

Gunakan checklist ini sebelum aplikasi dibuka untuk pengguna umum dan ulangi setiap kali melakukan deployment besar.

---

## 1. Dependency dan supply chain

- [ ] Jalankan `npm audit` dan pastikan tidak ada kerentanan **high** atau **critical** yang belum ditangani.
- [ ] Pastikan `sharp` sudah versi `0.35.4` atau lebih baru.
- [ ] Pastikan `js-yaml` sudah versi `4.3.2` atau lebih baru.
- [ ] Pastikan `next` sudah versi `16.3.5` atau lebih baru (patch RCE Windows-hosted & AVIF Image Optimization; pin exact di `package.json`, tanpa caret).
- [ ] Verifikasi versi yang benar-benar terpasang:

```bash
npm ls sharp js-yaml next eslint-config-next
```

- [ ] Periksa dependency transitive, bukan hanya dependency yang tercantum langsung di `package.json`.
- [ ] Pastikan `package-lock.json` atau lockfile yang digunakan sudah diperbarui dan di-commit.
- [ ] Gunakan `npm ci` saat deployment produksi agar versi mengikuti lockfile.
- [ ] Hapus package yang tidak dipakai.
- [ ] Hindari memasang package dari sumber tidak tepercaya.
- [ ] Tinjau perubahan dependency besar sebelum menjalankan deployment.
- [ ] Jalankan pemeriksaan lisensi dan package mencurigakan jika proyek memiliki banyak dependency.

Perintah pemeriksaan dasar:

```bash
npm ci
npm audit
npm ls --depth=0
npm run build
```

---

## 2. Versi runtime dan konfigurasi deployment

- [ ] Gunakan Node.js `>=24.15.0` di Hostinger (sesuai `engines` di `package.json`; `isomorphic-dompurify@4.2.0` dan `jsdom@30.0.1` menolak Node `<24.15`).
- [ ] Pastikan versi Node.js lokal dan versi Node.js di Hostinger sama.
- [ ] Set `NODE_ENV=production`.
- [ ] Pastikan build memakai `next build --webpack` (script `build` di `package.json`); Turbopack gagal di Hostinger karena GLIBC server `< 2.29` sehingga native binding `@next/swc-linux-x64-gnu` tidak bisa dimuat.
- [ ] Pastikan output `standalone` aktif dan aplikasi dijalankan via `.next/standalone/server.js` (`npm run start:standalone`) dengan `PORT` dari Hostinger.
- [ ] Pastikan perintah build berhasil tanpa error.
- [ ] Pastikan aplikasi tidak dijalankan dengan mode development.
- [ ] Pastikan proses aplikasi otomatis restart ketika crash.
- [ ] Pastikan log deployment dibaca setelah setiap rilis.
- [ ] Jangan mengaktifkan debug verbose di produksi.
- [ ] Batasi jumlah worker dan penggunaan memory sesuai kebutuhan aplikasi.
- [ ] Uji rollback ke deployment terakhir yang diketahui sehat.

Contoh pemeriksaan konfigurasi:

```bash
node --version
npm --version
printenv NODE_ENV
npm run build
```

---

## 3. Secrets dan kredensial

- [ ] Jangan menyimpan secret di GitHub, source code, screenshot, atau file `.env` yang di-commit.
- [ ] Simpan secret di environment variables aplikasi Hostinger.
- [ ] Pastikan `.env` tercantum di `.gitignore`.
- [ ] Pisahkan Midtrans Sandbox Key dan Production Key.
- [ ] Gunakan server key hanya di backend; jangan pernah mengirimkannya ke browser.
- [ ] Gunakan client key hanya pada bagian frontend yang memang membutuhkannya.
- [ ] Jangan mencetak secret ke log.
- [ ] Ganti semua key jika pernah terlanjur masuk ke repository atau log.
- [ ] Gunakan kredensial database dengan hak akses minimum.
- [ ] Pastikan password database tidak sama dengan password panel atau akun lain.

Contoh `.gitignore` minimal:

```gitignore
.env
.env.*
!.env.example
node_modules/
```

File `.env.example` hanya boleh berisi nama variabel tanpa nilai rahasia. Variabel yang dipakai project ini:

```env
NODE_ENV=production
PORT=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MIDTRANS_SERVER_KEY=
MIDTRANS_IS_PRODUCTION=
```

---

## 4. HTTPS, domain, dan jaringan

- [ ] `https://ppm.nurisba.id` dapat dibuka tanpa peringatan sertifikat.
- [ ] Alihkan semua trafik HTTP ke HTTPS.
- [ ] Pastikan cookie sensitif memakai `Secure`.
- [ ] Pastikan DNS mengarah ke aplikasi yang benar.
- [ ] Daftarkan `https://ppm.nurisba.id` sebagai Site URL + Redirect URL di dashboard Supabase Auth (untuk email konfirmasi registrasi donatur) dan set `NEXT_PUBLIC_APP_URL` yang sama di Hostinger.
- [ ] Jangan membuka port database ke publik jika tidak diperlukan.
- [ ] Batasi akses endpoint admin berdasarkan autentikasi dan otorisasi.
- [ ] Jangan menampilkan port internal, hostname server, atau detail deployment kepada pengguna.
- [ ] Periksa bahwa domain produksi tidak menampilkan halaman default atau halaman debug.
- [ ] Pastikan header `Host` yang tidak dikenal tidak dapat mengarahkan aplikasi ke domain lain.

---

## 5. HTTP security headers

- [ ] Aktifkan header keamanan via fungsi `headers()` di `next.config.mjs` (project ini Next.js App Router, bukan Express — jangan pasang `helmet`).
- [ ] Gunakan `Content-Security-Policy` yang sesuai dengan sumber script dan gambar yang benar-benar diperlukan (izinkan `*.supabase.co` untuk gambar Storage; WhatsApp/QRIS tidak butuh sumber script tambahan).
- [ ] Aktifkan `Strict-Transport-Security` setelah HTTPS dipastikan stabil.
- [ ] Aktifkan `X-Content-Type-Options: nosniff`.
- [ ] Gunakan kebijakan `Referrer-Policy` yang tidak membocorkan data sensitif.
- [ ] Batasi embedding halaman dengan `frame-ancestors` atau `X-Frame-Options`.
- [ ] Jangan menggunakan wildcard terlalu longgar pada CORS.

Contoh awal untuk Next.js di `next.config.mjs` (sesuaikan CSP dengan kebutuhan nyata):

```js
async headers() {
  return [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "DENY" },
      ],
    },
  ];
}
```

Tinjau kembali aturan Content Security Policy jika aplikasi memuat Midtrans Snap, CDN, font, atau layanan pihak ketiga. Catatan: Midtrans Snap saat ini disabled di UI publik.

---

## 6. Authentication dan authorization

- [ ] Password dikelola Supabase Auth (hash bcrypt); jangan membuat sistem password/Hash sendiri dan jangan menyimpan password dalam bentuk apa pun di database aplikasi.
- [ ] Jangan menyimpan password dalam bentuk plaintext.
- [ ] Manfaatkan rate limit bawaan Supabase Auth untuk login/register; pertimbangkan pembatasan tambahan di `proxy.ts` bila diperlukan.
- [ ] Session cookie dikelola `@supabase/ssr` (`HttpOnly`); pastikan flag `Secure` aktif di produksi (HTTPS).
- [ ] Terapkan timeout session via pengaturan Supabase Auth (JWT expiry).
- [ ] Bedakan role via `profiles.role` (`admin`/`donor`); setiap mutasi sensitif wajib memanggil `requireAdmin()` server-side dan jangan pernah percaya role dari client.
- [ ] Periksa authorization di server untuk setiap endpoint sensitif; jangan hanya mengandalkan pembatasan di frontend.
- [ ] Cegah user mengakses data milik user lain dengan mengganti ID pada URL atau request (andalkan RLS: kepemilikan `user_id = auth.uid()`, bukan filter di client).
- [ ] Aktifkan MFA untuk akun admin bila tersedia di Supabase Auth.
- [ ] Proses reset password memakai alur resmi Supabase Auth (token sekali pakai + redirect URL ke `ppm.nurisba.id` yang terdaftar).

---

## 7. Validasi input dan keamanan API

- [ ] Validasi semua input di server menggunakan Zod (`lib/validations/`, server actions, route handlers) — validasi client hanya UX, bukan batas keamanan.
- [ ] Tolak field yang tidak dikenal jika endpoint sensitif.
- [ ] Batasi ukuran request body (`bodySizeLimit: "12mb"` untuk Server Actions), upload (gambar 5 MB, PDF transparansi 10 MB), dan parameter URL.
- [ ] Akses database hanya via Supabase client (query terparameterisasi); hindari menyusun SQL dari string input pengguna.
- [ ] Escape/sanitasi output sesuai konteks untuk mencegah XSS (gunakan `lib/sanitize.ts` untuk konten HTML).
- [ ] Terapkan rate limit pada login, register, dan endpoint pembayaran (manfaatkan rate limit Supabase Auth + pertimbangkan pembatasan di `proxy.ts`).
- [ ] Gunakan timeout pada request ke API eksternal (mis. Midtrans).
- [ ] Jangan meneruskan URL dari user ke server tanpa validasi untuk mencegah SSRF (berlaku untuk field `document_url` laporan).
- [ ] Batasi tipe dan ukuran file upload (gambar: JPG/PNG/WebP; dokumen: PDF + cek magic bytes `%PDF-` server-side).
- [ ] Simpan upload di Supabase Storage bucket yang sesuai (`images` publik untuk gambar, `transparency-documents` privat untuk PDF) — bukan di filesystem yang bisa mengeksekusi script.
- [ ] Jangan mengembalikan stack trace ke pengguna.

---

## 8. Midtrans dan alur pembayaran

- [ ] Verifikasi Midtrans tetap disabled di UI publik (hanya `manual_bank`/`qris_manual` yang ditawarkan; `createPendingDonation` hanya stub penolakan).
- [ ] Buat Snap token hanya dari backend (`lib/midtrans/` server-side).
- [ ] Jangan expose Midtrans Server Key di frontend.
- [ ] Validasi signature notification/webhook di backend.
- [ ] Verifikasi `order_id`, nominal, status transaksi, dan identitas merchant.
- [ ] Jangan menganggap pembayaran sukses hanya karena frontend menerima callback sukses.
- [ ] Jadikan webhook sebagai sumber konfirmasi server-to-server.
- [ ] Terapkan idempotency agar webhook yang sama tidak menggandakan pesanan atau status pembayaran.
- [ ] Simpan status transaksi dengan state yang jelas, misalnya `pending`, `settlement`, `capture`, `expire`, `cancel`, atau `deny`.
- [ ] Tolak perubahan status yang tidak valid, misalnya transaksi yang sudah selesai kembali menjadi belum dibayar.
- [ ] Catat notification ID, order ID, waktu, dan hasil validasi tanpa mencatat secret.
- [ ] Gunakan Sandbox untuk pengujian dan Production Key hanya setelah alur tervalidasi.
- [ ] Uji pembayaran berhasil, gagal, kedaluwarsa, dibatalkan, dan webhook terlambat.

---

## 9. Database dan data pengguna

- [ ] Aktifkan backup otomatis / Point-in-Time Recovery di dashboard Supabase dan uji proses restore.
- [ ] Pastikan backup tidak dapat diakses melalui URL publik.
- [ ] Gunakan koneksi Supabase bawaan (SSL); service-role key hanya di server, anon key untuk client.
- [ ] Gunakan user database dengan hak akses minimum.
- [ ] Pastikan RLS aktif di semua tabel publik dan kebijakan terverifikasi (`pg_policies`): income hanya via service-role/webhook, expense/refund oleh admin, donor tidak bisa mengubah `role` atau status donasi.
- [ ] Pastikan constraint finansial ada: `CHECK (amount > 0)`, `UNIQUE` order ID, dan partial unique index satu income per donasi (`financial_transactions_one_income_per_donation_idx`).
- [ ] Jangan menyimpan data kartu pembayaran jika tidak diperlukan.
- [ ] Minimalkan penyimpanan data pribadi.
- [ ] Tetapkan masa penyimpanan dan proses penghapusan data.
- [ ] Pastikan error database tidak mengungkap query, username, atau struktur tabel.
- [ ] Uji pemulihan database pada lingkungan terpisah.

---

## 10. Logging dan monitoring

- [ ] Log login gagal, perubahan role, perubahan password, pembayaran, dan aktivitas admin (verifikasi donasi manual tercatat di tabel `audit_logs`; kegagalan tulis audit harus terlihat di log server, bukan dibiarkan diam).
- [ ] Jangan mencatat password, token, cookie, server key, atau data pribadi berlebihan.
- [ ] Sertakan timestamp, request ID, endpoint, status, dan latency.
- [ ] Pantau lonjakan error 4xx/5xx.
- [ ] Pantau crash, restart loop, penggunaan memory, dan waktu respons.
- [ ] Tetapkan alert untuk login gagal berulang dan perubahan konfigurasi penting.
- [ ] Simpan log dengan retensi yang wajar.
- [ ] Pastikan log tidak dapat diedit oleh user biasa.
- [ ] Siapkan prosedur respons jika ditemukan aktivitas mencurigakan.

---

## 11. Pengujian sebelum go-live

- [ ] Jalankan unit test (vitest tersedia di devDependencies; pastikan script test tersedia dan hijau).
- [ ] Jalankan integration test.
- [ ] Jalankan test untuk alur login dan authorization (admin vs donor, `requireAdmin()`).
- [ ] Jalankan test alur donasi manual end-to-end (transfer/QRIS → konfirmasi → verifikasi admin → ledger + agregat campaign); Midtrans Sandbox hanya bila integrasi Midtrans diaktifkan kembali.
- [ ] Uji webhook dengan signature salah dan request duplikat.
- [ ] Uji input kosong, terlalu panjang, karakter khusus, dan tipe data salah.
- [ ] Uji akses tanpa login ke endpoint privat.
- [ ] Uji akses user biasa ke endpoint admin.
- [ ] Uji file upload dengan file berbahaya dan ukuran berlebihan.
- [ ] Uji aplikasi setelah `npm ci --omit=dev`.
- [ ] Uji build produksi dengan `next build --webpack` pada environment yang sedekat mungkin dengan Hostinger (Turbopack gagal di GLIBC < 2.29).
- [ ] Jalankan smoke test setelah deployment:

```bash
curl -I https://ppm.nurisba.id
```

- [ ] Periksa halaman utama, login, dashboard, database, checkout, dan webhook.

---

## 12. GitHub dan proses rilis

- [ ] Aktifkan 2FA pada akun GitHub dan akun Hostinger.
- [ ] Lindungi branch produksi.
- [ ] Gunakan pull request untuk perubahan penting.
- [ ] Jangan commit secret atau data produksi.
- [ ] Tinjau perubahan dependency sebelum merge.
- [ ] Gunakan tag atau commit ID untuk setiap rilis.
- [ ] Simpan catatan perubahan.
- [ ] Pastikan rollback dapat dilakukan dengan cepat.
- [ ] Hapus deploy key atau token yang sudah tidak digunakan.
- [ ] Batasi hak akses collaborator repository.

---

## 13. Pemeriksaan setelah online

- [ ] HTTPS aktif dan tidak ada mixed content.
- [ ] Tidak ada halaman debug, directory listing, atau file `.env` yang dapat diakses.
- [ ] Header keamanan terpasang.
- [ ] `npm audit` pada source dan lockfile sudah diperiksa.
- [ ] Semua route privat menolak akses tanpa autentikasi.
- [ ] Webhook Midtrans menerima request valid dan menolak request palsu.
- [ ] Status pembayaran tersimpan satu kali untuk webhook duplikat.
- [ ] Log tidak membocorkan secret.
- [ ] Backup terbaru tersedia dan proses restore sudah pernah diuji.
- [ ] Tidak ada error kritis pada log aplikasi setelah traffic masuk.

---

## Kriteria minimum sebelum produksi

Jangan lanjutkan ke penggunaan publik jika salah satu kondisi ini masih terjadi:

- [ ] Ada kerentanan `high` atau `critical` yang belum dianalisis (termasuk `next` < `16.3.5`).
- [ ] Node.js Hostinger masih `< 24.15` atau build masih memakai Turbopack (`next build` tanpa `--webpack`).
- [ ] Secret masih ada di repository atau frontend bundle.
- [ ] Webhook pembayaran belum memvalidasi signature.
- [ ] Endpoint admin dapat diakses tanpa authorization server-side.
- [ ] HTTPS belum aktif.
- [ ] Tidak ada backup yang bisa dipulihkan.
- [ ] Aplikasi masih menampilkan stack trace atau mode debug.
- [ ] Versi dependency yang diperbaiki belum masuk ke lockfile dan hasil deployment.

---

## Catatan hasil pemeriksaan

- Tanggal pemeriksaan: ____________________
- Commit/deployment ID: ____________________
- Versi Node.js (lokal & Hostinger): ____________________
- Mode build (`--webpack`): ____________________
- Versi `next` / `eslint-config-next`: ____________________
- Versi `sharp`: ____________________
- Versi `js-yaml`: ____________________
- Hasil `npm audit`: ____________________
- Hasil pengujian pembayaran: ____________________
- Backup terakhir: ____________________
- Pemeriksa: ____________________
