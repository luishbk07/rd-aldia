import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import RelatedLinks from "@/components/RelatedLinks";
import WeatherSection from "@/components/WeatherSection";
import WindyMap from "@/components/WindyMap";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/pages";
import { SECTION_RELATED } from "@/lib/seo/related";

export const metadata: Metadata = pageMetadata(PAGE_SEO.weather);

export default function ClimaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Clima en el país
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
        Clima en República Dominicana
      </h1>
      <p className="mt-4 mb-10 max-w-2xl text-base leading-7 text-muted">
        Mapa interactivo de viento, lluvia, temperatura y nubes, más el detalle
        por ciudad. Santo Domingo va primero en las tarjetas: es la referencia
        de la capital.
      </p>
      <div className="mb-8 flex justify-center md:hidden">
        <AdSlot size="mobile-banner" position="section-between" />
      </div>
      <WindyMap />
      <h2 className="mt-12 font-heading text-2xl font-semibold tracking-tight text-heading">
        Temperatura por ciudad en República Dominicana
      </h2>
      <p className="mt-2 mb-6 max-w-2xl text-sm leading-6 text-muted">
        Santo Domingo va primero: es la referencia de la capital. Compara con
        Santiago, Punta Cana y el resto del país.
      </p>
      <WeatherSection variant="full" showHeading={false} showMoreLink={false} />
      <RelatedLinks
        title="Turismo, combustible y noticias"
        links={SECTION_RELATED.weather}
      />
    </div>
  );
}
