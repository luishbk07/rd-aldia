import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import NewsAggregator from "@/components/NewsAggregator";
import RelatedLinks from "@/components/RelatedLinks";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/pages";
import { SECTION_RELATED } from "@/lib/seo/related";

export const metadata: Metadata = pageMetadata(PAGE_SEO.news);

export default function NoticiasPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Prensa dominicana
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
        Noticias de República Dominicana
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        Agregamos titulares de periódicos establecidos. RD Al Día no escribe
        estas notas: cada enlace abre en el medio original, en una pestaña
        nueva.
      </p>
      <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,48rem)_18.75rem] lg:gap-10">
        <div className="max-w-3xl">
          <h2 className="mb-4 font-heading text-xl font-semibold text-heading">
            Titulares de la prensa dominicana
          </h2>
          <NewsAggregator limit={40} showMoreLink={false} showHeading={false} />
        </div>
        <aside className="mt-10 hidden lg:block">
          <div className="sticky top-24">
            <AdSlot size="rectangle" position="noticias-sidebar" />
          </div>
        </aside>
      </div>
      <RelatedLinks
        title="LIDOM, cultura y clima"
        links={SECTION_RELATED.news}
      />
    </div>
  );
}
