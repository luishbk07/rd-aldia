import { ROUTES, SITE_NAME } from "../site";

export const CORE_KEYWORDS = [
  "RD",
  "República Dominicana",
  "noticias",
  SITE_NAME,
  "Santo Domingo",
];

export const DEFAULT_DESCRIPTION =
  "Hub diario de República Dominicana: titulares, combustible, dólar, LIDOM, turismo y cultura. Todo lo que importa, al día.";

/** Static public pages — sitemap, search, and per-route metadata share this list. */
export const PAGE_SEO = {
  home: {
    path: ROUTES.home,
    title: SITE_NAME,
    absoluteTitle: `${SITE_NAME} | Noticias y datos de República Dominicana`,
    description: DEFAULT_DESCRIPTION,
    keywords: [
      "combustible",
      "dólar",
      "LIDOM",
      "turismo",
      "cultura",
      "palabra del día",
    ],
    changeFrequency: "hourly",
    priority: 1,
  },
  news: {
    path: ROUTES.news,
    title: "Noticias",
    description:
      "Titulares de Listín Diario, El Caribe, Diario Libre y El Nacional. Un solo lugar para enterarte y salir al medio original.",
    keywords: [
      "prensa dominicana",
      "Listín Diario",
      "Diario Libre",
      "El Caribe",
      "El Nacional",
      "titulares",
    ],
    changeFrequency: "hourly",
    priority: 0.9,
  },
  fuel: {
    path: ROUTES.fuel,
    title: "Combustible Hoy",
    description:
      "Precios oficiales de combustible en República Dominicana: gasolina, gasoil y GLP. Vigencia semanal del MICM.",
    keywords: [
      "combustible",
      "gasolina",
      "gasoil",
      "GLP",
      "MICM",
      "precios de combustible RD",
    ],
    changeFrequency: "daily",
    priority: 0.9,
  },
  dollar: {
    path: ROUTES.dollar,
    title: "Dólar RD",
    description:
      "Tasa del dólar y el euro en pesos dominicanos, más el oro en RD$. Referencia diaria para República Dominicana.",
    keywords: [
      "dólar",
      "peso dominicano",
      "tasa del dólar",
      "euro",
      "oro",
      "BCRD",
    ],
    changeFrequency: "hourly",
    priority: 0.9,
  },
  sports: {
    path: ROUTES.sports,
    title: "LIDOM Resultados",
    description:
      "Resultados LIDOM, calendario y posiciones, más marcador MLB y estrellas dominicanas. Béisbol de República Dominicana.",
    keywords: [
      "LIDOM",
      "resultados LIDOM",
      "béisbol",
      "MLB",
      "Tigres del Licey",
      "Águilas Cibaeñas",
    ],
    changeFrequency: "hourly",
    priority: 0.9,
  },
  tourism: {
    path: ROUTES.tourism,
    title: "Turismo",
    description:
      "Zona Colonial, Punta Cana, Samaná, Constanza y más destinos de República Dominicana. Cuándo ir y por qué vale el viaje.",
    keywords: [
      "turismo RD",
      "Punta Cana",
      "Samaná",
      "Zona Colonial",
      "destinos dominicanos",
    ],
    changeFrequency: "weekly",
    priority: 0.8,
  },
  culture: {
    path: ROUTES.culture,
    title: "Cultura",
    description:
      "Colmado, merengue, bachata, carnaval y tradiciones dominicanas. Lecturas para recordar quiénes somos.",
    keywords: [
      "cultura dominicana",
      "merengue",
      "bachata",
      "carnaval",
      "colmado",
    ],
    changeFrequency: "weekly",
    priority: 0.8,
  },
  verse: {
    path: ROUTES.verse,
    title: "Palabra del Día",
    description:
      "Versículo del día para la República Dominicana, con una nota práctica. Cambia cada jornada según la fecha en Santo Domingo.",
    keywords: ["palabra del día", "versículo", "Biblia", "fe"],
    changeFrequency: "daily",
    priority: 0.7,
  },
  finance: {
    path: ROUTES.finance,
    title: "Consejo financiero",
    description:
      "Un consejo práctico cada día para el bolsillo en República Dominicana: ahorro, deudas, estafas y hábitos simples.",
    keywords: [
      "consejo financiero",
      "ahorro",
      "finanzas personales",
      "bolsillo",
    ],
    changeFrequency: "daily",
    priority: 0.7,
  },
  search: {
    path: ROUTES.search,
    title: "Buscar",
    description: `Busca secciones, cultura y destinos en ${SITE_NAME}.`,
    keywords: ["buscar", "búsqueda"],
    changeFrequency: "weekly",
    priority: 0.3,
  },
};
