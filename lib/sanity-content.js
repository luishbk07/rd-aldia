import {
  CULTURE_ARTICLES,
  featuredCulture,
  getCultureArticle,
} from "@/data/culture-articles";
import {
  DESTINATIONS,
  featuredDestinations,
  getDestination,
} from "@/data/destinations";
import { sanityFetch, sanityImageUrl } from "./sanity";
import {
  destinationBySlugQuery,
  destinationsQuery,
  featuredDestinationsQuery,
  featuredPostsQuery,
  postBySlugQuery,
  postsByCategoryQuery,
} from "./sanity.queries";

/**
 * @typedef {object} CultureArticle
 * @property {string} slug
 * @property {string} title
 * @property {string} excerpt
 * @property {string} image
 * @property {string} imageAlt
 * @property {string} [category]
 * @property {string} [author]
 * @property {string} [publishedAt]
 * @property {boolean} featured
 * @property {number} readMinutes
 * @property {unknown[]} [content]
 * @property {string[]} body
 * @property {string} [source]
 */

/**
 * @typedef {object} TourismDestination
 * @property {string} slug
 * @property {string} name
 * @property {string} region
 * @property {string} description
 * @property {string} image
 * @property {string} imageAlt
 * @property {string} bestTime
 * @property {string[]} categories
 * @property {boolean} featured
 * @property {unknown[]} [content]
 * @property {string[]} body
 * @property {string} [publishedAt]
 * @property {string} [source]
 */

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80";

function readMinutesFromContent(content) {
  if (!Array.isArray(content)) return 5;
  const words = content
    .flatMap((block) => (block.children || []).map((child) => child.text || ""))
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(3, Math.round(words / 180));
}

function portableToParagraphs(content) {
  if (!Array.isArray(content)) return [];
  return content
    .filter((block) => block._type === "block")
    .map((block) =>
      (block.children || []).map((child) => child.text || "").join(""),
    )
    .filter(Boolean);
}

/**
 * @param {unknown} post
 * @returns {CultureArticle | null}
 */
export function mapSanityPost(post) {
  if (!post) return null;
  const content = post.content || [];
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    image: sanityImageUrl(post.coverImage) || FALLBACK_IMAGE,
    imageAlt: post.coverImage?.alt || post.title,
    category: post.category || "cultura",
    author: post.author || "RD Al Día",
    publishedAt: post.publishedAt,
    featured: Boolean(post.featured),
    readMinutes: readMinutesFromContent(content),
    content,
    body: portableToParagraphs(content),
    source: "sanity",
  };
}

/**
 * @param {unknown} item
 * @returns {TourismDestination | null}
 */
export function mapSanityDestination(item) {
  if (!item) return null;
  const bodyBlocks = item.body || [];
  return {
    slug: item.slug,
    name: item.name,
    region: item.region,
    description: item.description,
    image: sanityImageUrl(item.image) || FALLBACK_IMAGE,
    imageAlt: item.image?.alt || item.name,
    bestTime: item.bestTimeToVisit || "",
    categories: item.category ? [item.category] : [],
    featured: Boolean(item.featured),
    content: bodyBlocks,
    body: portableToParagraphs(bodyBlocks),
    publishedAt: item._updatedAt,
    source: "sanity",
  };
}

/**
 * @template {{ slug?: string } | null} T
 * @param {T} item
 * @returns {item is Exclude<T, null | undefined>}
 */
function hasSlug(item) {
  return Boolean(item?.slug);
}

/**
 * @returns {Promise<CultureArticle[]>}
 */
export async function getCulturePosts() {
  const rows = await sanityFetch(postsByCategoryQuery, { category: "cultura" });
  const mapped = Array.isArray(rows)
    ? rows.map(mapSanityPost).filter(hasSlug)
    : [];
  return mapped.length ? mapped : CULTURE_ARTICLES;
}

/**
 * @param {string} slug
 * @returns {Promise<CultureArticle | null>}
 */
export async function getCulturePost(slug) {
  const row = await sanityFetch(postBySlugQuery, { slug });
  if (row) return mapSanityPost(row);
  return getCultureArticle(slug);
}

/**
 * @returns {Promise<TourismDestination[]>}
 */
export async function getTourismDestinations() {
  const rows = await sanityFetch(destinationsQuery);
  const mapped = Array.isArray(rows)
    ? rows.map(mapSanityDestination).filter(hasSlug)
    : [];
  return mapped.length ? mapped : DESTINATIONS;
}

/**
 * @param {string} slug
 * @returns {Promise<TourismDestination | null>}
 */
export async function getTourismDestination(slug) {
  const row = await sanityFetch(destinationBySlugQuery, { slug });
  if (row) return mapSanityDestination(row);
  return getDestination(slug);
}

/**
 * @returns {Promise<CultureArticle[]>}
 */
export async function getFeaturedCulturePosts() {
  const rows = await sanityFetch(featuredPostsQuery);
  const mapped = Array.isArray(rows)
    ? rows
        .map(mapSanityPost)
        .filter(hasSlug)
        .filter((item) => item.category === "cultura")
    : [];
  return mapped.length ? mapped : featuredCulture();
}

/**
 * @returns {Promise<TourismDestination[]>}
 */
export async function getFeaturedTourism() {
  const rows = await sanityFetch(featuredDestinationsQuery);
  const mapped = Array.isArray(rows)
    ? rows.map(mapSanityDestination).filter(hasSlug)
    : [];
  return mapped.length ? mapped : featuredDestinations();
}
