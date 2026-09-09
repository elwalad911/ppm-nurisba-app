import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/utils";
import { Heart, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";

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

  const percentage = Math.min(
    Math.round(
      (Number(campaign.current_amount) / Number(campaign.target_amount)) * 100
    ),
    100
  );

  const endDate = campaign.end_date
    ? new Date(campaign.end_date)
    : null;
  const now = new Date();
  const daysLeft = endDate
    ? Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <>
      <Navbar />

      {/* Mobile Hero + Overlapping Card */}
      <main className="lg:hidden">
        {/* Hero Image */}
        <div className="w-full h-72 relative">
          {campaign.image_url ? (
            <Image
              src={campaign.image_url}
              alt={campaign.title}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-surface-container-high text-primary/20">
              <Heart className="h-16 w-16" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Campaign Info Card (Overlapping) */}
        <div className="px-4 -mt-12 relative z-10">
          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-surface-container-low">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 text-on-surface-variant text-xs">
                <span>Program</span>
                <span className="text-outline-variant">&rsaquo;</span>
                <span>{campaign.category || "Infrastruktur"}</span>
              </div>
              <span className="bg-primary-container text-primary text-xs font-semibold px-3 py-1 rounded-full">
                {campaign.category || "Wakaf"}
              </span>
            </div>

            <h1 className="text-lg font-bold text-on-surface mb-6 leading-tight">
              {campaign.title}
            </h1>

            {/* Progress */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-on-surface-variant mb-1">Terkumpul</p>
                  <p className="text-lg font-bold text-primary">
                    {formatRupiah(campaign.current_amount)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-on-surface-variant mb-1">Target</p>
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
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-primary">
                  {percentage}% Tercapai
                </span>
                {daysLeft !== null && (
                  <span className="text-xs text-on-surface-variant">
                    {daysLeft} Hari lagi
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <section className="mt-8 px-4">
          <h2 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-4 border-b border-surface-container-high pb-2">
            Cerita Penggalangan Dana
          </h2>
          <div className="text-sm text-text-secondary space-y-4 leading-relaxed">
            <p className="whitespace-pre-line">{campaign.description}</p>
          </div>
        </section>

        {/* Trust Badge */}
        <section className="mt-8 px-4">
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-primary-soft p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-text-primary">
                Penyaluran Terverifikasi
              </h4>
              <p className="text-xs text-text-secondary">
                Dana wakaf dan sedekah disalurkan langsung oleh Yayasan Nurul
                Ikhlas Soreang Bandung.
              </p>
            </div>
          </div>
        </section>

        {/* Spacer for sticky bottom CTA */}
        <div className="h-24" />
      </main>

      {/* Desktop Two-Column Layout */}
      <main className="hidden lg:block py-12 lg:py-20">
        <Container>
          <div className="mb-8">
            <Link
              href="/donasi"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Daftar Program
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <span className="inline-block rounded-full bg-primary-soft px-3.5 py-1 text-xs font-semibold text-primary">
                  {campaign.category || "Wakaf"}
                </span>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                  {campaign.title}
                </h1>
              </div>

              <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-2xl bg-primary-soft">
                {campaign.image_url ? (
                  <Image
                    src={campaign.image_url}
                    alt={campaign.title}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-primary/40">
                    <Heart className="h-16 w-16" />
                  </div>
                )}
              </div>

              <div className="prose prose-lg max-w-none text-text-secondary space-y-6 leading-relaxed">
                <h3 className="text-xl font-bold text-text-primary">
                  Tentang Program
                </h3>
                <p className="whitespace-pre-line">{campaign.description}</p>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-border bg-primary-soft p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary">
                    Penyaluran Terverifikasi
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Dana wakaf dan sedekah disalurkan langsung oleh Yayasan Nurul
                    Ikhlas Soreang Bandung untuk pembangunan fasilitas pesantren.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-border bg-surface p-6 shadow-md space-y-6">
                <h3 className="text-lg font-bold text-text-primary">
                  Donasi Wakaf Pembangunan
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-primary tabular-nums text-xl">
                      {formatRupiah(campaign.current_amount)}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    dari target{" "}
                    <span className="font-semibold text-text-primary">
                      {formatRupiah(campaign.target_amount)}
                    </span>
                  </p>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>Tercapai {percentage}%</span>
                    <span className="font-semibold text-primary">Aktif</span>
                  </div>
                </div>

                <Link
                  href={`/donasi/${campaign.slug}/donate`}
                  className="w-full bg-cta text-white text-sm font-semibold py-3.5 rounded-xl shadow-md hover:bg-cta-strong active:scale-95 transition-all duration-200 min-h-[44px] flex items-center justify-center gap-2"
                >
                  Donasi Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <p className="text-center text-xs text-text-muted">
                  Setiap wakaf menjadi amal jariyah yang terus mengalir manfaatnya.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>

      {/* Sticky Bottom CTA (Mobile only) */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-surface-container-high p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <Link
          href={`/donasi/${campaign.slug}/donate`}
          className="w-full bg-cta text-white text-sm font-semibold py-4 rounded-xl shadow-md hover:-translate-y-1 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Heart className="h-4 w-4" />
          Donasi Sekarang
        </Link>
      </div>

      <Footer />
    </>
  );
}
