import type { Metadata } from "next";
import Link from "next/link";
import { createPost } from "../actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

export const metadata: Metadata = {
  title: "Tambah Berita — Admin PPM Nurisba",
};

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/posts">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Tambah Berita Baru
        </h1>
      </div>

      <form action={createPost} className="space-y-6 rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Judul Berita <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="title"
            placeholder="Judul artikel atau berita..."
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
            placeholder="judul-berita-url"
            className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-mono text-xs"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Status
            </label>
            <select
              name="status"
              defaultValue="draft"
              className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="draft">Draft</option>
              <option value="published">Published (Publik)</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              URL Thumbnail
            </label>
            <input
              type="url"
              name="thumbnail_url"
              placeholder="https://..."
              className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Ringkasan (Excerpt)
          </label>
          <textarea
            name="excerpt"
            rows={3}
            placeholder="Ringkasan singkat artikel..."
            className="flex w-full rounded-xl border border-border bg-background p-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Konten Lengkap
          </label>
          <textarea
            name="content"
            rows={8}
            placeholder="Tuliskan isi berita lengkap..."
            className="flex w-full rounded-xl border border-border bg-background p-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
          />
        </div>

        <div className="pt-4 border-t border-border-light flex justify-end gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/posts">Batal</Link>
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary-strong text-white">
            <Save className="h-4 w-4 mr-2" />
            Simpan Berita
          </Button>
        </div>
      </form>
    </div>
  );
}
