import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/data-table";
import { formatRupiah } from "@/lib/utils";
import { ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Kelola Donations — Admin PPM Nurisba",
};

export const revalidate = 0;

interface DonationItem {
  id: string;
  donor_name: string;
  donor_email: string | null;
  is_anonymous: boolean;
  amount: number;
  payment_method: string;
  status: string;
  campaigns?: { title: string };
  payments?: { order_id: string; payment_type: string }[];
}

export default async function AdminDonationsPage() {
  const supabase = await createClient();

  const { data: donations } = await supabase
    .from("donations")
    .select("*, campaigns(title), payments(order_id, payment_type)")
    .order("created_at", { ascending: false });

  const donationList = (donations || []) as unknown as DonationItem[];

  const columns = [
    {
      header: "Donatur",
      accessorKey: (item: DonationItem) => (
        <div>
          <p className="font-bold text-text-primary">{item.donor_name}</p>
          <p className="text-xs text-text-muted">
            {item.donor_email || "Tanpa email"} {item.is_anonymous && "(Anonim)"}
          </p>
        </div>
      ),
    },
    {
      header: "Campaign",
      accessorKey: (item: DonationItem) => (
        <span className="text-sm font-medium text-text-secondary">
          {item.campaigns?.title || "Campaign"}
        </span>
      ),
    },
    {
      header: "Nominal",
      accessorKey: (item: DonationItem) => (
        <span className="font-bold text-primary tabular-nums">
          {formatRupiah(item.amount)}
        </span>
      ),
    },
    {
      header: "Order ID / Metode",
      accessorKey: (item: DonationItem) => (
        <div>
          <p className="font-mono text-xs text-text-primary">
            {item.payments?.[0]?.order_id || "-"}
          </p>
          <p className="text-xs text-text-muted uppercase">
            {item.payments?.[0]?.payment_type || item.payment_method}
          </p>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: (item: DonationItem) => (
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
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Daftar Donasi (Read-Only)
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Pantau seluruh komitmen dan transaksi donasi yang masuk.
        </p>
      </div>

      {/* Security Note */}
      <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning-soft p-4 text-warning">
        <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold">Kebijakan Keuangan & Integritas:</span> Sesuai
          standar keamanan finansial aplikasi, status donasi dan pembayaran
          bersifat <strong>Read-Only</strong> di panel admin. Status hanya dapat
          diubah secara otomatis oleh sistem melalui verifikasi webhook Midtrans
          terverifikasi untuk mencegah manipulasi data kas.
        </div>
      </div>

      <DataTable
        data={donationList}
        columns={columns}
        searchKey="donor_name"
        searchPlaceholder="Cari nama donatur..."
        emptyMessage="Belum ada transaksi donasi."
      />
    </div>
  );
}
