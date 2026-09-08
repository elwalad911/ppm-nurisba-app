import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updatePost, deletePost } from "../actions";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/image-upload";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from("posts").select("title").eq("id", id).single();
  return { title: post ? `Edit ${post.title} — Admin` : "Edit Berita" };
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase.from("posts").select("*").eq("id", id).single();

  if (!post) {
    notFound();
  }

  const handleUpdate = updatePost.bind(null, post.id);
  const handleDelete = deletePost.bind(null, post.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/posts">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Edit Berita</h1>
        </div>

        <form action={handleDelete}>
          <Button type="submit" variant="destructive" size="sm" className="bg-danger hover:bg-danger/90 text-white">
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus
          </Button>
        </form>
      </div>

      <form action={handleUpdate} className="space-y-6 rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Judul Berita <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="title"
            defaultValue={post.title}
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
            defaultValue={post.slug}
            className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-mono text-xs"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">Status</label>
            <select
              name="status"
              defaultValue={post.status}
              className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="draft">Draft</option>
              <option value="published">Published (Publik)</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <ImageUpload
            name="thumbnail_url"
            folder="posts"
            label="URL Thumbnail"
            defaultValue={post.thumbnail_url || ""}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">Ringkasan (Excerpt)</label>
          <textarea
            name="excerpt"
            rows={3}
            defaultValue={post.excerpt || ""}
            className="flex w-full rounded-xl border border-border bg-background p-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">Konten Lengkap</label>
          <textarea
            name="content"
            rows={8}
            defaultValue={post.content || ""}
            className="flex w-full rounded-xl border border-border bg-background p-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
          />
        </div>

        <div className="pt-4 border-t border-border-light flex justify-end gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/posts">Batal</Link>
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary-strong text-white">
            <Save className="h-4 w-4 mr-2" />
            Perbarui Berita
          </Button>
        </div>
      </form>
    </div>
  );
}
