import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { CampaignFilters } from "./campaign-filters";

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

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-8 pt-[72px] pb-12 md:py-24">
        <div className="flex flex-col gap-8">
          {/* Page Header */}
          <section className="flex flex-col gap-2">
            <h1 className="text-[36px] md:text-[48px] font-extrabold leading-[1.1] tracking-[-0.02em] text-on-surface">
              Program Kebaikan
            </h1>
            <p className="text-base text-on-surface-variant">
              Mari bersama membangun generasi penerus yang berakhlak mulia.
            </p>
          </section>

          {/* Filters + Campaign List (client component for filtering) */}
          <CampaignFilters campaigns={campaignList} />
        </div>
      </main>

      <Footer />
    </>
  );
}
