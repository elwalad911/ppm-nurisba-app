import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { PageHeader } from "@/components/page-header";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Users, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Profil",
  description:
    "Kenali Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung — sejarah, visi, misi, dan program pendidikan yang kami jalankan.",
};

export default function ProfilPage() {
  return (
    <>
      <Navbar />

      {/* Main content with padding for fixed navbar + bottom nav */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-8 pt-[72px] pb-12 md:py-24 space-y-12 md:space-y-24">
        {/* Page Header */}
        <PageHeader
          title="Profil Institusi"
          description="Mengenal lebih dekat visi, misi, dan perjalanan PPM Nurisba dalam membangun generasi yang berakhlak dan transparan."
        />

        {/* Bento Grid — Sejarah & Visi Misi */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature Card — Sejarah (Large) */}
          <div className="md:col-span-2 bg-surface-container-lowest rounded-2xl p-6 shadow-md hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-primary to-transparent z-0" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-2">
                  Sejarah &amp; Legalitas
                </h3>
                <div className="space-y-4 text-sm leading-relaxed text-on-surface-variant">
                  <p>
                    Kemajuan teknologi, perkembangan zaman, serta terbukanya
                    arus informasi memberikan tantangan baru dalam pembentukan
                    mindset dan karakter generasi bangsa.
                  </p>
                  <p>
                    Kemudahan memperoleh informasi tidak selalu memberikan
                    dampak positif. Berbagai persoalan sosial seperti pergaulan
                    bebas, kekerasan, dan kenakalan generasi muda menjadi
                    tantangan yang perlu dihadapi melalui pendidikan yang
                    membangun karakter dan akhlak.
                  </p>
                  <p>
                    Atas dasar tersebut, Yayasan Nurul Ikhlas Soreang Bandung
                    berupaya menghadirkan pendidikan yang memadukan:
                  </p>
                  <p className="text-center text-base font-bold text-primary">
                    Iman + Ilmu + Amal + Akhlak + Teknologi
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Card — Visi Misi (Small) */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md hover:-translate-y-1 transition-transform duration-300 flex flex-col items-center text-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary-soft text-primary flex items-center justify-center mb-4">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">
              Visi &amp; Misi
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Mewujudkan pondok pesantren sebagai sarana untuk mencetak kader
              pemimpin yang beraqidah, berilmu, beramaliyah, dan berakhlaqul
              karimah.
            </p>
          </div>

          {/* Info Card — Verified */}
          <div className="md:col-span-3 bg-primary-soft border border-primary/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="bg-white p-3 rounded-full shadow-sm text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-primary-strong">
                  Lembaga Terverifikasi
                </h4>
                <p className="text-xs text-on-surface-variant">
                  Terdaftar resmi dan diawasi oleh pihak berwenang.
                  AHU-0008977.AH.01.04.Tahun 2019
                </p>
              </div>
            </div>
            <Link
              href="/profil"
              className="px-6 py-2 border-2 border-primary text-primary rounded-xl text-sm font-semibold hover:bg-primary hover:text-white transition-colors duration-200"
            >
              Lihat Sertifikat
            </Link>
          </div>
        </section>

        {/* Misi */}
        <section>
          <SectionHeader title="Misi" centered={false} />
          <div className="space-y-6">
            {[
              {
                title: "Misi 1",
                desc: "Mempersiapkan pemimpin yang berkualitas menuju terbentuknya khaira ummah atau umat terbaik.",
              },
              {
                title: "Misi 2",
                desc: "Mencetak generasi yang profesional dalam melakukan kajian kutubut turats/kitab kuning, memiliki aqidah yang kuat, berwawasan luas, taat beribadah, berakhlaqul karimah, berbadan sehat, dan mampu berdakwah kepada masyarakat.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-surface-container-lowest p-6 shadow-md hover:-translate-y-1 transition-transform duration-300"
              >
                <h3 className="text-lg font-bold text-on-surface">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Mengapa Penting */}
        <section>
          <SectionHeader
            title="Mengapa Pembangunan Ini Penting?"
            description="Perkembangan teknologi dan arus informasi yang semakin terbuka memberikan banyak manfaat, tetapi juga membawa tantangan terhadap pembentukan karakter generasi muda."
            centered={false}
          />
          <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
            Yayasan Nurul Ikhlas Soreang Bandung berupaya memberikan pendidikan
            yang memadukan pendidikan agama dengan pendidikan modern agar
            generasi muda memiliki:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-on-surface-variant">
            {[
              "Aqidah yang kuat",
              "Akhlak yang mulia",
              "Ketaatan dalam beribadah",
              "Wawasan keilmuan yang luas",
              "Kemampuan berdakwah",
              "Kemampuan beradaptasi dengan teknologi",
              "Kemampuan berbahasa Arab dan Inggris",
              "Keseimbangan antara dzikir dan pikir",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Sistem Pendidikan */}
        <section>
          <SectionHeader
            title="Sistem Pendidikan"
            description="PPM Nurisba memadukan dua pendekatan pendidikan untuk membentuk generasi yang seimbang."
          />
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
            {[
              {
                title: "Salafiyah",
                items: [
                  "Kajian kitab kuning",
                  "Kajian kutubut turats",
                  "Penguatan aqidah",
                  "Pendidikan ibadah",
                  "Pembentukan akhlak",
                ],
              },
              {
                title: "Khalafiyah",
                items: [
                  "Pembelajaran berbasis teknologi",
                  "Penguasaan teknologi informasi",
                  "Pendidikan formal",
                  "Pengembangan kemampuan akademik",
                  "Persiapan menghadapi persaingan global",
                ],
              },
            ].map((program) => (
              <div
                key={program.title}
                className="rounded-2xl bg-surface-container-lowest p-6 shadow-md hover:-translate-y-1 transition-transform duration-300"
              >
                <h3 className="text-lg font-bold text-on-surface">
                  {program.title}
                </h3>
                <ul className="mt-3 space-y-1.5">
                  {program.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-on-surface-variant"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/program">
                Lihat Program Lengkap
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Pendidikan Formal */}
        <section>
          <SectionHeader
            title="Pendidikan Formal"
            description="Program prioritas pendidikan PPM Nurisba mencakup jenjang formal."
            centered={false}
          />
          <p className="text-sm leading-relaxed text-on-surface-variant">
            Program prioritas pendidikan PPM Nurisba mencakup jenjang SMP dan
            SMA. Seluruh siswa/siswi diarahkan untuk mendapatkan pembinaan
            berbasis asrama. Pendidikan dikembangkan dengan keberpihakan kepada
            berbagai lapisan masyarakat: ekonomi bawah, menengah, dan atas.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-primary-soft rounded-2xl py-12 md:py-16 px-6 md:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl md:text-[32px] font-bold tracking-tight text-on-surface md:leading-[1.2]">
              Tertarik dengan PPM Nurisba?
            </h2>
            <p className="mt-4 text-base text-on-surface-variant">
              Hubungi kami untuk informasi lebih lanjut mengenai program
              pendidikan dan pendaftaran santri.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild>
                <Link href="/kontak">
                  Hubungi Kami
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <a
                  href="https://wa.me/6282262893646"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
