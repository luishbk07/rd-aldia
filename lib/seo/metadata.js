import { SITE_NAME } from "../site";
import { CORE_KEYWORDS } from "./pages";

export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "RD Al Día — información diaria de República Dominicana",
};

/**
 * @param {object} entry
 * @param {string} entry.title
 * @param {string} [entry.absoluteTitle]
 * @param {string} entry.description
 * @param {string} entry.path
 * @param {string[]} [entry.keywords]
 * @param {object} [extra]
 */
export function pageMetadata(entry, extra = {}) {
  const keywords = [...CORE_KEYWORDS, ...(entry.keywords || [])];
  const fullTitle = entry.absoluteTitle || `${entry.title} | ${SITE_NAME}`;
  const description = extra.description || entry.description;
  const image = extra.image
    ? { url: extra.image, alt: extra.imageAlt || entry.title }
    : DEFAULT_OG_IMAGE;

  return {
    title: extra.absoluteTitle
      ? { absolute: extra.absoluteTitle }
      : entry.absoluteTitle
        ? { absolute: entry.absoluteTitle }
        : entry.title,
    description,
    keywords,
    alternates: {
      canonical: extra.canonical || entry.path,
    },
    openGraph: {
      title: extra.ogTitle || fullTitle,
      description,
      url: extra.canonical || entry.path,
      type: extra.type || "website",
      locale: "es_DO",
      siteName: SITE_NAME,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: extra.ogTitle || fullTitle,
      description,
      images: [image.url],
    },
    ...extra.overrides,
  };
}
