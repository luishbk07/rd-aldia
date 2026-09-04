import { CULTURE_ARTICLES } from "@/data/culture-articles";
import { DESTINATIONS } from "@/data/destinations";
import { ROUTES } from "../site";

/** Cross-links between culture stories and tourism destinations. */
export const CULTURE_TO_TOURISM = {
  "el-colmado": ["zona-colonial"],
  merengue: ["santiago", "zona-colonial"],
  bachata: ["zona-colonial", "las-terrenas"],
  "palo-encebado": ["santiago"],
  "diablos-cojuelos": ["santiago", "zona-colonial"],
  "el-cocuyo": ["constanza", "barahona"],
  "merengue-tipico": ["santiago"],
  atabales: ["zona-colonial", "barahona"],
};

export const TOURISM_TO_CULTURE = {
  "zona-colonial": ["el-colmado", "diablos-cojuelos"],
  "punta-cana": ["merengue", "bachata"],
  samana: ["el-cocuyo"],
  santiago: ["merengue-tipico", "merengue"],
  barahona: ["atabales", "el-cocuyo"],
  "las-terrenas": ["bachata"],
  "puerto-plata": ["merengue"],
  constanza: ["el-cocuyo"],
};

export const SECTION_RELATED = {
  fuel: [
    { href: ROUTES.dollar, label: "Tasa del dólar RD" },
    { href: ROUTES.finance, label: "Consejo financiero de hoy" },
    { href: ROUTES.weather, label: "Clima en República Dominicana" },
  ],
  dollar: [
    { href: ROUTES.fuel, label: "Combustible hoy" },
    { href: ROUTES.finance, label: "Consejo financiero" },
    { href: ROUTES.news, label: "Noticias de República Dominicana" },
  ],
  weather: [
    { href: ROUTES.tourism, label: "Turismo en República Dominicana" },
    { href: ROUTES.fuel, label: "Combustible hoy" },
    { href: ROUTES.news, label: "Noticias dominicanas" },
  ],
  sports: [
    { href: ROUTES.news, label: "Noticias de República Dominicana" },
    { href: ROUTES.culture, label: "Cultura dominicana" },
    { href: ROUTES.dollar, label: "Dólar RD" },
  ],
  news: [
    { href: ROUTES.sports, label: "LIDOM resultados" },
    { href: ROUTES.culture, label: "Cultura dominicana" },
    { href: ROUTES.weather, label: "Clima en República Dominicana" },
  ],
  culture: [
    { href: ROUTES.tourism, label: "Turismo en República Dominicana" },
    { href: ROUTES.sports, label: "LIDOM resultados" },
    { href: ROUTES.news, label: "Noticias dominicanas" },
  ],
  tourism: [
    { href: ROUTES.culture, label: "Cultura dominicana" },
    { href: ROUTES.weather, label: "Clima en República Dominicana" },
    { href: ROUTES.dollar, label: "Dólar RD" },
  ],
  verse: [
    { href: ROUTES.finance, label: "Consejo financiero de hoy" },
    { href: ROUTES.culture, label: "Cultura dominicana" },
    { href: ROUTES.news, label: "Noticias dominicanas" },
  ],
  finance: [
    { href: ROUTES.dollar, label: "Tasa del dólar RD" },
    { href: ROUTES.fuel, label: "Combustible hoy" },
    { href: ROUTES.verse, label: "Palabra del Día" },
  ],
  about: [
    { href: ROUTES.news, label: "Noticias de República Dominicana" },
    { href: ROUTES.contact, label: "Contacto" },
    { href: ROUTES.advertise, label: "Anúnciate" },
  ],
  contact: [
    { href: ROUTES.about, label: "Acerca de RD Al Día" },
    { href: ROUTES.advertise, label: "Anúnciate" },
    { href: ROUTES.privacy, label: "Política de privacidad" },
  ],
  advertise: [
    { href: ROUTES.contact, label: "Contacto" },
    { href: ROUTES.about, label: "Acerca de RD Al Día" },
    { href: ROUTES.news, label: "Noticias dominicanas" },
  ],
  search: [
    { href: ROUTES.news, label: "Noticias dominicanas" },
    { href: ROUTES.culture, label: "Cultura dominicana" },
    { href: ROUTES.tourism, label: "Turismo en República Dominicana" },
  ],
};

function findBySlug(items, slug) {
  return items.find((item) => item.slug === slug) || null;
}

/**
 * @param {string} slug
 * @param {{ destinations?: object[], articles?: object[] }} [catalog]
 */
export function relatedForCulture(slug, catalog = {}) {
  const destinations = catalog.destinations?.length
    ? catalog.destinations
    : DESTINATIONS;
  const articles = catalog.articles?.length ? catalog.articles : CULTURE_ARTICLES;

  const tourism = (CULTURE_TO_TOURISM[slug] || [])
    .map((id) => findBySlug(destinations, id) || findBySlug(DESTINATIONS, id))
    .filter(Boolean)
    .map((item) => ({
      href: `${ROUTES.tourism}/${item.slug}`,
      label: item.name,
      kind: "Turismo",
    }));

  const culture = articles
    .filter((item) => item.slug !== slug)
    .slice(0, 3)
    .map((item) => ({
      href: `${ROUTES.culture}/${item.slug}`,
      label: item.title,
      kind: "Cultura",
    }));

  return [
    { href: ROUTES.tourism, label: "Turismo en República Dominicana", kind: "Sección" },
    ...tourism,
    ...culture,
  ];
}

/**
 * @param {string} slug
 * @param {{ destinations?: object[], articles?: object[] }} [catalog]
 */
export function relatedForTourism(slug, catalog = {}) {
  const destinations = catalog.destinations?.length
    ? catalog.destinations
    : DESTINATIONS;
  const articles = catalog.articles?.length ? catalog.articles : CULTURE_ARTICLES;

  const culture = (TOURISM_TO_CULTURE[slug] || [])
    .map((id) => findBySlug(articles, id) || findBySlug(CULTURE_ARTICLES, id))
    .filter(Boolean)
    .map((item) => ({
      href: `${ROUTES.culture}/${item.slug}`,
      label: item.title,
      kind: "Cultura",
    }));

  const more = destinations
    .filter((item) => item.slug !== slug)
    .slice(0, 3)
    .map((item) => ({
      href: `${ROUTES.tourism}/${item.slug}`,
      label: item.name,
      kind: "Turismo",
    }));

  return [
    { href: ROUTES.culture, label: "Cultura dominicana", kind: "Sección" },
    { href: ROUTES.weather, label: "Clima en República Dominicana", kind: "Sección" },
    ...culture,
    ...more,
  ];
}
