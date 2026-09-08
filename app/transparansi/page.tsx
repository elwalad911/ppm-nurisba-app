import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/utils";
import { FileText, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "Transparansi Pembangunan",
  description:
    "Laporan transparansi dana, pemasukan, dan pengeluaran pembangunan Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung.",
};

export const revalidate = 60;

export default async function TransparencyPage() {
  const supabase = await createClient();

  // Fetch financial transactions and transparency reports in parallel
  const [
    { data: transactions },
    { data: reports },
  ] = await Promise.all([
    supabase
      .from("financial_transactions")
      .select("*, campaigns(title)")
      .order("transaction_date", { ascending: false }),
    supabase
      .from("transparency_reports")
      .select("*")
      .not("published_at", "is", null)
      .order("period_start", { ascending: false }),
  ]);

  const txList = transactions || [];
  const reportList = reports || [];

  const totalIncome = txList
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpense = txList
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const balance = totalIncome - totalExpense;

  const incomeTx = txList.filter((t) => t.type === "income");
  const expenseTx = txList.filter((t) => t.type === "expense");

  return (
    <>
      <Navbar />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-8 pt-[72px] pb-12 md:py-24 space-y-12 md:space-y-24">
        <PageHeader
          title="Transparansi Pembangunan"
          description="Kami berkomitmen menyampaikan informasi pembangunan secara terbuka agar masyarakat dan para donatur dapat mengetahui kebutuhan, penggunaan, serta perkembangan program pembangunan."
        />

        <section>
        <Container>
          {/* Summary Metrics */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-16">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-secondary">
                  Total Pemasukan (Donasi)
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-soft text-success">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-2xl font-bold tabular-nums text-success sm:text-3xl">
                {formatRupiah(totalIncome)}
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Terverifikasi dari sistem pembayaran & donasi
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-secondary">
                  Total Pengeluaran Aktual
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-soft text-danger">
                  <ArrowDownRight className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-2xl font-bold tabular-nums text-danger sm:text-3xl">
                {formatRupiah(totalExpense)}
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Dicatat dari pengeluaran proyek terverifikasi
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-secondary">
                  Saldo Kas Pembangunan
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Wallet className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-2xl font-bold tabular-nums text-primary sm:text-3xl">
                {formatRupiah(balance)}
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Selisih pemasukan dan pengeluaran
              </p>
            </div>
          </div>

          {/* Target & RAB Summary */}
          <div className="mb-16 rounded-2xl border border-border bg-primary-soft p-8">
            <div className="max-w-3xl">
              <h3 className="text-xl font-bold text-text-primary">
                Target & Anggaran Proyek Utama
              </h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                Pembangunan Masjid dan Ruang Kelas/Asrama PPM Nuril Islam memiliki total
                kebutuhan biaya sebesar <strong className="text-text-primary">Rp1.203.800.000</strong>, dengan
                porsi swadaya panitia sebesar <strong className="text-text-primary">Rp758.400.000</strong> dan
                target partisipasi donatur sebesar <strong className="text-text-primary">70%</strong>.
              </p>
            </div>
          </div>

          {/* Income & Expense Tables */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 mb-16">
            {/* Income Table */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-success" />
                Riwayat Pemasukan (Donasi Masuk)
              </h3>
              <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-primary-soft/50 text-xs font-semibold uppercase text-text-secondary">
                    <tr>
                      <th className="px-4 py-3">Tanggal</th>
                      <th className="px-4 py-3">Keterangan</th>
                      <th className="px-4 py-3 text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light text-text-primary">
                    {incomeTx.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-text-muted">
                          Belum ada catatan pemasukan.
                        </td>
                      </tr>
                    ) : (
                      incomeTx.map((t) => (
                        <tr key={t.id}>
                          <td className="px-4 py-3 text-xs text-text-secondary whitespace-nowrap">
                            {new Date(t.transaction_date).toLocaleDateString("id-ID")}
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium">{t.description}</p>
                            <p className="text-xs text-text-muted">{t.campaigns?.title}</p>
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-success tabular-nums whitespace-nowrap">
                            +{formatRupiah(t.amount)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Expense Table */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-danger" />
                Riwayat Pengeluaran Proyek
              </h3>
              <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-primary-soft/50 text-xs font-semibold uppercase text-text-secondary">
                    <tr>
                      <th className="px-4 py-3">Tanggal</th>
                      <th className="px-4 py-3">Keterangan</th>
                      <th className="px-4 py-3 text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light text-text-primary">
                    {expenseTx.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-text-muted">
                          Belum ada catatan pengeluaran aktual.
                        </td>
                      </tr>
                    ) : (
                      expenseTx.map((t) => (
                        <tr key={t.id}>
                          <td className="px-4 py-3 text-xs text-text-secondary whitespace-nowrap">
                            {new Date(t.transaction_date).toLocaleDateString("id-ID")}
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium">{t.description}</p>
                            <p className="text-xs text-text-muted">Ref: {t.reference || "-"}</p>
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-danger tabular-nums whitespace-nowrap">
                            -{formatRupiah(t.amount)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Supporting Documents & Reports */}
          <div>
            <h3 className="text-xl font-bold text-text-primary mb-6">
              Dokumen Laporan Resmi
            </h3>
            {reportList.length === 0 ? (
              <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-text-muted">
                Belum ada dokumen laporan periodik yang dipublikasikan.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {reportList.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-primary font-semibold mb-2">
                        <FileText className="h-4 w-4" />
                        Periode: {r.period_start} s.d. {r.period_end}
                      </div>
                      <h4 className="text-lg font-bold text-text-primary">{r.title}</h4>
                      {r.description && (
                        <p className="mt-2 text-sm text-text-secondary line-clamp-3">
                          {r.description}
                        </p>
                      )}
                    </div>
                    {r.document_url && (
                      <div className="mt-6 pt-4 border-t border-border-light">
                        <a
                          href={r.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                        >
                          Unduh Dokumen PDF
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>
      </main>

      <Footer />
    </>
  );
}
