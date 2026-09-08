import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { SectionHeader } from "@/components/section-header";
import { PageHeader } from "@/components/page-header";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Profil",
  description:
    "Kenali Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung — sejarah, visi, misi, dan program pendidikan yang kami jalankan.",
};

export default function ProfilPage() {
  return (
    <>
      <Navbar />

      <PageHeader
        title="Profil PPM Nurisba"
        description="Mengenal lebih dekat Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung."
      />

      {/* Sejarah */}
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeader
              title="Latar Belakang"
              description="Yayasan Nurul Ikhlas Soreang Bandung hadir sebagai bagian dari ikhtiar untuk memberikan manfaat kepada umat melalui pendidikan dan dakwah."
              centered={false}
            />
            <div className="space-y-4 text-base leading-relaxed text-text-secondary">
              <p>
                Kemajuan teknologi, perkembangan zaman, serta terbukanya arus
                informasi memberikan tantangan baru dalam pembentukan mindset dan
                karakter generasi bangsa.
              </p>
              <p>
                Kemudahan memperoleh informasi tidak selalu memberikan dampak
                positif. Berbagai persoalan sosial seperti pergaulan bebas,
                kekerasan, dan kenakalan generasi muda menjadi tantangan yang
                perlu dihadapi melalui pendidikan yang membangun karakter dan
                akhlak.
              </p>
              <p>
                Atas dasar tersebut, Yayasan Nurul Ikhlas Soreang Bandung
                berupaya menghadirkan pendidikan yang memadukan:
              </p>
              <p className="text-center text-lg font-bold text-primary">
                Iman + Ilmu + Amal + Akhlak + Teknologi
              </p>
              <p>
                Pondok pesantren dikembangkan sebagai tempat pendidikan yang
                mampu melahirkan generasi dengan aqidah yang kuat, akhlak mulia,
                ketaatan beribadah, wawasan luas, kemampuan berdakwah, serta
                penguasaan teknologi.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Visi */}
      <section className="bg-primary-soft py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeader
              title="Visi"
              centered={false}
            />
            <blockquote className="text-lg italic leading-relaxed text-text-primary sm:text-xl">
              &ldquo;Mewujudkan pondok pesantren sebagai sarana untuk mencetak
              kader pemimpin yang beraqidah, berilmu, beramaliyah, dan
              berakhlaqul karimah.&rdquo;
            </blockquote>
          </div>
        </Container>
      </section>

      {/* Misi */}
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
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

      {/* Nilai / Prinsip Pendidikan */}
      <section className="bg-surface py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeader
              title="Mengapa Pembangunan Ini Penting?"
              description="Perkembangan teknologi dan arus informasi yang semakin terbuka memberikan banyak manfaat, tetapi juga membawa tantangan terhadap pembentukan karakter generasi muda."
              centered={false}
            />
            <p className="mt-4 text-base leading-relaxed text-text-secondary">
              Yayasan Nurul Ikhlas Soreang Bandung berupaya memberikan
              pendidikan yang memadukan pendidikan agama dengan pendidikan modern
              agar generasi muda memiliki:
            </p>
            <ul className="mt-4 space-y-2 text-base text-text-secondary">
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
          </div>
        </Container>
      </section>

      {/* Program Pendidikan Ringkas */}
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
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
                className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-text-primary">
                  {program.title}
                </h3>
                <ul className="mt-3 space-y-1.5">
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
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/program">
                Lihat Program Lengkap
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Pendidikan Formal */}
      <section className="bg-surface py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeader
              title="Pendidikan Formal"
              description="Program prioritas pendidikan PPM Nurisba mencakup jenjang formal."
              centered={false}
            />
            <p className="text-base leading-relaxed text-text-secondary">
              Program prioritas pendidikan PPM Nurisba mencakup jenjang SMP dan
              SMA. Seluruh siswa/siswi diarahkan untuk mendapatkan pembinaan
              berbasis asrama. Pendidikan dikembangkan dengan keberpihakan kepada
              berbagai lapisan masyarakat: ekonomi bawah, menengah, dan atas.
            </p>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-primary-soft py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              Tertarik dengan PPM Nurisba?
            </h2>
            <p className="mt-4 text-base text-text-secondary">
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
        </Container>
      </section>

      <Footer />
    </>
  );
}
