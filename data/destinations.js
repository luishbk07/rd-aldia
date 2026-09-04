function unsplash(photoId) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1600&q=80`;
}

export const DESTINATION_CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "beach", label: "Playa" },
  { id: "mountain", label: "Montaña" },
  { id: "city", label: "Ciudad" },
  { id: "colonial", label: "Colonial" },
  { id: "adventure", label: "Aventura" },
];

export const DESTINATIONS = [
  {
    slug: "zona-colonial",
    name: "Zona Colonial",
    region: "Santo Domingo",
    bestTime: "Noviembre – abril",
    categories: ["city", "colonial"],
    featured: true,
    image: unsplash("photo-1555881400-74d7eac00235"),
    imageAlt: "Calle empedrada de la Zona Colonial en Santo Domingo",
    description:
      "La cuna urbana de América: cal, piedra y faroles. Camina El Conde, entra a un patio y entiende por qué el país se cuenta también en ruinas vivas.",
    body: [
      "La Zona Colonial no es un museo con horario: es un barrio que respira turismo, vecinos y vendedores. La Catedral, el Alcázar y las calles de piedra concentran cinco siglos en pocas cuadras.",
      "El mejor momento es la brisa seca de fin de año, cuando caminar de día no derrite y de noche hay terraza. Evita el mediodía de agosto si puedes: el calor aquí también es patrimonio.",
      "Come en un patio, visita un museo chico y déjate perder. El encanto no está solo en los monumentos, sino en el merengue que se cuela desde un colmado a dos cuadras del farol colonial.",
    ],
  },
  {
    slug: "punta-cana",
    name: "Punta Cana",
    region: "Este",
    bestTime: "Diciembre – abril",
    categories: ["beach"],
    featured: true,
    image: unsplash("photo-1507525428034-b723cf961d3e"),
    imageAlt: "Playa de arena clara y mar turquesa en Punta Cana",
    description:
      "El cartel mundial de la RD: arena clara, todo incluido y un mar que parece de anuncio. Vale ir más allá del hotel, hacia el pueblo y los arrecifes.",
    body: [
      "Punta Cana sostiene buena parte del empleo turístico del país. Es eficiente, soleada y, si te quedas solo en el resort, un poco genérica. El truco es salir: Bávaro, capillas de piedra, un snorkel con respeto al coral.",
      "Diciembre a abril es alta y más seca. El verano trae más lluvia y a veces sargazo: pregunta antes, no canceles el país entero por una temporada.",
      "Para dominicanos, no es solo «allá los gringos». Es trabajo de primos, taxis, animación y orgullo de que el mundo haga fila para un atardecer nuestro.",
    ],
  },
  {
    slug: "samana",
    name: "Samaná",
    region: "Península de Samaná",
    bestTime: "Enero – marzo (ballenas)",
    categories: ["beach", "adventure"],
    featured: false,
    image: unsplash("photo-1559827260-dc66d52bef19"),
    imageAlt: "Costa tropical con palmeras en Samaná, República Dominicana",
    description:
      "Ballenas jorobadas en invierno, saltos de agua y playas que todavía saben a pueblo. Samaná es el este soñado sin tanto mármol de lobby.",
    body: [
      "De enero a marzo las jorobadas entran a la bahía a parir y cortejar. Verlas no es un lujo de revista: es un ritual que los lancheros de Samaná conocen de memoria. Reserva con operadores que respetan la distancia.",
      "El resto del año quedan El Limón, Las Galeras, Cayo Levantado y una gastronomía de coco y pescado. El clima es más húmedo que el de Punta Cana; lleva chubasquero y paciencia.",
      "Samaná enseña que el turismo puede ser contemplación, no solo buffet. Si puedes, quédate un domingo en el pueblo y come donde comen los de aquí.",
    ],
  },
  {
    slug: "santiago",
    name: "Santiago de los Caballeros",
    region: "Cibao",
    bestTime: "Diciembre – marzo",
    categories: ["city"],
    featured: false,
    image: unsplash("photo-1449824913935-59a10b8d2000"),
    imageAlt: "Atardecer en Santiago de los Caballeros, Cibao",
    description:
      "La segunda ciudad no pide selfies de playa: pide monumentos, merengue típico y el orgullo cibaeño que mueve al país desde adentro.",
    body: [
      "Santiago es trabajo, universidades, cigarros y un Monumento a los Héroes que vigila el valle. Quien solo conoce la capital se pierde la otra mitad de la conversación nacional.",
      "El clima de invierno es más fresco que el del sur. Recorre el centro, un museo del merengue o del tabaco, y come sancocho como si el Cibao te examinara.",
      "No es destino de luna de miel clásico. Es destino de entender República Dominicana: productivo, musical y un poco testarudo, en el mejor sentido.",
    ],
  },
  {
    slug: "barahona",
    name: "Barahona",
    region: "Suroeste",
    bestTime: "Diciembre – abril",
    categories: ["beach", "mountain", "adventure"],
    featured: false,
    image: unsplash("photo-1476514525535-07fb3b4ae5f1"),
    imageAlt: "Costa y montañas del suroeste en Barahona",
    description:
      "Donde la sierra se tira al mar. Playas oscuras, Bahía de las Águilas cerca y un sur que todavía no se vendió del todo al todo incluido.",
    body: [
      "Barahona es carretera de acantilado, playas de arena oscura y un horizonte que mezcla verde y azul. Desde ahí se salta a Polo, a la sierra y, con tiempo, a Pedernales y Bahía de las Águilas.",
      "El turismo aquí pide 4x4 mental: menos spa, más paisaje. Lleva efectivo, respeto por las comunidades y ganas de no comparar todo con Bávaro.",
      "El suroeste es tesis de país diverso. Si solo conoces el este all inclusive, Barahona te corrige con viento y con silencio.",
    ],
  },
  {
    slug: "las-terrenas",
    name: "Las Terrenas",
    region: "Samaná",
    bestTime: "Diciembre – abril",
    categories: ["beach"],
    featured: false,
    image: unsplash("photo-1506953821276-2d1f7d68c337"),
    imageAlt: "Playa de agua clara en Las Terrenas, Samaná",
    description:
      "Pueblo playero con acento europeo y alma de pescadores. Cosón, Punta Popy y atardeceres que no necesitan influencer.",
    body: [
      "Las Terrenas mezcló migración europea, negocios locales y playa larga. El resultado es un pueblo caminable, con panaderías, olas y un ritmo más lento que Punta Cana.",
      "El mar cambia de humor: hay días de postal y días de viento. Pregunta a los pescadores antes de meterte. El mejor lujo sigue siendo un coco y no tener prisa.",
      "Para dominicanos es fin de semana posible, no solo luna de miel importada. Cuida el plástico: esa costa se merece más que selfies.",
    ],
  },
  {
    slug: "puerto-plata",
    name: "Puerto Plata",
    region: "Norte",
    bestTime: "Diciembre – abril",
    categories: ["beach", "city", "adventure"],
    featured: false,
    image: unsplash("photo-1469854523086-cc02fe5d8800"),
    imageAlt: "Costa del Atlántico vista desde un mirador en Puerto Plata",
    description:
      "El Atlántico, el teleférico al Isabel de Torres y un malecón con historia de turismo pionero. El norte tiene carácter.",
    body: [
      "Antes de que el este se comiera el mapa turístico, Puerto Plata ya recibía visitantes. El teleférico sube a un jardín en la montaña; abajo, el océano pega más duro que el Caribe del este.",
      "Casa de campo victorianas, rum y playas de Sosúa y Cabarete cerca: viento para kitesurf, olas para quien las busque. El invierno es más seco; el verano, más húmedo y vivo.",
      "Sube al teleférico un día claro. El país se entiende mejor visto desde arriba: verde, techos y un mar que no es de piscina.",
    ],
  },
  {
    slug: "constanza",
    name: "Constanza",
    region: "Cordillera Central",
    bestTime: "Diciembre – febrero (frío)",
    categories: ["mountain", "adventure"],
    featured: false,
    image: unsplash("photo-1464822759023-fed622ff2c3b"),
    imageAlt: "Valle de montañas con niebla en Constanza, Cordillera Central",
    description:
      "La Suiza criolla: fresa, repollo, chaqueta y nubes. Constanza recuerda que en la isla también se tiembla de frío.",
    body: [
      "A más de mil metros, Constanza cultiva lo que el llano no puede: flores, vegetales, un aire que pide abrigo. Los capitalinos van a «sentir frío» y a comer fresa como si fuera milagro.",
      "Diciembre a febrero es el ritual. Hay niebla, hay curvas y hay que manejar con respeto. El valle es frágil: turismo de picnic no debería dejar basura en los sembradíos.",
      "Constanza completa el mapa emocional del dominicano: no solo playa y merengue. También montaña, silencio y un chocolate caliente que sabe a país alto.",
    ],
  },
];

export function getDestination(slug) {
  return DESTINATIONS.find((item) => item.slug === slug) || null;
}

export function featuredDestinations() {
  return DESTINATIONS.filter((item) => item.featured);
}
