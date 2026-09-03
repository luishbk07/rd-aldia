import type { Metadata } from "next";
import DailyVerse from "@/components/DailyVerse";

export const metadata: Metadata = {
  title: "Palabra del Día",
  description:
    "Versículo del día para la República Dominicana, con una nota práctica. Cambia cada jornada según la fecha.",
};

export default function PalabraDelDiaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Fe · cada día
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
        Palabra del Día
      </h1>
      <p className="mt-4 mb-10 max-w-2xl text-base leading-7 text-muted">
        El mismo versículo para todos hoy, según la fecha en Santo Domingo. Un
        texto breve de las Escrituras y una nota para la vida cotidiana: casa,
        trabajo y esperanza.
      </p>
      <DailyVerse />
    </div>
  );
}
