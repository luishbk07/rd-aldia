import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/pages";
import { ROUTES, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = pageMetadata(PAGE_SEO.about);

const VALUES = [
  {
    title: "Al día, no al ruido",
    text: "Combustible, dólar, clima y el partido: lo que la gente abre antes de salir. Sin relleno.",
  },
  {
    title: "Hecho en RD",
    text: "Hora de Santo Domingo, ciudades del país, LIDOM primero. El resto del mundo entra si nos toca.",
  },
  {
    title: "Fuentes claras",
    text: "Los titulares salen al medio original. Los precios y tasas dicen de dónde vienen.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        El medio
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
        Acerca de {SITE_NAME}
      </h1>
      <p className="mt-4 text-base leading-7 text-muted">
        Un hub diario para República Dominicana: lo que importa hoy, en un
        solo lugar. No pretendemos ser todos los periódicos. Queremos que
        abras la mañana y ya sepas el combustible, el dólar, el clima, el
        béisbol y los titulares.
      </p>

      <section className="mt-10">
        <h2 className="font-heading text-xl font-semibold text-heading">
          Misión
        </h2>
        <p className="mt-2 text-base leading-7 text-muted">
          Ahorrar tiempo a quien vive y trabaja en el país. Publicamos datos
          oficiales cuando existen, agregamos prensa establecida con enlace de
          salida, y cuidamos cultura, turismo, una palabra del día y un
          consejo de bolsillo. La fecha que manda es la de Santo Domingo.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-xl font-semibold text-heading">
          Cómo trabajamos
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {VALUES.map((item) => (
            <li
              key={item.title}
              className="rounded-xl border border-edge bg-surface p-4 shadow-card dark:shadow-none"
            >
              <p className="font-heading text-sm font-semibold text-heading">
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-xl font-semibold text-heading">
          Equipo
        </h2>
        <p className="mt-2 text-base leading-7 text-muted">
          Somos un proyecto independiente, pequeño, con base en Santo Domingo.
          No hay una redacción de decenas de personas detrás de cada cifra:
          hay un equipo reducido que mantiene las secciones, las fuentes y el
          sitio. Si algo está mal, queremos saberlo.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-xl font-semibold text-heading">
          Hacia dónde vamos
        </h2>
        <p className="mt-2 text-base leading-7 text-muted">
          Seguir siendo el lugar de consulta diaria: más puntualidad en
          datos, mejor mapa del clima, y cultura y turismo que no se sientan
          de folleto. La publicidad ayuda a sostener el medio; no compra el
          criterio.
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button href={ROUTES.contact} variant="primary">
          Escribirnos
        </Button>
        <Button href={ROUTES.advertise} variant="outline">
          Anúnciate
        </Button>
      </div>
    </div>
  );
}
