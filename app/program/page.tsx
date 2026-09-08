import type { Metadata } from "next";
import { Container } from "@/components/container";
import { SectionHeader } from "@/components/section-header";
import { PageHeader } from "@/components/page-header";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BookOpen, Globe, Languages, BookMarked } from "lucide-react";

export const metadata: Metadata = {
  title: "Program Pendidikan",
  description:
    "Program pendidikan PPM Nurisba: Salafiyah, Khalafiyah, Bahasa, dan Al-Qur'an — memadukan pesantren tradisional dan pendidikan modern.",
};

const programs = [
  {
    icon: BookOpen,
    title: "Salafiyah",
    description:
      "Pendidikan tradisional pesantren yang mencakup kajian kitab kuning, kutubut turats, penguatan aqidah, pendidikan ibadah, dan pembentukan akhlak.",
    items: [
      "Kajian kitab kuning",
      "Kajian kutubut turats",
      "Penguatan aqidah",
      "Pendidikan ibadah",
      "Pembentukan akhlak",
    ],
  },
  {
    icon: Globe,
    title: "Khalafiyah",
    description:
      "Pendidikan modern yang mempersiapkan santri menghadapi tantangan global dengan penguasaan teknologi dan kemampuan akademik.",
    items: [
      "Pembelajaran berbasis teknologi",
      "Penguasaan teknologi informasi",
      "Pendidikan formal",
      "Pengembangan kemampuan akademik",
      "Persiapan menghadapi persaingan global",
    ],
  },
  {
    icon: Languages,
    title: "Bahasa",
    description:
      "Santri diarahkan menggunakan bahasa Arab dan bahasa Inggris sebagai bagian dari interaksi sehari-hari.",
    items: [
      "Bahasa Arab dalam kegiatan sehari-hari",
      "Bahasa Inggris dalam kegiatan sehari-hari",
      "Pembinaan percakapan",
      "Penguasaan kosakata keagamaan",
    ],
  },
  {
    icon: BookMarked,
    title: "Al-Qur'an",
    description:
      "Program pembinaan Al-Qur'an mencakup hafalan, tilawah, dan pengembangan kemampuan membaca Al-Qur'an.",
    items: [
      "Hafalan Al-Qur'an",
      "Tilawah Al-Qur'an",
      "Pembinaan kemampuan membaca Al-Qur'an",
      "Pembinaan akhlak Qur'ani",
    ],
  },
];

export default function ProgramPage() {
  return (
    <>
      <Navbar />

      <PageHeader
        title="Program Pendidikan"
        description="PPM Nurisba memadukan dua pendekatan pendidikan — salafiyah dan khalafiyah — untuk membentuk generasi yang beriman, berilmu, dan berakhlak."
      />

      {/* Program Cards */}
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {programs.map((program) => (
              <div
                key={program.title}
                className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <program.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-text-primary">
                  {program.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {program.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {program.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Pendidikan Formal */}
      <section className="bg-primary-soft py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeader
              title="Pendidikan Formal"
              description="Program prioritas pendidikan PPM Nurisba mencakup jenjang SMP dan SMA dengan pembinaan berbasis asrama."
            />
            <p className="text-base leading-relaxed text-text-secondary">
              Seluruh siswa/siswi diarahkan untuk mendapatkan pembinaan berbasis
              asrama. Pendidikan dikembangkan dengan keberpihakan kepada berbagai
              lapisan masyarakat — ekonomi bawah, menengah, dan atas — sehingga
              pendidikan berkualitas dapat diakses oleh semua kalangan.
            </p>
          </div>
        </Container>
      </section>

      {/* Program Yayasan */}
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <SectionHeader
            title="Program Yayasan"
            description="Yayasan Nurul Ikhlas Soreang Bandung merencanakan sembilan program kegiatan."
          />
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Program Pendidikan Pondok Pesantren Modern Nurul Ikhlas (PPM Nurisba)",
              "Program Pendidikan Formal SMP dan SMA Nurul Ikhlas",
              "Program Pendidikan Madrasah Diniyah Takmiliyah Nurisba",
              "Program Kemakmuran Masjid Jami Pondok Pesantren Nurisba",
              "Program Perekonomian Pondok Pesantren Nurisba",
              "Program Kesehatan Pondok Pesantren Nurisba",
              "Program Sosial Keagamaan Pondok Pesantren Nurisba",
              "Program Kelompok Bimbingan Ibadah Haji (KBIH)",
              "Program Lembaga Bantuan Hukum (LBH) Nurisba",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
                  {index + 1}
                </span>
                <p className="text-sm text-text-secondary">{item}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
