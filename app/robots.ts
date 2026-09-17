import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ppm.nurisba.id";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/donor/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
