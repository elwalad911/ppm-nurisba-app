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
import { Button } from "@/components/ui/button";

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

  return (
    <>
      <Navbar />

      <main className="py-12 sm:py-16 lg:py-20">
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
            {/* Left/Main Column: Image & Description */}
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

              {/* Mobile Progress Bar (visible on mobile only) */}
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm lg:hidden">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-primary tabular-nums text-lg">
                      {formatRupiah(campaign.current_amount)}
                    </span>
                    <span className="text-text-secondary tabular-nums">
                      Target {formatRupiah(campaign.target_amount)}
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-success transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>Tercapai {percentage}%</span>
                    <span>Status: Aktif</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Button asChild className="w-full bg-cta hover:bg-cta/90 text-white" size="lg">
                    <Link href={`/donasi/${campaign.slug}/donate`}>
                      Donasi Sekarang
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-lg max-w-none text-text-secondary space-y-6 leading-relaxed">
                <h3 className="text-xl font-bold text-text-primary">
                  Tentang Program
                </h3>
                <p className="whitespace-pre-line">{campaign.description}</p>
              </div>

              {/* Trust Badge */}
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

            {/* Right Column: Sticky Donation Card (Desktop) */}
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
                      className="h-full rounded-full bg-success transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>Tercapai {percentage}%</span>
                    <span className="font-semibold text-success">Aktif</span>
                  </div>
                </div>

                <Button asChild className="w-full bg-cta hover:bg-cta/90 text-white" size="lg">
                  <Link href={`/donasi/${campaign.slug}/donate`}>
                    Donasi Sekarang
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <p className="text-center text-xs text-text-muted">
                  Setiap wakaf menjadi amal jariyah yang terus mengalir manfaatnya.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
