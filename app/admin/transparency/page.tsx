import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteTransparencyReport } from "./actions";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { Plus, Trash2, ArrowDownRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Kelola Transparansi — Admin PPM Nurisba",
};

export const revalidate = 0;

interface ReportItem {
  id: string;
  title: string;
  period_start: string;
  period_end: string;
  published_at: string | null;
  document_url: string | null;
}

interface ExpenseItem {
  id: string;
  transaction_date: string;
  description: string;
  amount: number;
  reference: string | null;
  campaigns?: { title: string };
}

export default async function AdminTransparencyPage() {
  const supabase = await createClient();

  const [
    { data: reports },
    { data: expenses },
  ] = await Promise.all([
    supabase.from("transparency_reports").select("*").order("period_start", { ascending: false }),
    supabase.from("financial_transactions").select("*, campaigns(title)").eq("type", "expense").order("transaction_date", { ascending: false }),
  ]);

  const reportList = (reports || []) as ReportItem[];
  const expenseList = (expenses || []) as unknown as ExpenseItem[];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Kelola Transparansi & Pengeluaran
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Catat pengeluaran proyek dan publikasikan laporan transparansi periodik.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="border-danger text-danger hover:bg-danger-soft">
            <Link href="/admin/transparency/new-expense">
              <ArrowDownRight className="h-4 w-4 mr-2" />
              Catat Pengeluaran
            </Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary-strong text-white">
            <Link href="/admin/transparency/new-report">
              <Plus className="h-4 w-4 mr-2" />
              Buat Laporan
            </Link>
          </Button>
        </div>
      </div>

      {/* Expense Ledger Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-text-primary">
          Catatan Pengeluaran Aktual (Manual Admin)
        </h3>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-primary-soft/50 text-xs font-semibold uppercase text-text-secondary">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Campaign & Keterangan</th>
                <th className="px-6 py-4">Referensi</th>
                <th className="px-6 py-4 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light text-text-primary">
              {expenseList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-text-muted">
                    Belum ada pengeluaran proyek yang dicatat.
                  </td>
                </tr>
              ) : (
                expenseList.map((item) => (
                  <tr key={item.id} className="hover:bg-background/50">
                    <td className="px-6 py-4 text-xs text-text-secondary whitespace-nowrap">
                      {new Date(item.transaction_date).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold">{item.description}</p>
                      <p className="text-xs text-text-muted">{item.campaigns?.title}</p>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-text-secondary">
                      {item.reference || "-"}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-danger tabular-nums whitespace-nowrap">
                      -{formatRupiah(item.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transparency Reports Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-text-primary">
          Laporan Publik & Dokumen PDF
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reportList.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-border bg-surface p-8 text-center text-sm text-text-muted">
              Belum ada laporan transparansi.
            </div>
          ) : (
            reportList.map((r) => {
              const handleDelete = deleteTransparencyReport.bind(null, r.id);
              return (
                <div key={r.id} className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-primary">
                        {r.period_start} s.d. {r.period_end}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          r.published_at ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
                        }`}
                      >
                        {r.published_at ? "Published" : "Draft"}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-text-primary">{r.title}</h4>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border-light flex items-center justify-between">
                    {r.document_url ? (
                      <a
                        href={r.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Lihat Dokumen
                      </a>
                    ) : (
                      <span className="text-xs text-text-muted">Tanpa file PDF</span>
                    )}
                    <form action={handleDelete}>
                      <Button type="submit" variant="destructive" size="sm" className="bg-danger hover:bg-danger/90 text-white">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
