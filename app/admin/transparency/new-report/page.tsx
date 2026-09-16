import type { Metadata } from "next";
import Link from "next/link";
import { createTransparencyReport } from "../actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

export const metadata: Metadata = {
  title: "Buat Laporan — Admin PPM Nurisba",
};

export default async function NewReportPage() {

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
          Buat Laporan Transparansi
        </h1>
      </div>

      <form action={createTransparencyReport} className="space-y-6 rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Judul Laporan <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="title"
            placeholder="Laporan Pengeluaran Q1 2025"
            className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Deskripsi <span className="text-text-muted">(Opsional)</span>
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder="Ringkasan isi laporan..."
            className="flex w-full rounded-xl border border-border bg-background p-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Periode Mulai <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              name="period_start"
              className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Periode Selesai <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              name="period_end"
              className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            URL Dokumen PDF <span className="text-text-muted">(Opsional)</span>
          </label>
          <input
            type="url"
            name="document_url"
            placeholder="https://example.com/laporan.pdf"
            className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-mono text-xs"
          />
        </div>

        <div className="pt-4 border-t border-border-light flex justify-end gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/transparency">Batal</Link>
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary-strong text-white">
            <Save className="h-4 w-4 mr-2" />
            Simpan Laporan
          </Button>
        </div>
      </form>
    </div>
  );
}
