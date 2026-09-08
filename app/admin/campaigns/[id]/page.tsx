import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateCampaign, deleteCampaign } from "../actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("title")
    .eq("id", id)
    .single();

  return {
    title: campaign ? `Edit ${campaign.title} — Admin` : "Edit Campaign",
  };
}

export default async function EditCampaignPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .single();

  if (!campaign) {
    notFound();
  }

  const handleUpdate = updateCampaign.bind(null, campaign.id);
  const handleDelete = deleteCampaign.bind(null, campaign.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/campaigns">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Edit Campaign
          </h1>
        </div>

        <form action={handleDelete}>
          <Button
            type="submit"
            variant="destructive"
            size="sm"
            className="bg-danger hover:bg-danger/90 text-white"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus
          </Button>
        </form>
      </div>

      <form action={handleUpdate} className="space-y-6 rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Judul Campaign <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="title"
            defaultValue={campaign.title}
            className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Slug <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="slug"
            defaultValue={campaign.slug}
            className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-mono text-xs"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Kategori
            </label>
            <input
              type="text"
              name="category"
              defaultValue={campaign.category || "Wakaf"}
              className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Target Nominal (Rp) <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              name="target_amount"
              defaultValue={campaign.target_amount}
              className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary tabular-nums"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Status
            </label>
            <select
              name="status"
              defaultValue={campaign.status}
              className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="draft">Draft</option>
              <option value="active">Active (Publik)</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              URL Gambar (Thumbnail)
            </label>
            <input
              type="url"
              name="image_url"
              defaultValue={campaign.image_url || ""}
              className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Deskripsi Lengkap
          </label>
          <textarea
            name="description"
            rows={5}
            defaultValue={campaign.description || ""}
            className="flex w-full rounded-xl border border-border bg-background p-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
          />
        </div>

        <div className="pt-4 border-t border-border-light flex justify-end gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/campaigns">Batal</Link>
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary-strong text-white">
            <Save className="h-4 w-4 mr-2" />
            Perbarui Campaign
          </Button>
        </div>
      </form>
    </div>
  );
}
