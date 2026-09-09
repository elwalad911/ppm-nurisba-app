import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DonationFormClient } from "./donation-form-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DonatePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, title, slug, target_amount, current_amount, image_url, category, description")
    .eq("slug", slug)
    .single();

  if (!campaign) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="w-full max-w-md mx-auto px-4 pt-4 pb-8 flex flex-col gap-6">
          <DonationFormClient
            campaignId={campaign.id}
            campaignTitle={campaign.title}
            campaignCategory={campaign.category}
            campaignImageUrl={campaign.image_url}
            campaignDescription={campaign.description}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
