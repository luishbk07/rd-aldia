import { PAGE_SEO } from "@/lib/seo/pages";
import { getCulturePosts, getTourismDestinations } from "@/lib/sanity-content";
import { absoluteUrl, ROUTES } from "@/lib/site";

export const revalidate = 3600;

/** Public URLs: PAGE_SEO (incl. /clima) plus cultura and turismo slugs. */
export default async function sitemap() {
  const now = new Date();
  const [articles, destinations] = await Promise.all([
    getCulturePosts(),
    getTourismDestinations(),
  ]);

  const pages = Object.values(PAGE_SEO).map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const culture = articles.map((article) => ({
    url: absoluteUrl(`${ROUTES.culture}/${article.slug}`),
    lastModified: article.updatedAt || article.publishedAt || now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const tourism = destinations.map((destination) => ({
    url: absoluteUrl(`${ROUTES.tourism}/${destination.slug}`),
    lastModified: destination.updatedAt || destination.publishedAt || now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...pages, ...culture, ...tourism];
}
