import { santoDomingoDayOfYear } from "../lib/calendar.js";

export const CATEGORY_LABELS = {
  budgeting: "Presupuesto",
  saving: "Ahorro",
  debt: "Deudas",
  investment: "Inversión",
  scams: "Estafas",
};

export const FINANCIAL_TIPS = [
  {
    title: "El método 50/30/20",
    category: "budgeting",
    icon: "💵",
    tip: "Parte tus ingresos así: 50% necesidades (comida, luz, transporte), 30% gustos y 20% ahorro o deudas. Si el 50% no alcanza, recorta el 30% primero, no el ahorro. Anótalo el día de pago, no ‘de memoria’.",
  },
  {
    title: "Ahorra en el colmado",
    category: "saving",
    icon: "🛒",
    tip: "Haz una lista de 8–10 productos fijos y no entres ‘a ver’. El fiado y las compras sueltas suben el ticket sin que lo notes. Compara el arroz, el aceite y el pollo con el supermercado una vez al mes.",
  },
  {
    title: "Evita las deudas de Navidad",
    category: "debt",
    icon: "💳",
    tip: "Empieza un sobre ‘Navidad’ en enero, aunque sea RD$200 por quincena. En diciembre compras con cash, no con 12 cuotas. La fiesta se disfruta más sin enero amargo.",
  },
  {
    title: "Tu presupuesto en un cuaderno",
    category: "budgeting",
    icon: "📓",
    tip: "No hace falta una app cara: anota cada gasto de 7 días (guagua, data, almuerzo, colmado). Al octavo día ya ves fugas. Repite un mes y ajusta. Lo que no se escribe, se escapa.",
  },
  {
    title: "El método del sobre",
    category: "saving",
    icon: "✉️",
    tip: "Separa el efectivo en sobres: comida, transporte, luz y ‘imprevistos’. Cuando el sobre se acaba, se acaba. Es incómodo al principio y después te da paz: el dinero ya tiene dueño.",
  },
  {
    title: "Habla con el banco o la cooperativa",
    category: "debt",
    icon: "🏦",
    tip: "Si te atrasaste, llama antes de que te llamen. Pide consolidar, bajar la cuota o un periodo de gracia. Lleva tu historial de ingresos. Callar sale más caro que negociar.",
  },
  {
    title: "Nadie se hace rico en 15 días",
    category: "scams",
    icon: "⚠️",
    tip: "Si te prometen 10% semanal, crypto ‘seguro’ o un grupo de WhatsApp que ‘nunca pierde’, es trampa. El dinero serio no persigue gente por mensaje. Pregunta en Superintendencia de Bancos antes de invertir.",
  },
  {
    title: "Qué es un CDP",
    category: "investment",
    icon: "📈",
    tip: "Un certificado de depósito a plazo es ahorrar en el banco a un tiempo fijo (30, 90, 180 días) a una tasa pactada. No es para el dinero de la comida. Es para lo que no vas a tocar. Compara tasas entre bancos y cooperativas.",
  },
  {
    title: "Baja la factura de luz",
    category: "saving",
    icon: "💡",
    tip: "Desconecta el cargador, usa LED y no dejes el aire a 18°. El inverter ayuda, pero el hábito ahorra más. En hora pico, retrasa lavadora y plancha. Cada peso que no se va en kWh puede ir al sobre de emergencia.",
  },
  {
    title: "Remesas: no cobres al peor tipo",
    category: "saving",
    icon: "🌍",
    tip: "Antes de cobrar, mira el tipo de cambio en dos casas y en tu banco. A veces conviene recibir en dólares y vender cuando te convenga, no el mismo día a la carrera. Pregunta comisiones: el ‘gratis’ a veces se come en la tasa.",
  },
  {
    title: "Combustible: llena el viernes con cabeza",
    category: "budgeting",
    icon: "⛽",
    tip: "El MICM cambia precios los viernes. Si puedes, llena cuando te convenga según el anuncio, no por pánico. Un presupuesto de transporte semanal (RD$ fijos) evita que la gasolina se coma el mercado.",
  },
  {
    title: "GLP o electricidad: cuenta el mes",
    category: "budgeting",
    icon: "🔥",
    tip: "No asumas que ‘el gas siempre es más barato’. Anota un mes de bombona vs. lo que gastarías en estufa eléctrica. Elige con números, no con costumbre. Ajusta recetas y no desperdicies fuego encendido.",
  },
  {
    title: "Cooperativa vs. prestamista",
    category: "debt",
    icon: "🤝",
    tip: "La tasa de la esquina parece fácil y termina cara. Una cooperativa regulada te pide papeles, pero el costo total suele ser menor. Lee la TEA, no solo la cuota. Si no te explican el total a pagar, no firmes.",
  },
  {
    title: "Préstamos por WhatsApp",
    category: "scams",
    icon: "📱",
    tip: "Nadie te deposita sin datos y después ‘solo transfiere la garantía’. No envíes cédula ni código de banco a desconocidos. Si te presionan con ‘hoy o se acaba’, cuelga. El crédito serio tiene sucursal y contrato.",
  },
  {
    title: "Un ingreso extra, aunque sea chiquito",
    category: "saving",
    icon: "🛠️",
    tip: "Un turno de delivery, tutoría, uñas o reventa no te hace rico, pero rompe la asfixia. Destina el 100% de ese extra al sobre de emergencia hasta tener un mes de gastos. Después, 50% extra y 50% vida.",
  },
  {
    title: "Tu fondo de ‘se jodió el mes’",
    category: "saving",
    icon: "🛟",
    tip: "La meta realista no es 6 meses de sueldo de un golpe: es RD$500 constantes. Cuando llegues a 1 mes de comida y luz, ya duermes distinto. Guárdalo donde no esté a un toque de la cuenta del colmado.",
  },
  {
    title: "La tarjeta no es ingreso",
    category: "debt",
    icon: "💳",
    tip: "Si no puedes pagar el saldo completo, no la uses para el pollo. Los intereses se comen el 20% que querías ahorrar. Una tarjeta sirve para imprevistos grandes, no para el día a día. Si ya estás en el mínimo, deja de usarla.",
  },
  {
    title: "Súper vs. colmado: una lista, dos precios",
    category: "budgeting",
    icon: "🧾",
    tip: "Una vez al mes lleva la misma lista a ambos. Lo seco (arroz, habichuelas, aceite) a veces gana el súper; lo de último minuto, el colmado. Compra seco en bloque y fresco cerca. El hábito vence al antojo.",
  },
  {
    title: "Hora pico eléctrica",
    category: "saving",
    icon: "🔌",
    tip: "Lava y plancha fuera del pico, y no enciendas el horno ‘un rato’. El inverter no perdona mal uso. Si hay apagones, un cargador de celular y linterna LED salen más baratos que dañar nevera con subidas: usa protector.",
  },
  {
    title: "Cambia dólares con calma",
    category: "saving",
    icon: "💱",
    tip: "La remesa no es para cambiarla toda en la primera ventanilla. Mira RD Al Día, pregunta en dos sitios y cambia lo de la semana. Si el dólar está loco, no te apures a ‘adivinar el piso’: cubre gastos, no especules con la comida.",
  },
  {
    title: "Tu AFP no es un misterio",
    category: "investment",
    icon: "👴",
    tip: "Entra al portal de tu AFP una vez al año: saldo, comisión y si estás en el fondo correcto para tu edad. No retires por pánico. Es dinero de tu yo viejo. Si te ofrecen ‘pasarlo a un negocio seguro’, es una bandera roja.",
  },
  {
    title: "Mira tu historial de crédito",
    category: "debt",
    icon: "📊",
    tip: "Antes de pedir un préstamo, pide tu informe. Un atraso olvidado te sube la tasa. Paga primero lo que reporta y pide carta de saldo. El historial limpio es más barato que cualquier ‘oferta’.",
  },
  {
    title: "Cuotas de tienda: lee el total",
    category: "debt",
    icon: "📺",
    tip: "El abanico o el celular a 24 cuotas puede costar casi dos veces el precio de contado. Multiplica cuota × meses y compara. Si no puedes de contado, espera o busca usado. El ‘solo RD$x a la semana’ esconde el total.",
  },
  {
    title: "La lotería no es un plan",
    category: "scams",
    icon: "🎟️",
    tip: "Jugar de vez en cuando es un gusto; jugar para ‘salir’ es un hueco. Ponle tope semanal (o cero) y muévelo al sobre de ahorro. Nadie construyó casa con el chance como sueldo.",
  },
  {
    title: "Hablen de dinero en familia",
    category: "budgeting",
    icon: "👨‍👩‍👧‍👦",
    tip: "Una reunión de 20 minutos: qué entra, qué sale, qué se debe. Sin gritos. Los hijos adolescentes pueden saber que la luz no es infinita. El secreto y el reproche salen más caros que un presupuesto compartido.",
  },
  {
    title: "Vende lo que no usas",
    category: "saving",
    icon: "📦",
    tip: "El teléfono viejo, el abanico extra, la ropa en buen estado: Marketplace o el grupo del barrio. Ese efectivo va al fondo de emergencia, no a otro antojo. Despejas la casa y ganas aire financiero.",
  },
  {
    title: "Datos y minutos: el plan correcto",
    category: "budgeting",
    icon: "📶",
    tip: "Revisa un mes de recargas. Si siempre te pasas, un plan puede salir más barato; si casi no usas, el prepago con tope. Apaga datos de fondo. La factura ‘chiquita’ semanal se vuelve un sueldo en un año.",
  },
  {
    title: "Útiles en agosto, no en pánico",
    category: "budgeting",
    icon: "📚",
    tip: "Lista de la escuela en julio, compras en agosto por partes. Evita el préstamo de septiembre. Reusa mochilas y compara tres colmados/papelerías. La educación se paga mejor sin intereses de última hora.",
  },
  {
    title: "Efectivo para el temporal",
    category: "saving",
    icon: "🌀",
    tip: "En temporada de huracanes, aparta agua, linterna y un sobre de efectivo pequeño: los cajeros y el data fallan. No es paranoia; es un seguro casero. Revisa el sobre cada junio.",
  },
  {
    title: "La caja del negocio no es tuya",
    category: "budgeting",
    icon: "🏪",
    tip: "Si tienes colmado, taller o ventas: sueldo fijo para la casa, aparte de la caja. Si mezclas, no sabes si ganaste. Anota compras vs. ventas 7 días. Un negocio sin números es un hobby caro.",
  },
];

export function getDailyFinancialTip(now = new Date()) {
  const { dayOfYear, iso } = santoDomingoDayOfYear(now);
  const tip = FINANCIAL_TIPS[dayOfYear % FINANCIAL_TIPS.length];
  return { ...tip, dayOfYear, iso };
}
