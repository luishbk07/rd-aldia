import type { Metadata } from "next";
import CurrencyTracker from "@/components/CurrencyTracker";

export const metadata: Metadata = { title: "Dólar" };

export default function DolarPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Mercado · BCRD
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
        Dólar y oro
      </h1>
      <p className="mt-4 mb-10 max-w-2xl text-base leading-7 text-muted">
        Referencia USD/EUR a pesos dominicanos y onza de oro en RD$. Si el
        mercado falla, se muestra la última tasa guardada.
      </p>
      <CurrencyTracker />
    </div>
  );
}
