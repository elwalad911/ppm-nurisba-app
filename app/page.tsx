import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { SectionHeader } from "@/components/section-header";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import {
  BookOpen,
  Users,
  GraduationCap,
  Heart,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Newspaper,
  AlertCircle,
} from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // Fetch latest 3 published posts
  const { data: latestPosts } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, thumbnail_url, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  // Fetch upcoming 3 events
  const { data: upcomingEvents } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .gte("start_at", now)
    .order("start_at", { ascending: true })
    .limit(3);

  const posts = latestPosts || [];
  const events = upcomingEvents || [];

  return (
    <>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-br from-primary-soft via-white to-cta-soft pt-[72px] pb-16 sm:pb-24 lg:pb-32">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl xl:text-6xl">
              Membangun Masjid dan Ruang Kelas/Asrama untuk Generasi Berilmu
              dan Berakhlak
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
              Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung sedang
              membangun masjid dan tiga ruang kelas/asrama di atas tanah wakaf
              aset yayasan seluas 3.885 m². Pembangunan ini menjadi bagian dari
              ikhtiar menghadirkan pendidikan pesantren yang memadukan
              nilai-nilai salafiyah dan pendidikan modern untuk membentuk
              generasi yang beriman, berilmu, berakhlak, serta mampu menghadapi
              perkembangan zaman.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/donasi">
                  Wakaf Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/profil">Kenali PPM Nurisba</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== TRUST / INTRODUCTION ===== */}
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: BookOpen,
                title: "Pendidikan Salafiyah & Khalafiyah",
                desc: "Memadukan kajian kitab kuning dan pendidikan modern.",
              },
              {
                icon: Users,
                title: "Yayasan Terdaftar",
                desc: "Legalitas resmi AHU-0008977.AH.01.04.Tahun 2019.",
              },
              {
                icon: GraduationCap,
                title: "Jenjang SMP & SMA",
                desc: "Pendidikan formal berbasis asrama untuk semua lapisan masyarakat.",
              },
              {
                icon: Heart,
                title: "Wakaf Pembangunan",
                desc: "Masjid dan ruang kelas/asrama di atas tanah wakaf 3.885 m².",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== FEATURED CAMPAIGNS (Empty State) ===== */}
      <section className="bg-primary-soft py-16 sm:py-20 lg:py-24">
        <Container>
          <SectionHeader
            title="Program Donasi"
            description="Dukung pembangunan masjid dan ruang kelas/asrama untuk generasi penerus."
          />
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary/30 bg-white py-12 text-center">
            <AlertCircle className="h-10 w-10 text-text-muted" />
            <p className="mt-4 text-sm font-medium text-text-secondary">
              Belum ada program donasi aktif saat ini.
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Program donasi akan tersedia setelah integrasi database.
            </p>
          </div>
        </Container>
      </section>

      {/* ===== ABOUT PONDOK ===== */}
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeader
                title="Tentang PPM Nurisba"
                description="Yayasan Nurul Ikhlas Soreang Bandung hadir sebagai bagian dari ikhtiar untuk memberikan manfaat kepada umat melalui pendidikan dan dakwah."
                centered={false}
              />
              <p className="text-base leading-relaxed text-text-secondary">
                Kemajuan teknologi, perkembangan zaman, serta terbukanya arus
                informasi memberikan tantangan baru dalam pembentukan mindset dan
                karakter generasi bangsa. PPM Nurisba diarahkan untuk menjadi
                lembaga pendidikan yang membentuk generasi masa depan dengan
                landasan iman dan takwa kepada Allah SWT.
              </p>
              <p className="mt-4 text-base font-semibold text-primary">
                Iman + Ilmu + Amal + Akhlak + Teknologi
              </p>
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/profil">
                    Baca Selengkapnya
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center rounded-2xl bg-primary-soft p-8 sm:p-12">
              <div className="text-center">
                <p className="text-5xl font-bold text-primary sm:text-6xl">
                  3.885
                </p>
                <p className="mt-2 text-sm font-medium text-text-secondary">
                  m² tanah wakaf untuk pembangunan
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== PROGRAMS & ACTIVITIES ===== */}
      <section className="bg-surface py-16 sm:py-20 lg:py-24">
        <Container>
          <SectionHeader
            title="Program Pendidikan"
            description="PPM Nurisba memadukan dua pendekatan pendidikan untuk membentuk generasi yang seimbang."
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Salafiyah",
                desc: "Kajian kitab kuning, kutubut turats, penguatan aqidah, pendidikan ibadah, dan pembentukan akhlak.",
              },
              {
                title: "Khalafiyah",
                desc: "Pembelajaran berbasis teknologi, penguasaan TI, pendidikan formal, dan persiapan global.",
              },
              {
                title: "Bahasa",
                desc: "Penggunaan bahasa Arab dan Inggris sebagai bagian dari interaksi sehari-hari santri.",
              },
              {
                title: "Al-Qur'an",
                desc: "Hafalan, tilawah, dan pembinaan kemampuan membaca Al-Qur'an.",
              },
            ].map((program) => (
              <div
                key={program.title}
                className="rounded-2xl border border-border bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-bold text-text-primary">
                  {program.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {program.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== LATEST NEWS (Dynamic / Empty State) ===== */}
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
                Berita Terkini
              </h2>
              <p className="mt-2 text-base text-text-secondary">
                Informasi terbaru seputar kegiatan dan perkembangan PPM Nurisba.
              </p>
            </div>
            {posts.length > 0 && (
              <Button asChild variant="outline" className="hidden sm:inline-flex">
                <Link href="/berita">Semua Berita</Link>
              </Button>
            )}
          </div>

          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface py-12 text-center">
              <Newspaper className="h-10 w-10 text-text-muted" />
              <p className="mt-4 text-sm font-medium text-text-secondary">
                Belum ada berita saat ini.
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Berita akan muncul setelah dipublikasikan oleh admin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative h-48 w-full bg-primary-soft">
                    {post.thumbnail_url ? (
                      <Image
                        src={post.thumbnail_url}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-primary/40">
                        <Newspaper className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="text-xs text-text-secondary">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : ""}
                    </div>
                    <h4 className="mt-2 text-lg font-bold text-text-primary line-clamp-2">
                      <Link
                        href={`/berita/${post.slug}`}
                        className="transition-colors hover:text-primary"
                      >
                        {post.title}
                      </Link>
                    </h4>
                    {post.excerpt && (
                      <p className="mt-2 text-sm text-text-secondary line-clamp-2 flex-1">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-6 pt-4 border-t border-border-light">
                      <Link
                        href={`/berita/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-strong"
                      >
                        Baca selengkapnya
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {posts.length > 0 && (
            <div className="mt-8 text-center sm:hidden">
              <Button asChild variant="outline" className="w-full">
                <Link href="/berita">Semua Berita</Link>
              </Button>
            </div>
          )}
        </Container>
      </section>

      {/* ===== UPCOMING AGENDA (Dynamic / Empty State) ===== */}
      <section className="bg-surface py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
                Agenda Mendatang
              </h2>
              <p className="mt-2 text-base text-text-secondary">
                Kegiatan dan acara yang akan datang di PPM Nurisba.
              </p>
            </div>
            {events.length > 0 && (
              <Button asChild variant="outline" className="hidden sm:inline-flex">
                <Link href="/agenda">Semua Agenda</Link>
              </Button>
            )}
          </div>

          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background py-12 text-center">
              <CalendarDays className="h-10 w-10 text-text-muted" />
              <p className="mt-4 text-sm font-medium text-text-secondary">
                Belum ada agenda mendatang.
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Agenda akan muncul setelah dijadwalkan oleh admin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-background p-6 shadow-sm"
                >
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(event.start_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <h4 className="mt-4 text-xl font-bold text-text-primary">
                      {event.title}
                    </h4>
                    {event.description && (
                      <p className="mt-2 text-sm text-text-secondary line-clamp-3">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-6 pt-4 border-t border-border-light text-xs text-text-secondary">
                    {event.location && <span>📍 {event.location}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
          {events.length > 0 && (
            <div className="mt-8 text-center sm:hidden">
              <Button asChild variant="outline" className="w-full">
                <Link href="/agenda">Semua Agenda</Link>
              </Button>
            </div>
          )}
        </Container>
      </section>

      {/* ===== TRANSPARENCY HIGHLIGHT (Static) ===== */}
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <SectionHeader
            title="Transparansi Pembangunan"
            description="Kami berkomitmen menyampaikan informasi pembangunan secara terbuka."
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                label: "Total Kebutuhan Proyek",
                value: "Rp1.203.800.000",
              },
              {
                label: "Kebutuhan Swadaya Panitia",
                value: "Rp758.400.000",
              },
              {
                label: "Target Partisipasi Donatur",
                value: "70%",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-border bg-surface p-6 text-center shadow-sm"
              >
                <p className="text-sm font-medium text-text-secondary">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-bold tabular-nums text-primary sm:text-3xl">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-text-muted">
            Angka di atas bersifat statis sesuai proposal. Progress donasi aktual
            akan tersedia setelah integrasi database.
          </p>
        </Container>
      </section>

      {/* ===== DONATION CTA ===== */}
      <section className="bg-primary py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Wujudkan Masjid dan Asrama Santri
            </h2>
            <p className="mt-4 text-base text-white/80 sm:text-lg">
              Mari ikut mengambil bagian dalam pembangunan fasilitas pendidikan
              dan ibadah Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung.
              Wakaf dan bantuan yang diberikan dapat menjadi bagian dari ikhtiar
              membangun lingkungan pendidikan bagi generasi yang beraqidah,
              berilmu, beramaliyah, dan berakhlaqul karimah.
            </p>
            <p className="mt-3 text-sm italic text-white/60">
              Semoga menjadi shadaqah jariyah yang terus mengalir manfaatnya.
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="bg-cta text-white hover:bg-cta/90"
              >
                <Link href="/donasi">
                  Wakaf Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="bg-surface py-16 sm:py-20 lg:py-24">
        <Container>
          <SectionHeader
            title="Hubungi Kami"
            description="Silakan menghubungi panitia untuk informasi lebih lanjut."
          />
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center rounded-2xl border border-border bg-background p-6 text-center">
              <Phone className="h-6 w-6 text-primary" />
              <h3 className="mt-3 text-sm font-semibold text-text-primary">
                WhatsApp
              </h3>
              <a
                href="https://wa.me/6282262893646"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-sm text-primary transition-colors hover:underline"
              >
                082262893646
              </a>
            </div>
            <div className="flex flex-col items-center rounded-2xl border border-border bg-background p-6 text-center">
              <Mail className="h-6 w-6 text-primary" />
              <h3 className="mt-3 text-sm font-semibold text-text-primary">
                Email
              </h3>
              <a
                href="mailto:nurulikhlassoreangbandung@gmail.com"
                className="mt-1 text-sm text-primary transition-colors hover:underline"
              >
                nurulikhlassoreangbandung@gmail.com
              </a>
            </div>
            <div className="flex flex-col items-center rounded-2xl border border-border bg-background p-6 text-center">
              <MapPin className="h-6 w-6 text-primary" />
              <h3 className="mt-3 text-sm font-semibold text-text-primary">
                Alamat
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                Jl. Bhayangkara Blok N 7 No. 10–12
                <br />
                Soreang, Bandung 40911
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
