import { createClient } from "@sanity/client";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export function loadEnvLocal() {
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

export function paragraphsToBlocks(paragraphs) {
  return (paragraphs || []).map((text, index) => ({
    _type: "block",
    _key: `p${index + 1}`,
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `s${index + 1}`,
        text: String(text || ""),
        marks: [],
      },
    ],
  }));
}

export function createMigrateClient() {
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

Create an Editor token (not Viewer):
  https://www.sanity.io/manage/project/${projectId}/api#tokens

Add to .env.local:
  SANITY_API_WRITE_TOKEN=sk...
`);
    process.exit(1);
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });
}

export async function downloadImage(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "rd-aldia-migrate/1.0", Accept: "image/*" },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${url}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

export async function imageFromUrl(client, url, filename, alt, assetIndex) {
  if (!url) return undefined;
  const reused = assetIndex.get(filename);
  if (reused) {
    return {
      _type: "image",
      alt,
      asset: { _type: "reference", _ref: reused },
    };
  }
  const buffer = await downloadImage(url);
  const asset = await client.assets.upload("image", buffer, {
    filename,
    contentType: "image/jpeg",
  });
  assetIndex.set(filename, asset._id);
  return {
    _type: "image",
    alt,
    asset: { _type: "reference", _ref: asset._id },
  };
}

export function readLocalAdminArticles() {
  const path = resolve(process.cwd(), ".data", "admin-store.json");
  if (!existsSync(path)) return [];
  try {
    const store = JSON.parse(readFileSync(path, "utf8"));
    return Array.isArray(store.articles) ? store.articles : [];
  } catch {
    return [];
  }
}

export async function readSupabaseArticles() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return [];
  const response = await fetch(`${url}/rest/v1/articles?select=*`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });
  if (!response.ok) {
    console.warn(`Supabase articles skipped: ${response.status}`);
    return [];
  }
  const rows = await response.json();
  return Array.isArray(rows) ? rows : [];
}
