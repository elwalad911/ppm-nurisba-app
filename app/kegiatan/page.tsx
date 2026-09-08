import type { Metadata } from "next";
import { Container } from "@/components/container";
import { SectionHeader } from "@/components/section-header";
import { PageHeader } from "@/components/page-header";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Kegiatan",
  description:
    "Kegiatan dan program pengembangan potensi santri di Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung.",
};

export default function KegiatanPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-8 pt-[72px] pb-12 md:py-24 space-y-12 md:space-y-24">
        <PageHeader
          title="Kegiatan"
          description="Program kegiatan santri di PPM Nurisba yang mendukung pengembangan potensi dan akhlak."
        />

        {/* Kegiatan Description */}
        <section>
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeader
              title="Program Pengembangan Potensi"
              description="Pembangunan masjid dan ruang kelas/asrama diarahkan untuk mendukung tujuan pendidikan pesantren."
              centered={false}
            />
            <div className="space-y-6">
              {[
                {
                  title: "Pembentukan Iman dan Akhlak",
                  desc: "Mewujudkan santri yang istiqamah dalam iman, cerdas dalam berpikir, kuat dalam ibadah, dan berakhlaqul karimah.",
                },
                {
                  title: "Fasilitas Santri",
                  desc: "Menyediakan tempat tinggal santri yang ramah, aman, nyaman, rindang, kondusif, menyejukkan, dan menentramkan hati dan pikiran.",
                },
                {
                  title: "Penguasaan Bahasa",
                  desc: "Membentuk lingkungan pendidikan yang mendorong santri menggunakan bahasa Arab dan bahasa Inggris dalam pergaulan sehari-hari.",
                },
                {
                  title: "Pengembangan Potensi",
                  desc: "Membentuk santri yang terampil dalam dakwah, tilawatil Qur'an, tahfizhul Qur'an, kegiatan ekstrakurikuler, dan pengembangan kemampuan pribadi.",
                },
                {
                  title: "Melahirkan Ulama Intelek",
                  desc: "Membangun lingkungan pendidikan yang dapat melahirkan generasi ulama intelek dengan keseimbangan dzikir dan pikir.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-text-secondary">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Empty State untuk daftar kegiatan spesifik */}
      <section className="bg-surface py-16 sm:py-20 lg:py-24">
        <Container>
          <SectionHeader
            title="Jadwal Kegiatan"
            description="Daftar kegiatan dan agenda santri akan tersedia di sini."
          />
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background py-12 text-center">
            <AlertCircle className="h-10 w-10 text-text-muted" />
            <p className="mt-4 text-sm font-medium text-text-secondary">
              Belum ada jadwal kegiatan saat ini.
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Jadwal kegiatan akan tersedia setelah integrasi database.
            </p>
          </div>
        </Container>
      </section>
      </main>

      <Footer />
    </>
  );
}
