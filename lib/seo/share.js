import { SITE_NAME, absoluteUrl } from "../site";

/**
 * @param {{ title?: string, url?: string, path?: string, hash?: string }} opts
 */
export function buildSharePayload(opts = {}) {
  const title = (opts.title || SITE_NAME).trim();
  const base = opts.url || (opts.path ? absoluteUrl(opts.path) : "");
  const url = opts.hash && base ? `${base}#${opts.hash}` : base;
  const text = `Mira esto en ${SITE_NAME}: ${title}`;

  return { title, url, text };
}

/**
 * @param {{ title?: string, url?: string, path?: string, hash?: string }} opts
 */
export function shareNetworkUrls(opts = {}) {
  const { url, text } = buildSharePayload(opts);
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  return {
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };
}
