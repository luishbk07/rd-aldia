import { SITE_NAME } from "../site";
import { CORE_KEYWORDS } from "./pages";

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
  const image = extra.image;

  return {
    title: extra.absoluteTitle
      ? { absolute: extra.absoluteTitle }
      : entry.absoluteTitle
        ? { absolute: entry.absoluteTitle }
        : entry.title,
    description: extra.description || entry.description,
    keywords,
    alternates: {
      canonical: extra.canonical || entry.path,
    },
    openGraph: {
      title: extra.ogTitle || fullTitle,
      description: extra.description || entry.description,
      url: extra.canonical || entry.path,
      type: extra.type || "website",
      locale: "es_DO",
      siteName: SITE_NAME,
      ...(image ? { images: [{ url: image, alt: extra.imageAlt || entry.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: extra.ogTitle || fullTitle,
      description: extra.description || entry.description,
    },
    ...extra.overrides,
  };
}
