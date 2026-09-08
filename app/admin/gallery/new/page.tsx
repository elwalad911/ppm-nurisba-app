import type { Metadata } from "next";
import Link from "next/link";
import { createGalleryItem } from "../actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

export const metadata: Metadata = {
  title: "Tambah Foto Galeri — Admin PPM Nurisba",
};

export default function NewGalleryPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/gallery">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Tambah Foto Galeri Baru
        </h1>
      </div>

      <form action={createGalleryItem} className="space-y-6 rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Judul / Keterangan Singkat <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="title"
            placeholder="Kegiatan santri..."
            className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            URL Gambar <span className="text-danger">*</span>
          </label>
          <input
            type="url"
            name="image_url"
            placeholder="https://..."
            className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Kategori
          </label>
          <input
            type="text"
            name="category"
            placeholder="Kegiatan / Fasilitas / Asrama"
            className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Deskripsi (Opsional)
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Keterangan tambahan..."
            className="flex w-full rounded-xl border border-border bg-background p-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
          />
        </div>

        <div className="pt-4 border-t border-border-light flex justify-end gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/gallery">Batal</Link>
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary-strong text-white">
            <Save className="h-4 w-4 mr-2" />
            Simpan Foto
          </Button>
        </div>
      </form>
    </div>
  );
}
