/**
 * Seed the 8 static Cultura articles into Sanity as `post` docs.
 *
 * Usage:
 *   1. Create an Editor token (not Viewer):
 *      https://www.sanity.io/manage/project/q15cmaat/api#tokens
 *   2. Add SANITY_API_WRITE_TOKEN to .env.local
 *   3. npm run migrate:culture
 *      or: node scripts/migrate-culture-to-sanity.mjs
 *
 * Re-running skips slugs that already exist so Studio edits are not overwritten.
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { CULTURE_ARTICLES } from "../data/culture-articles.js";

const AUTHOR_ID = "author.redaccion-rd-al-dia";
const AUTHOR_NAME = "Redacción RD Al Día";

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  try {
    for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!(key in process.env) || process.env[key] === "") {
        process.env[key] = value;
      }
    }
  } catch {
    // .env.local is optional if the shell already has the vars.
  }
}

function paragraphsToBlocks(paragraphs) {
  return (paragraphs || []).map((text, index) => ({
    _type: "block",
    _key: `p${index + 1}`,
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `s${index + 1}`,
        text,
        marks: [],
      },
    ],
  }));
}

async function downloadImage(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "rd-aldia-migrate/1.0", Accept: "image/*" },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${url}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

function publishedAtForIndex(index) {
  const date = new Date(Date.UTC(2026, 7, 20 - index, 16, 0, 0));
  return date.toISOString();
}

loadEnvLocal();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "q15cmaat";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-09-03";
const token =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_AUTH_TOKEN ||
  process.env.SANITY_API_TOKEN;

if (!token) {
  console.error(`Missing SANITY_API_WRITE_TOKEN.

Create an Editor token (Permissions: Editor, not Viewer):
  https://www.sanity.io/manage/project/${projectId}/api#tokens

Then add this line to .env.local and re-run:
  SANITY_API_WRITE_TOKEN=sk...
`);
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

await client.createOrReplace({
  _id: AUTHOR_ID,
  _type: "author",
  name: AUTHOR_NAME,
  slug: { _type: "slug", current: "redaccion-rd-al-dia" },
});
console.log(`author ready: ${AUTHOR_NAME}`);

let created = 0;
let skipped = 0;
let failed = 0;

for (const [index, article] of CULTURE_ARTICLES.entries()) {
  try {
    const existingId = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]._id`,
      { slug: article.slug },
    );
    if (existingId) {
      skipped += 1;
      console.log(`skipped ${article.slug} (already exists)`);
      continue;
    }

    let coverImage;
    try {
      const buffer = await downloadImage(article.image);
      const asset = await client.assets.upload("image", buffer, {
        filename: `${article.slug}.jpg`,
        contentType: "image/jpeg",
      });
      coverImage = {
        _type: "image",
        alt: article.imageAlt,
        asset: { _type: "reference", _ref: asset._id },
      };
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
      publishedAt: publishedAtForIndex(index),
      author: { _type: "reference", _ref: AUTHOR_ID },
      content: paragraphsToBlocks(article.body),
      ...(coverImage ? { coverImage } : {}),
    });
    created += 1;
    console.log(`created ${article.slug}`);
  } catch (error) {
    failed += 1;
    console.error(`failed ${article.slug}: ${error.message}`);
  }
}

console.log(
  `\nDone. ${created} created, ${skipped} skipped, ${failed} failed (${CULTURE_ARTICLES.length} articles).`,
);
console.log("Open Studio → Artículos y blog, then reload /cultura.");
