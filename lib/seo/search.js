import { CULTURE_ARTICLES } from "@/data/culture-articles";
import { DESTINATIONS } from "@/data/destinations";
import { ROUTES } from "../site";
import { PAGE_SEO } from "./pages";

function match(haystack, query) {
  return haystack.toLowerCase().includes(query);
}

export function searchSite(rawQuery) {
  const query = String(rawQuery || "").trim().toLowerCase();
  if (query.length < 2) return [];

  const pages = Object.values(PAGE_SEO)
    .filter((page) => page.path !== ROUTES.home && page.path !== ROUTES.search)
    .filter((page) =>
      match(`${page.title} ${page.description} ${(page.keywords || []).join(" ")}`, query),
    )
    .map((page) => ({
      type: "Sección",
      href: page.path,
      title: page.title,
      excerpt: page.description,
    }));

  const culture = CULTURE_ARTICLES.filter((article) =>
    match(`${article.title} ${article.excerpt} ${article.body.join(" ")}`, query),
  ).map((article) => ({
    type: "Cultura",
    href: `${ROUTES.culture}/${article.slug}`,
    title: article.title,
    excerpt: article.excerpt,
  }));

  const tourism = DESTINATIONS.filter((destination) =>
    match(
      `${destination.name} ${destination.region} ${destination.description} ${destination.body.join(" ")}`,
      query,
    ),
  ).map((destination) => ({
    type: "Turismo",
    href: `${ROUTES.tourism}/${destination.slug}`,
    title: destination.name,
    excerpt: destination.description,
  }));

  return [...pages, ...culture, ...tourism];
}
