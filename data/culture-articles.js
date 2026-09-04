function unsplash(photoId) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1600&q=80`;
}

export const CULTURE_ARTICLES = [
  {
    slug: "el-colmado",
    title: "El colmado: el corazón del barrio",
    excerpt:
      "Más que una tienda: es banco informal, radio comunitaria y sala de estar de la esquina. Así late el barrio alrededor del mostrador.",
    readMinutes: 6,
    featured: true,
    image: unsplash("photo-1559339352-11d035aa65de"),
    imageAlt: "Colmado dominicano en una esquina de barrio en República Dominicana",
    body: [
      "En República Dominicana el colmado no es solo donde se compra el arroz. Es donde se fía hasta el quince, se discute el partido del Licey y se enteran primero de quién se mudó o quién llegó de Nueva York. El mostrador es un escenario pequeño y eterno.",
      "Nació como almacén de víveres y se quedó como institución. Hay colmados con nevera de cerveza, altavoz y un banco de madera que ha visto tres generaciones. El dueño conoce tu nombre, el de tu mamá y cuántos huevos te faltan para el desayuno.",
      "También es economía popular: empleo, crédito vecinal y el primer trabajo de muchos adolescentes. Cuando sube el dólar o el combustible, el colmado es el termómetro que la gente toca todos los días, no el boletín.",
      "Celebrarlo no es nostalgia barata. Es reconocer que el país se organiza, todavía, alrededor de una esquina con luz, música y alguien que te dice: «pasa, que eso te lo apunto».",
    ],
  },
  {
    slug: "merengue",
    title: "Merengue: el ritmo que nació en el campo",
    excerpt:
      "Del Cibao al mundo: acordeón, güira y tambora. Cómo un baile de fiesta de pueblo se volvió himno nacional y marca del país.",
    readMinutes: 5,
    featured: false,
    image: unsplash("photo-1429962714451-bb934ecdc4ec"),
    imageAlt: "Público en un concierto de merengue en República Dominicana",
    body: [
      "El merengue no pidió permiso en salones elegantes. Creció en fiestas de campo, con acordeón, güira y tambora, cuando el piso era tierra y el techo, estrellas. Por eso suena a cosecha, a gallera y a domingo largo.",
      "En el siglo XX salió del Cibao hacia la radio, los cabarets y las grandes orquestas. Se pulió sin perder el golpe. UNESCO lo reconoció como patrimonio, pero el reconocimiento verdadero sigue siendo el de una familia que no puede oír un güira sin mover un pie.",
      "Hoy convive con la bachata y el dembow, y aún así abre desfiles, campañas y bodas. El merengue es diplomacia suave: donde suena, hay República Dominicana aunque el mapa diga otra cosa.",
      "Si quieres entender el país, no empieces por un discurso. Empieza por un paso sencillo, un coro que todos saben y esa certeza de que el ritmo cabe en cualquier patio.",
    ],
  },
  {
    slug: "bachata",
    title: "La bachata: música de amor y desamor",
    excerpt:
      "De los bares mal vistos a las listas globales. La historia de un género que nació herido y terminó abrazando al mundo.",
    readMinutes: 6,
    featured: true,
    image: unsplash("photo-1470229722913-7c0e2dbbafd3"),
    imageAlt: "Pareja bailando bachata en un salón de República Dominicana",
    body: [
      "Hubo un tiempo en que la bachata era «música de guardia». Se escondía en bares, en radios de pueblo, en casetes que nadie ponía en la sala cuando llegaba visita. Hablaba de abandono, de ron y de cartas que no llegaban.",
      "Esa vergüenza ajena no mató el género: lo hizo más honesto. La guitarra, el bongó y la güira contaron lo que el merengue de orquesta a veces no podía: el despecho cotidiano, el barrio, la espera del que se fue.",
      "Después vinieron arreglos más limpios, el baile de salón y nombres que llenaron estadios. Lo que era margen se volvió exportación. Aun así, la bachata buena sigue oliendo a esquina y a corazón roto, no solo a luces de festival.",
      "Por eso conmueve tanto aquí: casi todos tenemos una historia que cabe en cuatro acordes. La bachata no pide que seas feliz. Pide que recuerdes, y que bailes igual.",
    ],
  },
  {
    slug: "palo-encebado",
    title: "El palo encebado: una tradición de fuerza",
    excerpt:
      "Un palo, sebo, premios arriba y un pueblo entero gritando. Así se celebra el ingenio colectivo cada fiesta patronal.",
    readMinutes: 5,
    featured: false,
    image: unsplash("photo-1533174072545-7a4b6ad7a6c3"),
    imageAlt: "Fiesta patronal dominicana con palo encebado y público en la calle",
    body: [
      "El palo encebado parece broma hasta que lo intentas. Un tronco alto, engrasado, y en la punta un premio: dinero, un jamón, a veces una bicicleta. Abajo, una fila de valientes y un público que no perdona.",
      "No gana el más fuerte: gana el que organiza. Unos hacen escalera humana, otros se untan arena o harina, alguien grita la estrategia. Es deporte, teatro y orgullo de barrio en cinco minutos de suspenso.",
      "Se ve en fiestas patronales, carnavales y días de pueblo. Los niños aprenden que el éxito a veces es sucio, colectivo y ruidoso. Los mayores recuerdan cuando ellos también resbalaron frente a todo el mundo.",
      "En un país que ama la competencia con sonrisa, el palo encebado es un espejo: hay que trepar, hay que caerse, y hay que volver a intentar mientras el vecino filmando se ríe con cariño.",
    ],
  },
  {
    slug: "diablos-cojuelos",
    title: "Los Diablos Cojuelos: el carnaval dominicano",
    excerpt:
      "Máscaras, vejigas y colores que no piden permiso. El diablo cojuelo es juego, crítica y memoria africana e ibérica a la vez.",
    readMinutes: 6,
    featured: false,
    image: unsplash("photo-1514525253161-7a46d19cd819"),
    imageAlt: "Carnaval dominicano con luces y disfraces de diablos cojuelos",
    body: [
      "Si el carnaval dominicano tuviera un santo laico, sería el diablo cojuelo: cojea, persigue, golpea con vejiga y se ríe de los que corren. La máscara —cuernos, dientes, espejos, papelillo— es un altar portátil.",
      "Hay genealogía española y raíz africana, y hay orgullo local: La Vega, Santiago, Santo Domingo, cada quien con su diablo. El disfraz cuesta meses de trabajo. No es souvenir; es identidad que se suda en febrero.",
      "El juego tiene reglas no escritas: se corre, se grita, se perdona. Los turistas se asustan; los de aquí saben que el susto es parte del cariño. El carnaval limpia el año con ruido y con belleza extraña.",
      "Mirar un diablo de cerca es entender que este país no es solo playa. También es máscara, crítica social y la certeza de que el mal, si se disfraza bien, se puede bailar.",
    ],
  },
  {
    slug: "el-cocuyo",
    title: "El cocuyo: el insecto que ilumina noches",
    excerpt:
      "Antes del bombillo barato, el patio tenía estrellas a ras de hierba. El cocuyo es ciencia, juego de infancia y metáfora que no se apaga.",
    readMinutes: 5,
    featured: false,
    image: unsplash("photo-1419242902214-272b3f66ee7a"),
    imageAlt: "Noche en el campo dominicano, cielo oscuro como cuando se ven cocuyos",
    body: [
      "Quien creció en patio de pueblo o en solar de ciudad todavía sin tanta luz, conoce el cocuyo: un punto verde que se enciende y se apaga, como si el monte respirara. Los niños lo cazaban con frascos. Los abuelos decían que anunciaba visitas o lluvia.",
      "Biología aparte —es un escarabajo que fabrica su propia lámpara— el cocuyo es patrimonio emocional. En un país de apagones, un insecto que no le debe nada a Edesur se siente casi político.",
      "Hoy hay menos oscuridad verdadera y, con ella, menos cocuyos a la vista. Conservar un rincón sin contaminar de luz es también conservar infancia. No todo progreso tiene que borrar el verde de la noche.",
      "Cuando alguien dice «brillaba como un cocuyo», no habla de entomología. Habla de esperanza chiquita, intermitente y viva. RD Al Día lo trae aquí para que no se nos olvide mirar al suelo cuando se apaga el farol.",
    ],
  },
  {
    slug: "merengue-tipico",
    title: "El merengue típico (perico ripiao)",
    excerpt:
      "Acordeón que llora y tambora que empuja. El perico ripiao es el merengue sin corbata: el de la fiesta que no cierra.",
    readMinutes: 5,
    featured: false,
    image: unsplash("photo-1511379938547-c1f69419868d"),
    imageAlt: "Acordeón y tambora de merengue típico perico ripiao",
    body: [
      "El merengue típico, el perico ripiao, no necesita saxofones de big band. Con acordeón, tambora y güira basta para armar un país. Es el sonido de Santiago, de fiestas de palo, de radios que no se apagan en el Cibao.",
      "Se le ha dicho rústico, como si rústico fuera un insulto. Al contrario: es precisión popular. El acordeonista improvisa, el güirero marca el pulso, la tambora conversa. Quien baila sabe que el típico no perdona el paso flojo.",
      "Mientras el merengue de orquesta viajaba a hoteles, el típico se quedó en el patio y en la gallera, y por eso sobrevivió a las modas. Hoy vuelve a escenarios grandes sin pedir disculpas por su acento.",
      "Si el merengue es la cédula cultural, el perico ripiao es la foto de cuando éramos niños: más polvo, más sudor, más verdad.",
    ],
  },
  {
    slug: "atabales",
    title: "Las atabales: tambores de la herencia africana",
    excerpt:
      "Tres cueros, una cofradía y un santo. Las atabales no son folklore de postal: son fe, memoria y resistencia que todavía suena.",
    readMinutes: 6,
    featured: false,
    image: unsplash("photo-1519892300165-cb5542fb47c7"),
    imageAlt: "Tambores atabales de la herencia africana en República Dominicana",
    body: [
      "Las atabales —o palos— son el hilo africano que el Caribe no dejó cortar. Tambores de distinto tamaño, toques para el santo, cantos que suben como incienso. En muchas comunidades no es espectáculo: es obligación sagrada.",
      "Llegan con las cofradías, con el velorio, con la fiesta de palos. El cuerpo entra en trance o, al menos, en otro tiempo. Quien no ha sentido un palo de cerca no ha oído del todo la isla.",
      "Durante décadas se les miró con recelo desde lo «decente». Esa vergüenza es colonial. Hoy, cada vez más, se enseña, se graba y se respeta. No para musealizarlos, sino para que los jóvenes no crean que la dominicanidad empieza en el merengue de hotel.",
      "Escuchar atabales es aceptar que este país es mestizo de verdad, no de discurso. El cuero habla cuando el papel se queda corto.",
    ],
  },
];

export function getCultureArticle(slug) {
  return CULTURE_ARTICLES.find((article) => article.slug === slug) || null;
}

export function featuredCulture() {
  return CULTURE_ARTICLES.filter((article) => article.featured);
}
