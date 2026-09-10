import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/utils";
import {
  Heart,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
  Calendar,
  MapPin,
  PieChart,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("title, description")
    .eq("slug", slug)
    .single();

  if (!campaign) {
    return { title: "Campaign Tidak Ditemukan" };
  }

  return {
    title: campaign.title,
    description: campaign.description || `Salurkan wakaf untuk ${campaign.title}`,
  };
}

export default async function CampaignDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!campaign) {
    notFound();
  }

  const percentage = Number(campaign.target_amount) > 0
    ? Math.min(
        Math.round(
          (Number(campaign.current_amount) / Number(campaign.target_amount)) * 100
        ),
        100
      )
    : 0;

  const endDate = campaign.end_date ? new Date(campaign.end_date) : null;
  const now = new Date();
  const daysLeft = endDate
    ? Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <>
      <Navbar />

      {/* ===== MOBILE VIEW (Single Column with Overlapping Card & Bottom CTA) ===== */}
      <main className="lg:hidden pt-[72px]">
        {/* Hero Image */}
        <div className="w-full h-72 relative bg-surface-container-high">
          {campaign.image_url ? (
            <Image
              src={campaign.image_url}
              alt={campaign.title}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-primary/20">
              <Heart className="h-16 w-16" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Campaign Info Card (Overlapping) */}
        <div className="px-4 -mt-12 relative z-10">
          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-outline-variant/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1 text-on-surface-variant text-xs font-semibold">
                <span>Program</span>
                <ChevronRight className="h-3.5 w-3.5 text-outline-variant" />
                <span>{campaign.category || "Infrastruktur"}</span>
              </div>
              <span className="bg-primary-soft text-primary text-xs font-bold px-3 py-1 rounded-full">
                {campaign.category || "Wakaf"}
              </span>
            </div>

            <h1 className="text-xl font-bold text-on-surface mb-6 leading-snug">
              {campaign.title}
            </h1>

            {/* Progress Bar & Amounts */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-on-surface-variant mb-0.5 font-medium">Terkumpul</p>
                  <p className="text-xl font-extrabold text-primary">
                    {formatRupiah(campaign.current_amount)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-on-surface-variant mb-0.5 font-medium">Target</p>
                  <p className="text-sm font-semibold text-on-surface">
                    {formatRupiah(campaign.target_amount)}
                  </p>
                </div>
              </div>
              <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-primary">{percentage}% Tercapai</span>
                {daysLeft !== null && (
                  <span className="text-on-surface-variant font-medium">
                    {daysLeft} Hari lagi
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <section className="mt-8 px-4">
          <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4 border-b border-surface-container-high pb-2">
            Cerita Penggalangan Dana
          </h2>
          <div className="text-sm text-text-secondary space-y-4 leading-relaxed font-normal">
            <p className="whitespace-pre-line">{campaign.description}</p>
          </div>
        </section>

        {/* RAB Table Section */}
        <section className="mt-8 px-4">
          <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4 border-b border-surface-container-high pb-2 flex items-center gap-1.5">
            <PieChart className="h-4 w-4 text-primary" />
            Rencana Anggaran Biaya (RAB)
          </h2>
          <div className="bg-white border border-outline-variant/30 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex justify-between items-center border-b border-border pb-2 text-sm">
              <span className="text-text-secondary">Struktur Bangunan &amp; Material</span>
              <span className="font-bold text-on-surface">Rp 650.000.000</span>
            </div>
            <div className="flex justify-between items-center border-b border-border pb-2 text-sm">
              <span className="text-text-secondary">Gedung Asrama &amp; Ruang Kelas</span>
              <span className="font-bold text-on-surface">Rp 403.800.000</span>
            </div>
            <div className="flex justify-between items-center border-b border-border pb-2 text-sm">
              <span className="text-text-secondary">Fasilitas Sanitasi &amp; Utilitas</span>
              <span className="font-bold text-on-surface">Rp 150.000.000</span>
            </div>
            <div className="flex justify-between items-center pt-1 text-sm">
              <span className="font-bold text-primary">Total Target Kebutuhan</span>
              <span className="font-extrabold text-primary text-base">
                {formatRupiah(campaign.target_amount)}
              </span>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="mt-8 px-4">
          <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4 border-b border-surface-container-high pb-2">
            Lokasi Pembangunan
          </h2>
          <div className="bg-white border border-outline-variant/30 rounded-2xl p-4 space-y-2 shadow-xs">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-on-surface">
                  Kp. Nyalindung RT.02 RW.18
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Desa Soreang, Kec. Soreang, Kab. Bandung (Luas Lahan Wakaf 3.885 m²)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badge */}
        <section className="mt-8 px-4">
          <div className="flex items-center gap-4 rounded-2xl border border-primary/20 bg-primary-soft p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-text-primary">
                Penyaluran Terverifikasi
              </h4>
              <p className="text-xs text-text-secondary mt-0.5">
                Dana disalurkan langsung oleh Yayasan Nurul Ikhlas Soreang Bandung.
              </p>
            </div>
          </div>
        </section>

        {/* Spacer for sticky bottom CTA */}
        <div className="h-28" />
      </main>

      {/* ===== DESKTOP VIEW (Two Column Grid with Sticky Sidebar) ===== */}
      <main className="hidden lg:block pt-24 pb-16 min-h-screen bg-background">
        <Container>
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-on-surface-variant text-sm font-semibold">
            <Link href="/" className="hover:text-primary transition-colors">
              Beranda
            </Link>
            <ChevronRight className="h-4 w-4 text-outline-variant" />
            <Link href="/donasi" className="hover:text-primary transition-colors">
              Donasi
            </Link>
            <ChevronRight className="h-4 w-4 text-outline-variant" />
            <span className="text-on-surface font-bold line-clamp-1">
              {campaign.title}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Campaign Image */}
              <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-md bg-surface-container-high relative">
                {campaign.image_url ? (
                  <Image
                    src={campaign.image_url}
                    alt={campaign.title}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-primary/20">
                    <Heart className="h-20 w-20" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md">
                  {campaign.category || "Wakaf"}
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface leading-tight">
                  {campaign.title}
                </h1>
                <div className="flex items-center gap-6 text-on-surface-variant text-sm font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>
                      {endDate
                        ? `Target: ${endDate.toLocaleDateString("id-ID", { month: "short", year: "numeric" })}`
                        : "Program Berkelanjutan"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Soreang, Kab. Bandung</span>
                  </div>
                </div>
              </div>

              <hr className="border-outline-variant/40" />

              {/* Story/Description */}
              <article className="space-y-4 text-base text-text-secondary leading-relaxed font-normal">
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  Cerita Penggalangan Dana
                </h3>
                <p className="whitespace-pre-line leading-relaxed">{campaign.description}</p>
              </article>

              {/* RAB Table Section */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/30 space-y-4">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Transparansi &amp; Rencana Anggaran (RAB)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-outline-variant text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                        <th className="py-3 px-2">Komponen Pembangunan</th>
                        <th className="py-3 px-2 text-right">Estimasi Biaya</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b border-surface-container-high">
                        <td className="py-3 px-2 text-text-secondary">Struktur Bangunan Utama &amp; Masjid</td>
                        <td className="py-3 px-2 text-right font-semibold text-text-primary">Rp 650.000.000</td>
                      </tr>
                      <tr className="border-b border-surface-container-high">
                        <td className="py-3 px-2 text-text-secondary">Gedung Asrama Santri &amp; Ruang Kelas</td>
                        <td className="py-3 px-2 text-right font-semibold text-text-primary">Rp 403.800.000</td>
                      </tr>
                      <tr className="border-b border-surface-container-high">
                        <td className="py-3 px-2 text-text-secondary">Fasilitas Sanitasi &amp; Utilitas Air</td>
                        <td className="py-3 px-2 text-right font-semibold text-text-primary">Rp 150.000.000</td>
                      </tr>
                      <tr className="bg-surface-container-low font-bold">
                        <td className="py-3 px-2 text-on-surface">Total Kebutuhan</td>
                        <td className="py-3 px-2 text-right text-primary text-base">
                          {formatRupiah(campaign.target_amount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Location Box */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/30 space-y-3">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Lokasi Pembangunan Wakaf
                </h3>
                <p className="text-sm text-text-secondary">
                  Kp. Nyalindung RT.02 RW.18 Desa Soreang, Kecamatan Soreang, Kabupaten Bandung 40911 (Aset Wakaf Yayasan Luas 3.885 m²).
                </p>
              </div>
            </div>

            {/* Right Column: Sticky Sidebar Progress Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-outline-variant/20 flex flex-col">
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-on-surface-variant">
                      Terkumpul
                    </span>
                    <div className="text-2xl font-extrabold text-primary mt-1 tabular-nums">
                      {formatRupiah(campaign.current_amount)}
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-xs text-on-surface-variant">
                      dari target{" "}
                      <span className="font-bold text-on-surface">
                        {formatRupiah(campaign.target_amount)}
                      </span>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-surface-container-high rounded-full h-2.5 mb-3 overflow-hidden">
                    <div
                      className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center mb-6 text-xs font-bold text-on-surface-variant">
                    <span className="text-primary">{percentage}% Tercapai</span>
                    <span>Status: Aktif</span>
                  </div>

                  {/* Actions */}
                  <Link
                    href={`/donasi/${campaign.slug}/donate`}
                    className="w-full bg-cta text-text-primary hover:bg-cta-strong transition-all font-bold text-sm py-3.5 rounded-xl shadow-md hover:-translate-y-0.5 active:scale-95 flex justify-center items-center gap-2 mb-3 min-h-[44px]"
                  >
                    <Heart className="h-4 w-4" />
                    Donasi Sekarang
                  </Link>

                  <Link
                    href="/donasi"
                    className="w-full bg-white border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors font-semibold text-xs py-3 rounded-xl flex justify-center items-center gap-2 min-h-[40px]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Program Lainnya
                  </Link>
                </div>

                {/* Trust Badge */}
                <div className="bg-primary-soft rounded-2xl p-5 flex items-start gap-4 border border-primary/20">
                  <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-primary-strong">
                      Amanah &amp; Terverifikasi
                    </h4>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                      Penyaluran dana wakaf dilakukan langsung oleh Yayasan Nurul Ikhlas Soreang Bandung.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      {/* Sticky Bottom CTA (Mobile only) */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/95 backdrop-blur-md border-t border-outline-variant/30 p-4 shadow-[0_-4px_15px_rgba(0,0,0,0.08)] z-50">
        <Link
          href={`/donasi/${campaign.slug}/donate`}
          className="w-full bg-cta text-text-primary text-base font-bold py-3.5 rounded-xl shadow-md hover:bg-cta-strong active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Heart className="h-5 w-5" />
          Donasi Sekarang
        </Link>
      </div>

      <Footer />
    </>
  );
}
