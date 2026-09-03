import type { Metadata } from "next";
import FinancialTip from "@/components/FinancialTip";

export const metadata: Metadata = {
  title: "Consejo financiero",
  description:
    "Un consejo práctico cada día para el bolsillo en República Dominicana: ahorro, deudas, estafas y hábitos simples.",
};

export default function ConsejoFinancieroPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Bolsillo · cada día
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
        Consejo financiero
      </h1>
      <p className="mt-4 mb-10 max-w-2xl text-base leading-7 text-muted">
        El mismo consejo para todos hoy, según la fecha en Santo Domingo. Ideas
        concretas para un costo de vida alto: listas, sobres, tasas y trampas
        que conviene conocer.
      </p>
      <FinancialTip />
    </div>
  );
}
