import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { History, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "Riwayat Donasi — Portal Donatur",
};

export const revalidate = 0;

interface DonationItem {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  campaigns?: { title: string };
  payments?: { order_id: string }[];
}

export default async function DonorDonationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: donations } = await supabase
    .from("donations")
    .select("*, campaigns(title), payments(order_id)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const donationList = (donations || []) as unknown as DonationItem[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Riwayat Wakaf & Donasi
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Daftar seluruh transaksi dan status pembayaran Anda.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary-soft/50 text-xs font-semibold uppercase text-text-secondary">
            <tr>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Program Campaign</th>
              <th className="px-6 py-4">Nominal</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light text-text-primary">
            {donationList.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                  Anda belum memiliki riwayat transaksi donasi.
                </td>
              </tr>
            ) : (
              donationList.map((item) => (
                <tr key={item.id} className="hover:bg-background/50">
                  <td className="px-6 py-4 text-xs text-text-secondary whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 font-semibold text-text-primary">
                    {item.campaigns?.title || "Wakaf Pembangunan"}
                  </td>
                  <td className="px-6 py-4 font-bold text-primary tabular-nums whitespace-nowrap">
                    {formatRupiah(item.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "success"
                          ? "bg-success-soft text-success"
                          : item.status === "pending"
                          ? "bg-warning-soft text-warning"
                          : "bg-danger-soft text-danger"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/donor/donations/${item.id}`}>
                        <Eye className="h-4 w-4 mr-1.5" />
                        Lihat
                      </Link>
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
