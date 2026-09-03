import { CULTURE_ARTICLES } from "@/data/culture-articles";
import { DESTINATIONS } from "@/data/destinations";
import { PAGE_SEO } from "@/lib/seo/pages";
import { absoluteUrl, ROUTES } from "@/lib/site";

export const revalidate = 3600;

export default function sitemap() {
  const now = new Date();

  const pages = Object.values(PAGE_SEO).map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const culture = CULTURE_ARTICLES.map((article) => ({
    url: absoluteUrl(`${ROUTES.culture}/${article.slug}`),
    lastModified: article.updatedAt || article.publishedAt || now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const tourism = DESTINATIONS.map((destination) => ({
    url: absoluteUrl(`${ROUTES.tourism}/${destination.slug}`),
    lastModified: destination.updatedAt || destination.publishedAt || now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...pages, ...culture, ...tourism];
}
