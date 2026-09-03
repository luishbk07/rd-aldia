import { parseMicmFilenameRange } from "./dates";

export const MICM_NOTICES_URL =
  "https://micm.gob.do/direcciones/combustibles/avisos-semanales-de-precios/avisos-semanales-de-precios-de-combustibles/";

const HEADERS = {
  "User-Agent": "RDAlDia/1.0 (+https://rdaldia; weekly public MICM fuel notices)",
  Accept: "text/html,application/pdf;q=0.9,*/*;q=0.8",
};

const PRICE_PATTERNS = [
  ["gasolinePremium", /gasolina\s+premium[^0-9]{0,80}(?:rd\$\s*)?(\d{2,3}[.,]\d{2})/i],
  ["gasolineRegular", /gasolina\s+regular[^0-9]{0,80}(?:rd\$\s*)?(\d{2,3}[.,]\d{2})/i],
  ["gasoilRegular", /gasoil\s+regular[^0-9]{0,80}(?:rd\$\s*)?(\d{2,3}[.,]\d{2})/i],
  ["gasoilOptimo", /gasoil\s+[oó]ptimo[^0-9]{0,80}(?:rd\$\s*)?(\d{2,3}[.,]\d{2})/i],
  ["glp", /(?:glp|gas\s+licuado(?:\s+de\s+petr[oó]leo)?)[^0-9]{0,80}(?:rd\$\s*)?(\d{2,3}[.,]\d{2})/i],
];

function parsePrice(raw) {
  return Number(String(raw).replace(",", "."));
}

function extractPdfLinks(html) {
  const matches = [...html.matchAll(/href="([^"]+\.pdf)"/gi)].map((match) => {
    try {
      return new URL(match[1], MICM_NOTICES_URL).href;
    } catch {
      return null;
    }
  });

  return [...new Set(matches.filter(Boolean))].filter((href) =>
    /aviso|precio|comb/i.test(href),
  );
}

function extractPricesFromText(text) {
  const prices = {};

  for (const [key, pattern] of PRICE_PATTERNS) {
    const match = text.match(pattern);
    if (match) prices[key] = parsePrice(match[1]);
  }

  return prices;
}

export async function scrapeMicmFuelNotice() {
  const listing = await fetch(MICM_NOTICES_URL, {
    headers: HEADERS,
    cache: "no-store",
  });

  if (!listing.ok) {
    throw new Error(`MICM listing HTTP ${listing.status}`);
  }

  const html = await listing.text();
  const pdfs = extractPdfLinks(html);
  const latest = pdfs[0];

  if (!latest) {
    return {
      ok: false,
      reason: "No se encontró un PDF de aviso semanal en el MICM.",
      noticeUrl: MICM_NOTICES_URL,
      prices: null,
    };
  }

  const range = parseMicmFilenameRange(latest);
  const fromHtml = extractPricesFromText(html.replace(/<[^>]+>/g, " "));

  const completeFromHtml = PRICE_PATTERNS.every(([key]) => fromHtml[key] > 0);
  if (completeFromHtml) {
    return {
      ok: true,
      noticeUrl: latest,
      ...range,
      prices: fromHtml,
    };
  }

  return {
    ok: false,
    reason:
      "El aviso semanal del MICM está en PDF. Copia los 5 precios al panel (método recomendado).",
    noticeUrl: latest,
    ...range,
    prices: Object.keys(fromHtml).length ? fromHtml : null,
  };
}
