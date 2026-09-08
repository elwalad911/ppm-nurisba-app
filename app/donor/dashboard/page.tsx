import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heart, History, User, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard Donatur — PPM Nurisba",
};

export const revalidate = 0;

interface DonationItem {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  campaigns?: { title: string; slug: string };
}

export default async function DonorDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch profile and donations for this user
  const [{ data: profile }, { data: donations }] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user.id).single(),
    supabase
      .from("donations")
      .select("*, campaigns(title, slug)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const donationList = (donations || []) as unknown as DonationItem[];
  const successfulDonations = donationList.filter((d) => d.status === "success");
  const totalAmount = successfulDonations.reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Selamat Datang, {profile?.name || "Donatur"}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Terima kasih atas partisipasi dan wakaf Anda untuk kemajuan PPM Nurisba.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-text-secondary">Total Wakaf & Donasi</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Heart className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold tabular-nums text-primary">
            {formatRupiah(totalAmount)}
          </p>
          <p className="mt-1 text-xs text-text-muted">Dari {successfulDonations.length} transaksi sukses</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-text-primary">Aksi Cepat</h3>
            <p className="text-xs text-text-secondary mt-1">Salurkan wakaf dan sedekah baru</p>
          </div>
          <div className="mt-4 flex gap-3">
            <Button asChild className="bg-cta hover:bg-cta/90 text-white">
              <Link href="/donasi">
                Pilih Program
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/donor/donations">Riwayat</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-text-primary">Donasi Terakhir Anda</h3>
          <Link href="/donor/donations" className="text-sm font-semibold text-primary hover:underline">
            Lihat Semua
          </Link>
        </div>

        <div className="divide-y divide-border-light">
          {donationList.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-muted">
              Anda belum memiliki riwayat donasi.
            </p>
          ) : (
            donationList.slice(0, 5).map((d) => (
              <div key={d.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-bold text-text-primary">
                    {d.campaigns?.title || "Wakaf Pembangunan PPM Nurisba"}
                  </p>
                  <p className="text-xs text-text-muted">
                    {new Date(d.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
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
