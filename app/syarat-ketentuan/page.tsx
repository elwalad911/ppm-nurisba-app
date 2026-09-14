import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: "Syarat dan ketentuan penggunaan situs web dan layanan donasi PPM Nurisba.",
};

export default function SyaratKetentuanPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-8 pt-[72px] pb-16 md:py-24 space-y-12">
        <Container>
          <div className="max-w-3xl mx-auto space-y-10">
            <PageHeader
              title="Syarat & Ketentuan PPM Nurisba"
              description="Terakhir diperbarui: Maret 2026"
            />

            <div className="prose prose-slate max-w-none space-y-8 text-on-surface text-base leading-relaxed">
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">1. Penerimaan Ketentuan</h2>
                <p className="text-on-surface-variant">
                  Dengan mengakses dan menggunakan situs PPM Nurisba (nurisba.id), Anda menyetujui syarat dan ketentuan berikut.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">2. Sifat Layanan</h2>
                <p className="text-on-surface-variant">
                  Situs ini adalah platform informasi resmi Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung (PPM Nurisba) di bawah Yayasan Nurul Ikhlas Soreang Bandung, termasuk fasilitas penggalangan dana donasi/wakaf untuk program pembangunan dan operasional pesantren. Situs ini bukan platform jual-beli barang atau jasa komersial.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">3. Donasi</h2>
                <p className="text-on-surface-variant">
                  Donasi yang diberikan melalui situs bersifat sukarela dan digunakan sesuai program yang dipilih donatur. Nominal donasi ditentukan sepenuhnya oleh donatur. Donasi yang telah berhasil diproses (status &quot;success&quot;) bersifat final dan tidak dapat dibatalkan atau dikembalikan, kecuali terjadi kesalahan teknis pada sistem pembayaran yang dapat dibuktikan.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">4. Metode Pembayaran</h2>
                <p className="text-on-surface-variant">
                  Pembayaran donasi diproses melalui payment gateway pihak ketiga (Midtrans) yang mendukung QRIS, e-wallet, dan virtual account/transfer bank, atau melalui transfer manual ke rekening resmi yayasan yang tercantum di situs. Status donasi manual baru dinyatakan &quot;success&quot; setelah bukti transfer diverifikasi oleh panitia/admin — bukan berdasarkan klaim sepihak dari donatur.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">5. Keakuratan Informasi</h2>
                <p className="text-on-surface-variant">
                  Kami berupaya menjaga keakuratan informasi program, target dana, dan progres pembangunan yang ditampilkan berdasarkan data resmi yayasan/panitia. Kami berhak melakukan koreksi data tanpa pemberitahuan sebelumnya bila ditemukan ketidaksesuaian.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">6. Akun Donatur</h2>
                <p className="text-on-surface-variant">
                  Jika Anda mendaftar akun donor portal, Anda bertanggung jawab menjaga kerahasiaan kredensial akun dan seluruh aktivitas yang terjadi melalui akun tersebut.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">7. Hak Kekayaan Intelektual</h2>
                <p className="text-on-surface-variant">
                  Seluruh konten situs (teks, logo, gambar) adalah milik Yayasan Nurul Ikhlas Soreang Bandung kecuali dinyatakan lain, dan tidak boleh digunakan atau disalin tanpa izin tertulis.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">8. Batasan Tanggung Jawab</h2>
                <p className="text-on-surface-variant">
                  Yayasan tidak bertanggung jawab atas kerugian tidak langsung yang timbul dari penggunaan situs, termasuk gangguan teknis pada penyedia pembayaran pihak ketiga.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">9. Perubahan Ketentuan</h2>
                <p className="text-on-surface-variant">
                  Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Versi terbaru akan selalu tersedia di halaman ini.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">10. Hukum yang Berlaku</h2>
                <p className="text-on-surface-variant">
                  Syarat dan ketentuan ini tunduk pada hukum yang berlaku di Republik Indonesia.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-bold text-primary">11. Kontak</h2>
                <p className="text-on-surface-variant">
                  Pertanyaan terkait syarat dan ketentuan ini dapat disampaikan melalui WhatsApp 082262893646 atau email nurulikhlassoreangbandung@gmail.com.
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
