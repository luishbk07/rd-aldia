import { addDays } from "./dates";

export const FUEL_PRODUCTS = [
  { key: "gasolinePremium", label: "Gasolina Premium", short: "Premium" },
  { key: "gasolineRegular", label: "Gasolina Regular", short: "Regular" },
  { key: "gasoilRegular", label: "Gasoil Regular", short: "Gasoil" },
  { key: "gasoilOptimo", label: "Gasoil Óptimo", short: "Óptimo" },
  { key: "glp", label: "GLP", short: "GLP" },
];

export function emptyFuel() {
  return {
    effectiveFrom: "",
    effectiveTo: "",
    gasolinePremium: 0,
    gasolineRegular: 0,
    gasoilRegular: 0,
    gasoilOptimo: 0,
    glp: 0,
    source: "manual",
    sourceUrl: null,
    updatedAt: null,
  };
}

export function normalizeFuel(input = {}) {
  const effectiveFrom = input.effectiveFrom || input.date || "";
  const effectiveTo = input.effectiveTo || (effectiveFrom ? addDays(effectiveFrom, 6) : "");

  return {
    effectiveFrom,
    effectiveTo,
    gasolinePremium: Number(input.gasolinePremium ?? 0),
    gasolineRegular: Number(input.gasolineRegular ?? 0),
    gasoilRegular: Number(input.gasoilRegular ?? input.diesel ?? 0),
    gasoilOptimo: Number(input.gasoilOptimo ?? 0),
    glp: Number(input.glp ?? input.propane ?? 0),
    source: input.source === "scrape" ? "scrape" : "manual",
    sourceUrl: input.sourceUrl || null,
    updatedAt: input.updatedAt || null,
  };
}

export function hasPublishedPrices(fuel) {
  if (!fuel?.updatedAt) return false;
  return FUEL_PRODUCTS.some((product) => Number(fuel[product.key]) > 0);
}

export function formatDop(value) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 2,
  }).format(Number(value) || 0);
}
