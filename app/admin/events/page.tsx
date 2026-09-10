import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
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

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary-soft/50 text-xs font-semibold uppercase text-text-secondary">
            <tr>
              <th className="px-6 py-4">Judul Agenda</th>
              <th className="px-6 py-4">Waktu Mulai</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light text-text-primary">
            {eventList.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-text-muted">
                  Belum ada agenda yang dijadwalkan.
                </td>
              </tr>
            ) : (
              eventList.map((item) => (
                <tr key={item.id} className="hover:bg-background/50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/events/${item.id}`}
                      className="font-bold text-text-primary hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-text-muted">{item.location || "Lokasi tidak diset"}</p>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {new Date(item.start_at).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
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
                  <td className="px-6 py-4 text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/events/${item.id}`}>Edit</Link>
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
        {eventList.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-text-muted">
            Belum ada agenda yang dijadwalkan.
          </div>
        ) : (
          eventList.map((item) => (
            <div key={item.id} className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/events/${item.id}`}
                    className="font-bold text-text-primary hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-text-muted mt-0.5">
                    {item.location || "Lokasi tidak diset"}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    item.status === "published"
                      ? "bg-success-soft text-success"
                      : item.status === "draft"
                      ? "bg-warning-soft text-warning"
                      : "bg-border text-text-secondary"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-text-secondary">
                  {new Date(item.start_at).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/events/${item.id}`}>Edit</Link>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
