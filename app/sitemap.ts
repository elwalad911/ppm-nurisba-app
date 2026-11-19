import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = site.url;

  // Static routes — semua halaman publik yang BENAR-BENAR ADA di app/ saat ini.
  const staticRoutes = [
    "",
    "/profil",
    "/program",
    "/kegiatan",
    "/kontak",
    "/donasi",
    "/berita",
    "/agenda",
    "/galeri",
    "/transparansi",
    "/kebijakan-privasi",
    "/syarat-ketentuan",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic campaigns — hanya slug dan updated_at, status active, client publik (anon key).
  let campaignRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data: campaigns } = await supabase
      .from("campaigns")
      .select("slug, updated_at")
      .eq("status", "active");
    campaignRoutes = (campaigns || []).map((c) => ({
      url: `${baseUrl}/donasi/${c.slug}`,
      lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));
  } catch {
    // Jika query gagal, sitemap tetap ter-generate dengan halaman statis saja.
  }

  // Dynamic posts — hanya slug dan updated_at, status published.
  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data: posts } = await supabase
      .from("posts")
      .select("slug, updated_at")
      .eq("status", "published");
    postRoutes = (posts || []).map((p) => ({
      url: `${baseUrl}/berita/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Jika query gagal, sitemap tetap ter-generate dengan halaman statis saja.
  }

  return [...staticRoutes, ...campaignRoutes, ...postRoutes];
}
