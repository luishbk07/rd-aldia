const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const MICM_MONTHS = {
  ENE: 0,
  FEB: 1,
  MAR: 2,
  ABR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AGO: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DIC: 11,
};

export function parseDateOnly(iso) {
  const [year, month, day] = String(iso).split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toDateOnly(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(iso, days) {
  const date = parseDateOnly(iso);
  date.setDate(date.getDate() + days);
  return toDateOnly(date);
}

export function formatValidityRange(from, to) {
  if (!from || !to) return "Vigencia no publicada";

  const start = parseDateOnly(from);
  const end = parseDateOnly(to);
  const startMonth = MONTHS[start.getMonth()];
  const endMonth = MONTHS[end.getMonth()];

  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return `Válido del ${start.getDate()} al ${end.getDate()} de ${startMonth}`;
  }

  if (start.getFullYear() === end.getFullYear()) {
    return `Válido del ${start.getDate()} de ${startMonth} al ${end.getDate()} de ${endMonth}`;
  }

  return `Válido del ${start.getDate()} de ${startMonth} de ${start.getFullYear()} al ${end.getDate()} de ${endMonth} de ${end.getFullYear()}`;
}

export function parseMicmFilenameRange(url) {
  const match = String(url).toUpperCase().match(
    /(\d{2})-([A-Z]{3})-(\d{2})-([A-Z]{3})-DE-(\d{4})/,
  );
  if (!match) return null;

  const startMonth = MICM_MONTHS[match[2]];
  const endMonth = MICM_MONTHS[match[4]];
  const year = Number(match[5]);
  if (startMonth == null || endMonth == null) return null;

  const startYear = startMonth > endMonth ? year - 1 : year;
  const start = new Date(startYear, startMonth, Number(match[1]));
  const end = new Date(year, endMonth, Number(match[3]));

  return {
    effectiveFrom: toDateOnly(start),
    effectiveTo: toDateOnly(end),
  };
}
