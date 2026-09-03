import goldFallback from "./gold-fallback.json";

const TIMEOUT_MS = 8000;

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function asQuote({ usdRate, euroRate, goldUsd, source, date }) {
  const usd = Number(usdRate);
  const euro = Number(euroRate);
  const gold = Number(goldUsd);

  if (!(usd > 0) || !(euro > 0) || !(gold > 0)) {
    throw new Error("Cotización incompleta.");
  }

  return {
    usdRate: Number(usd.toFixed(4)),
    euroRate: Number(euro.toFixed(4)),
    goldUsd: Number(gold.toFixed(2)),
    goldRd: Number((gold * usd).toFixed(2)),
    date: date || today(),
    source,
    createdAt: new Date().toISOString(),
    official: source === "bcrd" || source === "manual",
  };
}

async function fetchGoldUsd() {
  try {
    const data = await fetchJson("https://api.gold-api.com/price/XAU");
    const price = Number(data.price);
    if (!(price > 0)) throw new Error("Oro inválido");
    return { price, source: "gold-api" };
  } catch {
    return { price: Number(goldFallback.price), source: "gold-fallback" };
  }
}

async function fetchFromExchangeRateHost() {
  const key = process.env.EXCHANGERATE_HOST_KEY;
  const url = new URL("https://api.exchangerate.host/latest");
  url.searchParams.set("base", "USD");
  url.searchParams.set("symbols", "DOP,EUR");
  if (key) url.searchParams.set("access_key", key);

  const data = await fetchJson(url.toString());
  if (data.success === false) {
    throw new Error(data.error?.info || "exchangerate.host requiere access_key");
  }

  const usdRate = Number(data.rates?.DOP);
  const usdEur = Number(data.rates?.EUR);
  if (!(usdRate > 0) || !(usdEur > 0)) {
    throw new Error("exchangerate.host no devolvió DOP/EUR");
  }

  return {
    usdRate,
    euroRate: usdRate / usdEur,
    source: "exchangerate.host",
    date: data.date,
  };
}

async function fetchFromOpenErApi() {
  const usd = await fetchJson("https://open.er-api.com/v6/latest/USD");
  if (usd.result !== "success" || !(Number(usd.rates?.DOP) > 0)) {
    throw new Error("open.er-api no devolvió USD/DOP");
  }

  let euroRate = Number(usd.rates.DOP) / Number(usd.rates.EUR || 0);
  try {
    const eur = await fetchJson("https://open.er-api.com/v6/latest/EUR");
    if (Number(eur.rates?.DOP) > 0) euroRate = Number(eur.rates.DOP);
  } catch {
    // keep cross rate
  }

  return {
    usdRate: Number(usd.rates.DOP),
    euroRate,
    source: "open.er-api.com",
    date: usd.time_last_update_utc
      ? new Date(usd.time_last_update_utc).toISOString().slice(0, 10)
      : today(),
  };
}

async function fetchFromFrankfurterPlusDop() {
  const [fx, usd] = await Promise.all([
    fetchJson("https://api.frankfurter.app/latest?from=EUR&to=USD"),
    fetchJson("https://open.er-api.com/v6/latest/USD"),
  ]);

  const eurUsd = Number(fx.rates?.USD);
  const usdRate = Number(usd.rates?.DOP);
  if (!(eurUsd > 0) || !(usdRate > 0)) {
    throw new Error("Frankfurter/DOP incompleto");
  }

  return {
    usdRate,
    euroRate: usdRate * eurUsd,
    source: "frankfurter+open.er-api",
    date: fx.date || today(),
  };
}

export async function fetchLiveQuote() {
  const goldPromise = fetchGoldUsd();
  const errors = [];

  const attempts = [
    fetchFromExchangeRateHost,
    fetchFromFrankfurterPlusDop,
    fetchFromOpenErApi,
  ];

  let fx = null;
  for (const attempt of attempts) {
    try {
      fx = await attempt();
      break;
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "error");
    }
  }

  if (!fx) {
    throw new Error(`No se pudo cotizar el dólar (${errors.join(" · ")})`);
  }

  const gold = await goldPromise;
  return asQuote({
    usdRate: fx.usdRate,
    euroRate: fx.euroRate,
    goldUsd: gold.price,
    source: `${fx.source}+${gold.source}`,
    date: fx.date,
  });
}

export { asQuote };
