import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nurulikhlas.org";
  const supabase = await createClient();

  // Static routes
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
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic campaigns
  const { data: campaigns } = await supabase.from("campaigns").select("slug, updated_at").eq("status", "active");
  const campaignRoutes = (campaigns || []).map((c) => ({
    url: `${baseUrl}/donasi/${c.slug}`,
    lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  // Dynamic posts
  const { data: posts } = await supabase.from("posts").select("slug, updated_at").eq("status", "published");
  const postRoutes = (posts || []).map((p) => ({
    url: `${baseUrl}/berita/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...campaignRoutes, ...postRoutes];
}
