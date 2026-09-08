import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { Image as ImageIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Galeri Foto",
  description:
    "Dokumentasi foto kegiatan, fasilitas, dan lingkungan Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung.",
};

export const revalidate = 60;

export default async function GaleriPage() {
  const supabase = await createClient();

  const { data: galleryItems } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  const items = galleryItems || [];

  return (
    <>
      <Navbar />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-8 pt-[72px] pb-12 md:py-24 space-y-12 md:space-y-24">
        <PageHeader
          title="Galeri Foto"
          description="Dokumentasi visual kegiatan, fasilitas, dan suasana di Pondok Pesantren Modern Nurul Ikhlas."
        />

        <section>
          <Container>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface py-16 text-center">
              <ImageIcon className="h-12 w-12 text-text-muted" />
              <h3 className="mt-4 text-lg font-bold text-text-primary">
                Belum ada foto dalam galeri
              </h3>
              <p className="mt-1 text-sm text-text-secondary max-w-md">
                Dokumentasi foto kegiatan pesantren akan segera ditambahkan di sini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] w-full bg-primary-soft overflow-hidden">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    {item.category && (
                      <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                        {item.category}
                      </span>
                    )}
                    <h3 className="mt-3 text-lg font-bold text-text-primary">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-1 text-sm text-text-secondary">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
      </main>

      <Footer />
    </>
  );
}
