/**
 * Seed the 8 static Turismo destinations into Sanity as `destination` docs.
 *
 * Usage:
 *   1. Create an Editor token: https://www.sanity.io/manage/project/q15cmaat/api#tokens
 *   2. Add SANITY_API_WRITE_TOKEN to .env.local
 *   3. npm run migrate:destinations
 *
 * Re-running is safe: documents use stable ids (`destination.{slug}`).
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { DESTINATIONS } from "../data/destinations.js";

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

loadEnvLocal();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-09-03";
const token =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_AUTH_TOKEN ||
  process.env.SANITY_API_TOKEN ||
  process.env.SANITY_API_READ_TOKEN;

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
  process.exit(1);
}

if (!token) {
  console.error(`Missing SANITY_API_WRITE_TOKEN.

Create an Editor token:
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

let created = 0;
let updated = 0;

for (const dest of DESTINATIONS) {
  const id = `destination.${dest.slug}`;
  const existing = await client.getDocument(id);
  let imageField;

  try {
    const buffer = await downloadImage(dest.image);
    const asset = await client.assets.upload("image", buffer, {
      filename: `${dest.slug}.jpg`,
      contentType: "image/jpeg",
    });
    imageField = {
      _type: "image",
      alt: dest.imageAlt,
      asset: { _type: "reference", _ref: asset._id },
    };
  } catch (error) {
    console.warn(`  image skipped for ${dest.slug}: ${error.message}`);
  }

  const doc = {
    _id: id,
    _type: "destination",
    name: dest.name,
    slug: { _type: "slug", current: dest.slug },
    region: dest.region,
    description: dest.description,
    bestTimeToVisit: dest.bestTime,
    category: dest.categories.includes("colonial")
      ? "colonial"
      : dest.categories[0],
    featured: Boolean(dest.featured),
    body: paragraphsToBlocks(dest.body),
    ...(imageField ? { image: imageField } : {}),
  };

  await client.createOrReplace(doc);
  if (existing) {
    updated += 1;
    console.log(`updated ${dest.slug}`);
  } else {
    created += 1;
    console.log(`created ${dest.slug}`);
  }
}

console.log(
  `\nDone. ${created} created, ${updated} updated in ${dataset} (${DESTINATIONS.length} destinations).`,
);
console.log("Publish them in Studio if they are drafts, then reload /turismo.");
