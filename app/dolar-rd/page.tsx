import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import CurrencyTracker from "@/components/CurrencyTracker";
import RelatedLinks from "@/components/RelatedLinks";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/pages";
import { SECTION_RELATED } from "@/lib/seo/related";

export const metadata: Metadata = pageMetadata(PAGE_SEO.dollar);

export default function DolarRdPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Mercado · BCRD
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
        Dólar RD
      </h1>
      <p className="mt-4 mb-10 max-w-2xl text-base leading-7 text-muted">
        Referencia USD/EUR a pesos dominicanos y onza de oro en RD$. Si el
        mercado falla, se muestra la última tasa guardada.
      </p>
      <div className="mb-8 flex justify-center md:hidden">
        <AdSlot size="mobile-banner" position="section-between" />
      </div>
      <CurrencyTracker />
      <RelatedLinks
        title="Combustible, noticias y consejo financiero"
        links={SECTION_RELATED.dollar}
      />
    </div>
  );
}
