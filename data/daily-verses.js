/** Reina-Valera (tradición clásica). Un versículo por día, en ciclo. */

import { santoDomingoDayOfYear } from "../lib/calendar.js";

export const DAILY_VERSES = [
  {
    reference: "Jeremías 29:11",
    theme: "Esperanza",
    verse:
      "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.",
    explanation:
      "Cuando el dólar se mueve o el trabajo está corto, es fácil pensar que el futuro se cerró. Este versículo recuerda que Dios no improvisó tu historia: tiene un plan de paz, no de ruina. Sigue poniendo orden en lo que sí puedes controlar hoy.",
  },
  {
    reference: "Filipenses 4:13",
    theme: "Fortaleza",
    verse: "Todo lo puedo en Cristo que me fortalece.",
    explanation:
      "No promete que todo será fácil; promete fuerza para el tramo que te toca. Sea un turno largo, un trámite o un mes apretado, la fortaleza no sale solo de ti. Pide esa fuerza y da el siguiente paso, aunque sea pequeño.",
  },
  {
    reference: "Salmos 23:1",
    theme: "Provisión",
    verse: "Jehová es mi pastor; nada me faltará.",
    explanation:
      "En un país donde se mira el precio del combustible cada viernes, la escasez se siente cerca. David no niega las necesidades: afirma quién las cubre. Confía, trabaja con honradez y espera provisión sin dejar de ser prudente.",
  },
  {
    reference: "Proverbios 3:5-6",
    theme: "Fe",
    verse:
      "Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, y él enderezará tus veredas.",
    explanation:
      "A veces queremos resolverlo todo con cálculo: tasa, cuota, horario. La sabiduría cuenta, pero no sustituye a Dios. Encomiéndale las decisiones de la casa y del trabajo; Él endereza caminos torcidos.",
  },
  {
    reference: "Isaías 41:10",
    theme: "Ánimo",
    verse:
      "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.",
    explanation:
      "El miedo llega con una cuenta, un diagnóstico o una noticia. Dios no pide que finjas valentía: promete su presencia. Hoy puedes temblar y, aun así, no caminar solo.",
  },
  {
    reference: "Mateo 11:28",
    theme: "Descanso",
    verse: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.",
    explanation:
      "Entre el calor, el tráfico y las responsabilidades, muchos llegan agotados a la noche. Jesús no desprecia el cansancio: invita a soltar la carga. Date permiso de parar un rato y orar, no solo de seguir produciendo.",
  },
  {
    reference: "Josué 1:9",
    theme: "Valor",
    verse:
      "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que fueres.",
    explanation:
      "Hay días para cruzar un río: un examen, un viaje, un nuevo empleo. El valor no es ausencia de miedo, es obediencia con Dios al lado. Da el paso sin esperar a sentirte listo del todo.",
  },
  {
    reference: "Salmos 46:1",
    theme: "Protección",
    verse: "Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.",
    explanation:
      "Cuando viene un temporal o una crisis familiar, se busca un techo seguro. Este salmo dice que ese refugio tiene nombre. Corre a Dios primero, y después a las ayudas concretas que Él ponga en el camino.",
  },
  {
    reference: "Romanos 8:28",
    theme: "Esperanza",
    verse:
      "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.",
    explanation:
      "No todo lo que pasa es bueno, pero Dios puede tejerlo para bien. Una puerta que se cerró en el trabajo o en el extranjero no tiene la última palabra. Sigue amando a Dios y haciendo el bien donde estás.",
  },
  {
    reference: "Salmos 121:1-2",
    theme: "Ayuda",
    verse:
      "Alzaré mis ojos a los montes; ¿de dónde vendrá mi socorro? Mi socorro viene de Jehová, que hizo los cielos y la tierra.",
    explanation:
      "A veces miramos a un familiar en Nueva York, a un político o a un préstamo. El salmista alza la vista más alto: el socorro viene del Creador. Pide ayuda humana, sí, pero no pongas ahí toda tu fe.",
  },
  {
    reference: "Proverbios 22:6",
    theme: "Familia",
    verse:
      "Instruye al niño en su camino, y aun cuando fuere viejo no se apartará de él.",
    explanation:
      "Criar en el barrio, en la escuela y en la iglesia toma paciencia. Lo que se siembra en casa —oración, respeto, trabajo— no se pierde. No te desanimes si hoy no ves el fruto; sigue formando con amor y ejemplo.",
  },
  {
    reference: "Efesios 4:32",
    theme: "Perdón",
    verse:
      "Antes sed benignos unos con otros, misericordiosos, perdonándoos unos a otros, como Dios también os perdonó a vosotros en Cristo.",
    explanation:
      "En familias grandes y vecindarios cercanos, las ofensas se acumulan. El perdón no niega el daño; corta el ciclo. Empieza por una conversación honesta y por no guardar rencor en el corazón.",
  },
  {
    reference: "Colosenses 3:23",
    theme: "Trabajo",
    verse:
      "Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres.",
    explanation:
      "Da igual si atiendes un colmado, un aula o una oficina: el trabajo honrado es culto. Hazlo bien aunque nadie te esté mirando. Dios ve la excelencia cotidiana y eso sostiene la dignidad.",
  },
  {
    reference: "Salmos 37:5",
    theme: "Confianza",
    verse: "Encomienda a Jehová tu camino, y confía en él; y él hará.",
    explanation:
      "Hay decisiones que quitan el sueño: mudarse, invertir, casarse. Encomendar no es cruzarse de brazos; es poner el plan en las manos de Dios y seguir caminando. Él obra a su tiempo.",
  },
  {
    reference: "Juan 14:27",
    theme: "Paz",
    verse:
      "La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo.",
    explanation:
      "La paz del mundo depende de que todo esté quieto. La de Cristo cabe en un apagón, en una sala de espera o en un hogar ruidoso. Pídele esa paz antes de reaccionar con enojo.",
  },
  {
    reference: "Mateo 6:33",
    theme: "Prioridad",
    verse:
      "Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.",
    explanation:
      "Es fácil que el mes se vaya en correr detrás de lo urgente. Jesús reordena: primero el Reino, después lo demás. Ora, sé justo en tus tratos, y deja que Dios añada lo que falta.",
  },
  {
    reference: "Salmos 34:8",
    theme: "Gratitud",
    verse: "Gustad, y ved que es bueno Jehová; dichoso el hombre que confía en él.",
    explanation:
      "La gratitud se entrena: un plato de comida, un techo, un amigo que llama. Dios se deja encontrar en lo concreto. Hoy prueba a dar gracias en voz alta antes de pedir.",
  },
  {
    reference: "1 Pedro 5:7",
    theme: "Cuidado",
    verse: "Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.",
    explanation:
      "La ansiedad se disfraza de ‘estar pendiente de todo’. Pedro invita a echarla, no a reciclarla. Nombra tus preocupaciones en oración y suelta lo que no puedes cargar tú solo.",
  },
  {
    reference: "Isaías 40:31",
    theme: "Esperanza",
    verse:
      "Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán.",
    explanation:
      "Hay temporadas de espera: un visado, un resultado, una reconciliación. Esperar en Dios no es pasividad; es recargar fuerzas. Descansa en Él y volverás a volar.",
  },
  {
    reference: "Proverbios 17:17",
    theme: "Amistad",
    verse: "En todo tiempo ama el amigo, y el hermano para la angustia es nacido.",
    explanation:
      "Un verdadero amigo aparece en el velorio, en el hospital y cuando se acaba el mes. Cultiva esas amistades con lealtad, no solo en la fiesta. Sé tú también hermano en la angustia de otro.",
  },
  {
    reference: "Salmos 91:1-2",
    theme: "Protección",
    verse:
      "El que habita al abrigo del Altísimo, morará bajo la sombra del Omnipotente. Diré yo a Jehová: Esperanza mía, y castillo mío; mi Dios, en quien confiaré.",
    explanation:
      "Dormir en paz es un milagro cuando hay inseguridad o preocupación. Habitar al abrigo no es magia: es vivir cerca de Dios. Haz de la oración tu techo esta noche.",
  },
  {
    reference: "Gálatas 6:9",
    theme: "Perseverancia",
    verse:
      "No nos cansemos, pues, de hacer bien; porque a su tiempo segaremos, si no desmayamos.",
    explanation:
      "Hacer lo correcto a veces parece no pagar: devolver el vuelto, cuidar a un enfermo, estudiar de noche. La cosecha tiene fecha, aunque no la veas. No te canses hoy.",
  },
  {
    reference: "Salmos 127:3",
    theme: "Familia",
    verse: "He aquí, herencia de Jehová son los hijos; cosa de estima el fruto del vientre.",
    explanation:
      "Criar cuesta dinero, tiempo y nervios, pero los hijos no son un peso: son herencia. Míralos con ese honor. Invierte presencia, no solo provisión.",
  },
  {
    reference: "Mateo 5:16",
    theme: "Testimonio",
    verse:
      "Así alumbre vuestra luz delante de los hombres, para que vean vuestras buenas obras, y glorifiquen a vuestro Padre que está en los cielos.",
    explanation:
      "Tu fe se nota en cómo tratas al motoconcho, al compañero y a quien te sirve. La luz no es un letrero; son obras. Ilumina tu esquina del país con integridad.",
  },
  {
    reference: "Salmos 119:105",
    theme: "Sabiduría",
    verse: "Lámpara es a mis pies tu palabra, y lumbrera a mi camino.",
    explanation:
      "Cuando hay tantas voces —redes, rumores, consejos— hace falta una lámpara. Abre la Biblia aunque sea un versículo. Esa luz alcanza para el próximo paso, no tiene que mostrar toda la carretera.",
  },
  {
    reference: "2 Corintios 12:9",
    theme: "Gracia",
    verse:
      "Y me ha dicho: Bástate mi gracia; porque mi poder se perfecciona en la debilidad. Por tanto, de buena gana me gloriaré más bien en mis debilidades, para que repose sobre mí el poder de Cristo.",
    explanation:
      "La cultura a veces premia aparentar que todo está bien. Pablo muestra otra vía: la gracia cabe en la flaqueza. No escondas tu límite; déjalo ser el sitio donde Cristo se nota.",
  },
  {
    reference: "Salmos 37:4",
    theme: "Gozo",
    verse: "Deléitate asimismo en Jehová, y él te concederá las peticiones de tu corazón.",
    explanation:
      "El deleite no es un lujo de quien no tiene problemas. Es aprender a gozarse en Dios en medio de ellos. Alinea tus deseos con Él y verás peticiones que sí construyen vida.",
  },
  {
    reference: "Hebreos 13:5",
    theme: "Contentamiento",
    verse:
      "Sean vuestras costumbres sin avaricia, contentos con lo que tenéis ahora; porque él dijo: No te desampararé, ni te dejaré.",
    explanation:
      "Compararse con el vecino o con quien ‘se fue’ desgasta el alma. El contentamiento no niega ambición sana; niega la avaricia. Dios no te deja, aunque el bolsillo esté justo.",
  },
  {
    reference: "Juan 16:33",
    theme: "Victoria",
    verse:
      "Estas cosas os he hablado para que en mí tengáis paz. En el mundo tendréis aflicción; pero confiad, yo he vencido al mundo.",
    explanation:
      "Jesús no vende un mundo sin aflicción. Vende paz en medio de ella y una victoria ya ganada. Confía hoy: el mal no tiene la última palabra sobre tu vida.",
  },
  {
    reference: "Salmos 55:22",
    theme: "Carga",
    verse:
      "Echa sobre Jehová tu carga, y él te sustentará; no dejará para siempre caído al justo.",
    explanation:
      "Hay cargas que no se ven: deudas, secretos, cansancio de cuidar a otros. Échalas sobre Dios, no sobre más café. Él sustenta y no te deja tirado en el camino.",
  },
  {
    reference: "Romanos 15:13",
    theme: "Esperanza",
    verse:
      "Y el Dios de esperanza os llene de todo gozo y paz en el creer, para que abundéis en esperanza por el poder del Espíritu Santo.",
    explanation:
      "La esperanza cristiana no es ilusión: es fruto del Espíritu. Pide gozo y paz para creer de nuevo. Que tu casa se note más clara, no más amarga.",
  },
  {
    reference: "Proverbios 16:3",
    theme: "Trabajo",
    verse: "Encomienda a Jehová tus obras, y tus pensamientos serán afirmados.",
    explanation:
      "Antes de abrir el negocio o enviar el currículum, encomienda la obra. Dios afirma la mente cuando el plan pasa por sus manos. Empieza el día así, no solo con prisa.",
  },
  {
    reference: "Miqueas 6:8",
    theme: "Justicia",
    verse:
      "Oh hombre, él te ha declarado lo que es bueno, y qué pide Jehová de ti: solamente hacer justicia, y amar misericordia, y humillarte ante tu Dios.",
    explanation:
      "La fe se juega en lo público y en lo íntimo: pagar lo justo, no aprovecharse, ayudar al débil. Eso pide el Señor, no un espectáculo. Sé justo y misericordioso en tu calle.",
  },
  {
    reference: "Salmos 118:24",
    theme: "Alegría",
    verse: "Este es el día que hizo Jehová; nos gozaremos y alegraremos en él.",
    explanation:
      "Hoy no es un día cualquiera: es un día hecho. Aunque el sol pegue fuerte o la agenda apriete, elige alegrarte. La alegría también es obediencia.",
  },
  {
    reference: "Isaías 26:3",
    theme: "Paz",
    verse:
      "Tú guardarás en completa paz a aquel cuyo pensamiento en ti persevera; porque en ti ha confiado.",
    explanation:
      "La mente que da vueltas al problema pierde paz. Fijar el pensamiento en Dios no es negar la realidad; es anclarla. Vuelve a Él cada vez que la cabeza se dispare.",
  },
  {
    reference: "1 Tesalonicenses 5:16-18",
    theme: "Gratitud",
    verse:
      "Estad siempre gozosos. Orad sin cesar. Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús.",
    explanation:
      "Gozo, oración y gratitud no son tres lujos: son voluntad de Dios. Practícalos en el guagua, en la cocina y en la fila. Así se transforma un día común.",
  },
];

export function getDailyVerse(now = new Date()) {
  const { dayOfYear, iso } = santoDomingoDayOfYear(now);
  const verse = DAILY_VERSES[dayOfYear % DAILY_VERSES.length];
  return { ...verse, dayOfYear, iso };
}
