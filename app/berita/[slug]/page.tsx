import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { sanitizeHtml } from "@/lib/sanitize";
import { Calendar, ArrowLeft, Newspaper } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) {
    return {
      title: "Berita Tidak Ditemukan",
    };
  }

  return {
    title: post.title,
    description: post.excerpt || `Baca artikel ${post.title} di PPM Nurisba.`,
  };
}

export default async function BeritaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="py-12 sm:py-16 lg:py-20">
        <Container>
          <article className="mx-auto max-w-3xl">
            {/* Back link */}
            <div className="mb-8">
              <Link
                href="/berita"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Berita
              </Link>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Calendar className="h-4 w-4 text-primary" />
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : ""}
            </div>

            {/* Title */}
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            {/* Hero Image */}
            <div className="relative mt-8 h-72 sm:h-96 w-full overflow-hidden rounded-2xl bg-primary-soft">
              {post.thumbnail_url ? (
                <Image
                  src={post.thumbnail_url}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-primary/40">
                  <Newspaper className="h-16 w-16" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="prose prose-lg mt-8 max-w-none text-text-secondary space-y-6 leading-relaxed">
              {post.content ? (
                <div
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
                  className="space-y-4"
                />
              ) : (
                <p>{post.excerpt}</p>
              )}
            </div>
          </article>
        </Container>
      </main>

      <Footer />
    </>
  );
}
