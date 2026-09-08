import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/admin/stat-card";
import { formatRupiah } from "@/lib/utils";
import { Megaphone, CheckCircle2, Clock, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard — PPM Nurisba",
};

export const revalidate = 0;

interface DonationRecord {
  amount: number;
  status: string;
  created_at: string;
  donor_name: string;
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch metrics in parallel
  const [
    { count: totalCampaigns },
    { count: activeCampaigns },
    { data: donations },
  ] = await Promise.all([
    supabase.from("campaigns").select("*", { count: "exact", head: true }),
    supabase.from("campaigns").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("donations").select("amount, status, created_at, donor_name").order("created_at", { ascending: false }),
  ]);

  const donationList = (donations || []) as DonationRecord[];
  const totalDonationAmount = donationList
    .filter((d) => d.status === "success")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const successfulDonationsCount = donationList.filter((d) => d.status === "success").length;
  const pendingDonationsCount = donationList.filter((d) => d.status === "pending").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Ringkasan statistik dan aktivitas penggalangan dana PPM Nurisba.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Dana Terkumpul"
          value={formatRupiah(totalDonationAmount)}
          description="Dari seluruh donasi sukses"
          icon={DollarSign}
        />
        <StatCard
          title="Campaign Aktif"
          value={activeCampaigns || 0}
          description={`Dari total ${totalCampaigns || 0} campaign`}
          icon={Megaphone}
        />
        <StatCard
          title="Donasi Sukses"
          value={successfulDonationsCount}
          description="Transaksi terverifikasi"
          icon={CheckCircle2}
        />
        <StatCard
          title="Donasi Pending"
          value={pendingDonationsCount}
          description="Menunggu pembayaran / konfirmasi"
          icon={Clock}
        />
      </div>

      {/* Recent Donations Activity */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h3 className="text-lg font-bold text-text-primary mb-4">
          Aktivitas Donasi Terbaru
        </h3>
        <div className="divide-y divide-border-light">
          {donationList.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-muted">
              Belum ada aktivitas donasi.
            </p>
          ) : (
            donationList.slice(0, 5).map((d, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary font-bold">
                    {d.donor_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {d.donor_name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {new Date(d.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary tabular-nums">
                    {formatRupiah(d.amount)}
                  </p>
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      d.status === "success"
                        ? "bg-success-soft text-success"
                        : d.status === "pending"
                        ? "bg-warning-soft text-warning"
                        : "bg-danger-soft text-danger"
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
