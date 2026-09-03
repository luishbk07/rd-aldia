import { getSiteUrl } from "@/lib/site";

export default function robots() {
  const site = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/admin", "/api/admin/", "/studio", "/studio/"],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
