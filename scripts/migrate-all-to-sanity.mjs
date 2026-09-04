/**
 * Import missing culture posts and tourism destinations into Sanity.
 * Skips any slug that already exists. Does not overwrite Studio edits.
 *
 * Usage:
 *   npm run migrate:all
 *   node scripts/migrate-all-to-sanity.mjs
 *
 * Requires SANITY_API_WRITE_TOKEN (Editor) in .env.local.
 */
import { CULTURE_ARTICLES } from "../data/culture-articles.js";
import { DESTINATIONS } from "../data/destinations.js";
import {
  createMigrateClient,
  imageFromUrl,
  paragraphsToBlocks,
  readLocalAdminArticles,
  readSupabaseArticles,
} from "./lib/sanity-migrate.mjs";

const AUTHOR_ID = "author.redaccion-rd-al-dia";
const AUTHOR_NAME = "Redacción RD Al Día";

const EXISTING_QUERY = `{
  "posts": *[_type == "post" && defined(slug.current)]{ "slug": slug.current, _id },
  "destinations": *[_type == "destination" && defined(slug.current)]{ "slug": slug.current, _id },
  "assets": *[_type == "sanity.imageAsset"]{ _id, originalFilename }
}`;

function publishedAtForIndex(index) {
  return new Date(Date.UTC(2026, 7, 20 - index, 16, 0, 0)).toISOString();
}

function destinationCategory(dest) {
  if (dest.categories?.includes("colonial")) return "colonial";
  return dest.categories?.[0] || "city";
}

function normalizeAdminArticle(row) {
  const slug = row.slug || row.slug_current;
  if (!slug) return null;
  const category = String(row.category || "").toLowerCase();
  if (category !== "cultura" && category !== "turismo") return null;
  const body = Array.isArray(row.content)
    ? row.content
    : String(row.content || "")
        .split(/\n{2,}/)
        .map((part) => part.trim())
        .filter(Boolean);
  return {
    slug,
    title: row.title,
    excerpt: row.excerpt || row.description || row.title,
    featured: Boolean(row.featured),
    image: row.image || row.coverImageUrl || row.featured_image,
    imageAlt: row.imageAlt || row.title,
    body,
    category,
    publishedAt: row.publishedAt || row.published_at,
  };
}

const client = createMigrateClient();

const catalog = await client.fetch(EXISTING_QUERY);
const postSlugs = new Set((catalog.posts || []).map((row) => row.slug));
const destinationSlugs = new Set(
  (catalog.destinations || []).map((row) => row.slug),
);
const assetIndex = new Map(
  (catalog.assets || [])
    .filter((asset) => asset.originalFilename)
    .map((asset) => [asset.originalFilename, asset._id]),
);

await client.createOrReplace({
  _id: AUTHOR_ID,
  _type: "author",
  name: AUTHOR_NAME,
  slug: { _type: "slug", current: "redaccion-rd-al-dia" },
});

const extraArticles = [
  ...readLocalAdminArticles(),
  ...(await readSupabaseArticles()),
]
  .map(normalizeAdminArticle)
  .filter(Boolean);

const cultureBySlug = new Map();
for (const article of CULTURE_ARTICLES) {
  cultureBySlug.set(article.slug, { ...article, category: "cultura" });
}
for (const article of extraArticles.filter((item) => item.category === "cultura")) {
  if (!cultureBySlug.has(article.slug)) cultureBySlug.set(article.slug, article);
}

const summary = {
  found: 0,
  alreadyInSanity: 0,
  newlyImported: 0,
  failed: 0,
};

