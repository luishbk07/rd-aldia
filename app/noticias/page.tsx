import type { Metadata } from "next";
import NewsAggregator from "@/components/NewsAggregator";

export const metadata: Metadata = {
  title: "Noticias",
  description:
    "Titulares de Listín Diario, El Caribe, Diario Libre y El Nacional. Un solo lugar para enterarte y salir al medio original.",
};

export default function NoticiasPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Prensa dominicana
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
        Noticias
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        Agregamos titulares de periódicos establecidos. RD Al Día no escribe
        estas notas: cada enlace abre en el medio original, en una pestaña
        nueva.
      </p>
      <div className="mt-10 max-w-3xl">
        <NewsAggregator limit={40} showMoreLink={false} showHeading={false} />
      </div>
    </div>
  );
}
