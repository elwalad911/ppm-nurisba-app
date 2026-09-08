import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { Newspaper, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Berita & Artikel",
  description:
    "Berita, informasi, dan artikel terbaru seputar kegiatan serta perkembangan Pondok Pesantren Modern Nurul Ikhlas Soreang Bandung.",
};

export const revalidate = 60; // ISR cache 60 seconds

export default async function BeritaPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, thumbnail_url, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const articleList = posts || [];
  const featuredPost = articleList.length > 0 ? articleList[0] : null;
  const gridPosts = articleList.length > 1 ? articleList.slice(1) : [];

  return (
    <>
      <Navbar />

      <PageHeader
        title="Berita & Artikel"
        description="Informasi, kegiatan, dan perkembangan terbaru Pondok Pesantren Modern Nurul Ikhlas."
      />

      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          {articleList.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface py-16 text-center">
              <Newspaper className="h-12 w-12 text-text-muted" />
              <h3 className="mt-4 text-lg font-bold text-text-primary">
                Belum ada berita dipublikasikan
              </h3>
              <p className="mt-1 text-sm text-text-secondary max-w-md">
                Berita dan artikel seputar pesantren akan segera hadir di sini. Silakan
                kunjungi kembali secara berkala.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Featured Article */}
              {featuredPost && (
                <div className="grid grid-cols-1 gap-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm lg:grid-cols-2 lg:items-center">
                  <div className="relative h-64 sm:h-80 lg:h-full min-h-[300px] bg-primary-soft">
                    {featuredPost.thumbnail_url ? (
                      <Image
                        src={featuredPost.thumbnail_url}
                        alt={featuredPost.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-primary/40">
                        <Newspaper className="h-16 w-16" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 sm:p-8 lg:p-10">
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <Calendar className="h-4 w-4 text-primary" />
                      {featuredPost.published_at
                        ? new Date(featuredPost.published_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : ""}
                    </div>
                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                      <Link
                        href={`/berita/${featuredPost.slug}`}
                        className="transition-colors hover:text-primary"
                      >
                        {featuredPost.title}
                      </Link>
                    </h2>
                    {featuredPost.excerpt && (
                      <p className="mt-3 text-base text-text-secondary line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                    )}
                    <div className="mt-6">
                      <Button asChild>
                        <Link href={`/berita/${featuredPost.slug}`}>
                          Baca Selengkapnya
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Article Grid */}
              {gridPosts.length > 0 && (
                <div>
                  <h3 className="mb-6 text-xl font-bold text-text-primary">
                    Artikel Lainnya
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {gridPosts.map((post) => (
                      <div
                        key={post.id}
                        className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md"
                      >
                        <div className="relative h-48 w-full bg-primary-soft">
                          {post.thumbnail_url ? (
                            <Image
                              src={post.thumbnail_url}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-primary/40">
                              <Newspaper className="h-10 w-10" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                          <div className="flex items-center gap-2 text-xs text-text-secondary">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            {post.published_at
                              ? new Date(post.published_at).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : ""}
                          </div>
                          <h4 className="mt-2 text-lg font-bold text-text-primary line-clamp-2">
                            <Link
                              href={`/berita/${post.slug}`}
                              className="transition-colors hover:text-primary"
                            >
                              {post.title}
                            </Link>
                          </h4>
                          {post.excerpt && (
                            <p className="mt-2 text-sm text-text-secondary line-clamp-2 flex-1">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="mt-6 pt-4 border-t border-border-light">
                            <Link
                              href={`/berita/${post.slug}`}
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-strong"
                            >
                              Baca selengkapnya
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
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
