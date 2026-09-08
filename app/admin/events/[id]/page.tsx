import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateEvent, deleteEvent } from "../actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase.from("events").select("title").eq("id", id).single();
  return { title: event ? `Edit ${event.title} — Admin` : "Edit Agenda" };
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase.from("events").select("*").eq("id", id).single();

  if (!event) {
    notFound();
  }

  const handleUpdate = updateEvent.bind(null, event.id);
  const handleDelete = deleteEvent.bind(null, event.id);

  // Format start_at for datetime-local input (YYYY-MM-DDTHH:mm)
  const formatForDatetimeLocal = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toISOString().slice(0, 16);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Edit Agenda</h1>
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
            Judul Agenda <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="title"
            defaultValue={event.title}
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
            defaultValue={event.slug}
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
              defaultValue={formatForDatetimeLocal(event.start_at)}
              className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">Lokasi</label>
            <input
              type="text"
              name="location"
              defaultValue={event.location || ""}
              className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">Status</label>
            <select
              name="status"
              defaultValue={event.status}
              className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="draft">Draft</option>
              <option value="published">Published (Publik)</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">URL Gambar</label>
            <input
              type="url"
              name="image_url"
              defaultValue={event.image_url || ""}
              className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">Deskripsi Agenda</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={event.description || ""}
            className="flex w-full rounded-xl border border-border bg-background p-4 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
          />
        </div>

        <div className="pt-4 border-t border-border-light flex justify-end gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/events">Batal</Link>
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary-strong text-white">
            <Save className="h-4 w-4 mr-2" />
            Perbarui Agenda
          </Button>
        </div>
      </form>
    </div>
  );
}
