export function santoDomingoDayOfYear(now = new Date()) {
  const iso = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santo_Domingo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const [year, month, day] = iso.split("-").map(Number);
  const dayOfYear = Math.floor(
    (Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / 86400000,
  );
  return { dayOfYear, iso, year, month, day };
}
