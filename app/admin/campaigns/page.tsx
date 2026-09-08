import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Kelola Campaigns — Admin PPM Nurisba",
};

export const revalidate = 0;

interface CampaignItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  current_amount: number;
  target_amount: number;
  status: string;
}

export default async function AdminCampaignsPage() {
  const supabase = await createClient();

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  const campaignList = (campaigns || []) as CampaignItem[];

  const columns = [
    {
      header: "Judul Program",
      accessorKey: (item: CampaignItem) => (
        <div>
          <Link
            href={`/admin/campaigns/${item.id}`}
            className="font-bold text-text-primary hover:text-primary transition-colors"
          >
            {item.title}
          </Link>
          <p className="text-xs text-text-muted">Slug: {item.slug}</p>
        </div>
      ),
    },
    {
      header: "Kategori",
      accessorKey: "category" as keyof CampaignItem,
    },
    {
      header: "Target / Terkumpul",
      accessorKey: (item: CampaignItem) => (
        <div>
          <p className="font-semibold text-text-primary tabular-nums">
            {formatRupiah(item.current_amount)}
          </p>
          <p className="text-xs text-text-muted tabular-nums">
            Target: {formatRupiah(item.target_amount)}
          </p>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: (item: CampaignItem) => (
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
            item.status === "active"
              ? "bg-success-soft text-success"
              : item.status === "draft"
              ? "bg-warning-soft text-warning"
              : "bg-border text-text-secondary"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      header: "Aksi",
      accessorKey: (item: CampaignItem) => (
        <Button asChild size="sm" variant="outline">
          <Link href={`/admin/campaigns/${item.id}`}>Edit</Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Kelola Campaigns
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Buat dan kelola program donasi serta wakaf pembangunan.
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary-strong text-white">
          <Link href="/admin/campaigns/new">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Campaign
          </Link>
        </Button>
      </div>

      <DataTable
        data={campaignList}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Cari judul campaign..."
        emptyMessage="Belum ada campaign yang dibuat."
      />
    </div>
  );
}
