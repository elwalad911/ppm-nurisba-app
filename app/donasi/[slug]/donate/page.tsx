import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Container } from "@/components/container";
import { DonationFormClient } from "./donation-form-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DonatePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, title, slug, target_amount, current_amount")
    .eq("slug", slug)
    .single();

  if (!campaign) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="py-12 sm:py-16 lg:py-20 bg-background">
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                Formulir Wakaf & Donasi
              </span>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                {campaign.title}
              </h1>
              <p className="mt-2 text-sm text-text-secondary">
                Lengkapi formulir di bawah ini untuk menyalurkan wakaf Anda.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-md">
              <DonationFormClient campaignId={campaign.id} />
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
