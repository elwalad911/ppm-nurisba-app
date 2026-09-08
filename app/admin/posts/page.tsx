import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/data-table";
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

  const columns = [
    {
      header: "Judul Berita",
      accessorKey: (item: PostItem) => (
        <div>
          <Link
            href={`/admin/posts/${item.id}`}
            className="font-bold text-text-primary hover:text-primary transition-colors"
          >
            {item.title}
          </Link>
          <p className="text-xs text-text-muted">Slug: {item.slug}</p>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: (item: PostItem) => (
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
      ),
    },
    {
      header: "Tanggal Publikasi",
      accessorKey: (item: PostItem) =>
        item.published_at
          ? new Date(item.published_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "-",
    },
    {
      header: "Aksi",
      accessorKey: (item: PostItem) => (
        <Button asChild size="sm" variant="outline">
          <Link href={`/admin/posts/${item.id}`}>Edit</Link>
        </Button>
      ),
    },
  ];

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

      <DataTable
        data={postList}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Cari judul berita..."
        emptyMessage="Belum ada berita yang dibuat."
      />
    </div>
  );
}
