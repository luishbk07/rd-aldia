import { absoluteUrl, getSiteUrl, ROUTES, SITE_NAME } from "../site";
import { DEFAULT_DESCRIPTION } from "./pages";

export function organizationSchema() {
  const url = getSiteUrl();
  return {
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name: SITE_NAME,
    url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.svg"),
      width: 112,
      height: 112,
    },
    description: DEFAULT_DESCRIPTION,
    areaServed: {
      "@type": "Country",
      name: "República Dominicana",
    },
  };
}

export function websiteSchema() {
  const url = getSiteUrl();
  return {
    "@type": "WebSite",
    "@id": `${url}/#website`,
    name: SITE_NAME,
    url,
    inLanguage: "es-DO",
    description: DEFAULT_DESCRIPTION,
    publisher: { "@id": `${url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}${ROUTES.search}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function siteGraphSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationSchema(), websiteSchema()],
  };
}

export function newsArticleSchema(article) {
  const url = absoluteUrl(`${ROUTES.culture}/${article.slug}`);
  const published = article.publishedAt || "2026-09-01T12:00:00-04:00";

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: published,
    dateModified: article.updatedAt || published,
    inLanguage: "es-DO",
    articleSection: "Cultura",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: getSiteUrl(),
    },
    publisher: organizationSchema(),
  };
}

export function destinationArticleSchema(destination) {
  const url = absoluteUrl(`${ROUTES.tourism}/${destination.slug}`);
  const published = destination.publishedAt || "2026-09-01T12:00:00-04:00";

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: destination.name,
    description: destination.description,
    image: destination.image,
    datePublished: published,
    dateModified: destination.updatedAt || published,
    inLanguage: "es-DO",
    articleSection: "Turismo",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: getSiteUrl(),
    },
    publisher: organizationSchema(),
  };
}
