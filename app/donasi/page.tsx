import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { CampaignFilters } from "./campaign-filters";

export const metadata: Metadata = {
  title: "Program Kebaikan — Donasi & Wakaf",
  description:
    "Salurkan infaq, shadaqah, dan wakaf Anda untuk mendukung pendidikan santri dan pembangunan fasilitas PPM Nurisba.",
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

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-16 md:py-24">
        <div className="flex flex-col gap-8 md:gap-10">
          {/* Page Header */}
          <section className="text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Portal Donasi &amp; Wakaf
            </span>
            <h1 className="text-[32px] sm:text-[40px] md:text-[48px] font-extrabold leading-[1.15] tracking-[-0.02em] text-primary mt-1 mb-3">
              Program Kebaikan
            </h1>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Salurkan infaq, shadaqah, dan wakaf Anda untuk mendukung pendidikan santri
              dan percepatan pembangunan Pondok Pesantren Modern Nurul Ikhlas.
            </p>
          </section>

          {/* Filters + Campaign Grid */}
          <CampaignFilters campaigns={campaignList} />
        </div>
      </main>

      <Footer />
    </>
  );
}
