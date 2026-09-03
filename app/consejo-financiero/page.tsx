import type { Metadata } from "next";
import FinancialTip from "@/components/FinancialTip";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/pages";

export const metadata: Metadata = pageMetadata(PAGE_SEO.finance);

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
