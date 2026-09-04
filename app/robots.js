import { getSiteUrl } from "@/lib/site";

/** Serves /robots.txt. Static app/robots.txt would clash with this file. */
export default function robots() {
  const site = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/studio"],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
