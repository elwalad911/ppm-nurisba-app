import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { CalendarDays, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Agenda & Kegiatan",
  description:
    "Jadwal agenda dan kegiatan mendatang di Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung.",
};

export const revalidate = 60;

export default async function AgendaPage() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // Fetch upcoming and past events
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .order("start_at", { ascending: true });

  const eventList = events || [];
  const upcomingEvents = eventList.filter((e) => e.start_at >= now);
  const pastEvents = eventList.filter((e) => e.start_at < now);

  return (
    <>
      <Navbar />

      <PageHeader
        title="Agenda Kegiatan"
        description="Jadwal acara dan kegiatan yang akan datang di Pondok Pesantren Modern Nurul Ikhlas."
      />

      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          {eventList.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface py-16 text-center">
              <CalendarDays className="h-12 w-12 text-text-muted" />
              <h3 className="mt-4 text-lg font-bold text-text-primary">
                Belum ada agenda mendatang
              </h3>
              <p className="mt-1 text-sm text-text-secondary max-w-md">
                Jadwal kegiatan pondok pesantren akan segera diperbarui di sini.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {upcomingEvents.length > 0 && (
                <div>
                  <h3 className="mb-6 text-xl font-bold text-text-primary">
                    Agenda Mendatang
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md"
                      >
                        <div>
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {new Date(event.start_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </div>
                          <h4 className="mt-4 text-xl font-bold text-text-primary">
                            {event.title}
                          </h4>
                          {event.description && (
                            <p className="mt-2 text-sm text-text-secondary line-clamp-3">
                              {event.description}
                            </p>
                          )}
                        </div>
                        <div className="mt-6 pt-4 border-t border-border-light space-y-2 text-xs text-text-secondary">
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary shrink-0" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary shrink-0" />
                            <span>
                              {new Date(event.start_at).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              {" WIB"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pastEvents.length > 0 && (
                <div>
                  <h3 className="mb-6 text-xl font-bold text-text-primary">
                    Agenda Lampau
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 opacity-75">
                    {pastEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-sm"
                      >
                        <div>
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-border px-3 py-1 text-xs font-semibold text-text-secondary">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {new Date(event.start_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </div>
                          <h4 className="mt-4 text-xl font-bold text-text-primary">
                            {event.title}
                          </h4>
                          {event.description && (
                            <p className="mt-2 text-sm text-text-secondary line-clamp-3">
                              {event.description}
                            </p>
                          )}
                        </div>
                        <div className="mt-6 pt-4 border-t border-border-light space-y-2 text-xs text-text-secondary">
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-text-muted shrink-0" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Container>
      </section>

      <Footer />
    </>
  );
}
