import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/utils";
import { Heart, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Program Donasi & Wakaf",
  description:
    "Salurkan wakaf dan sedekah Anda untuk pembangunan masjid dan ruang kelas/asrama Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung.",
};

export const revalidate = 60;

export default async function DonasiPage() {
  const supabase = await createClient();

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const campaignList = campaigns || [];

  return (
    <>
      <Navbar />

      <PageHeader
        title="Program Donasi & Wakaf"
        description="Mari ambil bagian dalam pembangunan fasilitas ibadah dan pendidikan umat."
      />

      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          {campaignList.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface py-16 text-center">
              <AlertCircle className="h-12 w-12 text-text-muted" />
              <h3 className="mt-4 text-lg font-bold text-text-primary">
                Belum ada program donasi aktif saat ini
              </h3>
              <p className="mt-1 text-sm text-text-secondary max-w-md">
                Program wakaf dan pembangunan akan segera dibuka kembali.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {campaignList.map((campaign) => {
                const percentage = Math.min(
                  Math.round(
                    (Number(campaign.current_amount) /
                      Number(campaign.target_amount)) *
                      100
                  ),
                  100
                );

                return (
                  <div
                    key={campaign.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="relative h-56 w-full bg-primary-soft">
                      {campaign.image_url ? (
                        <Image
                          src={campaign.image_url}
                          alt={campaign.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-primary/40">
                          <Heart className="h-16 w-16" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-sm">
                          {campaign.category || "Wakaf"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl font-bold text-text-primary line-clamp-2">
                        <Link
                          href={`/donasi/${campaign.slug}`}
                          className="transition-colors hover:text-primary"
                        >
                          {campaign.title}
                        </Link>
                      </h3>
                      <p className="mt-2 text-sm text-text-secondary line-clamp-3 flex-1">
                        {campaign.description}
                      </p>

                      {/* Progress */}
                      <div className="mt-6 space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-primary tabular-nums">
                            {formatRupiah(campaign.current_amount)}
                          </span>
                          <span className="text-text-secondary tabular-nums">
                            Target {formatRupiah(campaign.target_amount)}
                          </span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-border">
                          <div
                            className="h-full rounded-full bg-success transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="text-right text-xs text-text-secondary">
                          Tercapai{" "}
                          <span className="font-bold text-text-primary">
                            {percentage}%
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-border-light">
                        <Button asChild className="w-full bg-cta hover:bg-cta/90 text-white">
                          <Link href={`/donasi/${campaign.slug}`}>
                            Donasi Sekarang
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      <Footer />
    </>
  );
}
