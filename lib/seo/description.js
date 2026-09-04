const MIN = 150;
const MAX = 160;

const PADS = [
  " Ya.",
  " Hoy.",
  " Entra.",
  " Léelo ya.",
  " Entra hoy.",
  " Consulta ahora.",
  " Consulta RD Al Día.",
];

function padToWindow(clean, min, max) {
  if (clean.length >= min) return clean;
  const need = min - clean.length;
  const maxAdd = max - clean.length;
  if (maxAdd < 1) return clean;
  const fit =
    PADS.find((pad) => pad.length >= need && pad.length <= maxAdd) ||
    PADS.filter((pad) => pad.length <= maxAdd).at(-1);
  return fit ? `${clean}${fit}` : clean;
}

/**
 * Keep public meta descriptions in the 150–160 character window.
 * Longer copy is trimmed at a word boundary; short copy is padded
 * with a short call to action.
 * @param {string} text
 * @param {{ min?: number, max?: number }} [opts]
 */
export function clipSeoDescription(text, opts = {}) {
  const max = opts.max ?? MAX;
  const min = opts.min ?? MIN;
  let clean = String(text || "").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  clean = padToWindow(clean, min, max);
  if (clean.length <= max) return clean;

  const sliced = clean.slice(0, max);
  const cut = sliced.lastIndexOf(" ");
  const base = (cut >= 120 ? sliced.slice(0, cut) : sliced.slice(0, max - 1))
    .replace(/[.,;:¿¡\s]+$/u, "");
  return `${base}…`;
}

/**
 * Article/destination excerpts plus a short CTA, then clipped to 160.
 * @param {string} excerpt
 */
export function articleSeoDescription(excerpt) {
  const clean = String(excerpt || "").replace(/\s+/g, " ").trim();
  if (clean.length >= MIN) return clipSeoDescription(clean);

  const period = /[.!?…]$/.test(clean) ? "" : ".";
  return clipSeoDescription(
    `${clean}${period} Léelo ahora en RD Al Día y comparte la nota.`,
  );
}
