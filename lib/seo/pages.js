import { ROUTES, SITE_NAME } from "../site";

export const CORE_KEYWORDS = [
  "RD",
  "República Dominicana",
  "noticias",
  SITE_NAME,
  "Santo Domingo",
];

export const DEFAULT_DESCRIPTION =
  "Noticias, combustible, dólar y clima de República Dominicana, en un solo lugar. Entra a RD Al Día, revisa lo esencial y compártelo hoy con tu familia.";

/** Static public pages — sitemap, search, and per-route metadata share this list. */
export const PAGE_SEO = {
  home: {
    path: ROUTES.home,
    title: "Noticias y datos de República Dominicana",
    absoluteTitle: "Noticias y datos de República Dominicana | RD Al Día",
    description: DEFAULT_DESCRIPTION,
    keywords: [
      "combustible",
      "dólar",
      "clima",
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
    title: "Noticias de República Dominicana",
    description:
      "Noticias de República Dominicana: titulares de Listín Diario, Diario Libre, El Caribe y El Nacional. Léelos hoy y abre cada nota en el medio original.",
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
      "Combustible hoy en República Dominicana: precios oficiales de gasolina, gasoil y GLP del MICM. Consulta la vigencia semanal y planifica tu tanque ahora.",
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
      "Dólar RD al peso dominicano, más euro y oro en RD$. Revisa la tasa de referencia de hoy, convierte tu monto y decide cuándo cambiar esta semana ya.",
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
  weather: {
    path: ROUTES.weather,
    title: "Clima en República Dominicana",
    description:
      "Clima en República Dominicana para Santo Domingo, Santiago, Punta Cana y más ciudades. Mira temperatura, lluvia y el mapa antes de salir de casa hoy.",
    keywords: [
      "clima RD",
      "clima Santo Domingo",
      "pronóstico",
      "lluvia",
      "temperatura",
      "mapa del clima",
    ],
    changeFrequency: "hourly",
    priority: 0.9,
  },
  sports: {
    path: ROUTES.sports,
    title: "LIDOM Resultados",
    description:
      "LIDOM resultados, posiciones y calendario, más MLB con peloteros dominicanos. Sigue el marcador en vivo y no te pierdas el partido de hoy en RD.",
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
    title: "Turismo en República Dominicana",
    description:
      "Turismo en República Dominicana: Punta Cana, Samaná, Zona Colonial y Constanza. Elige un destino, mira la mejor época y arma tu viaje este mes.",
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
    title: "Cultura dominicana",
    description:
      "Cultura dominicana: merengue, bachata, carnaval, atabales y el colmado. Lee las tradiciones y descubre el país más allá de la playa turística.",
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
      "Palabra del Día en República Dominicana: un versículo y una nota para la vida cotidiana. Léela esta mañana y empieza el día con calma y fe.",
    keywords: ["palabra del día", "versículo", "Biblia", "fe"],
    changeFrequency: "daily",
    priority: 0.7,
  },
  finance: {
    path: ROUTES.finance,
    title: "Consejo financiero",
    description:
      "Consejo financiero para República Dominicana: ahorro, deudas, estafas y hábitos simples. Lee el tip de hoy y cuida mejor tu bolsillo este mes.",
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
    description:
      "Busca noticias, combustible, cultura y turismo dominicano en RD Al Día. Escribe tu tema y encuentra la sección que necesitas ahora mismo.",
    keywords: ["buscar", "búsqueda"],
    changeFrequency: "weekly",
    priority: 0.3,
  },
  advertise: {
    path: ROUTES.advertise,
    title: "Anúnciate",
    description:
      "Anúnciate en RD Al Día y llega a quien consulta combustible, dólar, clima y noticias. Revisa los formatos y pide tu espacio publicitario hoy.",
    keywords: ["publicidad", "anuncios", "medios RD"],
    changeFrequency: "monthly",
    priority: 0.5,
  },
  about: {
    path: ROUTES.about,
    title: "Acerca de",
    description:
      "Acerca de RD Al Día: el hub diario de República Dominicana para noticias, datos, cultura y turismo. Conoce la misión, el equipo y escríbenos.",
    keywords: ["acerca de", "quiénes somos", "misión"],
    changeFrequency: "monthly",
    priority: 0.4,
  },
  contact: {
    path: ROUTES.contact,
    title: "Contacto",
    description:
      "Contacto RD Al Día: correcciones, alianzas, prensa o publicidad desde Santo Domingo. Envía tu mensaje ahora y te respondemos lo antes posible.",
    keywords: ["contacto", "correo", "prensa"],
    changeFrequency: "monthly",
    priority: 0.4,
  },
  privacy: {
    path: ROUTES.privacy,
    title: "Política de Privacidad",
    description:
      "Política de privacidad de RD Al Día: cómo cuidamos tu correo, el boletín y las visitas al sitio. Léela y pide borrar tus datos si lo deseas.",
    keywords: ["privacidad", "cookies", "datos personales"],
    changeFrequency: "yearly",
    priority: 0.3,
  },
};
