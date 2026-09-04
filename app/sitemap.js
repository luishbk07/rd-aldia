import { PAGE_SEO } from "@/lib/seo/pages";
import { getCulturePosts, getTourismDestinations } from "@/lib/sanity-content";
import { absoluteUrl, ROUTES } from "@/lib/site";

export const revalidate = 3600;

/**
 * Canonical public URLs. /combustible, /dolar and /deportes 301 to
 * /combustible-hoy, /dolar-rd and /lidom-resultados — only the destinies
 * go in the sitemap.
 */
function staticEntries(now) {
  return Object.values(PAGE_SEO).map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}

export default async function sitemap() {
  const now = new Date();
  const [articles, destinations] = await Promise.all([
    getCulturePosts(),
    getTourismDestinations(),
  ]);

  const culture = articles.map((article) => ({
    url: absoluteUrl(`${ROUTES.culture}/${article.slug}`),
    lastModified: new Date(article.updatedAt || article.publishedAt || now),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const tourism = destinations.map((destination) => ({
    url: absoluteUrl(`${ROUTES.tourism}/${destination.slug}`),
    lastModified: new Date(destination.updatedAt || destination.publishedAt || now),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries(now), ...culture, ...tourism];
}
