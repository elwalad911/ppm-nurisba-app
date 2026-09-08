import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, FileText, Printer } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: donation } = await supabase.from("donations").select("id").eq("id", id).single();
  return { title: donation ? `Detail Donasi #${donation.id.slice(0, 8)}` : "Detail Donasi" };
}

export default async function DonorDonationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: donation } = await supabase
    .from("donations")
    .select("*, campaigns(*), payments(*)")
    .eq("id", id)
    .single();

  if (!donation) {
    notFound();
  }

  const campaign = donation.campaigns;
  const payment = donation.payments?.[0];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/donor/donations">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Riwayat
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Detail Transaksi Donasi
        </h1>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-border-light pb-6">
          <div>
            <p className="text-xs text-text-muted">ID Transaksi / Donasi</p>
            <p className="font-mono text-sm font-bold text-text-primary">{donation.id}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              donation.status === "success"
                ? "bg-success-soft text-success"
                : donation.status === "pending"
                ? "bg-warning-soft text-warning"
                : "bg-danger-soft text-danger"
            }`}
          >
            {donation.status.toUpperCase()}
          </span>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between py-2 border-b border-border-light">
            <span className="text-text-secondary">Program Campaign</span>
            <span className="font-bold text-text-primary">{campaign?.title || "Wakaf Pembangunan"}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border-light">
            <span className="text-text-secondary">Nominal Wakaf</span>
            <span className="font-bold text-primary text-lg tabular-nums">{formatRupiah(donation.amount)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border-light">
            <span className="text-text-secondary">Nama Donatur</span>
            <span className="font-medium text-text-primary">{donation.donor_name} {donation.is_anonymous && "(Anonim)"}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border-light">
            <span className="text-text-secondary">Metode Pembayaran</span>
            <span className="font-medium text-text-primary uppercase">{payment?.payment_type || donation.payment_method}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border-light">
            <span className="text-text-secondary">Order ID Gateway</span>
            <span className="font-mono text-xs text-text-primary">{payment?.order_id || "-"}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border-light">
            <span className="text-text-secondary">Tanggal Transaksi</span>
            <span className="text-text-primary">{new Date(donation.created_at).toLocaleString("id-ID")}</span>
          </div>
          {donation.message && (
            <div className="py-2">
              <span className="block text-text-secondary mb-1">Doa / Pesan Kebaikan</span>
              <p className="rounded-xl bg-background p-3 italic text-text-primary">{donation.message}</p>
            </div>
          )}
        </div>

        {donation.status === "success" && (
          <div className="rounded-2xl border border-success/30 bg-success-soft p-6 text-center space-y-3">
            <CheckCircle2 className="mx-auto h-8 w-8 text-success" />
            <h4 className="font-bold text-text-primary">Bukti Wakaf Resmi (Receipt)</h4>
            <p className="text-xs text-text-secondary">
              Wakaf Anda telah diverifikasi dan tercatat resmi dalam ledger keuangan Yayasan Nurul Ikhlas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
