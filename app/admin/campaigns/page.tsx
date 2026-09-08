import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
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

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary-soft/50 text-xs font-semibold uppercase text-text-secondary">
            <tr>
              <th className="px-6 py-4">Judul Program</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Target / Terkumpul</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light text-text-primary">
            {campaignList.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                  Belum ada campaign yang dibuat.
                </td>
              </tr>
            ) : (
              campaignList.map((item) => (
                <tr key={item.id} className="hover:bg-background/50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/campaigns/${item.id}`}
                      className="font-bold text-text-primary hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-text-muted">Slug: {item.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{item.category}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-text-primary tabular-nums">
                      {formatRupiah(item.current_amount)}
                    </p>
                    <p className="text-xs text-text-muted tabular-nums">
                      Target: {formatRupiah(item.target_amount)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
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
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/campaigns/${item.id}`}>Edit</Link>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
