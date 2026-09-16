import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteTransparencyReport, publishTransparencyReport, unpublishTransparencyReport } from "./actions";
import { ConfirmSubmitButton } from "./confirm-submit-button";
import { DocumentManager } from "./document-manager";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { Plus, Trash2, ArrowDownRight, ArrowUpRight, Undo2, Wallet, Pencil, Eye, EyeOff } from "lucide-react";

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
  updated_at: string | null;
}

interface ExpenseItem {
  id: string;
  transaction_date: string;
  description: string;
  amount: number;
  reference: string | null;
  campaigns?: { title: string };
}

interface IncomeItem {
  id: string;
  transaction_date: string | null;
  type: string;
  description: string | null;
  amount: number;
  source: string;
  reference: string | null;
  campaigns?: { title: string };
}

function formatTxDate(value: string | null): string {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID");
}

export default async function AdminTransparencyPage() {
  const supabase = await createClient();

  const [
    { data: reports },
    { data: expenses },
    { data: incomeTx },
  ] = await Promise.all([
    supabase.from("transparency_reports").select("*").order("period_start", { ascending: false }),
    supabase.from("financial_transactions").select("*, campaigns(title)").eq("type", "expense").order("transaction_date", { ascending: false }),
    supabase.from("financial_transactions").select("*, campaigns(title)").in("type", ["income", "refund"]).order("transaction_date", { ascending: false }),
  ]);

  const reportList = (reports || []) as ReportItem[];
  const expenseList = (expenses || []) as unknown as ExpenseItem[];
  const incomeList = (incomeTx || []) as unknown as IncomeItem[];

  const totalIncome = incomeList
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalRefund = incomeList
    .filter((t) => t.type === "refund")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalExpense = expenseList.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const netBalance = totalIncome - totalExpense - totalRefund;

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

      {/* Financial Summary Cards (read-only ledger totals) */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">
              Total Pemasukan
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success-soft text-success">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-lg font-bold tabular-nums text-success break-all">
            {formatRupiah(totalIncome)}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">
            Income terverifikasi
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">
              Total Pengeluaran
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger-soft text-danger">
              <ArrowDownRight className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-lg font-bold tabular-nums text-danger break-all">
            {formatRupiah(totalExpense)}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">
            Expense tercatat admin
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">
              Total Refund
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning-soft text-warning">
              <Undo2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-lg font-bold tabular-nums text-warning break-all">
            {formatRupiah(totalRefund)}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">
            Dana dikembalikan
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">
              Saldo Bersih
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-lg font-bold tabular-nums text-primary break-all">
            {formatRupiah(netBalance)}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">
            Pemasukan − pengeluaran − refund
          </p>
        </div>
      </div>

      {/* Income Ledger Section (read-only — income tercatat otomatis dari donasi terverifikasi) */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-text-primary">
          Riwayat Pemasukan (Otomatis dari Donasi Terverifikasi)
        </h3>
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-primary-soft/50 text-xs font-semibold uppercase text-text-secondary">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Keterangan</th>
                <th className="px-6 py-4">Sumber</th>
                <th className="px-6 py-4">Referensi</th>
                <th className="px-6 py-4 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light text-text-primary">
              {incomeList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-text-muted">
                    Belum ada pemasukan yang tercatat.
                  </td>
                </tr>
              ) : (
                incomeList.map((item) => (
                  <tr key={item.id} className="hover:bg-background/50">
                    <td className="px-6 py-4 text-xs text-text-secondary whitespace-nowrap">
                      {formatTxDate(item.transaction_date)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${
                            item.type === "refund"
                              ? "bg-warning-soft text-warning"
                              : "bg-success-soft text-success"
                          }`}
                        >
                          {item.type === "refund" ? "Refund" : "Income"}
                        </span>
                        <p className="font-bold">{item.description || "-"}</p>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">{item.campaigns?.title}</p>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-text-secondary">
                      {item.source}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-text-secondary">
                      {item.reference || "-"}
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-bold tabular-nums whitespace-nowrap ${
                        item.type === "refund" ? "text-warning" : "text-success"
                      }`}
                    >
                      {item.type === "refund" ? "-" : "+"}
                      {formatRupiah(item.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3">
          {incomeList.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-text-muted">
              Belum ada pemasukan yang tercatat.
            </div>
          ) : (
            incomeList.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        item.type === "refund"
                          ? "bg-warning-soft text-warning"
                          : "bg-success-soft text-success"
                      }`}
                    >
                      {item.type === "refund" ? "Refund" : "Income"}
                    </span>
                    <p className="font-bold text-text-primary line-clamp-1 mt-1.5">{item.description || "-"}</p>
                    <p className="text-xs text-text-muted mt-0.5">{item.campaigns?.title}</p>
                  </div>
                  <p
                    className={`text-sm font-bold tabular-nums shrink-0 ${
                      item.type === "refund" ? "text-warning" : "text-success"
                    }`}
                  >
                    {item.type === "refund" ? "-" : "+"}
                    {formatRupiah(item.amount)}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-text-secondary">
                    {formatTxDate(item.transaction_date)}
                  </p>
                  <p className="font-mono text-xs text-text-muted">{item.source}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Expense Ledger Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-text-primary">
          Catatan Pengeluaran Aktual (Manual Admin)
        </h3>
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
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

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3">
          {expenseList.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-text-muted">
              Belum ada pengeluaran proyek yang dicatat.
            </div>
          ) : (
            expenseList.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-text-primary line-clamp-1">{item.description}</p>
                    <p className="text-xs text-text-muted mt-0.5">{item.campaigns?.title}</p>
                  </div>
                  <p className="text-sm font-bold text-danger tabular-nums shrink-0">
                    -{formatRupiah(item.amount)}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-text-secondary">
                    {new Date(item.transaction_date).toLocaleDateString("id-ID")}
                  </p>
                  {item.reference && (
                    <p className="font-mono text-xs text-text-muted">{item.reference}</p>
                  )}
                </div>
              </div>
            ))
          )}
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
              const handlePublish = publishTransparencyReport.bind(null, r.id);
              const handleUnpublish = unpublishTransparencyReport.bind(null, r.id);
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
                    {r.updated_at && (
                      <p className="mt-1 text-[11px] text-text-muted">
                        Diperbarui {new Date(r.updated_at).toLocaleDateString("id-ID")}
                      </p>
                    )}
                  </div>
                  <DocumentManager reportId={r.id} documentPath={r.document_url} />
                  <div className="mt-6 pt-4 border-t border-border-light flex items-center justify-between gap-2 flex-wrap">
                    {r.document_url ? (
                      <span className="text-xs font-semibold text-success">
                        Dokumen tersedia
                      </span>
                    ) : (
                      <span className="text-xs text-text-muted">Tanpa file PDF</span>
                    )}
                    <div className="flex items-center gap-2">
                      {r.published_at ? (
                        <form action={handleUnpublish}>
                          <ConfirmSubmitButton
                            variant="outline"
                            size="sm"
                            title="Unpublish laporan"
                            confirmMessage={`Sembunyikan "${r.title}" dari halaman publik?`}
                          >
                            <EyeOff className="h-4 w-4" />
                          </ConfirmSubmitButton>
                        </form>
                      ) : (
                        <form action={handlePublish}>
                          <ConfirmSubmitButton
                            variant="outline"
                            size="sm"
                            title="Publish laporan"
                            confirmMessage={`Publikasikan "${r.title}" ke halaman publik?`}
                          >
                            <Eye className="h-4 w-4" />
                          </ConfirmSubmitButton>
                        </form>
                      )}
                      <Button asChild variant="outline" size="sm" title="Edit laporan">
                        <Link href={`/admin/transparency/${r.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <form action={handleDelete}>
                        <Button type="submit" variant="destructive" size="sm" className="bg-danger hover:bg-danger/90 text-white" title="Hapus laporan">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
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
