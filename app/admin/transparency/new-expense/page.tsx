import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createExpenseTransaction } from "../actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

export const metadata: Metadata = {
  title: "Catat Pengeluaran — Admin PPM Nurisba",
};

export default async function NewExpensePage() {
  const supabase = await createClient();
  const { data: campaigns } = await supabase.from("campaigns").select("id, title");
  const campaignList = campaigns || [];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/transparency">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Catat Pengeluaran Proyek
        </h1>
      </div>

      <form action={createExpenseTransaction} className="space-y-6 rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Pilih Campaign / Program <span className="text-danger">*</span>
          </label>
          <select
            name="campaign_id"
            className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            required
          >
            <option value="">-- Pilih Campaign --</option>
            {campaignList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Jumlah Pengeluaran (Rp) <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              name="amount"
              placeholder="5000000"
              className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary tabular-nums"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Tanggal Transaksi <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              name="transaction_date"
              defaultValue={new Date().toISOString().split("T")[0]}
              className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Nomor Referensi / Kwitansi (Opsional)
          </label>
          <input
            type="text"
            name="reference"
            placeholder="INV-001/REV"
            className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-mono text-xs"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Deskripsi Pengeluaran <span className="text-danger">*</span>
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder="Pembelian material semen dan pasir tahap 1..."
            className="flex w-full rounded-xl border border-border bg-background p-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
            required
          />
        </div>

        <div className="pt-4 border-t border-border-light flex justify-end gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/transparency">Batal</Link>
          </Button>
          <Button type="submit" className="bg-danger hover:bg-danger/90 text-white">
            <Save className="h-4 w-4 mr-2" />
            Simpan Pengeluaran
          </Button>
        </div>
      </form>
    </div>
  );
}
