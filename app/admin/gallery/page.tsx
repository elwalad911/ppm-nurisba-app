import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { deleteGalleryItem } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Kelola Gallery — Admin PPM Nurisba",
};

export const revalidate = 0;

export default async function AdminGalleryPage() {
  const supabase = await createClient();

  const { data: gallery } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  const items = gallery || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Kelola Galeri Foto
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Unggah dan kelola dokumentasi foto kegiatan pesantren.
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary-strong text-white">
          <Link href="/admin/gallery/new">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Foto
          </Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center text-sm text-text-muted">
          Belum ada foto dalam galeri.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const handleDelete = deleteGalleryItem.bind(null, item.id);
            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full bg-primary-soft">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-primary/40">
                        <ImageIcon className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {item.category && (
                      <span className="inline-block rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary mb-2">
                        {item.category}
                      </span>
                    )}
                    <h3 className="font-bold text-text-primary">{item.title}</h3>
                    {item.description && (
                      <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="p-4 pt-0 border-t border-border-light mt-4 flex justify-end">
                  <form action={handleDelete}>
                    <Button
                      type="submit"
                      variant="destructive"
                      size="sm"
                      className="bg-danger hover:bg-danger/90 text-white"
                    >
                      <Trash2 className="h-4 w-4 mr-1.5" />
                      Hapus
                    </Button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
