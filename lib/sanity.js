import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-09-03";

export function sanityConfigured() {
  return Boolean(projectId && dataset);
}

export const sanityClient = sanityConfigured()
  ? createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    perspective: "published",
  })
  : null;

const builder = sanityConfigured()
  ? createImageUrlBuilder({ projectId, dataset })
  : null;

export function urlFor(source) {
  if (!builder || !source || typeof source === "string") return null;
  return builder.image(source);
}

export function sanityImageUrl(source, width = 1600) {
  if (!source) return "";
  if (typeof source === "string") return source;
  const built = urlFor(source);
  return built ? built.width(width).auto("format").url() : "";
}

export async function sanityFetch(query, params = {}) {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch(query, params);
  } catch {
    return null;
  }
}

