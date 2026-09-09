import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import {
  HandHeart,
  ArrowRight,
  Verified,
  Newspaper,
  School,
  BookOpen,
  GraduationCap,
  MapPin,
  Phone,
  AlertCircle,
  ChevronRight,
  Building2,
  Scale,
  ShieldCheck,
} from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select(
      "id, title, slug, image_url, current_amount, target_amount, category",
    )
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(4);

  const { data: latestPosts } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, thumbnail_url, published_at, category")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  const posts = latestPosts || [];
  const activeCampaigns = campaigns || [];

  return (
    <>
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative px-4 pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden flex flex-col items-center text-center">
        {/* Decorative Top Glow */}
        <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-primary-soft via-primary-soft/40 to-transparent -z-10 rounded-b-[3rem] opacity-80" />

        {/* Logo Circle Badge */}
        <div className="w-24 h-24 md:w-28 md:h-28 mb-6 rounded-full bg-white shadow-lg p-2 flex items-center justify-center border border-primary-soft hover:scale-105 transition-transform duration-300">
          <Image
            src="/logo-ppm-nurisba.png"
            alt="PPM Nurisba"
            width={122}
            height={122}
            className="object-contain"
          />
        </div>

        {/* Main Heading */}
        <h1 className="text-[32px] sm:text-[40px] md:text-[52px] lg:text-[56px] font-extrabold leading-[1.15] tracking-[-0.02em] text-primary mb-4 max-w-4xl">
          Membangun Generasi Qurani &amp; Berakhlak Mulia
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-on-surface-variant mb-8 max-w-2xl mx-auto leading-relaxed">
          Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung memadukan
          pendidikan salafiyah dan kurikulum modern untuk mencetak generasi
          pemimpin berilmu, bertakwa, dan berdaya saing global.
        </p>

        {/* Action Buttons (Stacked on mobile, row on desktop) */}
        <div className="flex flex-col sm:flex-row w-full max-w-xs sm:max-w-md gap-3 sm:gap-4 justify-center">
          <Link
            href="/donasi"
            className="w-full sm:w-auto px-8 h-12 bg-cta text-white rounded-xl text-sm font-semibold shadow-md active:translate-y-0.5 hover:bg-cta-strong hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <HandHeart className="h-5 w-5" />
            Donasi Sekarang
          </Link>
          <Link
            href="/program"
            className="w-full sm:w-auto px-8 h-12 bg-white sm:bg-transparent border-2 border-primary text-primary rounded-xl text-sm font-semibold active:bg-primary-soft hover:bg-primary-soft transition-colors flex items-center justify-center"
          >
            Lihat Program
          </Link>
        </div>
      </section>

      {/* ===== TRUST / VALUE PROPOSITION SECTION ===== */}
      <section className="py-10 md:py-16 px-4 bg-surface-dim border-y border-outline-variant/30">
        <Container>
          {/* Mobile Single Card / Desktop 4-grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border flex flex-col items-center sm:items-start text-center sm:text-left transition-all hover:shadow-md">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-soft text-primary mb-3">
                <Verified className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-text-primary mb-1">
                Lembaga Resmi
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Legalitas terdaftar resmi di Kemenkumham RI No.
                AHU-0008977.AH.01.04.Tahun 2019.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border flex flex-col items-center sm:items-start text-center sm:text-left transition-all hover:shadow-md">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-soft text-primary mb-3">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-text-primary mb-1">
                Tanah Wakaf 3.885 m²
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Aset wakaf tetap yayasan untuk pembangunan masjid, asrama
                santri, dan ruang kelas.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border flex flex-col items-center sm:items-start text-center sm:text-left transition-all hover:shadow-md">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-soft text-primary mb-3">
                <Scale className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-text-primary mb-1">
                Salafiyah &amp; Khalafiyah
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Kajian kitab kuning turats berpadu kurikulum nasional SMP IT
                &amp; SMA IT.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border flex flex-col items-center sm:items-start text-center sm:text-left transition-all hover:shadow-md">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-soft text-primary mb-3">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-text-primary mb-1">
                Amanah &amp; Transparan
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Laporan keuangan dan progres fisik proyek dapat diakses publik
                secara berkala.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== FEATURED CAMPAIGNS (PROGRAM KEBAIKAN) ===== */}
      <section className="py-12 md:py-20">
        <Container>
          <div className="mb-8 flex justify-between items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cta">
                Donasi &amp; Wakaf
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mt-1">
                Program Kebaikan
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Salurkan amal jariyah Anda untuk pembangunan dan operasional
                santri.
              </p>
            </div>
            {activeCampaigns.length > 0 && (
              <Link
                href="/donasi"
                className="text-sm font-semibold text-cta flex items-center gap-1 hover:text-cta-strong active:opacity-70 transition-colors"
              >
                Lihat Semua
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {activeCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary/30 bg-white py-12 text-center">
              <AlertCircle className="h-10 w-10 text-text-muted" />
              <p className="mt-4 text-sm font-medium text-text-secondary">
                Belum ada program donasi aktif saat ini.
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Program donasi akan segera hadir setelah dibuka oleh admin.
              </p>
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-5 pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible hide-scrollbar">
              {activeCampaigns.map((campaign) => {
                const progress =
                  Number(campaign.target_amount) > 0
                    ? Math.min(
                        Math.round(
                          (Number(campaign.current_amount) /
                            Number(campaign.target_amount)) *
                            100,
                        ),
                        100,
                      )
                    : 0;

                return (
                  <article
                    key={campaign.id}
                    className="snap-start shrink-0 w-[280px] md:w-auto bg-white rounded-2xl shadow-md border border-outline-variant/20 overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="h-40 w-full bg-surface-container-high relative">
                      {campaign.image_url ? (
                        <Image
                          src={campaign.image_url}
                          alt={campaign.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-primary/20">
                          <HandHeart className="h-12 w-12" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-primary text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs">
                        {campaign.category || "Wakaf"}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-sm font-bold text-text-primary mb-3 line-clamp-2 leading-tight">
                        <Link
                          href={`/donasi/${campaign.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {campaign.title}
                        </Link>
                      </h3>

                      <div className="mt-auto space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1.5 font-medium">
                            <span className="text-text-secondary">
                              Terkumpul
                            </span>
                            <span className="font-bold text-primary tabular-nums">
                              Rp{" "}
                              {Number(campaign.current_amount).toLocaleString(
                                "id-ID",
                              )}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[11px] text-on-surface-variant mt-1">
                            <span>
                              Target Rp{" "}
                              {Number(campaign.target_amount).toLocaleString(
                                "id-ID",
                              )}
                            </span>
                            <span className="font-bold text-primary">
                              {progress}%
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/donasi/${campaign.slug}`}
                          className="w-full h-10 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center"
                        >
                          Donasi
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* ===== ABOUT SECTION (BENTO GRID STYLE) ===== */}
      <section className="py-12 md:py-20 px-4 bg-background">
        <Container>
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Profil Pesantren
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mt-1">
              Tentang PPM Nurisba
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: Text Summary */}
            <div className="md:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-bold">
                  <span>Sejarah &amp; Komitmen</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary leading-snug">
                  Mencetak Generasi Berakhlak, Hafal Al-Qur&apos;an, dan Siap
                  Menjawab Tantangan Zaman
                </h3>
                <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                  Berdiri di Soreang, Kabupaten Bandung, Yayasan Nurul Ikhlas
                  berkomitmen menyelenggarakan pendidikan pesantren terpadu yang
                  memadukan kedalaman ilmu agama dan kecakapan teknologi. Kami
                  meyakini bahwa pendidikan terbaik dibangun di atas fondasi
                  iman, takwa, dan akhlakul karimah.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted">
                  Soreang, Bandung &bull; Terdaftar Resmi 2019
                </span>
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-strong transition-colors"
                >
                  Selengkapnya tentang kami
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Bento Card 2: 3.885 m2 Stat Highlight */}
            <div className="bg-primary text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div>
                <span className="text-xs uppercase tracking-wider text-white/80 font-semibold">
                  Tanah Wakaf Pesantren
                </span>
                <p className="text-4xl sm:text-5xl font-extrabold text-white mt-3 tracking-tight">
                  3.885
                  <span className="text-2xl sm:text-3xl font-medium ml-1">
                    m²
                  </span>
                </p>
                <p className="text-sm text-white/90 mt-3 leading-relaxed">
                  Luas tanah wakaf aset yayasan di Kp. Nyalindung Soreang yang
                  sedang dikembangkan untuk masjid dan kompleks asrama santri.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/20">
                <Link
                  href="/donasi"
                  className="inline-flex items-center gap-1 text-xs font-bold text-white hover:underline"
                >
                  Dukung Pembangunan Fisik
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== JENJANG PENDIDIKAN (PROGRAMS) ===== */}
      <section className="py-12 md:py-20 bg-primary-soft border-y border-outline-variant/30">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Kurikulum &amp; Pendidikan
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mt-1">
              Jenjang Pendidikan
            </h2>
            <p className="text-sm text-on-surface-variant mt-2">
              Pendidikan formal berasrama yang mengintegrasikan sains, adab, dan
              tahfizh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* SMP IT */}
            <Link
              href="/program"
              className="bg-white rounded-2xl p-6 shadow-sm border border-border flex items-start gap-4 hover:-translate-y-1 hover:shadow-md active:scale-[0.98] transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-primary flex items-center justify-center shrink-0">
                <School className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-text-primary">
                  SMP IT Nurisba
                </h3>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Pendidikan dasar menengah berbasis penguatan karakter, dasar
                  keislaman, dan kemandirian santri.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-outline-variant shrink-0 mt-1" />
            </Link>

            {/* SMA IT */}
            <Link
              href="/program"
              className="bg-white rounded-2xl p-6 shadow-sm border border-border flex items-start gap-4 hover:-translate-y-1 hover:shadow-md active:scale-[0.98] transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-text-primary">
                  SMA IT Nurisba
                </h3>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Persiapan jenjang perguruan tinggi, kepemimpinan Islam, serta
                  penguasaan teknologi informasi.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-outline-variant shrink-0 mt-1" />
            </Link>

            {/* Tahfizh */}
            <Link
              href="/program"
              className="bg-white rounded-2xl p-6 shadow-sm border border-border flex items-start gap-4 hover:-translate-y-1 hover:shadow-md active:scale-[0.98] transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-cta-soft text-cta flex items-center justify-center shrink-0">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-text-primary">
                  Program Tahfizh Al-Qur&apos;an
                </h3>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Bimbingan hafalan Al-Qur&apos;an bersanad disertai tartil,
                  tahsin, dan pemahaman tafsir amaliyah.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-outline-variant shrink-0 mt-1" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ===== STATS: DAMPAK KEBAIKAN ===== */}
      <section className="py-12 md:py-20 px-4 bg-background">
        <Container>
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-cta">
              Akuntabilitas
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mt-1">
              Dampak Kebaikan
            </h2>
            <p className="text-sm text-on-surface-variant mt-2">
              Setiap donasi dan wakaf dikelola untuk memberikan dampak nyata
              berkelanjutan.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: "450+", label: "Santri Aktif", color: "text-primary" },
              { value: "12K+", label: "Donatur Tergabung", color: "text-cta" },
              {
                value: "50+",
                label: "Pengajar & Musyrif",
                color: "text-primary",
              },
              { value: "100%", label: "Transparansi Dana", color: "text-cta" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-surface-dim rounded-2xl p-6 text-center border border-border flex flex-col items-center justify-center h-36 shadow-xs hover:shadow-sm transition-shadow"
              >
                <span
                  className={`text-[32px] sm:text-[38px] font-extrabold leading-none ${stat.color}`}
                >
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-on-surface-variant mt-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== LATEST NEWS (KABAR TERBARU) ===== */}
      <section className="py-12 md:py-20 bg-surface-dim border-t border-outline-variant/30">
        <Container>
          <div className="mb-8 flex justify-between items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Publikasi
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mt-1">
                Kabar Terbaru
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Informasi dan agenda terkini dari Pondok Pesantren Modern Nurul
                Ikhlas.
              </p>
            </div>
            {posts.length > 0 && (
              <Link
                href="/berita"
                className="hidden sm:inline-flex text-sm font-semibold text-primary hover:text-primary-strong items-center gap-1 transition-colors"
              >
                Lihat Semua Berita
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white py-12 text-center">
              <Newspaper className="h-10 w-10 text-text-muted" />
              <p className="mt-4 text-sm font-medium text-text-secondary">
                Belum ada berita saat ini.
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Berita kegiatan santri dan pesantren akan segera dipublikasikan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/berita/${post.slug}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col"
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
                      <div className="flex h-full items-center justify-center text-primary/30">
                        <Newspaper className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-2">
                      {post.category || "Berita"}
                      {post.published_at
                        ? ` • ${new Date(post.published_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}`
                        : ""}
                    </span>
                    <h3 className="text-base font-bold text-text-primary line-clamp-2 leading-tight mb-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-xs text-text-secondary line-clamp-2 mt-auto">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {posts.length > 0 && (
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/berita"
                className="text-sm font-semibold text-primary border border-primary/30 rounded-xl px-6 py-3 inline-flex items-center gap-2 active:bg-primary-soft transition-colors w-full justify-center"
              >
                Lihat Semua Berita
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* ===== HUBUNGI KAMI (CONTACT) ===== */}
      <section className="py-12 md:py-20 px-4 bg-background">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Kontak &amp; Silaturahmi
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mt-1">
                Hubungi Kami
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Panitia pembangunan dan pengurus pesantren siap melayani
                pertanyaan Anda.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-border p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-primary">
                    Sekretariat &amp; Lokasi Pesantren
                  </h4>
                  <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                    Jl. Bhayangkara Blok N 7 No. 10–12, Soreang, Bandung 40911
                    <br />
                    Lokasi Pembangunan Wakaf: Kp. Nyalindung RT.02 RW.18 Desa
                    Soreang, Kec. Soreang, Kab. Bandung
                  </p>
                </div>
              </div>

              <hr className="border-border" />

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:+6282262893646"
                  className="flex-1 h-12 bg-surface-container-high rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-text-primary hover:bg-surface-container-highest transition-colors"
                >
                  <Phone className="h-5 w-5 text-primary" />
                  Telepon (0822-6289-3646)
                </a>
                <a
                  href="https://wa.me/6282262893646"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 h-12 bg-[#25D366]/10 text-[#075E54] hover:bg-[#25D366]/20 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 shrink-0"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Panitia
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
