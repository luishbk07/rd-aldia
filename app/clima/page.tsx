import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import WeatherSection from "@/components/WeatherSection";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_SEO } from "@/lib/seo/pages";

export const metadata: Metadata = pageMetadata(PAGE_SEO.weather);

export default function ClimaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Pronóstico · Open-Meteo
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
        Clima en República Dominicana
      </h1>
      <p className="mt-4 mb-10 max-w-2xl text-base leading-7 text-muted">
        Temperatura actual, máximo y mínimo del día, y probabilidad de lluvia
        en diez ciudades. Santo Domingo va primero: es la referencia de la
        capital.
      </p>
      <div className="mb-8 flex justify-center md:hidden">
        <AdSlot size="mobile-banner" position="section-between" />
      </div>
      <WeatherSection variant="full" showHeading={false} showMoreLink={false} />
    </div>
  );
}
