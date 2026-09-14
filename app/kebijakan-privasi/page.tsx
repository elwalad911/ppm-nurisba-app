import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi dan perlindungan data pribadi pengguna situs web PPM Nurisba.",
};

export default function KebijakanPrivasiPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-8 pt-[72px] pb-16 md:py-24 space-y-12">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10">
            <PageHeader
              title="Kebijakan Privasi PPM Nurisba"
              description="Terakhir diperbarui: Maret 2026"
            />

            <div className="prose prose-slate max-w-none space-y-8 text-on-surface text-base leading-relaxed">
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">1. Pendahuluan</h2>
                <p className="text-on-surface-variant">
                  Yayasan Nurul Ikhlas Soreang Bandung (&quot;Yayasan&quot;, &quot;kami&quot;) mengelola situs web PPM Nurisba (nurisba.id) sebagai platform informasi Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung dan platform penggalangan dana donasi/wakaf. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda (&quot;Anda&quot;, &quot;pengguna&quot;).
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">2. Data yang Kami Kumpulkan</h2>
                <p className="text-on-surface-variant">
                  Nama, email, nomor telepon (opsional saat donasi), pesan/doa yang Anda tulis, dan riwayat donasi Anda. Jika Anda mendaftar akun donatur, kami menyimpan data akun sesuai yang Anda daftarkan. Untuk pembayaran, data transaksi diproses oleh Midtrans sebagai payment gateway; kami tidak menyimpan data kartu pembayaran Anda di server kami.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">3. Bagaimana Kami Menggunakan Data</h2>
                <p className="text-on-surface-variant">
                  Memproses donasi Anda, memverifikasi transfer manual, mengirimkan konfirmasi/tanda terima donasi, menampilkan riwayat donasi di portal donatur (hanya dapat diakses oleh Anda sendiri), menghubungi Anda bila diperlukan terkait donasi, dan keperluan pelaporan transparansi program (secara agregat/anonim, kecuali Anda memilih untuk tidak anonim).
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">4. Donasi Anonim</h2>
                <p className="text-on-surface-variant">
                  Jika Anda memilih opsi &quot;anonim&quot; saat berdonasi, nama Anda tidak akan ditampilkan secara publik di halaman campaign atau transparansi. Data tersebut tetap tercatat secara internal untuk keperluan audit dan pelaporan keuangan.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">5. Berbagi Data dengan Pihak Ketiga</h2>
                <p className="text-on-surface-variant">
                  Kami membagikan data transaksi yang diperlukan kepada Midtrans untuk memproses pembayaran Anda. Kami tidak menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga lain untuk tujuan pemasaran.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">6. Keamanan Data</h2>
                <p className="text-on-surface-variant">
                  Data Anda disimpan menggunakan Supabase dengan Row Level Security aktif. Akses ke data transaksi keuangan dibatasi hanya untuk sistem yang terverifikasi (webhook payment gateway) dan admin yang berwenang.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">7. Hak Anda</h2>
                <p className="text-on-surface-variant">
                  Anda dapat meminta akses, koreksi, atau penghapusan data pribadi Anda dengan menghubungi kami melalui kontak di bawah, kecuali untuk data yang wajib kami simpan demi kepatuhan hukum atau keperluan audit keuangan (misalnya bukti transaksi donasi).
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">8. Cookies</h2>
                <p className="text-on-surface-variant">
                  Situs ini dapat menggunakan cookies untuk fungsi dasar, misalnya menjaga sesi login pada portal donatur.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">9. Perubahan Kebijakan</h2>
                <p className="text-on-surface-variant">
                  Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Perubahan signifikan akan diinformasikan melalui halaman ini.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">10. Kontak</h2>
                <p className="text-on-surface-variant">
                  Pertanyaan seputar kebijakan privasi ini dapat disampaikan melalui WhatsApp 082262893646 atau email nurulikhlassoreangbandung@gmail.com.
                </p>
              </section>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
