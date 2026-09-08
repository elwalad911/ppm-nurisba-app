import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Kelola Events — Admin PPM Nurisba",
};

export const revalidate = 0;

interface EventItem {
  id: string;
  title: string;
  location: string | null;
  start_at: string;
  status: string;
}

export default async function AdminEventsPage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("start_at", { ascending: true });

  const eventList = (events || []) as EventItem[];

  const columns = [
    {
      header: "Judul Agenda",
      accessorKey: (item: EventItem) => (
        <div>
          <Link
            href={`/admin/events/${item.id}`}
            className="font-bold text-text-primary hover:text-primary transition-colors"
          >
            {item.title}
          </Link>
          <p className="text-xs text-text-muted">{item.location || "Lokasi tidak diset"}</p>
        </div>
      ),
    },
    {
      header: "Waktu Mulai",
      accessorKey: (item: EventItem) =>
        new Date(item.start_at).toLocaleString("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
    },
    {
      header: "Status",
      accessorKey: (item: EventItem) => (
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
      header: "Aksi",
      accessorKey: (item: EventItem) => (
        <Button asChild size="sm" variant="outline">
          <Link href={`/admin/events/${item.id}`}>Edit</Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Kelola Agenda & Kegiatan
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Jadwalkan agenda dan kegiatan mendatang di pesantren.
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary-strong text-white">
          <Link href="/admin/events/new">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Agenda
          </Link>
        </Button>
      </div>

      <DataTable
        data={eventList}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Cari judul agenda..."
        emptyMessage="Belum ada agenda yang dijadwalkan."
      />
    </div>
  );
}
