import type { Metadata } from "next";
import DailyVerse from "@/components/DailyVerse";
import RelatedLinks from "@/components/RelatedLinks";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/pages";
import { SECTION_RELATED } from "@/lib/seo/related";

export const metadata: Metadata = pageMetadata(PAGE_SEO.verse);

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
      <h2 className="sr-only">Versículo de hoy en República Dominicana</h2>
      <DailyVerse />
      <RelatedLinks
        title="Consejo financiero, cultura y noticias"
        links={SECTION_RELATED.verse}
      />
    </div>
  );
}
