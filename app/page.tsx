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
} from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("id, title, slug, image_url, current_amount, target_amount")
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

      {/* Hero */}
      <section className="relative px-4 pt-20 pb-12 md:pt-24 md:pb-20 overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary-soft to-transparent -z-10 rounded-b-[3rem] opacity-70" />
        <div className="w-20 h-20 md:w-24 md:h-24 mb-6 rounded-full bg-white shadow-lg p-2 flex items-center justify-center border border-primary-soft">
          <span className="text-xl md:text-2xl font-bold text-primary">PPM</span>
        </div>
        <h1 className="text-[36px] md:text-[48px] font-extrabold leading-[1.1] tracking-[-0.02em] text-primary mb-4">
          Membangun Generasi Qurani
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant mb-8 max-w-sm mx-auto leading-relaxed">
          Lembaga pendidikan Islam modern yang berdedikasi mencetak generasi pemimpin masa depan berakhlak mulia dan berwawasan global.
        </p>
        <div className="flex flex-col w-full max-w-xs gap-4">
          <Link
            href="/donasi"
            className="w-full h-12 bg-cta text-white rounded-xl text-sm font-semibold shadow-md active:translate-y-1 transition-transform flex items-center justify-center gap-2"
          >
            <HandHeart className="h-5 w-5" />
            Donasi Sekarang
          </Link>
          <Link
            href="/program"
            className="w-full h-12 bg-transparent border-2 border-primary text-primary rounded-xl text-sm font-semibold active:bg-primary-soft transition-colors flex items-center justify-center"
          >
            Lihat Program
          </Link>
        </div>
      </section>

      {/* Trust */}
      <section className="py-12 px-4 bg-surface-dim">
        <Container>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-soft text-primary mb-4">
              <Verified className="h-6 w-6" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-text-primary mb-2">
              Lembaga Terpercaya
            </h2>
            <p className="text-sm text-text-secondary max-w-lg mx-auto leading-relaxed">
              PPM Nurisba telah resmi terdaftar dan diawasi, memastikan setiap donasi dan program dijalankan dengan penuh amanah dan transparansi.
            </p>
          </div>
        </Container>
      </section>

      {/* Featured Campaigns */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-primary">
                Program Kebaikan
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Salurkan bantuan Anda hari ini
              </p>
            </div>
            {activeCampaigns.length > 0 && (
              <Link
                href="/donasi"
                className="text-sm font-semibold text-cta flex items-center gap-1 active:opacity-70"
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
                Program donasi akan tersedia setelah integrasi database.
              </p>
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible">
              {activeCampaigns.map((campaign) => {
                const progress =
                  campaign.target_amount > 0
                    ? Math.min(
                        (campaign.current_amount / campaign.target_amount) * 100,
                        100
                      )
                    : 0;
                return (
                  <div
                    key={campaign.id}
                    className="snap-start shrink-0 w-[280px] md:w-auto bg-white rounded-2xl shadow-md border border-border overflow-hidden flex flex-col"
                  >
                    <div className="h-32 w-full bg-surface-container-high relative">
                      {campaign.image_url ? (
                        <Image
                          src={campaign.image_url}
                          alt={campaign.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-primary/20">
                          <HandHeart className="h-10 w-10" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-sm font-semibold text-text-primary mb-2 line-clamp-2 leading-tight">
                        {campaign.title}
                      </h3>
                      <div className="mt-auto">
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-text-secondary">Terkumpul</span>
                            <span className="font-semibold text-primary">
                              Rp {campaign.current_amount.toLocaleString("id-ID")}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-teal-50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        <Link
                          href={`/donasi/${campaign.slug}`}
                          className="w-full h-10 bg-cta/10 text-cta rounded-lg text-sm font-semibold active:bg-cta/20 transition-colors flex items-center justify-center"
                        >
                          Donasi
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* About */}
      <section className="py-12 px-4">
        <Container>
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-6">
            Tentang Kami
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-surface-dim rounded-2xl p-6 border border-border shadow-sm">
              <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                Berdiri sejak 2010, PPM Nurisba berkomitmen memadukan kurikulum nasional dan kepesantrenan. Kami membina santri tidak hanya unggul dalam akademik, tetapi juga memiliki hafalan Al-Quran dan akhlakul karimah.
              </p>
              <Link
                href="/profil"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
              >
                Selengkapnya tentang sejarah
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Programs */}
      <section className="py-12 md:py-16 bg-primary-soft">
        <Container>
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-6 text-center md:text-left">
            Jenjang Pendidikan
          </h2>
          <div className="flex flex-col gap-3">
            <Link
              href="/program"
              className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-transform"
            >
              <div className="w-12 h-12 rounded-lg bg-teal-50 text-primary flex items-center justify-center shrink-0">
                <School className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-text-primary">
                  SMP IT Nurisba
                </h3>
                <p className="text-xs text-text-secondary mt-1 line-clamp-1">
                  Pendidikan dasar menengah berbasis karakter.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-outline-variant" />
            </Link>
            <Link
              href="/program"
              className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-transform"
            >
              <div className="w-12 h-12 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-text-primary">
                  SMA IT Nurisba
                </h3>
                <p className="text-xs text-text-secondary mt-1 line-clamp-1">
                  Persiapan perguruan tinggi &amp; kepemimpinan.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-outline-variant" />
            </Link>
            <Link
              href="/program"
              className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-transform"
            >
              <div className="w-12 h-12 rounded-lg bg-cta-soft text-cta flex items-center justify-center shrink-0">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-text-primary">
                  Program Tahfizh
                </h3>
                <p className="text-xs text-text-secondary mt-1 line-clamp-1">
                  Hafalan Al-Quran bersanad.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-outline-variant" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-12 px-4">
        <Container>
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-6 text-center">
            Dampak Kebaikan
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "450+", label: "Santri Aktif", color: "text-primary" },
              { value: "12K", label: "Donatur Tergabung", color: "text-cta" },
              { value: "50+", label: "Pengajar Ahli", color: "text-primary" },
              { value: "100%", label: "Transparansi Dana", color: "text-cta" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-surface-dim rounded-xl p-4 text-center border border-border flex flex-col items-center justify-center h-32 shadow-sm"
              >
                <span className={`text-[32px] font-extrabold leading-none ${stat.color}`}>
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-on-surface-variant mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Latest News */}
      <section className="py-12 md:py-16 bg-surface-dim">
        <Container>
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-primary">
              Kabar Terbaru
            </h2>
          </div>

          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white py-12 text-center">
              <Newspaper className="h-10 w-10 text-text-muted" />
              <p className="mt-4 text-sm font-medium text-text-secondary">
                Belum ada berita saat ini.
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Berita akan muncul setelah dipublikasikan oleh admin.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/berita/${post.slug}`}
                  className="bg-white rounded-xl p-3 shadow-sm flex gap-4 active:bg-surface-container-lowest transition-colors border border-border"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-primary-soft shrink-0">
                    {post.thumbnail_url ? (
                      <Image
                        src={post.thumbnail_url}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-primary/30">
                        <Newspaper className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-1">
                      {post.category || "Berita"}{" "}
                      {post.published_at
                        ? `• ${new Date(post.published_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}`
                        : ""}
                    </span>
                    <h4 className="text-sm font-semibold text-text-primary line-clamp-2 leading-tight">
                      {post.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {posts.length > 0 && (
            <div className="mt-6 text-center">
              <Link
                href="/berita"
                className="text-sm font-semibold text-primary border border-primary/30 rounded-xl px-6 py-3 inline-flex items-center gap-2 active:bg-primary-soft transition-colors"
              >
                Lihat Semua Berita
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* Contact */}
      <section className="py-12 px-4">
        <Container>
          <h2 className="text-xl md:text-2xl font-bold text-primary mb-6">
            Hubungi Kami
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-border p-6 flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-text-primary">
                  Alamat Pesantren
                </h4>
                <p className="text-sm text-text-secondary mt-1">
                  Jl. Bhayangkara Blok N 7 No. 10–12, Soreang, Bandung 40911
                </p>
              </div>
            </div>
            <hr className="border-border" />
            <div className="flex gap-4">
              <a
                href="tel:+6282262893646"
                className="flex-1 h-12 bg-surface-container-high rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-text-primary active:bg-surface-container-highest transition-colors"
              >
                <Phone className="h-5 w-5" />
                Telepon
              </a>
              <a
                href="https://wa.me/6282262893646"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-12 bg-[#25D366]/10 text-[#075E54] rounded-xl flex items-center justify-center gap-2 text-sm font-semibold active:bg-[#25D366]/20 transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
