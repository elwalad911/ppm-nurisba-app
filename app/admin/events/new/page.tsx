import type { Metadata } from "next";
import Link from "next/link";
import { createEvent } from "../actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

export const metadata: Metadata = {
  title: "Tambah Agenda — Admin PPM Nurisba",
};

export default function NewEventPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/events">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Tambah Agenda Baru
        </h1>
      </div>

      <form action={createEvent} className="space-y-6 rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Judul Agenda <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="title"
            placeholder="Contoh: Tabligh Akbar & Santunan"
            className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Slug <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="slug"
            placeholder="tabligh-akbar-santunan"
            className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-mono text-xs"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Waktu Mulai <span className="text-danger">*</span>
            </label>
            <input
              type="datetime-local"
              name="start_at"
              className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Lokasi
            </label>
            <input
              type="text"
              name="location"
              placeholder="Masjid PPM Nurisba"
              className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Status
            </label>
            <select
              name="status"
              defaultValue="published"
              className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="draft">Draft</option>
              <option value="published">Published (Publik)</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              URL Gambar
            </label>
            <input
              type="url"
              name="image_url"
              placeholder="https://..."
              className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Deskripsi Agenda
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder="Rincian kegiatan acara..."
            className="flex w-full rounded-xl border border-border bg-background p-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
          />
        </div>

        <div className="pt-4 border-t border-border-light flex justify-end gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/events">Batal</Link>
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary-strong text-white">
            <Save className="h-4 w-4 mr-2" />
            Simpan Agenda
          </Button>
        </div>
      </form>
    </div>
  );
}