async function importCulturePost(article, index) {
  summary.found += 1;
  if (postSlugs.has(article.slug)) {
    summary.alreadyInSanity += 1;
    console.log(`Already exists [post] ${article.slug}`);
    return;
  }
  try {
    const filename = `${article.slug}.jpg`;
    let coverImage;
    try {
      coverImage = await imageFromUrl(
        client,
        article.image,
        filename,
        article.imageAlt || article.title,
        assetIndex,
      );
    } catch (error) {
      console.warn(`  image skipped for ${article.slug}: ${error.message}`);
    }
    await client.create({
      _id: `post.cultura.${article.slug}`,
      _type: "post",
      title: article.title,
      slug: { _type: "slug", current: article.slug },
      category: "cultura",
      excerpt: article.excerpt,
      featured: Boolean(article.featured),
      publishedAt: article.publishedAt || publishedAtForIndex(index),
      author: { _type: "reference", _ref: AUTHOR_ID },
      content: paragraphsToBlocks(article.body),
      ...(coverImage ? { coverImage } : {}),
    });
    postSlugs.add(article.slug);
    summary.newlyImported += 1;
    console.log(`Imported [post/cultura] ${article.slug}`);
  } catch (error) {
    summary.failed += 1;
    console.error(`Failed [post] ${article.slug}: ${error.message}`);
  }
}

async function importDestination(dest) {
  summary.found += 1;
  if (destinationSlugs.has(dest.slug) || postSlugs.has(dest.slug)) {
    summary.alreadyInSanity += 1;
    console.log(`Already exists [destination] ${dest.slug}`);
    return;
  }
  try {
    const filename = `${dest.slug}.jpg`;
    let image;
    try {
      image = await imageFromUrl(
        client,
        dest.image,
        filename,
        dest.imageAlt || dest.name,
        assetIndex,
      );
    } catch (error) {
      console.warn(`  image skipped for ${dest.slug}: ${error.message}`);
    }
    await client.create({
      _id: `destination.${dest.slug}`,
      _type: "destination",
      name: dest.name,
      slug: { _type: "slug", current: dest.slug },
      region: dest.region,
      description: dest.description,
      bestTimeToVisit: dest.bestTime,
      category: destinationCategory(dest),
      featured: Boolean(dest.featured),
      body: paragraphsToBlocks(dest.body),
      ...(image ? { image } : {}),
    });
    destinationSlugs.add(dest.slug);
    summary.newlyImported += 1;
    console.log(`Imported [destination] ${dest.slug}`);
  } catch (error) {
    summary.failed += 1;
    console.error(`Failed [destination] ${dest.slug}: ${error.message}`);
  }
}

async function importTurismoPost(article) {
  summary.found += 1;
  if (postSlugs.has(article.slug)) {
    summary.alreadyInSanity += 1;
    console.log(`Already exists [post] ${article.slug}`);
    return;
  }
  try {
    const filename = `${article.slug}.jpg`;
    let coverImage;
    try {
      coverImage = await imageFromUrl(
        client,
        article.image,
        filename,
        article.imageAlt || article.title,
        assetIndex,
      );
    } catch (error) {
      console.warn(`  image skipped for ${article.slug}: ${error.message}`);
    }
    await client.create({
      _id: `post.turismo.${article.slug}`,
      _type: "post",
      title: article.title,
      slug: { _type: "slug", current: article.slug },
      category: "turismo",
      excerpt: article.excerpt,
      featured: Boolean(article.featured),
      publishedAt: article.publishedAt || new Date().toISOString(),
      author: { _type: "reference", _ref: AUTHOR_ID },
      content: paragraphsToBlocks(article.body),
      ...(coverImage ? { coverImage } : {}),
    });
    postSlugs.add(article.slug);
    summary.newlyImported += 1;
    console.log(`Imported [post/turismo] ${article.slug}`);
  } catch (error) {
    summary.failed += 1;
    console.error(`Failed [post] ${article.slug}: ${error.message}`);
  }
}

console.log("Scanning local data, Sanity, admin store, and Supabase…");
console.log(
  `Sanity already has ${postSlugs.size} posts and ${destinationSlugs.size} destinations.`,
);

let cultureIndex = 0;
for (const article of cultureBySlug.values()) {
  await importCulturePost(article, cultureIndex);
  cultureIndex += 1;
}

for (const dest of DESTINATIONS) {
  await importDestination(dest);
}

for (const article of extraArticles.filter((item) => item.category === "turismo")) {
  await importTurismoPost(article);
}

console.log(`
Summary
  Total found: ${summary.found}
  Already in Sanity: ${summary.alreadyInSanity}
  Newly imported: ${summary.newlyImported}
  Failed: ${summary.failed}
`);
console.log("Culture posts → Studio → Artículos y blog (categoría Cultura).");
console.log("Destinations → Studio → Destinos (not posts). Reload /turismo.");
