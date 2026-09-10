import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Kelola Posts — Admin PPM Nurisba",
};

export const revalidate = 0;

interface PostItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  published_at: string | null;
}

export default async function AdminPostsPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  const postList = (posts || []) as PostItem[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Kelola Berita & Artikel
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Publikasikan artikel dan berita kegiatan pesantren.
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary-strong text-white">
          <Link href="/admin/posts/new">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Berita
          </Link>
        </Button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary-soft/50 text-xs font-semibold uppercase text-text-secondary">
            <tr>
              <th className="px-6 py-4">Judul Berita</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Tanggal Publikasi</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light text-text-primary">
            {postList.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-text-muted">
                  Belum ada berita yang dibuat.
                </td>
              </tr>
            ) : (
              postList.map((item) => (
                <tr key={item.id} className="hover:bg-background/50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/posts/${item.id}`}
                      className="font-bold text-text-primary hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-text-muted">Slug: {item.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "published"
                          ? "bg-success-soft text-success"
                          : item.status === "draft"
                          ? "bg-warning-soft text-warning"
                          : "bg-border text-text-secondary"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {item.published_at
                      ? new Date(item.published_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/posts/${item.id}`}>Edit</Link>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {postList.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-text-muted">
            Belum ada berita yang dibuat.
          </div>
        ) : (
          postList.map((item) => (
            <div key={item.id} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/posts/${item.id}`}
                    className="font-bold text-text-primary hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-text-muted mt-0.5">
                    {item.published_at
                      ? new Date(item.published_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Belum dipublikasi"}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      item.status === "published"
                        ? "bg-success-soft text-success"
                        : item.status === "draft"
                        ? "bg-warning-soft text-warning"
                        : "bg-border text-text-secondary"
                    }`}
                  >
                    {item.status}
                  </span>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/posts/${item.id}`}>Edit</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
